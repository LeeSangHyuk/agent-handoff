# Agent Handoff for Claude Code

This is a Claude Code plugin scaffold for Agent Handoff.

It packages a skill that tells Claude Code to maintain:

- `HANDOFF.md` as the concise current-state index.
- `handoffs/*.md` as themed detail files.

## Local Test

From Claude Code, add this plugin directory through the plugin UI or command flow, then invoke:

```text
/agent-handoff:agent-handoff
```

You can also use a natural prompt:

```text
handoff
```

## Distribution Direction

For team sharing, wrap this plugin in a Claude Code marketplace repository or add it to an existing company marketplace.
