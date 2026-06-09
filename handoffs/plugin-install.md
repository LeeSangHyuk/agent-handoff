# Plugin Install Handoff

## Codex Plugin State

The repository contains a local Codex plugin at `plugins/agent-handoff` and a repo-local marketplace at `.agents/plugins/marketplace.json`.

Marketplace name:

```text
agent-handoff-local
```

Codex install commands documented in `README.md`:

```powershell
codex plugin marketplace add D:\AgentHandoff
codex plugin add agent-handoff@agent-handoff-local
```

## Confirmed State

- GitHub repository exists at `https://github.com/LeeSangHyuk/agent-handoff`.
- `agent-handoff@agent-handoff-local` was installed/enabled in Codex by the user.
- The cached `plugin.json` and `SKILL.md` were confirmed to match repository copies by SHA-256 in a previous validation session.
- The plugin version now uses a Codex cachebuster suffix after themed handoff changes: `0.1.0+codex.20260609123226`.

## Known Limitation

Running `codex.exe` from this managed shell fails with WindowsApps `Access is denied`, even with escalated command execution. Use the user's normal terminal or the Codex app UI for plugin marketplace install tests.

## Do Not Repeat

- Do not keep retrying `codex plugin marketplace add D:\AgentHandoff` from this managed shell.
- Do not use the `D:\ContextCache` repo for this plugin.

## Next Install Step

After pulling this change, reinstall/update the plugin from a normal terminal or Codex UI:

```powershell
codex plugin add agent-handoff@agent-handoff-local
```
