import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const publicDir = join(projectRoot, "public");
const siteUrl = (process.env.VITE_SITE_URL || "https://example.com").replace(/\/+$/, "");

if (!existsSync(publicDir)) {
  mkdirSync(publicDir, { recursive: true });
}

const content = [
  "User-agent: *",
  "Allow: /",
  `Sitemap: ${siteUrl}/sitemap.xml`,
  ""
].join("\n");

const target = join(publicDir, "robots.txt");
writeFileSync(target, content, "utf8");
console.log(`robots.txt generated at ${target}`);
