// Simple Express server to serve the built TanStack Start app
// Used for Render deployment
import express from "express";
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

// Try to use the TanStack Start server entry if available
const serverEntry = join(__dirname, "dist/server/index.js");

if (existsSync(serverEntry)) {
  // Use the SSR server
  const { default: handler } = await import(serverEntry);
  const app = express();
  app.use((req, res) => {
    handler(req, res);
  });
  createServer(app).listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} else {
  // Fallback: serve static client files
  const app = express();
  const clientDir = join(__dirname, "dist/client");
  app.use(express.static(clientDir));
  app.get("*", (req, res) => {
    const index = join(clientDir, "index.html");
    if (existsSync(index)) {
      res.sendFile(index);
    } else {
      res.status(404).send("Build not found. Run npm run build first.");
    }
  });
  createServer(app).listen(PORT, () => {
    console.log(`Static server running on port ${PORT}`);
  });
}
