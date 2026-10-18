// Cloudflare Pages only (it sets CF_PAGES=1 during builds): drop the
// GitHub Pages 404.html redirect trick from the build. Without a top-level
// 404.html, Pages serves index.html for every unknown path, so deep links
// like /about just work. GitHub Pages builds keep the file.
const fs = require("fs");
const path = require("path");

if (process.env.CF_PAGES) {
  const file = path.join(__dirname, "..", "build", "404.html");
  if (fs.existsSync(file)) fs.unlinkSync(file);
}
