import fs from "fs";
import path from "path";

const rootDir = process.cwd();

const targetDirs = ["src", "open-sse", "public", "bin", "electron", "scripts", "docs", "tests"];
const targetRootFiles = [
  "package.json",
  "tsconfig.json",
  "next.config.mjs",
  "README.md",
  "AGENTS.md",
  "CLAUDE.md",
  "GEMINI.md",
  ".env.example",
  "docker-compose.yml",
  "Dockerfile",
  "fly.toml"
];

const ignoredExtensions = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".ico", ".dmg", ".exe", ".zip", ".tar", ".gz", ".woff", ".woff2", ".ttf", ".eot", ".bin", ".mp3", ".wav"
]);

const ignoredDirs = new Set(["node_modules", ".git", ".next", ".build", "dist", "dist-electron", "coverage"]);

function replaceContent(content) {
  let res = content;
  
  // Specific regex replacements
  res = res.replace(/@myrouter\/open-sse/gi, "@myrouter/open-sse");
  res = res.replace(/@myrouter/gi, "@myrouter");
  res = res.replace(/myrouter([A-Z0-9])/g, (m, p1) => `myRouter${p1}`);
  res = res.replace(/MyRouter([A-Z0-9])/g, (m, p1) => `MyRouter${p1}`);
  res = res.replace(/myrouterProvider/g, "myrouterProvider");
  
  // Case variants
  res = res.replace(/myrouter/gi, (match) => {
    if (match === match.toUpperCase()) return "MYROUTER";
    if (match[0] === match[0].toUpperCase()) return "MyRouter";
    return "myrouter";
  });
  
  res = res.replace(/myrouter/gi, (match) => {
    if (match === match.toUpperCase()) return "MYROUTER";
    if (match[0] === match[0].toUpperCase()) return "MyRouter";
    return "myrouter";
  });
  
  return res;
}

function processFileContent(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ignoredExtensions.has(ext)) return;

  try {
    const original = fs.readFileSync(filePath, "utf8");
    const modified = replaceContent(original);
    if (original !== modified) {
      fs.writeFileSync(filePath, modified, "utf8");
      console.log(`Cleaned: ${path.relative(rootDir, filePath)}`);
    }
  } catch (err) {}
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (ignoredDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile()) {
      processFileContent(fullPath);
    }
  }
}

for (const file of targetRootFiles) {
  const fp = path.join(rootDir, file);
  if (fs.existsSync(fp)) processFileContent(fp);
}

for (const dir of targetDirs) {
  const dp = path.join(rootDir, dir);
  if (fs.existsSync(dp)) walk(dp);
}

console.log("Complete deep cleanup done!");
