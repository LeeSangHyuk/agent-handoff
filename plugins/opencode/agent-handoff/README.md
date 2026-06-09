# Agent Handoff for OpenCode

This is an OpenCode plugin scaffold for Agent Handoff.

OpenCode can load plugins from:

- Project files under `.opencode/plugins/`
- npm packages listed in `opencode.json`

The current repository already includes `AGENTS.md`, which provides the main handoff behavior. This plugin scaffold is the future place for stronger automation, such as compaction hooks or notifications.

## Local Project Use

Copy or symlink `index.js` into a project's `.opencode/plugins/` directory.

## npm-Style Use

After publishing under your organization, add it to `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["@agent-handoff/opencode-plugin"]
}
```

## Current Behavior

This scaffold registers a `session.compacted` event handler placeholder. The agent-facing handoff instructions still live in `AGENTS.md`.
