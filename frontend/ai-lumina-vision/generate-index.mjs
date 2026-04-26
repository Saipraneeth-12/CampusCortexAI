/**
 * Post-build script: generates index.html from the client build manifest.
 * Run after `vite build` to create a proper entry point for static hosting.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const clientDir = join(__dirname, "dist/client");
const assetsDir = join(clientDir, "assets");

if (!existsSync(assetsDir)) {
  console.error("dist/client/assets not found. Run vite build first.");
  process.exit(1);
}

// Find the main JS entry (largest non-chunk file, or the one named index-*.js)
const files = readdirSync(assetsDir);
const mainJs = files.find(f => f.startsWith("index-") && f.endsWith(".js") && !f.includes("chunk"));
const cssFile = files.find(f => f.startsWith("styles-") && f.endsWith(".css"));

if (!mainJs) {
  console.error("Could not find main JS entry in dist/client/assets");
  console.log("Available files:", files);
  process.exit(1);
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Campus Cortex AI — Morning Pulse Market Intelligence</title>
  <meta name="description" content="Autonomous real-time market intelligence for EdTech professionals. Powered by Groq AI." />
  ${cssFile ? `<link rel="stylesheet" crossorigin href="/assets/${cssFile}" />` : ""}
</head>
<body>
  <div id="root"></div>
  <script type="module" crossorigin src="/assets/${mainJs}"></script>
</body>
</html>
`;

writeFileSync(join(clientDir, "index.html"), html);
console.log(`✅ Generated index.html → /assets/${mainJs}`);
if (cssFile) console.log(`   CSS: /assets/${cssFile}`);
