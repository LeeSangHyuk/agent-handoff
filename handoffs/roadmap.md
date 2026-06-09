# Roadmap Handoff

## Near-Term

1. Keep `HANDOFF.md` short and use it as an index.
2. Update `SKILL.md` so Codex knows how to maintain themed files under `handoffs/`.
3. Add project-level rules for broader agent support:
   - `AGENTS.md` for Codex/OpenCode-style project instructions.
   - `CLAUDE.md` or `.claude/CLAUDE.md` for Claude Code project memory.
4. Test the workflow from a clean clone.

## Cross-Agent Direction

The file-based approach should port well because the core artifact is Markdown, not a Codex-only API.

Candidate adapters:

- Codex: plugin skill plus optional `AGENTS.md`.
- OpenCode: `AGENTS.md` project rules and optional `opencode.json` instruction references.
- Claude Code: `CLAUDE.md` project memory, optional custom slash command, optional hooks for stronger enforcement.

## Company Adoption Path

Start with low-risk repo files:

1. `HANDOFF.md`
2. `handoffs/`
3. `AGENTS.md`
4. `CLAUDE.md`

Only add hooks after the team agrees what should be automated, because hooks can create external side effects and should be reviewed like code.
