const annotationApp = (() => {
  const PAGE_SLUG = "caida-tenochtitlan";
  const PAGE_TITLE = "Tenochtitlan: la ciudad que cayó de pie";
  const API_URL = "/api/annotations";
  const LOCAL_KEY = "tenochtitlan.annotations.v1";
  const AUTHOR_KEY = "tenochtitlan.annotation.author";
  const VALID_INTENTS = new Set(["", "Pregunta", "Observacion", "Dato relacionado", "Interpretacion", "Correccion"]);
  const INTENT_LABELS = {
    Observacion: "Observación",
    Interpretacion: "Interpretación",
    Correccion: "Corrección"
  };

  const elements = {
    commentToggle: document.getElementById("commentToggle"),
    commentToggleLabel: document.querySelector(".comment-toggle-label"),
    annotationBar: document.getElementById("annotationBar"),
    showNotesButton: document.getElementById("showNotesButton"),
    cancelCommentMode: document.getElementById("cancelCommentMode"),
    notesPanel: document.getElementById("notesPanel"),
    closeNotesPanel: document.getElementById("closeNotesPanel"),
    notesStatus: document.getElementById("notesStatus"),
    notesList: document.getElementById("notesList"),
    composer: document.getElementById("annotationComposer"),
    composerSection: document.getElementById("annotationComposerSection"),
    composerTitle: document.getElementById("annotationComposerTitle"),
    composerExcerpt: document.getElementById("annotationComposerExcerpt"),
    author: document.getElementById("annotationAuthor"),
    intent: document.getElementById("annotationIntent"),
    body: document.getElementById("annotationBody"),
    error: document.getElementById("annotationError"),
    closeComposer: document.getElementById("closeComposer"),
    publish: document.getElementById("publishAnnotation"),
    layer: document.getElementById("annotationLayer")
  };

  const requiredElements = Object.values(elements);
  if (requiredElements.some((element) => !element)) return null;

  const state = {
    pageSlug: PAGE_SLUG,
    mode: false,
    annotationsVisible: true,
    annotations: [],
    activeAnnotationId: null,
    composer: null,
    loading: false,
    error: null,
    usingLocalStore: false
  };

  let renderFrame = 0;

  function emit(name, detail = {}) {
    document.dispatchEvent(new CustomEvent(name, { detail }));
  }

  function normalizeSpaces(value) {
    return String(value || "")
      .replace(/\r\n/g, "\n")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function hasHtml(value) {
    return /<[^>]+>/.test(String(value || ""));
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function createId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function formatIntent(intent) {
    return INTENT_LABELS[intent] || intent || "Nota";
  }

  function formatDate(value) {
    const date = value ? new Date(value) : new Date();
    return new Intl.DateTimeFormat("es-MX", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(date);
  }

  function isApiAvailable() {
    return window.location.protocol !== "file:";
  }

  function normalizeAnnotation(row) {
    return {
      id: row.id,
      pageSlug: row.pageSlug || row.page_slug || PAGE_SLUG,
      anchorId: row.anchorId || row.anchor_id,
      sectionId: row.sectionId || row.section_id || "inicio",
      sectionTitle: row.sectionTitle || row.section_title || "Fragmento",
      anchorText: row.anchorText || row.anchor_text || "",
      contextType: row.contextType || row.context_type || "",
      contextKey: row.contextKey || row.context_key || "",
      xRatio: Number(row.xRatio ?? row.x_ratio ?? 0.5),
      yRatio: Number(row.yRatio ?? row.y_ratio ?? 0.5),
      viewportWidth: Number(row.viewportWidth ?? row.viewport_width ?? window.innerWidth),
      viewportHeight: Number(row.viewportHeight ?? row.viewport_height ?? window.innerHeight),
      authorName: row.authorName || row.author_name || "Anónimo",
      body: row.body || "",
      intent: row.intent || "",
      status: row.status || "visible",
      createdAt: row.createdAt || row.created_at || new Date().toISOString(),
      updatedAt: row.updatedAt || row.updated_at || row.createdAt || row.created_at || new Date().toISOString()
    };
  }

  function loadLocalAnnotations() {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(LOCAL_KEY) || "[]");
      return Array.isArray(parsed) ? parsed.map(normalizeAnnotation) : [];
    } catch {
      return [];
    }
  }

  function saveLocalAnnotations(annotations) {
    window.localStorage.setItem(LOCAL_KEY, JSON.stringify(annotations));
  }

  async function loadAnnotations() {
    state.loading = true;
    state.error = null;
    elements.commentToggle.classList.add("is-loading");
    elements.commentToggle.disabled = true;
    updateNotesStatus("Cargando notas...");
    emit("annotations:load:start");

    if (!isApiAvailable()) {
      state.annotations = loadLocalAnnotations();
      state.usingLocalStore = true;
      state.loading = false;
      elements.commentToggle.classList.remove("is-loading");
      elements.commentToggle.disabled = false;
      updateNotesStatus("Modo local: las notas se guardan en este navegador.");
      renderAll();
      emit("annotations:load:success", { source: "local" });
      return;
    }

    try {
      const response = await fetch(`${API_URL}?page=${encodeURIComponent(PAGE_SLUG)}`, {
        headers: { Accept: "application/json" }
      });
      if (!response.ok) throw await readApiError(response);
      const data = await response.json();
      state.annotations = (data.annotations || []).map(normalizeAnnotation);
      state.usingLocalStore = false;
      updateNotesStatus("");
      emit("annotations:load:success", { source: "api" });
    } catch (error) {
      state.annotations = loadLocalAnnotations();
      state.usingLocalStore = true;
      state.error = error.message || "No se pudo cargar la API. Usando modo local.";
      updateNotesStatus("API no disponible. Mostrando notas locales de este navegador.");
      emit("annotations:load:error", { error });
    } finally {
      state.loading = false;
      elements.commentToggle.classList.remove("is-loading");
      elements.commentToggle.disabled = false;
      renderAll();
    }
  }

  async function readApiError(response) {
    try {
      const data = await response.json();
      return new Error(data.error?.message || "Error de API");
    } catch {
      return new Error("Error de API");
    }
  }

  async function createAnnotation(payload) {
    emit("annotations:create:start", { payload });

    if (!isApiAvailable() || state.usingLocalStore) {
      return createLocalAnnotation(payload);
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw await readApiError(response);
      const data = await response.json();
      emit("annotations:create:success", { source: "api" });
      return normalizeAnnotation(data.annotation);
    } catch (error) {
      state.usingLocalStore = true;
      state.error = error.message || "No se pudo guardar en la API.";
      updateNotesStatus("API no disponible. Esta nota se guardó localmente.");
      emit("annotations:create:error", { error });
      return createLocalAnnotation(payload);
    }
  }

  function createLocalAnnotation(payload) {
    const annotation = normalizeAnnotation({
      ...payload,
      id: createId(),
      status: "visible",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    const next = [...loadLocalAnnotations(), annotation];
    saveLocalAnnotations(next);
    emit("annotations:create:success", { source: "local" });
    return annotation;
  }

  function setCommentMode(active) {
    state.mode = active;
    document.body.classList.toggle("annotations-mode", active);
    elements.annotationBar.hidden = !active;
    elements.commentToggle.setAttribute("aria-pressed", String(active));
    elements.commentToggle.setAttribute("aria-label", active ? "Salir del modo comentar" : "Activar modo comentar");
    elements.commentToggleLabel.textContent = active ? "Comentando" : "Comentar";
    if (active) {
      emit("annotations:mode:on");
    } else {
      closeComposer();
      emit("annotations:mode:off");
    }
  }

  function setNotesPanel(open) {
    elements.notesPanel.hidden = !open;
    document.body.classList.toggle("notes-open", open);
    if (open) renderNotesPanel();
  }

  function updateNotesStatus(message) {
    elements.notesStatus.textContent = message || "";
  }

  function prepareAnchors() {
    document.querySelectorAll('[data-annotatable="true"]').forEach((anchor) => {
      if (!anchor.dataset.anchorId) return;
      if (!anchor.hasAttribute("tabindex") && !isNaturallyFocusable(anchor)) {
        anchor.setAttribute("tabindex", "0");
      }
      anchor.setAttribute("data-annotation-ready", "true");
    });
  }

  function isNaturallyFocusable(element) {
    return ["A", "BUTTON", "INPUT", "TEXTAREA", "SELECT"].includes(element.tagName);
  }

  function isUiChrome(target) {
    return Boolean(target.closest(".topbar, .annotation-bar, .annotation-composer, .notes-panel, .annotation-layer, .modal, .mobile-panel, .scrim, .footer"));
  }

  function isGalleryModalOpen() {
    return document.getElementById("artifactModal")?.classList.contains("is-open");
  }

  function getAnchorFromTarget(target) {
    return target.closest('[data-annotatable="true"][data-anchor-id]');
  }

  function findAnchor(anchorId) {
    const safeId = window.CSS && typeof window.CSS.escape === "function"
      ? window.CSS.escape(anchorId)
      : String(anchorId).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    return document.querySelector(`[data-anchor-id="${safeId}"]`);
  }

  function getSectionInfo(anchor) {
    const section = anchor.closest("[data-section]") || anchor.closest("section") || document.getElementById("inicio");
    const heading = section?.querySelector("h1, h2") || anchor.closest("article")?.querySelector("h3") || anchor;
    return {
      sectionId: section?.id || section?.dataset.section || "inicio",
      sectionTitle: normalizeSpaces(heading?.textContent || "Fragmento")
    };
  }

  function getAnchorText(anchor) {
    const label = anchor.dataset.label || anchor.dataset.title || "";
    const text = normalizeSpaces(anchor.textContent || label);
    return (text || label || "Fragmento visual").slice(0, 220);
  }

  function openComposer(anchor, clientX, clientY, keyboard = false) {
    if (!anchor || isGalleryModalOpen()) return;

    const rect = anchor.getBoundingClientRect();
    const x = keyboard ? rect.left + rect.width / 2 : clientX;
    const y = keyboard ? rect.top + rect.height / 2 : clientY;
    const section = getSectionInfo(anchor);
    const anchorText = getAnchorText(anchor);
    const xRatio = rect.width > 0 ? clamp((x - rect.left) / rect.width, 0, 1) : 0.5;
    const yRatio = rect.height > 0 ? clamp((y - rect.top) / rect.height, 0, 1) : 0.5;

    state.composer = {
      pageSlug: PAGE_SLUG,
      pageTitle: PAGE_TITLE,
      anchorId: anchor.dataset.anchorId,
      sectionId: section.sectionId,
      sectionTitle: section.sectionTitle,
      anchorText,
      contextType: anchor.dataset.contextType || "",
      contextKey: anchor.dataset.contextKey || "",
      xRatio,
      yRatio,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight
    };

    elements.composerSection.textContent = section.sectionTitle;
    elements.composerTitle.textContent = "Nueva nota";
    elements.composerExcerpt.textContent = anchorText;
    elements.error.textContent = "";
    elements.author.value = window.localStorage.getItem(AUTHOR_KEY) || elements.author.value;
    elements.body.value = "";
    elements.intent.value = "";
    elements.composer.hidden = false;
    positionComposer(x, y);
    elements.body.focus();
    emit("annotations:composer:open", state.composer);
  }

  function positionComposer(clientX, clientY) {
    if (window.matchMedia("(max-width: 720px)").matches) return;
    const margin = 12;
    const topLimit = margin + 76;
    const rect = elements.composer.getBoundingClientRect();
    const width = rect.width || 368;
    const height = Math.min(rect.height || 470, window.innerHeight - topLimit - margin);
    const left = clamp(clientX + 18, margin, window.innerWidth - width - margin);
    const top = clamp(clientY + 18, topLimit, window.innerHeight - height - margin);
    elements.composer.style.setProperty("--composer-left", `${left}px`);
    elements.composer.style.setProperty("--composer-top", `${top}px`);
    elements.composer.style.setProperty("--composer-max-height", `${window.innerHeight - top - margin}px`);
  }

  function closeComposer() {
    if (elements.composer.hidden) return;
    elements.composer.hidden = true;
    elements.error.textContent = "";
    state.composer = null;
    emit("annotations:composer:close");
  }

  function validateComposer() {
    if (!state.composer) return { error: "Selecciona un fragmento para comentar." };
    const authorName = normalizeSpaces(elements.author.value);
    const body = normalizeSpaces(elements.body.value);
    const intent = elements.intent.value;

    if (authorName.length < 1 || authorName.length > 40) {
      return { error: "El alias debe tener entre 1 y 40 caracteres." };
    }
    if (body.length < 3 || body.length > 500) {
      return { error: "El comentario debe tener entre 3 y 500 caracteres." };
    }
    if (!VALID_INTENTS.has(intent)) {
      return { error: "La intención seleccionada no es válida." };
    }
    if (hasHtml(authorName) || hasHtml(body)) {
      return { error: "No se permite HTML en los comentarios." };
    }

    return {
      payload: {
        ...state.composer,
        authorName,
        body,
        intent
      }
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const result = validateComposer();
    if (result.error) {
      elements.error.textContent = result.error;
      return;
    }

    elements.publish.disabled = true;
    elements.publish.textContent = "Publicando...";
    elements.error.textContent = "";

    try {
      const annotation = await createAnnotation(result.payload);
      state.annotations = [...state.annotations.filter((item) => item.id !== annotation.id), annotation];
      window.localStorage.setItem(AUTHOR_KEY, result.payload.authorName);
      closeComposer();
      renderAll();
    } catch (error) {
      elements.error.textContent = error.message || "No se pudo publicar el comentario.";
    } finally {
      elements.publish.disabled = false;
      elements.publish.textContent = "Publicar";
    }
  }

  function scheduleRenderMarkers() {
    if (renderFrame) return;
    renderFrame = window.requestAnimationFrame(() => {
      renderFrame = 0;
      renderMarkers();
    });
  }

  function renderAll() {
    renderMarkers();
    renderNotesPanel();
  }

  function visibleAnnotations() {
    return state.annotations.filter((annotation) => annotation.status === "visible");
  }

  function renderMarkers() {
    elements.layer.replaceChildren();
    if (!state.annotationsVisible) return;

    visibleAnnotations().forEach((annotation, index) => {
      const anchor = findAnchor(annotation.anchorId);
      if (!anchor) return;
      const rect = anchor.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0 || rect.bottom < 0 || rect.top > window.innerHeight) return;

      const x = rect.left + rect.width * clamp(annotation.xRatio, 0, 1);
      const y = rect.top + rect.height * clamp(annotation.yRatio, 0, 1);
      const marker = document.createElement("button");
      marker.type = "button";
      marker.className = "annotation-marker";
      marker.classList.toggle("is-active", state.activeAnnotationId === annotation.id);
      marker.style.left = `${x}px`;
      marker.style.top = `${y}px`;
      marker.textContent = String((index % 9) + 1);
      marker.setAttribute("aria-label", `Abrir nota de ${annotation.authorName} en ${annotation.sectionTitle}`);
      marker.addEventListener("click", (event) => {
        event.stopPropagation();
        state.activeAnnotationId = state.activeAnnotationId === annotation.id ? null : annotation.id;
        renderMarkers();
      });
      elements.layer.append(marker);

      if (state.activeAnnotationId === annotation.id) {
        elements.layer.append(createAnnotationCard(annotation, x, y));
      }
    });
  }

  function createAnnotationCard(annotation, x, y) {
    const card = document.createElement("article");
    card.className = "annotation-card";
    const width = Math.min(328, window.innerWidth - 24);
    const left = clamp(x + 14, 12, window.innerWidth - width - 12);
    const top = clamp(y + 14, 88, window.innerHeight - 230);
    card.style.left = `${left}px`;
    card.style.top = `${top}px`;

    const header = document.createElement("div");
    header.className = "annotation-card-header";
    const titleWrap = document.createElement("div");
    const author = document.createElement("strong");
    author.textContent = annotation.authorName;
    const meta = document.createElement("div");
    meta.className = "annotation-card-meta";
    const intent = document.createElement("span");
    intent.className = "annotation-intent";
    intent.textContent = formatIntent(annotation.intent);
    const section = document.createElement("span");
    section.textContent = annotation.sectionTitle;
    const date = document.createElement("time");
    date.dateTime = annotation.createdAt;
    date.textContent = formatDate(annotation.createdAt);
    meta.append(intent, section, date);
    titleWrap.append(author, meta);

    const close = document.createElement("button");
    close.type = "button";
    close.className = "annotation-card-close";
    close.setAttribute("aria-label", "Cerrar nota");
    close.textContent = "×";
    close.addEventListener("click", (event) => {
      event.stopPropagation();
      state.activeAnnotationId = null;
      renderMarkers();
    });

    const body = document.createElement("p");
    body.textContent = annotation.body;
    header.append(titleWrap, close);
    card.append(header, body);
    return card;
  }

  function renderNotesPanel() {
    elements.notesList.replaceChildren();
    const annotations = visibleAnnotations();

    if (state.loading) {
      updateNotesStatus("Cargando notas...");
      return;
    }

    if (!annotations.length) {
      updateNotesStatus(state.usingLocalStore ? "Modo local activo." : "");
      const empty = document.createElement("p");
      empty.className = "body-copy";
      empty.textContent = "Todavía no hay notas. Activa Comentar y elige un fragmento.";
      elements.notesList.append(empty);
      return;
    }

    updateNotesStatus(state.usingLocalStore ? "Modo local: estas notas viven en este navegador." : "");
    annotations.forEach((annotation) => {
      const card = document.createElement("article");
      card.className = "note-card";

      const title = document.createElement("strong");
      title.textContent = annotation.authorName;
      const meta = document.createElement("div");
      meta.className = "note-card-meta";
      const intent = document.createElement("span");
      intent.className = "annotation-intent";
      intent.textContent = formatIntent(annotation.intent);
      const section = document.createElement("span");
      section.textContent = annotation.sectionTitle;
      const date = document.createElement("time");
      date.dateTime = annotation.createdAt;
      date.textContent = formatDate(annotation.createdAt);
      meta.append(intent, section, date);

      const body = document.createElement("p");
      body.textContent = annotation.body;
      const jump = document.createElement("button");
      jump.type = "button";
      jump.textContent = "Ir al fragmento";
      jump.addEventListener("click", () => {
        const anchor = findAnchor(annotation.anchorId);
        if (!anchor) return;
        state.activeAnnotationId = annotation.id;
        anchor.scrollIntoView({ behavior: "smooth", block: "center" });
        window.setTimeout(renderMarkers, 420);
      });

      card.append(title, meta, body, jump);
      elements.notesList.append(card);
    });
  }

  function handleDocumentClick(event) {
    if (!state.mode) {
      if (state.activeAnnotationId && !event.target.closest(".annotation-layer")) {
        state.activeAnnotationId = null;
        renderMarkers();
      }
      return;
    }

    if (isUiChrome(event.target) || isGalleryModalOpen()) return;
    const anchor = getAnchorFromTarget(event.target);
    if (!anchor) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    openComposer(anchor, event.clientX, event.clientY);
  }

  function handleKeydown(event) {
    if (event.key === "Escape") {
      if (!elements.composer.hidden) {
        event.stopImmediatePropagation();
        event.preventDefault();
        closeComposer();
        return;
      }
      if (!elements.notesPanel.hidden) {
        event.stopImmediatePropagation();
        event.preventDefault();
        setNotesPanel(false);
        return;
      }
      if (state.mode) {
        event.stopImmediatePropagation();
        event.preventDefault();
        setCommentMode(false);
      }
      return;
    }

    if (!state.mode || isUiChrome(event.target) || isGalleryModalOpen()) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    const anchor = getAnchorFromTarget(event.target);
    if (!anchor) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openComposer(anchor, 0, 0, true);
  }

  function init() {
    prepareAnchors();
    elements.commentToggle.addEventListener("click", () => setCommentMode(!state.mode));
    elements.cancelCommentMode.addEventListener("click", () => setCommentMode(false));
    elements.showNotesButton.addEventListener("click", () => setNotesPanel(true));
    elements.closeNotesPanel.addEventListener("click", () => setNotesPanel(false));
    elements.closeComposer.addEventListener("click", closeComposer);
    elements.composer.addEventListener("submit", handleSubmit);
    document.addEventListener("click", handleDocumentClick, true);
    document.addEventListener("keydown", handleKeydown, true);
    window.addEventListener("scroll", scheduleRenderMarkers, { passive: true });
    window.addEventListener("resize", scheduleRenderMarkers);
    document.addEventListener("click", scheduleRenderMarkers);
    loadAnnotations();
  }

  init();

  return {
    state,
    reload: loadAnnotations,
    render: renderAll
  };
})();
