const timelineItems = [
  {
    date: "1325",
    title: "Fundación de México-Tenochtitlan",
    short: "Fundación en el lago",
    text: "La isla se vuelve capital posible. El entorno lacustre, difícil para otros, se convierte en defensa natural, ruta de canoas y base para una ciudad que crecerá sobre el agua.",
    image: "assets/img/curadas/linea-fundacion.jpg",
    imagePosition: "center center"
  },
  {
    date: "1428",
    title: "Nacimiento de la Triple Alianza",
    short: "Triple Alianza",
    text: "Tenochtitlan, Texcoco y Tlacopan derrotan a Azcapotzalco. Desde entonces, la ciudad deja de ser sólo un asentamiento poderoso y se convierte en cabeza de una maquinaria tributaria e imperial.",
    image: "assets/img/curadas/triple-alianza.jpg",
    imagePosition: "center center"
  },
  {
    date: "1473",
    title: "Conquista de Tlatelolco",
    short: "Tlatelolco",
    text: "Axayácatl somete la ciudad gemela del norte. Su mercado queda bajo control tenochca y se vuelve una de las escenas más intensas de riqueza, orden y tensión política.",
    image: "assets/img/curadas/linea-tlatelolco.jpg",
    imagePosition: "center center"
  },
  {
    date: "8 nov. 1519",
    title: "Entrada de Cortés y sus aliados",
    short: "El encuentro",
    text: "La comitiva entra por la calzada de Iztapalapa. Moctezuma recibe a los recién llegados en un gesto cargado de diplomacia, vigilancia y peligro.",
    image: "assets/img/curadas/linea-encuentro.jpg",
    imagePosition: "center center"
  },
  {
    date: "1520",
    title: "Ruptura, epidemia y resistencia",
    short: "La crisis",
    text: "La captura y muerte de Moctezuma, la salida española y la viruela transforman la crisis en guerra abierta. Cuitláhuac muere durante la epidemia y Cuauhtémoc toma el mando.",
    image: "assets/img/curadas/epidemia.jpg",
    imagePosition: "center center"
  },
  {
    date: "13 ago. 1521",
    title: "Caída de Tenochtitlan-Tlatelolco",
    short: "La caída",
    text: "Tras meses de sitio, hambre y combate urbano, Cuauhtémoc es capturado en Coyonacazco. Termina la guerra militar, pero empieza una memoria que no ha dejado de discutirse.",
    image: "assets/img/curadas/linea-cuauhtemoc.jpg",
    imagePosition: "center center"
  }
];

const mapPlaces = {
  tenochtitlan: {
    tag: "Capital lacustre",
    title: "Tenochtitlan",
    text: "Fundada tradicionalmente en 1325, fue isla, puerto, santuario, mercado y centro político. Desde aquí se articulaban calzadas, canales, barrios, tributo y ceremonias imperiales."
  },
  tlatelolco: {
    tag: "Mercado y bastión",
    title: "Tlatelolco",
    text: "Ciudad gemela de Tenochtitlan. Su mercado concentró riqueza y orden comercial; en 1521 se convirtió en el último gran espacio de resistencia mexica."
  },
  chapultepec: {
    tag: "Agua dulce",
    title: "Chapultepec",
    text: "Sus manantiales fueron estratégicos para llevar agua potable a la ciudad. El control del agua explica tanto el esplendor urbano como la vulnerabilidad durante el sitio."
  },
  iztapalapa: {
    tag: "Calzada del sur",
    title: "Iztapalapa",
    text: "Ruta meridional de entrada a la capital. Por esta zona avanzó la comitiva de Cortés y sus aliados en noviembre de 1519."
  },
  tlacopan: {
    tag: "Occidente",
    title: "Tlacopan / Tacuba",
    text: "Miembro de la Triple Alianza y punto occidental de conexión con tierra firme. Las calzadas fueron comercio, movimiento militar y punto de escape."
  },
  texcoco: {
    tag: "Aliado acolhua",
    title: "Texcoco",
    text: "Centro político e intelectual asociado con Nezahualcóyotl. Su papel fue clave en la cuenca y en la historia hidráulica del valle."
  }
};

const artifacts = {
  coyolxauhqui: {
    tag: "Escultura",
    title: "Coyolxauhqui",
    image: "assets/img/curadas/galeria-coyolxauhqui.jpg",
    imagePosition: "center center",
    text: "El hallazgo de la Coyolxauhqui en 1978 impulsó el Proyecto Templo Mayor. Como objeto narrativo, permite hablar del mito de Huitzilopochtli, del centro sagrado y de la memoria material bajo la ciudad moderna."
  },
  piedra: {
    tag: "Monolito",
    title: "Piedra del Sol",
    image: "assets/img/curadas/galeria-piedra-sol.jpg",
    imagePosition: "center center",
    text: "Objeto ideal para explicar que el arte mexica no era decoración aislada: condensaba tiempo, poder, calendario, cosmos y legitimación política."
  },
  codice: {
    tag: "Manuscrito",
    title: "Códices y tlacuiloque",
    image: "assets/img/curadas/galeria-codice.jpg",
    imagePosition: "center center",
    text: "La memoria mexica se guardó en imágenes, genealogías, mapas, cantos y relatos. Los tlacuiloque hicieron visible una forma de escritura que no dependía sólo del alfabeto europeo."
  },
  acueducto: {
    tag: "Ingeniería",
    title: "Agua de Chapultepec",
    image: "assets/img/curadas/galeria-acueducto.jpg",
    imagePosition: "center center",
    text: "La ciudad podía estar rodeada por agua y aun así necesitar infraestructura para beber. El acueducto y los manantiales muestran la inteligencia práctica detrás del esplendor."
  },
  mercado: {
    tag: "Economía",
    title: "Mercado de Tlatelolco",
    image: "assets/img/curadas/galeria-mercado.jpg",
    imagePosition: "center center",
    text: "Tlatelolco permite narrar el imperio desde el intercambio: pochtecas, reglamentos, autoridades, cacao, mantas, productos cotidianos y bienes de prestigio."
  },
  bergantines: {
    tag: "Sitio",
    title: "Bergantines",
    image: "assets/img/curadas/galeria-bergantines.jpg",
    imagePosition: "center center",
    text: "Durante el sitio, los bergantines cambiaron la lógica lacustre. El lago, que había protegido y alimentado a Tenochtitlan, también pudo convertirse en vía de ataque."
  }
};

function resolveAssetUrl(path) {
  return new URL(path, document.baseURI).href;
}

function applyPlaceholderImage(element, image, position = "center center", size = "cover") {
  if (!element || !image) return;
  element.style.setProperty("--image-src", `url("${resolveAssetUrl(image)}")`);
  element.style.setProperty("--image-position", position);
  element.style.setProperty("--image-size", size);
  element.classList.add("has-image");
}

function applyHeroImage(element, image, position = "center center") {
  if (!element || !image) return;
  element.style.setProperty("--hero-image", `url("${resolveAssetUrl(image)}")`);
  element.style.setProperty("--hero-position", position);
  element.classList.add("has-image");
}

document.querySelectorAll(".image-placeholder[data-image-src]").forEach((element) => {
  applyPlaceholderImage(
    element,
    element.dataset.imageSrc,
    element.dataset.imagePosition || "center center",
    element.dataset.imageSize || "cover"
  );
});

document.querySelectorAll(".hero-visual[data-image-src]").forEach((element) => {
  applyHeroImage(element, element.dataset.imageSrc, element.dataset.imagePosition || "center center");
});

const topbar = document.getElementById("topbar");
const progressBar = document.getElementById("progressBar");
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const scrim = document.getElementById("scrim");
const navLinks = [...document.querySelectorAll(".mobile-panel a")];
const sections = [...document.querySelectorAll("[data-section]")];
let lastScrollY = window.scrollY;

function setMenu(open) {
  mobileMenu.classList.toggle("is-open", open);
  scrim.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
  menuToggle.classList.toggle("is-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
}

menuToggle.addEventListener("click", () => setMenu(!mobileMenu.classList.contains("is-open")));
scrim.addEventListener("click", () => setMenu(false));
mobileMenu.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});

function updateProgress() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  const progress = max > 0 ? (doc.scrollTop / max) * 100 : 0;
  progressBar.style.width = `${progress}%`;
  topbar.classList.toggle("is-scrolled", doc.scrollTop > 20);

  if (mobileMenu.classList.contains("is-open") && Math.abs(window.scrollY - lastScrollY) > 2) {
    setMenu(false);
  }
  lastScrollY = window.scrollY;

  document.querySelectorAll("[data-parallax]").forEach((element) => {
    const speed = Number(element.dataset.parallax || 0);
    const rect = element.getBoundingClientRect();
    const offset = rect.top * speed * -1;
    element.style.transform = `translate3d(0, ${offset}px, 0)`;
  });
}

window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      link.classList.toggle("is-active", href === `#${id}`);
    });
  });
}, { rootMargin: "-42% 0px -52% 0px", threshold: 0.01 });

sections.forEach((section) => {
  if (section.id) sectionObserver.observe(section);
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const timelineButtons = document.getElementById("timelineButtons");
const timelineDate = document.getElementById("timelineDate");
const timelineTitle = document.getElementById("timelineTitle");
const timelineText = document.getElementById("timelineText");
const timelineImage = document.getElementById("timelineImage");
const timelineCard = document.getElementById("timelineCard");
let timelineAnimationTimer;

function renderTimeline(index) {
  const item = timelineItems[index];
  timelineCard.dataset.contextKey = item.date;
  timelineCard.classList.remove("is-changing");
  window.requestAnimationFrame(() => {
    timelineCard.classList.add("is-changing");
    clearTimeout(timelineAnimationTimer);
    timelineAnimationTimer = window.setTimeout(() => {
      timelineCard.classList.remove("is-changing");
    }, 560);
  });
  timelineDate.textContent = item.date;
  timelineTitle.textContent = item.title;
  timelineText.textContent = item.text;
  timelineImage.dataset.label = "";
  applyPlaceholderImage(timelineImage, item.image, item.imagePosition);
  document.querySelectorAll(".timeline-button").forEach((button, buttonIndex) => {
    button.classList.toggle("is-active", buttonIndex === index);
    button.setAttribute("aria-pressed", String(buttonIndex === index));
  });
}

timelineItems.forEach((item, index) => {
  const button = document.createElement("button");
  button.className = `timeline-button${index === 0 ? " is-active" : ""}`;
  button.type = "button";
  button.setAttribute("aria-pressed", String(index === 0));
  button.dataset.annotatable = "true";
  button.dataset.anchorId = `linea-evento-${index + 1}`;
  button.dataset.contextType = "timeline-event";
  button.dataset.contextKey = item.date;
  const time = document.createElement("time");
  time.textContent = item.date;
  const label = document.createElement("span");
  label.textContent = item.short;
  button.append(time, label);
  button.addEventListener("click", () => renderTimeline(index));
  timelineButtons.appendChild(button);
});

renderTimeline(0);

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const id = tab.dataset.tab;
    document.querySelectorAll(".tab").forEach((item) => {
      const active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
    });
    document.querySelectorAll(".tab-panel").forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.panel === id);
    });
  });
});

const MAP_PIN_POSITIONS_KEY = "tenochtitlan.mapPinPositions.v5";
const mapPanel = document.getElementById("mapPanel");
const mapCanvas = document.getElementById("mapCanvas");
const mapStage = document.querySelector(".map-stage");
let activeMapDrag = null;
let activeMapPan = null;

function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function loadMapPinPositions() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(MAP_PIN_POSITIONS_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveMapPinPosition(pin) {
  const positions = loadMapPinPositions();
  positions[pin.dataset.place] = {
    left: Number(pin.style.left.replace("%", "")),
    top: Number(pin.style.top.replace("%", ""))
  };
  window.localStorage.setItem(MAP_PIN_POSITIONS_KEY, JSON.stringify(positions));
}

function setMapPinPosition(pin, left, top) {
  pin.style.left = `${clampNumber(left, 0, 100).toFixed(2)}%`;
  pin.style.top = `${clampNumber(top, 0, 100).toFixed(2)}%`;
}

function getMapPointerPosition(event) {
  const rect = mapCanvas.getBoundingClientRect();
  return {
    left: ((event.clientX - rect.left) / rect.width) * 100,
    top: ((event.clientY - rect.top) / rect.height) * 100
  };
}

function restoreMapPinPositions() {
  const positions = loadMapPinPositions();
  document.querySelectorAll(".map-pin").forEach((pin) => {
    const saved = positions[pin.dataset.place];
    if (!saved) return;
    setMapPinPosition(pin, saved.left, saved.top);
  });
}

function renderMapPanel(place, key) {
  mapPanel.replaceChildren();
  mapPanel.dataset.contextKey = key;
  const tag = document.createElement("span");
  tag.className = "tag";
  tag.textContent = place.tag;
  const title = document.createElement("h3");
  title.textContent = place.title;
  const text = document.createElement("p");
  text.className = "body-copy";
  text.textContent = place.text;
  mapPanel.append(tag, title, text);
}

restoreMapPinPositions();

document.querySelectorAll(".map-pin").forEach((pin) => {
  pin.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    activeMapDrag = {
      pin,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      moved: false
    };
    pin.classList.add("is-dragging");
    pin.setPointerCapture(event.pointerId);
  });

  pin.addEventListener("pointermove", (event) => {
    if (!activeMapDrag || activeMapDrag.pin !== pin) return;
    const distance = Math.hypot(event.clientX - activeMapDrag.startX, event.clientY - activeMapDrag.startY);
    if (distance > 3) activeMapDrag.moved = true;
    const position = getMapPointerPosition(event);
    setMapPinPosition(pin, position.left, position.top);
  });

  pin.addEventListener("pointerup", (event) => {
    if (!activeMapDrag || activeMapDrag.pin !== pin) return;
    pin.releasePointerCapture(event.pointerId);
    pin.classList.remove("is-dragging");
    pin.dataset.justDragged = String(activeMapDrag.moved);
    if (activeMapDrag.moved) saveMapPinPosition(pin);
    activeMapDrag = null;
    window.setTimeout(() => {
      pin.dataset.justDragged = "false";
    }, 0);
  });

  pin.addEventListener("pointercancel", () => {
    if (!activeMapDrag || activeMapDrag.pin !== pin) return;
    pin.classList.remove("is-dragging");
    activeMapDrag = null;
  });

  pin.addEventListener("click", (event) => {
    if (pin.dataset.justDragged === "true") {
      event.preventDefault();
      return;
    }
    const place = mapPlaces[pin.dataset.place];
    document.querySelectorAll(".map-pin").forEach((item) => item.classList.remove("is-active"));
    pin.classList.add("is-active");
    renderMapPanel(place, pin.dataset.place);
  });
});

let mapScale = 1;
let mapPanX = 0;
let mapPanY = 0;

function applyMapTransform() {
  mapCanvas.style.transform = `translate3d(${mapPanX}px, ${mapPanY}px, 0) scale(${mapScale})`;
}

document.getElementById("zoomIn").addEventListener("click", () => {
  mapScale = Math.min(1.7, mapScale + 0.18);
  applyMapTransform();
});
document.getElementById("zoomOut").addEventListener("click", () => {
  mapScale = Math.max(0.82, mapScale - 0.18);
  applyMapTransform();
});
document.getElementById("zoomReset").addEventListener("click", () => {
  mapScale = 1;
  mapPanX = 0;
  mapPanY = 0;
  applyMapTransform();
});

mapStage.addEventListener("pointerdown", (event) => {
  if (event.button !== 0 || event.target.closest(".map-pin, .map-controls, button")) return;
  activeMapPan = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    panX: mapPanX,
    panY: mapPanY
  };
  mapStage.classList.add("is-panning");
  mapStage.setPointerCapture(event.pointerId);
});

mapStage.addEventListener("pointermove", (event) => {
  if (!activeMapPan || activeMapPan.pointerId !== event.pointerId) return;
  mapPanX = activeMapPan.panX + event.clientX - activeMapPan.startX;
  mapPanY = activeMapPan.panY + event.clientY - activeMapPan.startY;
  applyMapTransform();
});

function endMapPan(event) {
  if (!activeMapPan || activeMapPan.pointerId !== event.pointerId) return;
  mapStage.classList.remove("is-panning");
  activeMapPan = null;
}

mapStage.addEventListener("pointerup", endMapPan);
mapStage.addEventListener("pointercancel", endMapPan);

const siegeDate = document.getElementById("siegeDate");
const siegePhase = document.getElementById("siegePhase");
const siegeVisual = document.getElementById("siegeVisual");
const stepObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll(".step").forEach((step) => step.classList.remove("is-active"));
    entry.target.classList.add("is-active");
    siegeDate.textContent = entry.target.dataset.date;
    siegePhase.textContent = entry.target.dataset.phase;
    applyPlaceholderImage(
      siegeVisual,
      entry.target.dataset.imageSrc,
      entry.target.dataset.imagePosition || "center center"
    );
  });
}, { rootMargin: "-35% 0px -45% 0px", threshold: 0.25 });

document.querySelectorAll(".step").forEach((step) => stepObserver.observe(step));

const modal = document.getElementById("artifactModal");
const closeModal = document.getElementById("closeModal");
const modalImage = document.getElementById("modalImage");
const modalTag = document.getElementById("modalTag");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");

function openArtifact(id) {
  const artifact = artifacts[id];
  modalImage.dataset.label = "";
  applyPlaceholderImage(modalImage, artifact.image, artifact.imagePosition);
  modalTag.textContent = artifact.tag;
  modalTitle.textContent = artifact.title;
  modalText.textContent = artifact.text;
  modal.classList.add("is-open");
  closeModal.focus();
}

function closeArtifact() {
  modal.classList.remove("is-open");
}

document.querySelectorAll(".artifact").forEach((button) => {
  button.addEventListener("click", () => openArtifact(button.dataset.artifact));
});

closeModal.addEventListener("click", closeArtifact);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeArtifact();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeArtifact();
    setMenu(false);
  }
});
