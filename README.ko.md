# Agent Handoff

새 AI 코딩 세션을 열 때마다 프로젝트를 다시 설명하지 마세요.

Agent Handoff는 Codex, Claude Code, OpenCode에서 함께 쓸 수 있는 가벼운
Markdown 기반 인수인계 시스템입니다. 현재 목표, 중요한 결정, 실패한 시도,
변경 파일, 다음 단계를 Git으로 검토 가능한 repo 파일에 남겨서 새 에이전트가
처음부터 다시 시작하지 않게 합니다.

## 왜 필요한가

긴 AI 코딩 세션은 시간이 지나면 흐트러집니다. context가 compact되고, 새 세션은 이전 결정의 이유를 잊고, 다른 에이전트는 이미 실패한 시도를 반복할 수 있습니다.

Agent Handoff는 코드와 함께 버전 관리되는 파일에 작업 상태를 보관합니다.

- `HANDOFF.md`: 가장 먼저 읽는 짧은 현재 상태 인덱스
- `handoffs/*.md`: 제품, 설치, 검증, 로드맵 등 테마별 상세 기록
- `AGENTS.md` / `CLAUDE.md`: repo 규칙을 읽는 에이전트용 프로젝트 지침

목표는 일반적인 AI memory가 아닙니다. 목표는 **검토 가능한 AI 코딩 세션 인수인계**입니다.

## AGENTS.md만 있으면 되는 것 아닌가?

`AGENTS.md`는 agent에게 repo에서 어떻게 일해야 하는지 알려주는 규칙 파일입니다.

Agent Handoff는 다음 agent에게 지금 작업이 어디까지 왔는지 알려줍니다.

```text
README.md       = 프로젝트 설명
AGENTS.md       = agent 작업 규칙
HANDOFF.md      = 현재 작업 상태
handoffs/*.md   = 다음 agent에게 필요한 테마별 상세 맥락
```

이 차이가 중요합니다. `AGENTS.md`는 비교적 안정적인 규칙이어야 하고,
`HANDOFF.md`는 프로젝트 진행에 따라 계속 갱신되는 현재 상태판이어야 합니다.

Agent Handoff는 여기에 다음을 더합니다.

- 정해진 handoff 문서 구조
- 테마별 상세 파일
- Codex, Claude Code, OpenCode용 plugin scaffold
- workflow가 실제로 검증됐다는 기록

## 해결하는 문제

- 긴 AI 코딩 세션을 다시 설명하지 않고 이어가기
- context reset 이후에도 결정과 실패한 시도 보존하기
- AI가 만든 프로젝트 상태를 Git diff로 검토하기
- Codex, Claude Code, OpenCode에서 같은 handoff 규칙 공유하기
- hooks, MCP, SaaS 없이 로컬 Markdown으로 먼저 시작하기

## 현재 상태

아직 완성된 marketplace 제품은 아니고, MVP CLI, 플러그인 프로토타입,
파일 규약입니다.

검증된 것:

- `init`, `validate`, `compact`를 가진 repo-local CLI scaffold 추가
- Codex plugin manifest / skill 검증 통과
- Codex 새 세션 smoke test 통과: 짧은 `handoff` 프롬프트로 동작 확인
- Claude Code marketplace 검증, plugin 검증, marketplace add, local plugin install 통과
- OpenCode smoke-test 프로젝트에서 `.opencode/plugins` 로컬 플러그인 로드 확인

아직 남은 것:

- clean clone install flow
- 실제 회사/샘플 repo에서 OpenCode agent 행동 검증
- Claude Code에서 plugin install/details를 넘어 실제 agent 행동 검증

정확한 검증 명령과 결과는 [VALIDATION.ko.md](VALIDATION.ko.md)를 참고하세요.

## 빠른 시작

파일 규약만 먼저 써보고 싶다면 CLI로 초기화합니다.

```powershell
node bin/agent-handoff.mjs init path\to\your-project
node bin/agent-handoff.mjs validate path\to\your-project
```

그 다음 새 AI 코딩 세션에서 이렇게 말합니다.

```text
handoff
```

도구별 플러그인 설치는 아래 Codex, Claude Code, OpenCode 섹션을 참고하세요.

나중에 npm으로 배포하면 목표 사용법은 아래와 같습니다.

```powershell
npx agent-handoff init
npx agent-handoff validate
npx agent-handoff compact
```

## 지원 대상

```text
Codex
  .agents/plugins/marketplace.json
  plugins/agent-handoff/.codex-plugin/plugin.json
  plugins/agent-handoff/skills/agent-handoff/SKILL.md

Claude Code
  .claude-plugin/marketplace.json
  plugins/claude-code/agent-handoff/.claude-plugin/plugin.json
  plugins/claude-code/agent-handoff/skills/agent-handoff/SKILL.md

OpenCode
  AGENTS.md
  bin/agent-handoff.mjs
  plugins/opencode/agent-handoff/index.js
  plugins/opencode/agent-handoff/package.json
```

## Codex에 설치

이 repo 루트를 local marketplace로 추가합니다.

```powershell
codex plugin marketplace add D:\AgentHandoff
codex plugin add agent-handoff@agent-handoff-local
```

다른 경로에 clone했다면 `D:\AgentHandoff`를 clone 경로로 바꾸세요.

플러그인 파일을 수정한 뒤에는 같은 명령으로 다시 설치해서 Codex가 새 cachebuster 버전을 읽도록 합니다.

## Claude Code에 설치

이 repo에는 Claude Code용 local marketplace도 들어 있습니다.

```powershell
claude plugin marketplace add D:\AgentHandoff
claude plugin install agent-handoff@agent-handoff-claude-local --scope local
```

다른 경로에 clone했다면 `D:\AgentHandoff`를 clone 경로로 바꾸세요.

## OpenCode에서 사용

회사 프로젝트에서 로컬 테스트할 때는 OpenCode 플러그인을 프로젝트의 `.opencode/plugins/`에 복사합니다.

```text
your-project/
  .opencode/
    plugins/
      agent-handoff.js
```

복사할 원본 파일:

```text
plugins/opencode/agent-handoff/index.js
```

함께 복사하거나 프로젝트에 맞게 조정할 파일:

```text
AGENTS.md
HANDOFF.md
handoffs/
```

나중에는 OpenCode scaffold를 npm package로 배포하고 `opencode.json`에 등록할 수 있습니다.

## Smoke Test

새 agent 세션에서 아래처럼 짧게 요청합니다.

```text
handoff
```

기대 결과:

1. agent가 `HANDOFF.md`를 읽습니다.
2. 현재 초점과 다음 단계를 따라갑니다.
3. 필요한 `handoffs/` 테마 파일을 읽습니다.
4. 의미 있는 작업 후 `HANDOFF.md`를 짧게 업데이트합니다.
5. 상세 기록은 관련 테마 파일에 남깁니다.

구체적인 before/after 예시는 `examples/before-after.md`를 참고하세요.

## CLI

repo-local CLI는 작게 시작합니다.

```powershell
node bin/agent-handoff.mjs init .
node bin/agent-handoff.mjs validate .
node bin/agent-handoff.mjs compact .
```

명령:

- `init`: `HANDOFF.md`, `handoffs/`, `AGENTS.md`, `CLAUDE.md`가 없으면 생성
- `validate`: 필수 섹션, context file 존재 여부, 길이, secret-like 값 검사
- `compact`: `HANDOFF.md`를 줄이거나 theme file로 옮겨야 할 내용을 report

## 테마별 Handoff

`HANDOFF.md`는 첫 번째로 읽는 현재 상태 인덱스입니다. 오래 유지될 상세 기록은 테마 파일에 둡니다.

```text
handoffs/
|-- product.md
|-- plugin-install.md
|-- validation.md
`-- roadmap.md
```

이 구조는 다음 에이전트가 긴 시간순 로그를 읽지 않고도 바로 현재 상태를 이해하게 해줍니다.

## 디렉터리 구조

```text
.
|-- .agents/
|   `-- plugins/marketplace.json
|-- .claude-plugin/
|   `-- marketplace.json
|-- AGENTS.md
|-- CLAUDE.md
|-- HANDOFF.md
|-- LICENSE
|-- PORTABILITY.md
|-- PORTABILITY.ko.md
|-- README.md
|-- README.ko.md
|-- VALIDATION.md
|-- VALIDATION.ko.md
|-- bin/
|   `-- agent-handoff.mjs
|-- examples/
|   `-- before-after.md
|-- handoffs/
|   |-- plugin-install.md
|   |-- product.md
|   |-- roadmap.md
|   `-- validation.md
|-- templates/
|   |-- AGENTS.md
|   |-- CLAUDE.md
|   |-- HANDOFF.md
|   `-- handoffs/
|       |-- plugin-install.md
|       |-- product.md
|       |-- roadmap.md
|       `-- validation.md
`-- plugins/
    |-- agent-handoff/
    |   |-- .codex-plugin/plugin.json
    |   `-- skills/agent-handoff/
    |       |-- SKILL.md
    |       |-- agents/openai.yaml
    |       `-- assets/HANDOFF.template.md
    |-- claude-code/agent-handoff/
    |   |-- .claude-plugin/plugin.json
    |   `-- skills/agent-handoff/SKILL.md
    `-- opencode/agent-handoff/
        |-- package.json
        |-- index.js
        `-- README.md
```

## 다음 방향

1. clean clone install test
2. 실제 프로젝트에서 OpenCode 행동 검증
3. 실제 프로젝트에서 Claude Code 행동 검증
4. CLI를 npm 배포 가능한 형태로 강화
5. OpenCode를 npm package로 배포할지 결정
6. 파일 기반 워크플로가 충분히 유용하다고 확인된 뒤 hooks/MCP 추가 검토
