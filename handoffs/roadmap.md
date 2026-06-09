# Roadmap Handoff

## Near-Term

1. Keep `HANDOFF.md` short and use it as an index.
2. Make the CLI the primary install-immediate value path:
   - `agent-handoff init`
   - `agent-handoff validate`
   - `agent-handoff compact`
3. Test the workflow from a clean clone.
4. Test OpenCode behavior in a company or sample repo.

## Cross-Agent Direction

The file-based approach should port well because the core artifact is Markdown, not a Codex-only API.

Candidate adapters:

- Codex: plugin skill plus optional `AGENTS.md`.
- OpenCode: `AGENTS.md` project rules plus a JS/TS plugin under `.opencode/plugins/` or an npm package listed in `opencode.json`.
- Claude Code: `CLAUDE.md` project memory plus a `.claude-plugin` plugin with skills/hooks for reusable distribution.

## Company Adoption Path

Start with low-risk repo files:

1. `HANDOFF.md`
2. `handoffs/`
3. `AGENTS.md`
4. `CLAUDE.md`

Only add hooks after the team agrees what should be automated, because hooks can create external side effects and should be reviewed like code.

## Plugin Packaging Status

- Codex plugin: working MVP, installed and smoke-tested.
- Claude Code plugin: scaffolded with `.claude-plugin/plugin.json` and `skills/agent-handoff/SKILL.md`.
- OpenCode plugin: scaffolded as an npm-style ESM package with an event hook placeholder.
- CLI: scaffolded with `init`, `validate`, and `compact`; validated with portable Node.js.

Next validation should happen inside Claude Code and OpenCode rather than only through this managed shell.

## Product Direction

The plugins should remain adapters, not the center of gravity.

The product should be framed as:

```text
handoff protocol + CLI initializer/validator + optional agent adapters
```

This lowers adoption friction because teams can start with repo files and CLI checks before trusting any agent-specific plugin automation.
