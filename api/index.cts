"use strict";

const http = require("http");
const https = require("https");

const BACKEND_URL = process.env.PYTHON_BACKEND_URL || "http://localhost:8000";

function handler(req, res) {
  const target = new URL(req.url, BACKEND_URL);
  const isHttps = target.protocol === "https:";
  const lib = isHttps ? https : http;

  const proxyReq = lib.request(
    {
      hostname: target.hostname,
      port: target.port ? parseInt(target.port) : (isHttps ? 443 : 80),
      path: target.pathname + target.search,
      method: req.method,
      headers: { ...req.headers, host: target.host },
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    }
  );

  proxyReq.on("error", (err) => {
    console.error("Proxy error:", err.message);
    if (!res.headersSent) {
      res.writeHead(502, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Backend no disponible" }));
    }
  });

  req.pipe(proxyReq, { end: true });
}

// Desactiva el body parser de Vercel para poder redirigir el stream crudo
handler.config = { api: { bodyParser: false } };

module.exports = handler;
