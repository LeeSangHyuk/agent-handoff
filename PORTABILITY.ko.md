# 이식성

Agent Handoff는 의도적으로 파일 기반입니다. Codex 플러그인은 Codex 안에서 발견성과 동작을 좋게 하지만, 핵심 워크플로는 Markdown 파일에 있기 때문에 다른 코딩 에이전트에도 적용할 수 있습니다.

## 핵심 파일

```text
HANDOFF.md
handoffs/
  product.md
  plugin-install.md
  validation.md
  roadmap.md
```

`HANDOFF.md`는 짧게 유지합니다. 현재 작업에 필요한 테마 파일을 가리키는 인덱스 역할을 합니다.

## Codex

포함된 Codex 플러그인을 사용합니다.

- `.agents/plugins/marketplace.json`
- `plugins/agent-handoff/.codex-plugin/plugin.json`
- `plugins/agent-handoff/skills/agent-handoff/SKILL.md`

추천 프롬프트:

```text
handoff
```

강화 옵션:

- `AGENTS.md`를 프로젝트 규칙으로 사용해서 handoff 동작을 더 기본 동작에 가깝게 만들 수 있습니다.

## OpenCode

OpenCode는 `AGENTS.md` 프로젝트 규칙과 `.opencode/plugins/` 로컬 플러그인 또는 `opencode.json`의 npm plugin을 사용할 수 있습니다. 이 repo에는 `AGENTS.md`와 초기 OpenCode plugin scaffold가 모두 들어 있습니다.

OpenCode 구조:

```text
AGENTS.md
opencode.json
.opencode/plugins/
plugins/opencode/agent-handoff/
```

`opencode.json`에는 npm plugin이나 추가 instruction 파일을 연결할 수 있습니다.

## Claude Code

Claude Code는 `CLAUDE.md` 또는 `.claude/CLAUDE.md` 프로젝트 메모리를 지원합니다. 이 repo에는 같은 handoff 동작을 위한 `CLAUDE.md`가 있고, `.claude-plugin/marketplace.json` 및 Claude Code plugin scaffold도 포함되어 있습니다.

회사에서 안전하게 시작하는 최소 구조:

```text
CLAUDE.md
HANDOFF.md
handoffs/
.claude-plugin/marketplace.json
plugins/claude-code/agent-handoff/
```

강화 옵션:

- 명시적 handoff 업데이트용 custom slash command
- 작업 종료 시 handoff 업데이트를 확인하는 `Stop` 또는 `SessionEnd` hook
- 여러 repo에 공유할 수 있는 plugin/skill package

## 회사 적용 순서

처음에는 hooks 없이 Markdown 규칙과 Git으로 검토 가능한 파일부터 시작하는 것이 좋습니다.

추천 순서:

1. `HANDOFF.md`와 `handoffs/` 추가
2. `AGENTS.md` 추가
3. Claude Code 사용자를 위해 `CLAUDE.md` 추가
4. 보안/개발자 경험 검토 후 hooks 추가

보안 가이드:

- handoff 파일에 secret이나 credential을 저장하지 않습니다.
- 팀이 명시적으로 허용하지 않은 proprietary log를 복사하지 않습니다.
- handoff 파일은 source-controlled project document로 취급합니다.
- hook script는 production automation처럼 리뷰합니다.

## 참고

- OpenCode rules: `AGENTS.md` project instructions 및 `opencode.json` instruction references
- OpenCode plugins: `.opencode/plugins/` 로컬 파일 또는 `opencode.json`의 npm package
- Claude Code memory: `CLAUDE.md`, `.claude/CLAUDE.md`
- Claude Code hooks: lifecycle 자동화
- Claude Code plugins: skills, agents, hooks, MCP servers를 묶는 local plugin package
