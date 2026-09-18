/* ============================================================
   Tiny zero-dependency dev server for the quiz.
   Run with:  npm run dev      (or:  node serve.js [port])
   No npm install needed — uses only Node.js built-ins.
   There is no build step: after editing songs.js, refresh the
   browser to see your changes.
   ============================================================ */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = Number(process.argv[2] || process.env.PORT || 3000);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8"
};

const server = http.createServer((req, res) => {
  try {
    const urlPath = decodeURIComponent(req.url.split("?")[0]);
    const file = path.normalize(
      path.join(ROOT, urlPath === "/" ? "index.html" : urlPath)
    );
    if (file !== ROOT && !file.startsWith(ROOT + path.sep)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end(fs.readFileSync(path.join(ROOT, "404.html")));
      return;
    }
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(fs.readFileSync(file));
  } catch (e) {
    res.writeHead(500);
    res.end("Server error");
  }
});

server.listen(PORT, () => {
  console.log("🎵 English Song Quiz is running at");
  console.log("   http://localhost:" + PORT + "/");
  console.log("");
  console.log("Serving from: " + ROOT);
  console.log("Edit songs.js, then refresh the browser (no build step). Ctrl+C to stop.");
});
