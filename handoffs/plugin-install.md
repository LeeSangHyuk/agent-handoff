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

## Cross-Agent Plugin Scaffolds

- Claude Code: `plugins/claude-code/agent-handoff`
- OpenCode: `plugins/opencode/agent-handoff`

These are initial scaffolds and still need runtime validation in their native tools.

## Claude Code Marketplace

Claude Code marketplace path:

```text
.claude-plugin/marketplace.json
```

Marketplace name:

```text
agent-handoff-claude-local
```

Install commands:

```powershell
claude plugin marketplace add D:\AgentHandoff
claude plugin install agent-handoff@agent-handoff-claude-local --scope local
```

Validated on 2026-06-09:

- Claude Code CLI version: `2.1.168`.
- Marketplace validation passed.
- Plugin validation passed.
- Marketplace add succeeded.
- Plugin install succeeded in local scope.
- Plugin details showed one skill: `agent-handoff`.

Local-scope Claude install created `.claude/settings.local.json`; keep that file gitignored.

## OpenCode Runtime Smoke

Validated on 2026-06-09:

- OpenCode CLI version: `1.16.2`.
- Copied `plugins/opencode/agent-handoff/index.js` into `tmp/opencode-plugin-smoke/.opencode/plugins/agent-handoff.js`.
- Ran `opencode run --demo "hello" --print-logs --log-level DEBUG --format json`.
- Logs showed OpenCode loading the plugin file and printing `Agent Handoff OpenCode plugin initialized`.
- The command then failed because `--demo` requires `--interactive`, but plugin loading had already succeeded.
