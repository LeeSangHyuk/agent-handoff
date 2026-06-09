# Agent Handoff

Stop re-explaining your project to every new AI coding session.

Agent Handoff is a lightweight Markdown handoff system for Codex, Claude Code, and OpenCode. It keeps the current goal, key decisions, failed attempts, changed files, and next steps in reviewable repo files so a fresh agent can continue without starting from zero.

## Why

Long AI coding sessions lose shape. Context gets compacted, fresh sessions forget why decisions were made, and different agents repeat failed attempts.

Agent Handoff keeps the durable working state in files that live with the code:

- `HANDOFF.md`: the short first-read index and current-state summary.
- `handoffs/*.md`: themed detail files for product, install, validation, roadmap, or team-specific topics.
- `AGENTS.md` / `CLAUDE.md`: project rules for agents that read repo instructions.

The goal is not generic memory. The goal is **auditable AI coding session handoff**.

## What It Solves

- Resume long AI coding sessions without re-explaining the project.
- Preserve decisions and failed attempts across context resets.
- Keep AI-generated project state visible in Git diffs.
- Share the same handoff convention across Codex, Claude Code, and OpenCode.
- Start locally with Markdown before adding hooks, MCP, or a hosted service.

## Current Status

This is an MVP plugin prototype and file convention, not a polished marketplace product.

Validated so far:

- Codex plugin manifest and skill validation pass.
- Codex fresh-session smoke test passed with a short `handoff` prompt.
- Claude Code marketplace validation, plugin validation, marketplace add, and local plugin install passed.
- OpenCode loaded the local plugin scaffold from `.opencode/plugins` in a smoke-test project.

Still to validate:

- Clean-clone install flow.
- Real OpenCode agent behavior against a company or sample repo.
- Real Claude Code agent behavior beyond plugin install/details.

See `VALIDATION.md` for exact commands and results.

## Supported Surfaces

```text
Codex
  .agents/plugins/marketplace.json
  plugins/agent-handoff/.codex-plugin/plugin.json
  plugins/agent-handoff/skills/agent-handoff/SKILL.md

Claude Code
  .claude-plugin/marketplace.json
  plugins/claude-code/agent-handoff/.claude-plugin/plugin.json
  plugins/claude-code/agent-handoff/skills/agent-handoff/SKILL.md

OpenCode
  AGENTS.md
  plugins/opencode/agent-handoff/index.js
  plugins/opencode/agent-handoff/package.json
```

## Install In Codex

Add this repository root as a local marketplace:

```powershell
codex plugin marketplace add D:\AgentHandoff
codex plugin add agent-handoff@agent-handoff-local
```

Alternatively, install or enable `agent-handoff` from the Codex plugin UI after adding the marketplace.

If you cloned the repo somewhere else, replace `D:\AgentHandoff` with your local clone path.

After changing plugin files, reinstall with the same `codex plugin add agent-handoff@agent-handoff-local` command so Codex picks up the updated cachebuster version.

## Install In Claude Code

This repository includes a local Claude Code marketplace:

```powershell
claude plugin marketplace add D:\AgentHandoff
claude plugin install agent-handoff@agent-handoff-claude-local --scope local
```

If you cloned the repo somewhere else, replace `D:\AgentHandoff` with your local clone path.

## Use With OpenCode

For a local project test, copy the OpenCode plugin into a project's `.opencode/plugins/` directory:

```text
your-project/
  .opencode/
    plugins/
      agent-handoff.js
```

Source file:

```text
plugins/opencode/agent-handoff/index.js
```

Also copy or adapt:

```text
AGENTS.md
HANDOFF.md
handoffs/
```

The OpenCode scaffold can later become an npm package listed in `opencode.json`.

## Smoke Test

In a fresh agent session, try:

```text
handoff
```

Expected result:

1. The agent reads `HANDOFF.md`.
2. It follows the current focus and next steps.
3. It reads relevant files from `handoffs/`.
4. After meaningful work, it updates `HANDOFF.md` briefly.
5. Detailed notes go into the relevant themed file.

## Themed Handoffs

`HANDOFF.md` is the first-read index and current-state summary. Longer-lived detail belongs in theme files:

```text
handoffs/
|-- product.md
|-- plugin-install.md
|-- validation.md
`-- roadmap.md
```

This keeps the next agent from reading a long chronological log before it can act.

## Repository Layout

```text
.
|-- .agents/
|   `-- plugins/marketplace.json
|-- .claude-plugin/
|   `-- marketplace.json
|-- AGENTS.md
|-- CLAUDE.md
|-- HANDOFF.md
|-- PORTABILITY.md
|-- README.md
|-- VALIDATION.md
|-- handoffs/
|   |-- plugin-install.md
|   |-- product.md
|   |-- roadmap.md
|   `-- validation.md
`-- plugins/
    |-- agent-handoff/
    |   |-- .codex-plugin/plugin.json
    |   `-- skills/agent-handoff/
    |       |-- SKILL.md
    |       |-- agents/openai.yaml
    |       `-- assets/HANDOFF.template.md
    |-- claude-code/agent-handoff/
    |   |-- .claude-plugin/plugin.json
    |   `-- skills/agent-handoff/SKILL.md
    `-- opencode/agent-handoff/
        |-- package.json
        |-- index.js
        `-- README.md
```

## Planned Direction

1. Run a clean-clone install test.
2. Test OpenCode behavior in a real project.
3. Test Claude Code behavior in a real project.
4. Decide whether OpenCode should ship as an npm package.
5. Add hooks or MCP tools only after the file workflow proves useful.
