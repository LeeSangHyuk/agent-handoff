# Validation

Use this checklist to decide whether Agent Handoff is ready for another Codex session to use.

## Static Checks

Run from the repository root:

```powershell
python C:\Users\HYUK\.codex\skills\.system\plugin-creator\scripts\validate_plugin.py D:\AgentHandoff\plugins\agent-handoff
python C:\Users\HYUK\.codex\skills\.system\skill-creator\scripts\quick_validate.py D:\AgentHandoff\plugins\agent-handoff\skills\agent-handoff
```

Expected result:

- The plugin manifest is valid.
- The skill has valid frontmatter.
- No `[TODO: ...]` placeholders remain.

If validation fails because `yaml` is missing, install `PyYAML` in the Python environment used by the command and rerun the checks.

Latest local result on 2026-06-09:

- `validate_plugin.py` passed for `D:\AgentHandoff\plugins\agent-handoff`.
- `quick_validate.py` passed for `D:\AgentHandoff\plugins\agent-handoff\skills\agent-handoff`.
- `read_marketplace_name.py --marketplace-path D:\AgentHandoff\.agents\plugins\marketplace.json` returned `agent-handoff-local`.
- Copying `HANDOFF.template.md` into a temporary smoke-test workspace produced the expected section structure.
- `codex plugin marketplace add D:\AgentHandoff` still fails in this managed shell with WindowsApps `Access is denied`, even with escalated execution.
- `C:\Users\HYUK\.codex\config.toml` already lists `agent-handoff@agent-handoff-local` as enabled.
- The cached `plugin.json` and `SKILL.md` under `C:\Users\HYUK\.codex\plugins\cache\agent-handoff-local\agent-handoff\0.1.0` match the repository copies by SHA-256.

Fresh-session plugin smoke test on 2026-06-09:

- User started a separate Codex session and prompted only `handoff로 이어서 해줘`.
- The session continued from the handoff context and updated `HANDOFF.md` plus `VALIDATION.md`.
- The session reported the expected validation outcomes and identified the next step as Codex marketplace/plugin UI testing.
- Result: basic plugin-triggered handoff flow passed with a short natural-language prompt.

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
- A short prompt such as `handoff로 이어서 해줘` is enough to trigger the workflow after the plugin is installed.

## Behavioral Checks

- Current user instructions override stale handoff content.
- The handoff records decisions with reasons, not just outcomes.
- The handoff records failed attempts that should not be repeated.
- The handoff records commands/tests and their outcomes when they matter for continuation.
- The handoff never stores secrets, credentials, or unnecessary private details.
