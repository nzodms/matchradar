import { cpSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");

mkdirSync(dist, { recursive: true });
cpSync(resolve(root, "manifest.json"), resolve(dist, "manifest.json"));
cpSync(resolve(root, "rules"), resolve(dist, "rules"), { recursive: true });
cpSync(resolve(root, "assets"), resolve(dist, "assets"), { recursive: true });

if (!existsSync(resolve(dist, "service-worker.js"))) {
  console.error("copy-static: dist/service-worker.js missing — run the full `npm run build`.");
  process.exit(1);
}
console.log("copy-static: manifest, rules and assets copied to dist/.");
