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

## Behavioral Checks

- Current user instructions override stale handoff content.
- The handoff records decisions with reasons, not just outcomes.
- The handoff records failed attempts that should not be repeated.
- The handoff records commands/tests and their outcomes when they matter for continuation.
- The handoff never stores secrets, credentials, or unnecessary private details.
