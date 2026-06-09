# Validation

Use this checklist to decide whether Agent Handoff is ready for another agent session to use.

## Static Checks

Run from the repository root:

```powershell
python C:\Users\HYUK\.codex\skills\.system\plugin-creator\scripts\validate_plugin.py D:\AgentHandoff\plugins\agent-handoff
python C:\Users\HYUK\.codex\skills\.system\skill-creator\scripts\quick_validate.py D:\AgentHandoff\plugins\agent-handoff\skills\agent-handoff
python -m json.tool D:\AgentHandoff\plugins\claude-code\agent-handoff\.claude-plugin\plugin.json
python -m json.tool D:\AgentHandoff\plugins\opencode\agent-handoff\package.json
node D:\AgentHandoff\bin\agent-handoff.mjs validate D:\AgentHandoff
```

Expected result:

- The Codex plugin manifest is valid.
- The Codex skill has valid frontmatter.
- No `[TODO: ...]` placeholders remain.
- `HANDOFF.md` stays concise and points to relevant theme files under `handoffs/`.
- Claude Code plugin manifest JSON parses.
- OpenCode plugin package JSON parses.
- CLI `validate` passes for the repository.

If validation fails because `yaml` is missing, install `PyYAML` in the Python environment used by the command and rerun the checks.

## Latest Results

Latest local result on 2026-06-09:

- `validate_plugin.py` passed for `D:\AgentHandoff\plugins\agent-handoff`.
- `quick_validate.py` passed for `D:\AgentHandoff\plugins\agent-handoff\skills\agent-handoff`.
- `read_marketplace_name.py --marketplace-path D:\AgentHandoff\.agents\plugins\marketplace.json` returned `agent-handoff-local`.
- Copying `HANDOFF.template.md` into a temporary smoke-test workspace produced the expected section structure.
- `codex plugin marketplace add D:\AgentHandoff` still fails in this managed shell with WindowsApps `Access is denied`, even with escalated execution.
- `C:\Users\HYUK\.codex\config.toml` already lists `agent-handoff@agent-handoff-local` as enabled.
- The cached `plugin.json` and `SKILL.md` under `C:\Users\HYUK\.codex\plugins\cache\agent-handoff-local\agent-handoff\0.1.0` match the repository copies by SHA-256.
- Claude Code plugin manifest JSON parses.
- OpenCode plugin package JSON parses.
- CLI scaffold added with `init`, `validate`, and `compact`.

Runtime validation on 2026-06-09:

- Installed Claude Code CLI `2.1.168` with winget.
- Installed OpenCode CLI `1.16.2` with winget.
- `claude plugin validate D:\AgentHandoff` passed for `.claude-plugin/marketplace.json`.
- `claude plugin validate D:\AgentHandoff\plugins\claude-code\agent-handoff` passed.
- `claude plugin marketplace add D:\AgentHandoff` succeeded and registered `agent-handoff-claude-local`.
- `claude plugin install agent-handoff@agent-handoff-claude-local --scope local` succeeded.
- `claude plugin details agent-handoff@agent-handoff-claude-local` showed one skill: `agent-handoff`.
- OpenCode loaded `.opencode/plugins/agent-handoff.js` from a temporary smoke-test project and printed `Agent Handoff OpenCode plugin initialized`.
- `opencode run --demo` then failed because `--demo` requires `--interactive`, but that happened after plugin loading, so plugin startup validation passed.

CLI validation on 2026-06-10:

- Global Node.js LTS install through winget was cancelled at the MSI admin prompt.
- Downloaded portable Node.js `v24.16.0` into `.tools/` for local smoke testing.
- `node bin/agent-handoff.mjs --help` printed CLI usage.
- `node bin/agent-handoff.mjs validate .` passed for this repository.
- `node bin/agent-handoff.mjs compact .` reported that older completed work should move into a theme file.
- `node bin/agent-handoff.mjs init tmp\cli-smoke` created all expected files.
- `node bin/agent-handoff.mjs validate tmp\cli-smoke` passed.
- `node bin/agent-handoff.mjs compact tmp\cli-smoke` reported that the generated `HANDOFF.md` is compact enough.

Clean-clone validation on 2026-06-10:

- Cloned `https://github.com/LeeSangHyuk/agent-handoff.git` into `tmp\clean-clone-test`.
- Clone resolved to commit `3c02c19a87979b98f08f9740039ef924f8f869d9`.
- Portable Node.js ran `bin\agent-handoff.mjs --help` successfully from the clean clone.
- `node bin\agent-handoff.mjs validate .` passed in the clean clone.
- `node bin\agent-handoff.mjs compact .` reported expected suggestions because the repository `HANDOFF.md` is slightly over the target length.
- `node bin\agent-handoff.mjs init tmp\new-project` initially failed in this managed shell because the sandbox denied creating a directory inside the nested clean clone.
- Re-running the same init/validate/compact sequence with escalated execution succeeded.
- `package.json`, `.claude-plugin\marketplace.json`, and `plugins\opencode\agent-handoff\package.json` parsed successfully in the clean clone.

Fresh-session plugin smoke test on 2026-06-09:

- User started a separate Codex session and prompted only `handoff`.
- The session continued from the handoff context and updated `HANDOFF.md` plus `VALIDATION.md`.
- The session reported the expected validation outcomes and identified the next step as Codex marketplace/plugin UI testing.
- Result: basic plugin-triggered handoff flow passed with a short natural-language prompt.

Cross-agent plugin scaffold result:

- Claude Code plugin scaffold was added under `plugins/claude-code/agent-handoff`.
- OpenCode plugin scaffold was added under `plugins/opencode/agent-handoff`.
- JSON checks pass for both new plugin manifest/package files.
- Node execution is blocked in this managed shell, so OpenCode runtime validation should be done in a normal terminal or OpenCode itself.

## Manual Smoke Test

1. Start a fresh Codex session in this repository.
2. Ask Codex to use Agent Handoff and read `HANDOFF.md`.
3. Make a small, meaningful project change.
4. Confirm Codex updates `HANDOFF.md` before ending the turn.
5. Start another fresh session and ask Codex to continue from the handoff.

Expected result:

- The new session can state the original goal, current focus, completed work, and next action without the user re-explaining them.
- `HANDOFF.md` stays concise and uses the exact required sections.
- Failed attempts and open questions are preserved only when they help the next session.
- A short prompt such as `handoff` is enough to trigger the workflow after the plugin is installed.

## CLI Smoke Test

Use a temporary directory:

```powershell
mkdir tmp\cli-smoke
node bin\agent-handoff.mjs init tmp\cli-smoke
node bin\agent-handoff.mjs validate tmp\cli-smoke
node bin\agent-handoff.mjs compact tmp\cli-smoke
```

Expected result:

- `init` creates the handoff files without overwriting existing files.
- `validate` passes on the generated structure.
- `compact` prints that `HANDOFF.md` is already compact enough, or only low-risk suggestions.

## Behavioral Checks

- Current user instructions override stale handoff content.
- The handoff records decisions with reasons, not just outcomes.
- The handoff records failed attempts that should not be repeated.
- The handoff records commands/tests and their outcomes when they matter for continuation.
- The handoff never stores secrets, credentials, or unnecessary private details.
- `HANDOFF.md` is an index/current-state file, not a chronological log.
- Detailed install, validation, product, and roadmap notes go into themed files under `handoffs/`.
