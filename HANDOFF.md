# Handoff

## Original Goal

Build a separate Agent Handoff repository instead of mixing the experiment into the existing ContextCache Chrome extension repo.

## Current Focus

Make the MVP installable in Codex by adding a repo-local marketplace and documenting the install/smoke-test flow.

## Key Decisions

- Start with a Codex skill/plugin before MCP or SaaS.
  Reason: the workflow can be tested locally with no server cost.
- Keep this in `D:\AgentHandoff`.
  Reason: `D:\ContextCache` is already a separate Chrome extension Git repository.
- Position the product as AI coding session handoff, not generic AI memory.
  Reason: handoff has a clearer user problem and a sharper developer audience.

## Completed Work

- Created a local plugin scaffold under `plugins/agent-handoff`.
- Added an `agent-handoff` skill.
- Added a reusable `HANDOFF.template.md` asset.
- Added initial repository documentation and ignore rules.
- Added `VALIDATION.md` with static checks, manual smoke test steps, and behavioral expectations.
- Updated `plugin.json` so `interface.defaultPrompt` uses the documented array shape.
- Added a skill self-check section for end-of-work handoff quality.
- Installed `PyYAML` for the local Python environment so Codex plugin/skill validation scripts can run.
- Ran static validation successfully:
  - `validate_plugin.py D:\AgentHandoff\plugins\agent-handoff`
  - `quick_validate.py D:\AgentHandoff\plugins\agent-handoff\skills\agent-handoff`
- Created `.agents/plugins/marketplace.json` so the repo can be added as a local Codex marketplace.
- Added README instructions for adding the marketplace and running a fresh-session smoke test.
- Confirmed the marketplace name is `agent-handoff-local` with `read_marketplace_name.py`.
- Re-ran static validation successfully after adding marketplace metadata.

## Failed Attempts

- An earlier scaffold was started under `D:\ContextCache\plugins\agent-handoff`.
  Outcome: the user redirected the work to a new folder.
  Do not repeat because: the Chrome extension repo should stay separate.
- First validation attempt failed because Python could not import `yaml`.
  Outcome: installed `PyYAML` and reran validation successfully.
  Do not repeat because: the dependency is now installed in the local Python environment.
- Attempted to run `codex --version` from this managed shell.
  Outcome: WindowsApps returned access denied, even with escalated command execution.
  Do not repeat because: marketplace installation likely needs the user's normal terminal or Codex app UI in this environment.

## Changed Files

- `README.md`: explains the repository purpose and roadmap.
- `.agents/plugins/marketplace.json`: registers `agent-handoff` as an available local Codex plugin.
- `VALIDATION.md`: defines how to verify the MVP through static checks and fresh-session smoke tests.
- `.gitignore`: ignores common local/generated files.
- `HANDOFF.md`: records the active project state.
- `plugins/agent-handoff/.codex-plugin/plugin.json`: plugin metadata.
- `plugins/agent-handoff/skills/agent-handoff/SKILL.md`: Codex handoff workflow.
- `plugins/agent-handoff/skills/agent-handoff/assets/HANDOFF.template.md`: template for new projects.

## Next Steps

1. Add the repo-local marketplace with `codex plugin marketplace add D:\AgentHandoff`.
2. Install the plugin with `codex plugin add agent-handoff@agent-handoff-local`, or enable it from the Codex plugin UI.
3. Try the manual fresh-session smoke test using this repository.
4. Record whether plugin discovery and handoff updates work as expected.

## Open Questions

- Should the public product name be `Agent Handoff`, `Handoff.md`, or something else?
- Should the next version target Codex only, or add OpenCode hooks quickly?
- Does Codex install the repo-local marketplace cleanly from this Windows app environment, or does it require using the Codex app UI instead of the CLI?
