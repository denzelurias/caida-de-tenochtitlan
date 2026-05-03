const crypto = require("crypto");
const { listAnnotations, createAnnotation } = require("../../lib/db");

const PAGE_TITLE = "Tenochtitlan: la ciudad que cayó de pie";
const VALID_INTENTS = new Set(["", "Pregunta", "Observacion", "Dato relacionado", "Interpretacion", "Correccion"]);
const KNOWN_ANCHORS = new Set([
  "inicio-hero-title",
  "origen-title",
  "origen-lead-migracion",
  "origen-body-fundacion-1325",
  "origen-body-ciudad-social",
  "origen-ficha-sala",
  "linea-title",
  "linea-card-active",
  "linea-evento-1",
  "linea-evento-2",
  "linea-evento-3",
  "linea-evento-4",
  "linea-evento-5",
  "linea-evento-6",
  "ciudad-title",
  "ciudad-panel-agua",
  "ciudad-panel-chinampas",
  "ciudad-panel-mercado",
  "ciudad-panel-templo",
  "ciudad-metricas",
  "ciudad-imagen-canales",
  "poder-title",
  "poder-chapter-templo",
  "poder-chapter-triple-alianza",
  "poder-chapter-calpulli",
  "encuentro-quote-band",
  "encuentro-detalle-title",
  "encuentro-lead-alianzas",
  "encuentro-body-crisis",
  "encuentro-body-cuauhtemoc",
  "sitio-title",
  "sitio-visual",
  "sitio-step-bloqueo",
  "sitio-step-agua",
  "sitio-step-tlatelolco",
  "sitio-step-caida",
  "mapa-title",
  "mapa-canvas",
  "mapa-pin-tenochtitlan",
  "mapa-pin-tlatelolco",
  "mapa-pin-chapultepec",
  "mapa-pin-iztapalapa",
  "mapa-pin-tlacopan",
  "mapa-pin-texcoco",
  "mapa-panel-active",
  "galeria-title",
  "galeria-artifact-coyolxauhqui",
  "galeria-artifact-piedra",
  "galeria-artifact-codice",
  "galeria-artifact-acueducto",
  "galeria-artifact-mercado",
  "galeria-artifact-bergantines",
  "legado-title",
  "legado-lead-ciudad",
  "legado-body-nombres",
  "legado-body-cierre",
  "legado-fuentes-principales"
]);

const buckets = globalThis.__annotationRateBuckets || new Map();
globalThis.__annotationRateBuckets = buckets;

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

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

function sendError(res, status, code, message, field) {
  sendJson(res, status, {
    error: {
      code,
      message,
      ...(field ? { field } : {})
    }
  });
}

async function readJson(req) {
  if (req.body) {
    return typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function getRequestKey(req) {
  const forwarded = req.headers["x-forwarded-for"] || "";
  const ip = String(forwarded).split(",")[0] || req.socket?.remoteAddress || "unknown";
  const ua = req.headers["user-agent"] || "";
  const salt = process.env.RATE_LIMIT_SALT || "annotation-rate-limit";
  return crypto.createHash("sha256").update(`${salt}:${ip}:${ua}`).digest("hex");
}

function enforceRateLimit(req) {
  const now = Date.now();
  const key = getRequestKey(req);
  const windowMs = 60 * 1000;
  const limit = 6;
  const bucket = buckets.get(key) || { count: 0, resetAt: now + windowMs };

  if (bucket.resetAt <= now) {
    bucket.count = 0;
    bucket.resetAt = now + windowMs;
  }

  bucket.count += 1;
  buckets.set(key, bucket);
  return bucket.count <= limit;
}

function validatePageSlug(slug) {
  const normalized = normalizeSpaces(slug || "caida-tenochtitlan");
  if (!/^[a-z0-9-]{1,80}$/.test(normalized)) {
    return { error: ["VALIDATION_ERROR", "El identificador de página no es válido.", "page"] };
  }
  return { value: normalized };
}

function numericRatio(value, field) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || number > 1) {
    return { error: ["VALIDATION_ERROR", "La posición del comentario debe estar entre 0 y 1.", field] };
  }
  return { value: number };
}

function optionalInteger(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return null;
  return Math.round(number);
}

function validateAnnotation(input) {
  const anchorId = normalizeSpaces(input.anchorId);
  const sectionId = normalizeSpaces(input.sectionId);
  const sectionTitle = normalizeSpaces(input.sectionTitle);
  const anchorText = normalizeSpaces(input.anchorText).slice(0, 220);
  const contextType = normalizeSpaces(input.contextType).slice(0, 80);
  const contextKey = normalizeSpaces(input.contextKey).slice(0, 120);
  const authorName = normalizeSpaces(input.authorName);
  const body = normalizeSpaces(input.body);
  const intent = normalizeSpaces(input.intent);
  const xRatio = numericRatio(input.xRatio, "xRatio");
  const yRatio = numericRatio(input.yRatio, "yRatio");

  if (!KNOWN_ANCHORS.has(anchorId)) {
    return { error: ["VALIDATION_ERROR", "El fragmento seleccionado no se puede anotar.", "anchorId"] };
  }
  if (!sectionId || sectionId.length > 80) {
    return { error: ["VALIDATION_ERROR", "La sección no es válida.", "sectionId"] };
  }
  if (!sectionTitle || sectionTitle.length > 160) {
    return { error: ["VALIDATION_ERROR", "El título de sección no es válido.", "sectionTitle"] };
  }
  if (authorName.length < 1 || authorName.length > 40) {
    return { error: ["VALIDATION_ERROR", "El alias debe tener entre 1 y 40 caracteres.", "authorName"] };
  }
  if (body.length < 3 || body.length > 500) {
    return { error: ["VALIDATION_ERROR", "El comentario debe tener entre 3 y 500 caracteres.", "body"] };
  }
  if (!VALID_INTENTS.has(intent)) {
    return { error: ["VALIDATION_ERROR", "La intención seleccionada no es válida.", "intent"] };
  }
  if (hasHtml(authorName) || hasHtml(body) || hasHtml(sectionTitle) || hasHtml(anchorText)) {
    return { error: ["VALIDATION_ERROR", "No se permite HTML en los comentarios.", "body"] };
  }
  if (xRatio.error) return { error: xRatio.error };
  if (yRatio.error) return { error: yRatio.error };

  return {
    value: {
      anchorId,
      sectionId,
      sectionTitle,
      anchorText,
      contextType,
      contextKey,
      xRatio: xRatio.value,
      yRatio: yRatio.value,
      viewportWidth: optionalInteger(input.viewportWidth),
      viewportHeight: optionalInteger(input.viewportHeight),
      authorId: null,
      authorName,
      body,
      intent
    }
  };
}

function toCamel(row) {
  return {
    id: row.id,
    anchorId: row.anchor_id,
    sectionId: row.section_id,
    sectionTitle: row.section_title,
    anchorText: row.anchor_text || "",
    contextType: row.context_type || "",
    contextKey: row.context_key || "",
    xRatio: Number(row.x_ratio),
    yRatio: Number(row.y_ratio),
    viewportWidth: row.viewport_width,
    viewportHeight: row.viewport_height,
    authorName: row.author_name,
    body: row.body,
    intent: row.intent || "",
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  const url = new URL(req.url, `https://${req.headers.host || "localhost"}`);
  const page = validatePageSlug(url.searchParams.get("page"));
  if (page.error) {
    sendError(res, 400, ...page.error);
    return;
  }

  try {
    if (req.method === "GET") {
      const annotations = await listAnnotations(page.value, PAGE_TITLE);
      sendJson(res, 200, {
        page: { slug: page.value, title: PAGE_TITLE },
        annotations: annotations.map(toCamel)
      });
      return;
    }

    if (req.method === "POST") {
      if (!enforceRateLimit(req)) {
        sendError(res, 429, "RATE_LIMITED", "Demasiados comentarios. Intenta de nuevo en un minuto.");
        return;
      }

      const body = await readJson(req);
      const payload = validateAnnotation(body);
      if (payload.error) {
        sendError(res, 400, ...payload.error);
        return;
      }

      const annotation = await createAnnotation(page.value, PAGE_TITLE, payload.value);
      sendJson(res, 201, { annotation: toCamel(annotation) });
      return;
    }

    sendError(res, 405, "METHOD_NOT_ALLOWED", "Método no permitido.");
  } catch (error) {
    sendError(res, error.status || 500, error.code || "SERVER_ERROR", error.message || "Error inesperado.");
  }
};
