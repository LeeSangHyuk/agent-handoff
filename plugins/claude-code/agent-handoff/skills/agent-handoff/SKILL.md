---
name: agent-handoff
description: >-
  Maintain concise HANDOFF.md and themed handoff files for long Claude Code
  sessions. Use when the user asks to continue from previous work, preserve
  decisions, failures, next steps, prepare a handoff, or avoid context loss.
---

# Agent Handoff

Use repository Markdown files as the durable handoff state for AI coding sessions.

## Start

1. Read `HANDOFF.md` at the workspace root before planning substantial work.
2. Treat `HANDOFF.md` as the concise index and current-state summary.
3. Read relevant files listed under `Relevant Context Files`.
4. If `HANDOFF.md` is missing and the work will span sessions, create it with the required sections.

## Themed Files

Keep durable detail under `handoffs/`:

```text
handoffs/
  product.md
  plugin-install.md
  validation.md
  roadmap.md
```

Use stable theme names. Do not create date-based logs unless the date is part of the domain.

## End

Before ending meaningful work:

1. Update `HANDOFF.md` with the latest current focus and next steps.
2. Update only the relevant `handoffs/*.md` detail files.
3. Keep `HANDOFF.md` concise; move details to theme files.
4. Record failed attempts that future agents should not repeat.
5. Do not store secrets, credentials, or unnecessary private details.

## Required HANDOFF.md Sections

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
