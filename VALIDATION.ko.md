# 검증

Agent Handoff가 다른 agent 세션에서 사용할 준비가 되었는지 확인하는 체크리스트입니다.

## 정적 검증

repo 루트에서 실행합니다.

```powershell
python C:\Users\HYUK\.codex\skills\.system\plugin-creator\scripts\validate_plugin.py D:\AgentHandoff\plugins\agent-handoff
python C:\Users\HYUK\.codex\skills\.system\skill-creator\scripts\quick_validate.py D:\AgentHandoff\plugins\agent-handoff\skills\agent-handoff
python -m json.tool D:\AgentHandoff\plugins\claude-code\agent-handoff\.claude-plugin\plugin.json
python -m json.tool D:\AgentHandoff\plugins\opencode\agent-handoff\package.json
```

기대 결과:

- Codex plugin manifest가 유효합니다.
- Codex skill frontmatter가 유효합니다.
- `[TODO: ...]` placeholder가 없습니다.
- `HANDOFF.md`는 짧게 유지되고 관련 theme file을 가리킵니다.
- Claude Code plugin manifest JSON이 파싱됩니다.
- OpenCode plugin package JSON이 파싱됩니다.

`yaml` 모듈이 없어서 실패하면 해당 Python 환경에 `PyYAML`을 설치하고 다시 실행합니다.

## 최신 결과

2026-06-09 로컬 검증 결과:

- `validate_plugin.py`가 `D:\AgentHandoff\plugins\agent-handoff`에서 통과했습니다.
- `quick_validate.py`가 `D:\AgentHandoff\plugins\agent-handoff\skills\agent-handoff`에서 통과했습니다.
- `read_marketplace_name.py --marketplace-path D:\AgentHandoff\.agents\plugins\marketplace.json` 결과는 `agent-handoff-local`입니다.
- `HANDOFF.template.md`를 임시 smoke-test workspace에 복사했을 때 기대한 섹션 구조가 있었습니다.
- 이 관리 shell에서는 `codex plugin marketplace add D:\AgentHandoff`가 WindowsApps `Access is denied`로 실패합니다.
- `C:\Users\HYUK\.codex\config.toml`에는 `agent-handoff@agent-handoff-local`이 enabled로 등록되어 있었습니다.
- 캐시된 `plugin.json`과 `SKILL.md`는 repo 파일과 SHA-256 기준으로 일치했습니다.
- Claude Code plugin manifest JSON 파싱 통과
- OpenCode plugin package JSON 파싱 통과

2026-06-09 runtime 검증 결과:

- winget으로 Claude Code CLI `2.1.168` 설치
- winget으로 OpenCode CLI `1.16.2` 설치
- `claude plugin validate D:\AgentHandoff`가 `.claude-plugin/marketplace.json`에 대해 통과
- `claude plugin validate D:\AgentHandoff\plugins\claude-code\agent-handoff` 통과
- `claude plugin marketplace add D:\AgentHandoff` 성공, `agent-handoff-claude-local` 등록
- `claude plugin install agent-handoff@agent-handoff-claude-local --scope local` 성공
- `claude plugin details agent-handoff@agent-handoff-claude-local`에서 skill `agent-handoff` 1개 확인
- OpenCode 임시 프로젝트에서 `.opencode/plugins/agent-handoff.js` 로드 확인
- OpenCode 로그에서 `Agent Handoff OpenCode plugin initialized` 확인
- `opencode run --demo`는 이후 `--demo requires --interactive`로 실패했지만, 플러그인 로드는 이미 성공했으므로 startup 검증은 통과로 봅니다.

Codex fresh-session smoke test:

- 사용자가 별도 Codex 세션에서 `handoff`만 입력했습니다.
- 세션이 handoff context에서 이어졌고 `HANDOFF.md`, `VALIDATION.md`를 업데이트했습니다.
- 검증 결과와 다음 단계를 올바르게 요약했습니다.
- 결과: 짧은 자연어 프롬프트로 plugin-triggered handoff flow가 동작했습니다.

Cross-agent scaffold 결과:

- Claude Code plugin scaffold: `plugins/claude-code/agent-handoff`
- OpenCode plugin scaffold: `plugins/opencode/agent-handoff`
- 두 scaffold 모두 JSON 검증 통과

## 수동 Smoke Test

1. 이 repo에서 새 Codex/Claude/OpenCode 세션을 시작합니다.
2. Agent Handoff를 사용해서 `HANDOFF.md`를 읽으라고 요청합니다.
3. 작지만 의미 있는 변경을 하나 수행합니다.
4. 세션 종료 전 `HANDOFF.md`가 짧게 업데이트되는지 확인합니다.
5. 상세 내용이 관련 `handoffs/*.md`에 들어가는지 확인합니다.
6. 또 다른 새 세션에서 handoff를 기준으로 이어갈 수 있는지 확인합니다.

기대 결과:

- 새 세션이 원래 목표, 현재 초점, 완료한 일, 다음 행동을 사용자가 다시 설명하지 않아도 파악합니다.
- `HANDOFF.md`는 정확한 섹션 구조를 유지하고 짧게 남습니다.
- 실패한 시도와 열린 질문은 다음 세션에 도움이 될 때만 유지합니다.
- 설치 후에는 `handoff` 같은 짧은 프롬프트로 workflow가 발동됩니다.

## 행동 검증

- 현재 사용자 지시는 오래된 handoff 내용보다 우선합니다.
- 결정은 이유와 함께 기록합니다.
- 반복하면 안 되는 실패한 시도를 기록합니다.
- 이어받기에 중요한 command/test와 결과를 기록합니다.
- secret, credential, 불필요한 private detail을 저장하지 않습니다.
- `HANDOFF.md`는 시간순 로그가 아니라 현재 상태 인덱스입니다.
- 설치, 검증, 제품, 로드맵 상세는 `handoffs/`의 테마 파일에 기록합니다.
