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

function main() {
  const input = readStdin();
  const data = safeJsonParse(input);
  if (!data) process.exit(0);

  const prompt = String(data.prompt ?? "").toLowerCase();
  const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  const rulesPath = path.join(projectDir, ".claude", "skills", "skill-rules.json");

  let rules;
  try {
    rules = JSON.parse(fs.readFileSync(rulesPath, "utf-8"));
  } catch {
    process.exit(0);
  }

  const skills = rules?.skills ?? {};
  const matched = [];

  for (const [skillName, config] of Object.entries(skills)) {
    const triggers = config?.promptTriggers;
    if (!triggers) continue;

    const keywords = triggers.keywords ?? [];
    const keywordMatch = keywords.some((kw) => prompt.includes(String(kw).toLowerCase()));
    if (keywordMatch) {
      matched.push({ name: skillName, config });
      continue;
    }

    const patterns = triggers.intentPatterns ?? [];
    const intentMatch = patterns.some((pattern) => {
      try {
        return new RegExp(String(pattern), "i").test(prompt);
      } catch {
        return false;
      }
    });
    if (intentMatch) matched.push({ name: skillName, config });
  }

  if (matched.length === 0) process.exit(0);

  const byPriority = (p) => matched.filter((s) => s.config?.priority === p);
  const critical = byPriority("critical");
  const high = byPriority("high");
  const medium = byPriority("medium");
  const low = byPriority("low");

  let output = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
  output += "SKILL ACTIVATION CHECK\n";
  output += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

  if (critical.length > 0) {
    output += "CRITICAL SKILLS (REQUIRED):\n";
    for (const s of critical) output += `  -> ${s.name}\n`;
    output += "\n";
  }
  if (high.length > 0) {
    output += "RECOMMENDED SKILLS:\n";
    for (const s of high) output += `  -> ${s.name}\n`;
    output += "\n";
  }
  if (medium.length > 0) {
    output += "SUGGESTED SKILLS:\n";
    for (const s of medium) output += `  -> ${s.name}\n`;
    output += "\n";
  }
  if (low.length > 0) {
    output += "OPTIONAL SKILLS:\n";
    for (const s of low) output += `  -> ${s.name}\n`;
    output += "\n";
  }

  output += "ACTION: Use Skill tool BEFORE responding\n";
  output += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";

  console.log(output);
  process.exit(0);
}

try {
  main();
} catch (err) {
  console.error("Error in skill-activation-prompt hook:", err);
  process.exit(1);
}

