# Agent Handoff

Agent Handoff is a local Codex plugin experiment for keeping long AI coding sessions aligned with a concise project `HANDOFF.md`.

## Why

AI coding sessions get messy over time. The model can lose the original goal, repeat failed attempts, or forget why a decision was made. Agent Handoff keeps the durable working state in a markdown file that a fresh Codex session or another AI coding agent can read.

Core idea:

- `README.md` explains the project.
- `AGENTS.md` explains the rules.
- `HANDOFF.md` explains what just happened.

## What This Includes

- A Codex plugin scaffold at `plugins/agent-handoff`.
- An `agent-handoff` skill that tells Codex how to maintain `HANDOFF.md`.
- A reusable `HANDOFF.template.md` asset.
- A `VALIDATION.md` checklist for static and manual smoke tests.
- A repo-local Codex marketplace at `.agents/plugins/marketplace.json`.
- A themed handoff layout under `handoffs/`.
- A `PORTABILITY.md` note for OpenCode, Claude Code, and company rollout.
- `AGENTS.md` and `CLAUDE.md` project rules for non-Codex agents.

## Current Status

This is an MVP scaffold, not a finished marketplace product. The first test is simple: install/use the skill locally, run a long Codex task, then start a fresh session and see whether `HANDOFF.md` reduces re-explanation.

Read `VALIDATION.md` before calling the MVP usable. A successful MVP should pass the static plugin/skill checks and the manual fresh-session smoke test.

## Install In Codex

This repository includes a local marketplace file so Codex can discover the plugin from the repo.

Add this repository root as a local marketplace:

```powershell
codex plugin marketplace add D:\AgentHandoff
codex plugin add agent-handoff@agent-handoff-local
```

Alternatively, install or enable `agent-handoff` from the Codex plugin UI after adding the marketplace.

If you cloned the repo somewhere else, replace `D:\AgentHandoff` with your local clone path.

After changing plugin files, reinstall with the same `codex plugin add agent-handoff@agent-handoff-local` command so Codex picks up the updated cachebuster version.

## Smoke Test

1. Start a fresh Codex session in this repository.
2. Enable or ask for the `agent-handoff` plugin.
3. Ask Codex to read `HANDOFF.md` before planning work.
4. Make a small, meaningful project change.
5. Confirm Codex updates `HANDOFF.md` before ending the turn.
6. Start another fresh session and confirm it can continue from the handoff without re-explanation.

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
    `-- agent-handoff/
        |-- .codex-plugin/plugin.json
        `-- skills/agent-handoff/
            |-- SKILL.md
            |-- agents/openai.yaml
            `-- assets/HANDOFF.template.md
```

## Planned Direction

1. Validate the Codex skill workflow locally.
2. Validate the themed handoff workflow in a fresh Codex session.
3. Add OpenCode/Claude Code project-rule adapters if the workflow proves useful.
4. Add hooks or MCP tools later for stronger automation.
