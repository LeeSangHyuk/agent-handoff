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

## Current Status

This is an MVP scaffold, not a finished marketplace product. The first test is simple: install/use the skill locally, run a long Codex task, then start a fresh session and see whether `HANDOFF.md` reduces re-explanation.

Read `VALIDATION.md` before calling the MVP usable. A successful MVP should pass the static plugin/skill checks and the manual fresh-session smoke test.

## Repository Layout

```text
.
├── HANDOFF.md
├── README.md
├── VALIDATION.md
└── plugins/
    └── agent-handoff/
        ├── .codex-plugin/plugin.json
        └── skills/agent-handoff/
            ├── SKILL.md
            ├── agents/openai.yaml
            └── assets/HANDOFF.template.md
```

## Planned Direction

1. Validate the Codex skill workflow locally.
2. Package the plugin for personal installation.
3. Add OpenCode hooks if the handoff workflow proves useful.
4. Add MCP tools later for multi-agent access.
