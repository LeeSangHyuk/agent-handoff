# Product Handoff

## Positioning

Agent Handoff is an auditable project handoff system for AI coding agents. It is not generic AI memory. The core promise is that a fresh coding agent can continue from durable repo files instead of relying on hidden chat memory or the previous conversation transcript.

## Target User

- Developers running long AI coding sessions.
- Small teams that want agent work to be reviewable in Git.
- Company teams that cannot rely on opaque cross-session memory for engineering state.

## Key Product Decisions

- Start with a local file workflow before MCP or SaaS.
  Reason: teams can evaluate it without sending additional data to a hosted service.
- Position around handoff, not memory.
  Reason: handoff is narrower, more concrete, and easier to validate.
- Keep files plain Markdown.
  Reason: every coding agent and developer can read them.

## Naming Options

- `Agent Handoff`
- `Handoff.md`
- `AI Handoff`

## Product Risks

- If `HANDOFF.md` becomes a log, it loses the benefit of fast orientation.
- If too many theme files are mandatory, setup may feel heavy.
- If the workflow depends on a Codex-only plugin, company adoption across Claude Code/OpenCode becomes weaker.
