---
name: agent-handoff
description: >-
  Maintain concise HANDOFF.md and themed handoff files for long Claude Code
  sessions. Use when the user asks to continue from previous work, preserve
  decisions, failures, next steps, prepare a handoff, or avoid context loss.
---

# Agent Handoff

Use repository Markdown files as the durable handoff state for AI coding sessions.
Prefer the hidden layout `.agent-handoff/HANDOFF.md` when it exists; fall back
to root `HANDOFF.md` for older projects.

## Start

1. Look for `.agent-handoff/HANDOFF.md` first, then `HANDOFF.md` at the workspace root.
2. Read the first existing handoff file before planning substantial work.
3. Treat the handoff file as the concise index and current-state summary.
4. Read relevant files listed under `Relevant Context Files`.
5. If neither handoff file exists and the work will span sessions, create `.agent-handoff/HANDOFF.md` with the required sections.

## Themed Files

Keep durable detail under `.agent-handoff/handoffs/` for hidden-layout projects:

```text
.agent-handoff/
  HANDOFF.md
  handoffs/
    product.md
    plugin-install.md
    validation.md
    roadmap.md
```

For older root-layout projects, continue using `handoffs/`.

Use stable theme names. Do not create date-based logs unless the date is part of the domain.

## End

Before ending meaningful work:

1. Update `.agent-handoff/HANDOFF.md` or `HANDOFF.md` with the latest current focus and next steps.
2. Update only the relevant themed detail files.
3. Keep the handoff file concise; move details to theme files.
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
