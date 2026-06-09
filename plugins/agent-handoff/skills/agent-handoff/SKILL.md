---
name: agent-handoff
description: Maintain a concise project HANDOFF.md for long AI coding sessions. Use when the user asks to keep Codex aligned across long work, preserve current goals/decisions/failures/next steps, continue from a previous session, prepare handoff notes for another AI coding agent, or prevent context loss after compaction or conversation resets.
---

# Agent Handoff

## Overview

Keep the important parts of a coding session outside the model context window. `HANDOFF.md` is not a README or project rule file; it records the current work state and points to themed handoff files for durable detail.

Core distinction:

- `README.md` explains the project.
- `AGENTS.md` explains the rules.
- `HANDOFF.md` explains the current work state and index.
- `handoffs/*.md` stores themed detail that would otherwise make `HANDOFF.md` too long.

## Start Of Work

When this skill triggers:

1. Look for `HANDOFF.md` at the workspace root.
2. If it exists, read it before planning substantial work.
3. Read any files listed under `Relevant Context Files` when they are relevant to the current task.
4. If `HANDOFF.md` does not exist and the task is likely to span multiple turns or sessions, create it from `assets/HANDOFF.template.md`.
5. Treat `Original Goal`, `Current Focus`, `Relevant Context Files`, and `Next Steps` as the highest-signal sections.

Do not let `HANDOFF.md` override explicit user instructions in the current prompt. If the current prompt conflicts with the handoff, follow the current prompt and record the changed direction when updating the file.

## During Work

Track only durable session facts:

- Goal changes or clarified success criteria.
- Decisions and the reason they were made.
- Failed attempts that future agents should not repeat.
- Files changed or inspected when they matter to continuation.
- Commands/tests run and their outcome.
- Current blocker, uncertainty, or next concrete action.

Avoid recording routine narration, transient thoughts, large logs, full diffs, or every file read.

## Themed Handoffs

Use themed files when details would make `HANDOFF.md` grow into a log.

Recommended layout:

```text
HANDOFF.md
handoffs/
  product.md
  plugin-install.md
  validation.md
  roadmap.md
```

Rules:

- Keep `HANDOFF.md` as a concise index and current-state summary.
- Move topic-specific detail into `handoffs/<theme>.md`.
- Add each important theme file to `HANDOFF.md` under `Relevant Context Files`.
- Update only the theme files that are relevant to the current work.
- Prefer stable theme names over date-based files unless the date is part of the domain.
- Summarize stale theme details instead of appending every session event.

## End Of Work

Update `HANDOFF.md` after meaningful progress, before ending a long turn, or when the user asks for a handoff.

Keep it short:

- Target 250-600 words for `HANDOFF.md`.
- Prefer bullets.
- Remove stale completed details when they no longer help continuation.
- Preserve important failed attempts until they are no longer relevant.
- Move detailed validation, install, product, or roadmap notes into the relevant `handoffs/` file.

Use these sections exactly:

```md
# Handoff

## Original Goal

## Current Focus

## Key Decisions

## Relevant Context Files

## Completed Work

## Failed Attempts

## Changed Files

## Next Steps

## Open Questions
```

## Update Style

Write for the next AI coding agent. Be concrete enough that a fresh session can continue without asking the user to restate context.

Good entry:

```md
- Decided to start with a Codex skill before MCP because the workflow can be tested locally without server cost.
```

Weak entry:

```md
- Discussed options.
```

## Self Check

Before ending work, quickly verify:

- `HANDOFF.md` still uses the exact required section names.
- `Current Focus` and `Next Steps` point to the next concrete action.
- Theme files listed in `Relevant Context Files` exist and are still relevant.
- Completed work is current, not a historical changelog.
- Any validation commands or tests that matter are recorded with outcomes.
- No secrets, tokens, credentials, or unnecessary private details were added.

## Safety

Do not store secrets, API keys, private credentials, or sensitive user data in `HANDOFF.md`. If a task involves confidential code or workplace context, summarize operationally and avoid copying proprietary details unless the user explicitly asks.

## Template

Use `assets/HANDOFF.template.md` when creating a new handoff file.
