# Handoff

## Original Goal

Build a separate Agent Handoff repository instead of mixing the experiment into the existing ContextCache Chrome extension repo.

## Current Focus

Prepare the MVP for a fresh-session trial now that the plugin and skill pass static validation.

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

## Failed Attempts

- An earlier scaffold was started under `D:\ContextCache\plugins\agent-handoff`.
  Outcome: the user redirected the work to a new folder.
  Do not repeat because: the Chrome extension repo should stay separate.
- First validation attempt failed because Python could not import `yaml`.
  Outcome: installed `PyYAML` and reran validation successfully.
  Do not repeat because: the dependency is now installed in the local Python environment.

## Changed Files

- `README.md`: explains the repository purpose and roadmap.
- `VALIDATION.md`: defines how to verify the MVP through static checks and fresh-session smoke tests.
- `.gitignore`: ignores common local/generated files.
- `HANDOFF.md`: records the active project state.
- `plugins/agent-handoff/.codex-plugin/plugin.json`: plugin metadata.
- `plugins/agent-handoff/skills/agent-handoff/SKILL.md`: Codex handoff workflow.
- `plugins/agent-handoff/skills/agent-handoff/assets/HANDOFF.template.md`: template for new projects.

## Next Steps

1. Install or otherwise expose the plugin to a fresh Codex session.
2. Try the manual fresh-session smoke test using this repository.
3. Decide whether to add installer/marketplace metadata.
4. Commit the MVP scaffold once the preferred installation path is chosen.

## Open Questions

- Should the public product name be `Agent Handoff`, `Handoff.md`, or something else?
- Should the next version target Codex only, or add OpenCode hooks quickly?
- Should this repo include personal marketplace metadata now, or keep installation manual until the workflow is proven?
