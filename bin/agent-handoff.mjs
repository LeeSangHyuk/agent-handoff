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

const ROOT_THEME_FILES = [
  "handoffs/product.md",
  "handoffs/plugin-install.md",
  "handoffs/validation.md",
  "handoffs/roadmap.md",
];

const HIDDEN_ROOT = ".agent-handoff";

const HIDDEN_THEME_FILES = ROOT_THEME_FILES.map((file) => `${HIDDEN_ROOT}/${file}`);

const HIDDEN_AGENT_FILES = [
  `${HIDDEN_ROOT}/agents/codex.md`,
  `${HIDDEN_ROOT}/agents/claude.md`,
  `${HIDDEN_ROOT}/agents/opencode.md`,
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
  init [target]       Create handoff files. Use --layout hidden for .agent-handoff/.
  validate [target]   Check handoff structure, links, length, and secret smells.
  compact [target]    Report content that should move from HANDOFF.md to themes.

Examples:
  agent-handoff init .
  agent-handoff init . --layout hidden
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

function init(target, options) {
  const layout = options.layout || "root";
  const results = layout === "hidden" ? initHidden(target) : initRoot(target);

  console.log(`Agent Handoff initialized (${layout} layout):`);
  for (const result of results) {
    console.log(`- ${result.status.padEnd(7)} ${result.path}`);
  }
}

function initRoot(target) {
  return [
    copyTemplateIfMissing(target, "HANDOFF.md"),
    copyTemplateIfMissing(target, "AGENTS.md"),
    copyTemplateIfMissing(target, "CLAUDE.md"),
    ...ROOT_THEME_FILES.map((file) => copyTemplateIfMissing(target, file)),
  ];
}

function initHidden(target) {
  const handoff = readUtf8(path.join(templateRoot, "HANDOFF.md"))
    .replaceAll("`handoffs/", "`.agent-handoff/handoffs/");
  const codex = hiddenAgentInstructions("Codex");
  const claude = hiddenAgentInstructions("Claude Code");
  const opencode = hiddenAgentInstructions("OpenCode");

  return [
    writeFileIfMissing(target, `${HIDDEN_ROOT}/HANDOFF.md`, handoff),
    writeFileIfMissing(target, `${HIDDEN_ROOT}/agents/codex.md`, codex),
    writeFileIfMissing(target, `${HIDDEN_ROOT}/agents/claude.md`, claude),
    writeFileIfMissing(target, `${HIDDEN_ROOT}/agents/opencode.md`, opencode),
    ...ROOT_THEME_FILES.map((file) => copyTemplateIfMissing(target, `${HIDDEN_ROOT}/${file}`, file)),
  ];
}

function hiddenAgentInstructions(agentName) {
  return `# Agent Handoff Instructions for ${agentName}

This repository keeps AI coding session state under \`.agent-handoff/\` so the
project root stays clean.

Before substantial work:

1. Read \`.agent-handoff/HANDOFF.md\`.
2. Use it as the concise current-state index.
3. Read relevant files under \`.agent-handoff/handoffs/\` when the handoff points to them.

After meaningful work:

1. Update \`.agent-handoff/HANDOFF.md\` with the current focus and next steps.
2. Update the relevant themed file under \`.agent-handoff/handoffs/\`.
3. Keep the handoff concise; do not turn it into a chronological session log.

Never store secrets, credentials, or unnecessary private details in handoff files.
`;
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

function detectLayout(target) {
  const rootHandoff = path.join(target, "HANDOFF.md");
  const hiddenHandoff = path.join(target, HIDDEN_ROOT, "HANDOFF.md");

  if (fs.existsSync(hiddenHandoff)) {
    return {
      name: "hidden",
      handoffFile: `${HIDDEN_ROOT}/HANDOFF.md`,
      themeFiles: HIDDEN_THEME_FILES,
      agentFiles: HIDDEN_AGENT_FILES,
      legacyRootExists: fs.existsSync(rootHandoff),
    };
  }

  if (fs.existsSync(rootHandoff)) {
    return {
      name: "root",
      handoffFile: "HANDOFF.md",
      themeFiles: ROOT_THEME_FILES,
      agentFiles: ["AGENTS.md", "CLAUDE.md"],
      legacyRootExists: false,
    };
  }

  return {
    name: "missing",
    handoffFile: "HANDOFF.md",
    themeFiles: ROOT_THEME_FILES,
    agentFiles: ["AGENTS.md", "CLAUDE.md"],
    legacyRootExists: false,
  };
}

function validate(target) {
  const errors = [];
  const warnings = [];
  const layout = detectLayout(target);
  const handoffPath = path.join(target, layout.handoffFile);

  if (layout.legacyRootExists) {
    warnings.push(`Both ${HIDDEN_ROOT}/HANDOFF.md and HANDOFF.md exist; using ${HIDDEN_ROOT}/HANDOFF.md.`);
  }

  if (!fs.existsSync(handoffPath)) {
    errors.push(`Missing handoff file. Expected HANDOFF.md or ${HIDDEN_ROOT}/HANDOFF.md.`);
  } else {
    const handoff = readUtf8(handoffPath);
    const sections = parseSections(handoff);
    for (const section of REQUIRED_SECTIONS) {
      if (!sections.includes(section)) {
        errors.push(`${layout.handoffFile} is missing section: ${section}`);
      }
    }

    const wordCount = handoff.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount > 900) {
      warnings.push(`${layout.handoffFile} is long (${wordCount} words). Consider compact.`);
    }

    for (const relativePath of referencedContextFiles(handoff)) {
      if (!fs.existsSync(path.join(target, relativePath))) {
        errors.push(`Referenced context file is missing: ${relativePath}`);
      }
    }

    for (const pattern of SECRET_PATTERNS) {
      if (pattern.test(handoff)) {
        errors.push(`${layout.handoffFile} may contain a secret-like value.`);
        break;
      }
    }
  }

  for (const file of layout.themeFiles) {
    if (!fs.existsSync(path.join(target, file))) {
      warnings.push(`Recommended theme file is missing: ${file}`);
    }
  }

  for (const file of layout.agentFiles) {
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
  const layout = detectLayout(target);
  const handoffPath = path.join(target, layout.handoffFile);
  if (!fs.existsSync(handoffPath)) {
    console.error(`Missing handoff file. Expected HANDOFF.md or ${HIDDEN_ROOT}/HANDOFF.md.`);
    process.exit(1);
  }

  const handoff = readUtf8(handoffPath);
  const suggestions = [];
  const completedLines = countListItemsAfter(handoff, "Completed Work");
  const failedLines = countListItemsAfter(handoff, "Failed Attempts");
  const wordCount = handoff.trim().split(/\s+/).filter(Boolean).length;

  if (wordCount > 600) {
    suggestions.push(`${layout.handoffFile} has ${wordCount} words; target 250-600.`);
  }
  if (completedLines > 8) {
    suggestions.push(`Move older completed work into ${layout.themeFiles[2]} or ${layout.themeFiles[3]}.`);
  }
  if (failedLines > 5) {
    suggestions.push("Move detailed failed attempts into the relevant themed handoff file.");
  }

  for (const file of layout.themeFiles) {
    if (!handoff.includes(`\`${file}\``)) {
      suggestions.push(`Consider listing \`${file}\` under Relevant Context Files.`);
    }
  }

  if (!suggestions.length) {
    console.log(`${layout.handoffFile} is already compact enough.`);
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

const [command, ...commandArgs] = process.argv.slice(2);
const options = parseOptions(commandArgs);
const target = resolveTarget(options.target);

function parseOptions(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--layout") {
      if (!args[index + 1] || args[index + 1].startsWith("-")) {
        console.error("Missing value for --layout. Use root or hidden.");
        usage(1);
      }
      options.layout = args[index + 1];
      index += 1;
    } else if (arg === "--layout=hidden" || arg === "--hidden") {
      options.layout = "hidden";
    } else if (arg === "--layout=root") {
      options.layout = "root";
    } else if (!arg.startsWith("-")) {
      options.target = arg;
    } else {
      console.error(`Unknown option: ${arg}`);
      usage(1);
    }
  }

  if (options.layout && !["root", "hidden"].includes(options.layout)) {
    console.error(`Unknown layout: ${options.layout}`);
    usage(1);
  }

  return options;
}

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
    init(target, options);
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
