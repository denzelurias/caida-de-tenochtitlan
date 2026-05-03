const { softDeleteAnnotation } = require("../../lib/db");

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

function getId(req) {
  if (req.query?.id) return String(req.query.id);
  const url = new URL(req.url, `https://${req.headers.host || "localhost"}`);
  return decodeURIComponent(url.pathname.split("/").filter(Boolean).pop() || "");
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method === "PATCH") {
    sendError(res, 403, "FORBIDDEN", "La edición de notas queda reservada para una fase con autenticación.");
    return;
  }

  if (req.method !== "DELETE") {
    sendError(res, 405, "METHOD_NOT_ALLOWED", "Método no permitido.");
    return;
  }

  const token = req.headers["x-annotation-admin-token"];
  if (!process.env.ANNOTATION_ADMIN_TOKEN || token !== process.env.ANNOTATION_ADMIN_TOKEN) {
    sendError(res, 401, "UNAUTHORIZED", "Hace falta un token de moderación para eliminar notas.");
    return;
  }

  try {
    const id = getId(req);
    if (!/^[a-f0-9-]{36}$/i.test(id)) {
      sendError(res, 400, "VALIDATION_ERROR", "El identificador de nota no es válido.", "id");
      return;
    }

    const annotation = await softDeleteAnnotation(id);
    if (!annotation) {
      sendError(res, 404, "NOT_FOUND", "La nota no existe.");
      return;
    }

    sendJson(res, 200, { ok: true, id });
  } catch (error) {
    sendError(res, error.status || 500, error.code || "SERVER_ERROR", error.message || "Error inesperado.");
  }
};
