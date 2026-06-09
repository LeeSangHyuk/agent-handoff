#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const templateRoot = path.join(repoRoot, "templates");

const REQUIRED_SECTIONS = [
  "Original Goal",
  "Current Focus",
  "Key Decisions",
  "Relevant Context Files",
  "Completed Work",
  "Failed Attempts",
  "Changed Files",
  "Next Steps",
  "Open Questions",
];

const THEME_FILES = [
  "handoffs/product.md",
  "handoffs/plugin-install.md",
  "handoffs/validation.md",
  "handoffs/roadmap.md",
];

const SECRET_PATTERNS = [
  /sk-[A-Za-z0-9_-]{20,}/,
  /ghp_[A-Za-z0-9_]{20,}/,
  /xox[baprs]-[A-Za-z0-9-]{20,}/,
  /-----BEGIN (?:RSA |OPENSSH |EC |DSA )?PRIVATE KEY-----/,
  /\b(?:api[_-]?key|secret|token|password)\s*[:=]\s*['"]?[A-Za-z0-9_.\-]{16,}/i,
];

function usage(exitCode = 0) {
  const text = `
agent-handoff <command> [target]

Commands:
  init [target]       Create HANDOFF.md, handoffs/, AGENTS.md, and CLAUDE.md.
  validate [target]   Check handoff structure, links, length, and secret smells.
  compact [target]    Report content that should move from HANDOFF.md to themes.

Examples:
  agent-handoff init .
  agent-handoff validate .
  agent-handoff compact .
`;
  console.log(text.trim());
  process.exit(exitCode);
}

function resolveTarget(value) {
  return path.resolve(value || ".");
}

function readUtf8(file) {
  return fs.readFileSync(file, "utf8");
}

function writeFileIfMissing(target, relativePath, content) {
  const file = path.join(target, relativePath);
  if (fs.existsSync(file)) {
    return { path: relativePath, status: "exists" };
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
  return { path: relativePath, status: "created" };
}

function copyTemplateIfMissing(target, relativePath, templateRelativePath = relativePath) {
  const template = path.join(templateRoot, templateRelativePath);
  return writeFileIfMissing(target, relativePath, readUtf8(template));
}

function init(target) {
  const results = [
    copyTemplateIfMissing(target, "HANDOFF.md"),
    copyTemplateIfMissing(target, "AGENTS.md"),
    copyTemplateIfMissing(target, "CLAUDE.md"),
    ...THEME_FILES.map((file) => copyTemplateIfMissing(target, file)),
  ];

  console.log("Agent Handoff initialized:");
  for (const result of results) {
    console.log(`- ${result.status.padEnd(7)} ${result.path}`);
  }
}

function parseSections(markdown) {
  const matches = [...markdown.matchAll(/^## (.+)$/gm)];
  return matches.map((match) => match[1].trim());
}

function referencedContextFiles(markdown) {
  const relevantStart = markdown.indexOf("## Relevant Context Files");
  if (relevantStart === -1) return [];
  const rest = markdown.slice(relevantStart);
  const nextSection = rest.slice(1).search(/\n## /);
  const block = nextSection === -1 ? rest : rest.slice(0, nextSection + 1);
  return [...block.matchAll(/`([^`]+)`/g)].map((match) => match[1]);
}

function validate(target) {
  const errors = [];
  const warnings = [];
  const handoffPath = path.join(target, "HANDOFF.md");

  if (!fs.existsSync(handoffPath)) {
    errors.push("Missing HANDOFF.md.");
  } else {
    const handoff = readUtf8(handoffPath);
    const sections = parseSections(handoff);
    for (const section of REQUIRED_SECTIONS) {
      if (!sections.includes(section)) {
        errors.push(`HANDOFF.md is missing section: ${section}`);
      }
    }

    const wordCount = handoff.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount > 900) {
      warnings.push(`HANDOFF.md is long (${wordCount} words). Consider compact.`);
    }

    for (const relativePath of referencedContextFiles(handoff)) {
      if (!fs.existsSync(path.join(target, relativePath))) {
        errors.push(`Referenced context file is missing: ${relativePath}`);
      }
    }

    for (const pattern of SECRET_PATTERNS) {
      if (pattern.test(handoff)) {
        errors.push("HANDOFF.md may contain a secret-like value.");
        break;
      }
    }
  }

  for (const file of THEME_FILES) {
    if (!fs.existsSync(path.join(target, file))) {
      warnings.push(`Recommended theme file is missing: ${file}`);
    }
  }

  for (const file of ["AGENTS.md", "CLAUDE.md"]) {
    if (!fs.existsSync(path.join(target, file))) {
      warnings.push(`Recommended agent rule file is missing: ${file}`);
    }
  }

  printValidation(errors, warnings);
  process.exit(errors.length ? 1 : 0);
}

function printValidation(errors, warnings) {
  if (!errors.length && !warnings.length) {
    console.log("Agent Handoff validation passed.");
    return;
  }

  if (errors.length) {
    console.log("Errors:");
    for (const error of errors) console.log(`- ${error}`);
  }

  if (warnings.length) {
    console.log("Warnings:");
    for (const warning of warnings) console.log(`- ${warning}`);
  }
}

function compact(target) {
  const handoffPath = path.join(target, "HANDOFF.md");
  if (!fs.existsSync(handoffPath)) {
    console.error("Missing HANDOFF.md.");
    process.exit(1);
  }

  const handoff = readUtf8(handoffPath);
  const suggestions = [];
  const completedLines = countListItemsAfter(handoff, "Completed Work");
  const failedLines = countListItemsAfter(handoff, "Failed Attempts");
  const wordCount = handoff.trim().split(/\s+/).filter(Boolean).length;

  if (wordCount > 600) {
    suggestions.push(`HANDOFF.md has ${wordCount} words; target 250-600.`);
  }
  if (completedLines > 8) {
    suggestions.push("Move older completed work into handoffs/validation.md or roadmap.md.");
  }
  if (failedLines > 5) {
    suggestions.push("Move detailed failed attempts into the relevant themed handoff file.");
  }

  for (const file of THEME_FILES) {
    if (!handoff.includes(`\`${file}\``)) {
      suggestions.push(`Consider listing \`${file}\` under Relevant Context Files.`);
    }
  }

  if (!suggestions.length) {
    console.log("HANDOFF.md is already compact enough.");
    return;
  }

  console.log("Compaction suggestions:");
  for (const suggestion of suggestions) console.log(`- ${suggestion}`);
}

function countListItemsAfter(markdown, sectionName) {
  const start = markdown.indexOf(`## ${sectionName}`);
  if (start === -1) return 0;
  const rest = markdown.slice(start);
  const nextSection = rest.slice(1).search(/\n## /);
  const block = nextSection === -1 ? rest : rest.slice(0, nextSection + 1);
  return block.split("\n").filter((line) => line.trim().startsWith("- ")).length;
}

const [command, targetArg] = process.argv.slice(2);
const target = resolveTarget(targetArg);

if (!command || command === "--help" || command === "-h") {
  usage(0);
}

if (command === "init" && !fs.existsSync(target)) {
  fs.mkdirSync(target, { recursive: true });
}

if (!fs.existsSync(target)) {
  console.error(`Target does not exist: ${target}`);
  process.exit(1);
}

switch (command) {
  case "init":
    init(target);
    break;
  case "validate":
    validate(target);
    break;
  case "compact":
    compact(target);
    break;
  default:
    console.error(`Unknown command: ${command}`);
    usage(1);
}
