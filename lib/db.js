const crypto = require("crypto");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const ANNOTATION_COLUMNS = [
  "id",
  "anchor_id",
  "section_id",
  "section_title",
  "anchor_text",
  "context_type",
  "context_key",
  "x_ratio",
  "y_ratio",
  "viewport_width",
  "viewport_height",
  "author_id",
  "author_name",
  "body",
  "intent",
  "status",
  "created_at",
  "updated_at"
].join(",");

function assertConfig() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    const error = new Error("Faltan SUPABASE_URL y una llave de Supabase para el servidor.");
    error.code = "SERVER_ERROR";
    throw error;
  }
}

function restUrl(path, query = "") {
  const base = SUPABASE_URL.replace(/\/$/, "");
  return `${base}/rest/v1/${path}${query ? `?${query}` : ""}`;
}

async function supabaseRequest(path, options = {}) {
  assertConfig();
  const response = await fetch(restUrl(path, options.query), {
    method: options.method || "GET",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.prefer ? { Prefer: options.prefer } : {}),
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (!response.ok) {
    let details = "";
    try {
      const data = await response.json();
      details = data.message || data.error || JSON.stringify(data);
    } catch {
      details = response.statusText;
    }
    const error = new Error(details || "Error de Supabase.");
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function getPage(slug) {
  const query = `slug=eq.${encodeURIComponent(slug)}&select=id,slug,title&limit=1`;
  const rows = await supabaseRequest("annotation_pages", { query });
  return rows[0] || null;
}

async function ensurePage(slug, title) {
  const existing = await getPage(slug);
  if (existing) return existing;

  const error = new Error("La página de anotaciones no está registrada.");
  error.status = 404;
  error.code = "NOT_FOUND";
  throw error;
}

async function listAnnotations(slug, title) {
  const page = await ensurePage(slug, title);
  const query = [
    `page_id=eq.${page.id}`,
    "status=eq.visible",
    `select=${ANNOTATION_COLUMNS}`,
    "order=created_at.asc"
  ].join("&");
  return supabaseRequest("annotations", { query });
}

async function createAnnotation(slug, title, annotation) {
  const page = await ensurePage(slug, title);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await supabaseRequest("annotations", {
    method: "POST",
    prefer: "return=minimal",
    body: {
      id,
      page_id: page.id,
      anchor_id: annotation.anchorId,
      section_id: annotation.sectionId,
      section_title: annotation.sectionTitle,
      anchor_text: annotation.anchorText,
      context_type: annotation.contextType || null,
      context_key: annotation.contextKey || null,
      x_ratio: annotation.xRatio,
      y_ratio: annotation.yRatio,
      viewport_width: annotation.viewportWidth || null,
      viewport_height: annotation.viewportHeight || null,
      author_id: annotation.authorId || null,
      author_name: annotation.authorName,
      body: annotation.body,
      intent: annotation.intent || null,
      status: "visible"
    }
  });
  return {
    id,
    page_id: page.id,
    anchor_id: annotation.anchorId,
    section_id: annotation.sectionId,
    section_title: annotation.sectionTitle,
    anchor_text: annotation.anchorText,
    context_type: annotation.contextType || null,
    context_key: annotation.contextKey || null,
    x_ratio: annotation.xRatio,
    y_ratio: annotation.yRatio,
    viewport_width: annotation.viewportWidth || null,
    viewport_height: annotation.viewportHeight || null,
    author_id: annotation.authorId || null,
    author_name: annotation.authorName,
    body: annotation.body,
    intent: annotation.intent || null,
    status: "visible",
    created_at: now,
    updated_at: now
  };
}

async function softDeleteAnnotation(id) {
  const rows = await supabaseRequest("annotations", {
    method: "PATCH",
    query: `id=eq.${encodeURIComponent(id)}`,
    prefer: "return=representation",
    body: {
      status: "deleted",
      updated_at: new Date().toISOString()
    }
  });
  return rows[0] || null;
}

module.exports = {
  listAnnotations,
  createAnnotation,
  softDeleteAnnotation
};
