# Before / After Example

This example shows why Agent Handoff is more than a generic project rule file.

## Before

A long AI coding session ends with the important state trapped in chat:

```text
User: We tried the Codex marketplace path, but WindowsApps blocked the CLI.
Agent: Right. We validated via the app UI and should not repeat that CLI path.
User: Also remember that OpenCode loaded the plugin but --demo failed later.
Agent: Got it.
```

The next session starts with no durable project state unless the user explains
everything again.

## After

`HANDOFF.md` stays short:

```md
# Handoff

## Current Focus

Run a clean-clone install test.

## Relevant Context Files

- `handoffs/plugin-install.md`: install state and known CLI limitations.
- `handoffs/validation.md`: validation commands and smoke-test results.

## Next Steps

1. Clone the repo into a fresh directory.
2. Install the Codex and Claude Code local marketplaces.
3. Copy the OpenCode plugin into `.opencode/plugins/`.
4. Record any install failures in the relevant theme file.
```

The detailed context moves into a theme file:

```md
# Plugin Install Handoff

## Known Limitation

Running `codex.exe` from the managed shell returns WindowsApps `Access is denied`.
Use a normal terminal or the Codex app UI for marketplace install tests.

## OpenCode Runtime Smoke

OpenCode loaded `.opencode/plugins/agent-handoff.js` and printed
`Agent Handoff OpenCode plugin initialized`. The later `--demo` error happened
after plugin loading, so startup validation passed.
```

Now a fresh agent can read `HANDOFF.md`, follow only the relevant theme files,
and continue without the user restating the full history.
