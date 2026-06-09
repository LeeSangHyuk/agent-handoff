# Handoff

## Original Goal

Build a separate Agent Handoff repository instead of mixing the experiment into the existing ContextCache Chrome extension repo.

## Current Focus

Convert Agent Handoff from a single accumulating handoff file into a themed handoff system that keeps `HANDOFF.md` concise while preserving deeper context in `handoffs/`.

## Key Decisions

- Keep `HANDOFF.md` as the first-read index and current-state summary.
  Reason: a fresh agent should get oriented quickly without reading a long session log.
- Store durable detail in theme files under `handoffs/`.
  Reason: install, validation, product, and roadmap context grow at different rates.
- Keep the first implementation local and file-based.
  Reason: this can work across Codex, OpenCode, Claude Code, and company repos without a hosted service.

## Relevant Context Files

- `handoffs/product.md`: product positioning and naming questions.
- `handoffs/plugin-install.md`: Codex marketplace/install state and known Windows CLI limitation.
- `handoffs/validation.md`: validation commands, results, and fresh-session smoke test evidence.
- `handoffs/roadmap.md`: next hardening steps and cross-agent portability notes.

## Completed Work

- Built and validated a local Codex plugin with an `agent-handoff` skill.
- Added a repo-local Codex marketplace and pushed the repo to GitHub.
- Confirmed a fresh Codex session can trigger the workflow with a short `handoff` prompt.
- Introduced the themed handoff structure in this repository.
- Added `AGENTS.md` and `CLAUDE.md` so OpenCode/Claude Code-style agents can follow the same handoff rules.
- Updated the plugin version cachebuster so Codex can pick up the revised skill after reinstall.
- Added initial Claude Code and OpenCode plugin scaffolds for shareable adapters.

## Failed Attempts

- Do not put this experiment under `D:\ContextCache`; that is a separate Chrome extension repo.
- Do not rely on `codex.exe` from this managed shell; WindowsApps returns access denied here.
- Do not keep appending every validation detail to `HANDOFF.md`; move detail into the relevant theme file.

## Changed Files

- `HANDOFF.md`: concise handoff index and current state.
- `handoffs/*.md`: themed handoff detail files.
- `plugins/agent-handoff/skills/agent-handoff/SKILL.md`: handoff workflow rules.
- `plugins/agent-handoff/.codex-plugin/plugin.json`: plugin metadata and cachebuster version.
- `plugins/agent-handoff/skills/agent-handoff/assets/HANDOFF.template.md`: template for new handoff files.
- `README.md`, `VALIDATION.md`: project docs and validation evidence.
- `AGENTS.md`, `CLAUDE.md`, `PORTABILITY.md`: cross-agent and company rollout support.
- `plugins/claude-code/agent-handoff`: Claude Code plugin scaffold.
- `plugins/opencode/agent-handoff`: OpenCode plugin scaffold.

## Next Steps

1. Validate the updated themed handoff skill.
2. Validate the Claude Code plugin scaffold in Claude Code.
3. Validate the OpenCode plugin scaffold in OpenCode.
4. Run a clean-clone install test.

## Open Questions

- Should the public product name be `Agent Handoff`, `Handoff.md`, or something else?
- Should company usage stay with simple `AGENTS.md`/`CLAUDE.md` rules first, or add reviewed hooks for stronger enforcement?
- Which theme files should be standard versus optional in new projects?
