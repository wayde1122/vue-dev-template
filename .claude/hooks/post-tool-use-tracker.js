#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

function readStdin() {
  const buf = fs.readFileSync(0);
  // PowerShell pipeline often outputs UTF-16LE; detect NUL bytes and decode accordingly.
  const asUtf8 = buf.toString("utf8");
  if (asUtf8.includes("\u0000")) return buf.toString("utf16le");
  return asUtf8;
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function normalizeSlashes(p) {
  return p.replaceAll("\\", "/");
}

function detectRepo(filePath, projectRoot) {
  const file = normalizeSlashes(filePath);
  const root = normalizeSlashes(projectRoot);

  const relativePath = file.startsWith(root + "/") ? file.slice(root.length + 1) : file;
  const repo = relativePath.split("/")[0] ?? "";

  switch (repo) {
    case "frontend":
    case "client":
    case "web":
    case "app":
    case "ui":
      return repo;
    case "backend":
    case "server":
    case "api":
    case "src":
    case "services":
      return repo;
    case "database":
    case "prisma":
    case "migrations":
      return repo;
    case "packages": {
      const pkg = relativePath.split("/")[1] ?? "";
      return pkg ? `packages/${pkg}` : repo;
    }
    case "examples": {
      const example = relativePath.split("/")[1] ?? "";
      return example ? `examples/${example}` : repo;
    }
    default: {
      const hasSlash = relativePath.includes("/");
      if (!hasSlash) return "root";
      return "unknown";
    }
  }
}

function hasBuildScript(packageJsonPath) {
  try {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    return Boolean(pkg?.scripts?.build);
  } catch {
    return false;
  }
}

function getBuildCommand(repo, projectRoot) {
  const repoPath = path.join(projectRoot, repo);
  const pkgPath = path.join(repoPath, "package.json");
  if (!fs.existsSync(pkgPath) || !hasBuildScript(pkgPath)) return "";

  const pnpmLock = path.join(repoPath, "pnpm-lock.yaml");
  const npmLock = path.join(repoPath, "package-lock.json");
  const yarnLock = path.join(repoPath, "yarn.lock");

  if (fs.existsSync(pnpmLock)) return `cd "${repoPath}" && pnpm build`;
  if (fs.existsSync(npmLock)) return `cd "${repoPath}" && npm run build`;
  if (fs.existsSync(yarnLock)) return `cd "${repoPath}" && yarn build`;
  return `cd "${repoPath}" && npm run build`;
}

function getTscCommand(repo, projectRoot) {
  const repoPath = path.join(projectRoot, repo);
  const tsconfig = path.join(repoPath, "tsconfig.json");
  if (!fs.existsSync(tsconfig)) return "";

  const tsconfigApp = path.join(repoPath, "tsconfig.app.json");
  if (fs.existsSync(tsconfigApp)) return `cd "${repoPath}" && npx tsc --project tsconfig.app.json --noEmit`;
  return `cd "${repoPath}" && npx tsc --noEmit`;
}

function appendLine(file, line) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.appendFileSync(file, line + "\n", "utf-8");
}

function readLines(file) {
  try {
    return fs
      .readFileSync(file, "utf-8")
      .split(/\r?\n/u)
      .map((l) => l.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function writeLines(file, lines) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, lines.join("\n") + "\n", "utf-8");
}

function main() {
  const toolInfoText = readStdin();
  const toolInfo = safeJsonParse(toolInfoText);
  if (!toolInfo) process.exit(0);

  const toolName = toolInfo.tool_name ?? "";
  const filePath = toolInfo?.tool_input?.file_path ?? "";
  const sessionId = toolInfo.session_id ?? "default";

  if (!/^(Edit|MultiEdit|Write)$/u.test(toolName) || !filePath) process.exit(0);
  if (/\.(md|markdown)$/iu.test(filePath)) process.exit(0);

  const projectRoot = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  const cacheDir = path.join(projectRoot, ".claude", "tsc-cache", sessionId);
  fs.mkdirSync(cacheDir, { recursive: true });

  const repo = detectRepo(filePath, projectRoot);
  if (repo === "unknown" || !repo) process.exit(0);

  appendLine(path.join(cacheDir, "edited-files.log"), `${Math.floor(Date.now() / 1000)}:${filePath}:${repo}`);

  const affectedReposFile = path.join(cacheDir, "affected-repos.txt");
  const affected = new Set(readLines(affectedReposFile));
  affected.add(repo);
  writeLines(affectedReposFile, [...affected].sort());

  const cmds = new Set(readLines(path.join(cacheDir, "commands.txt")));
  const buildCmd = getBuildCommand(repo, projectRoot);
  const tscCmd = getTscCommand(repo, projectRoot);

  if (buildCmd) cmds.add(`${repo}:build:${buildCmd}`);
  if (tscCmd) cmds.add(`${repo}:tsc:${tscCmd}`);

  writeLines(path.join(cacheDir, "commands.txt"), [...cmds].sort());
  process.exit(0);
}

try {
  main();
} catch (err) {
  console.error("Error in post-tool-use-tracker hook:", err);
  process.exit(1);
}

