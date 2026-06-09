# Portability

Agent Handoff is intentionally file-based. The Codex plugin improves discoverability and behavior in Codex, but the core workflow can be adapted to other coding agents because the state lives in Markdown files committed to the repository.

## Core Files

```text
HANDOFF.md
handoffs/
  product.md
  plugin-install.md
  validation.md
  roadmap.md
```

`HANDOFF.md` should stay short. It points agents to the theme files that matter for the current task.

## Codex

Use the bundled Codex plugin:

- `.agents/plugins/marketplace.json`
- `plugins/agent-handoff/.codex-plugin/plugin.json`
- `plugins/agent-handoff/skills/agent-handoff/SKILL.md`

Recommended prompt:

```text
handoff
```

Optional hardening:

- Add `AGENTS.md` to make handoff behavior a project rule.

## OpenCode

OpenCode supports project rules through `AGENTS.md`. This repository includes a committed `AGENTS.md` that tells OpenCode to read `HANDOFF.md` first and update relevant files under `handoffs/`.

Optional OpenCode shape:

```text
AGENTS.md
opencode.json
```

`opencode.json` can reference additional instruction files if the team wants to split rules across documents.

## Claude Code

Claude Code supports project memory through `CLAUDE.md` or `.claude/CLAUDE.md`. This repository includes a committed `CLAUDE.md` for the same handoff behavior. Claude Code also supports hooks and plugins for stronger automation.

Recommended company-safe starting point:

```text
CLAUDE.md
HANDOFF.md
handoffs/
```

Optional hardening:

- A custom slash command for explicit handoff updates.
- A `Stop` or `SessionEnd` hook that reminds or requires the agent to update handoff files.
- A plugin/skill package if the team wants reusable behavior across repositories.

## Company Rollout

Start with Markdown rules and reviewable repo files before adding hooks.

Suggested rollout:

1. Add `HANDOFF.md` and `handoffs/`.
2. Add `AGENTS.md` for tools that read it.
3. Add `CLAUDE.md` for Claude Code users.
4. Add hooks only after security and developer-experience review.

Security guidance:

- Do not store secrets or credentials in handoff files.
- Avoid copying proprietary logs unless the team explicitly allows it.
- Treat handoff files as source-controlled project documents.
- Review hook scripts like production automation.

## References

- OpenCode rules: `AGENTS.md` project instructions and `opencode.json` instruction references.
- Claude Code memory: `CLAUDE.md` and `.claude/CLAUDE.md` project memory.
- Claude Code hooks: project/plugin hooks for stronger lifecycle automation.
- Claude Code plugins: local plugin packages can include skills, agents, hooks, and MCP servers.
