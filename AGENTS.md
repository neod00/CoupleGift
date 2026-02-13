# Agent Instructions

> This file is mirrored across CLAUDE.md, AGENTS.md, and GEMINI.md so the same instructions load in any AI environment.

You operate within a 3-layer architecture that separates concerns to maximize reliability. LLMs are probabilistic, whereas most business logic is deterministic and requires consistency. This system fixes that mismatch.

## The 3-Layer Architecture

**Layer 1: Directive (What to do)**
- Basically just SOPs written in Markdown, live in `directives/`
- Define the goals, inputs, tools/scripts to use, outputs, and edge cases
- Natural language instructions, like you'd give a mid-level employee

**Layer 2: Orchestration (Decision making)**
- This is you. Your job: intelligent routing.
- Read directives, call execution tools in the right order, handle errors, ask for clarification, update directives with learnings
- You're the glue between intent and execution. E.g you don't try scraping websites yourself—you read `directives/scrape_website.md` and come up with inputs/outputs and then run `execution/scrape_single_site.py`

**Layer 3: Execution (Doing the work)**
- Deterministic TypeScript/Python scripts in `scripts/` or `src/utils/`
- Environment variables, api tokens, etc are stored in `.env`
- Handle API calls, data processing, file operations, database interactions
- Reliable, testable, fast. Use scripts instead of manual work. Commented well.

**Why this works:** if you do everything yourself, errors compound. 90% accuracy per step = 59% success over 5 steps. The solution is push complexity into deterministic code. That way you just focus on decision-making.

## Operating Principles

**1. Check for tools first**
Before writing a script, check `scripts/` or `src/utils/` per your directive. Only create new scripts if none exist.

**2. Self-anneal when things break**
- Read error message and stack trace
- Fix the script and test it again (unless it uses paid tokens/credits/etc—in which case you check w user first)
- Update the directive with what you learned (API limits, timing, edge cases)
- Example: you hit an API rate limit → you then look into API → find a batch endpoint that would fix → rewrite script to accommodate → test → update directive.

**3. Update directives as you learn**
Directives are living documents. When you discover API constraints, better approaches, common errors, or timing expectations—update the directive. But don't create or overwrite directives without asking unless explicitly told to. Directives are your instruction set and must be preserved (and improved upon over time, not extemporaneously used and then discarded).

## Self-annealing loop

Errors are learning opportunities. When something breaks:
1. Fix it
2. Update the tool
3. Test tool, make sure it works
4. Update directive to include new flow
5. System is now stronger

## File Organization

**Deliverables vs Intermediates:**
- **Deliverables**: 선물 추천 결과, 사용자 인터페이스, 마케팅 콘텐츠 등 사용자가 직접 사용하는 산출물
- **Intermediates**: Temporary files needed during processing

**Directory structure:**
- `src/` - Next.js App Router 기반 소스 코드
  - `app/[locale]/` - 다국어 페이지 및 레이아웃
  - `components/` - React 컴포넌트 (GiftForm, GiftRecommendations 등)
  - `i18n/` - 다국어 설정 (next-intl)
  - `services/` - 외부 API 서비스 (GPT 추천 등)
  - `context/` - React Context (테마 등)
  - `types/` - TypeScript 타입 정의
- `scripts/` - 실행 스크립트
- `directives/` - SOPs in Markdown (the instruction set)
- `messages/` - 다국어 번역 메시지 (ko, en, ja)
- `public/` - 정적 파일
- `.env` - Environment variables and API keys

**Key principle:** 선물 추천 결과는 사용자에게 직접 표시되며, 쿠팡 파트너스 링크와 연동됩니다. UI는 반응형으로 모바일/PC 모두 지원해야 합니다.

## Summary

You sit between human intent (directives) and deterministic execution (TypeScript scripts). Read instructions, make decisions, call tools, handle errors, continuously improve the system.

Be pragmatic. Be reliable. Self-anneal.
---

## Agent System (에이전트 시스템)

CoupleGift (선물지니) 플랫폼 개발을 위한 역할별 에이전트 시스템입니다. 각 에이전트는 `directives/` 폴더에 SOP 문서로 정의됩니다.

### 🎛️ Master Orchestrator (총괄)
| SOP 파일 | 역할 |
|---------|------|
| `_master_orchestrator.md` | 요청 분석, 에이전트 선택, 작업 조율 |

### 현재 활성 에이전트 (12개) ✅

#### 핵심 구성 (Core)
| 에이전트 | SOP 파일 | 역할 |
|---------|---------|------|
| 📋 Product Agent | `product_agent.md` | 기획, 요구사항, PRD |
| 🔧 Dev Agent | `dev_agent.md` | 개발, 버그 수정, 코드 |
| 📊 QA Agent | `qa_agent.md` | 테스트, 품질 검증 |

#### 표준 구성 (Standard)
| 에이전트 | SOP 파일 | 역할 |
|---------|---------|------|
| 🎨 Design Agent | `design_agent.md` | UI/UX, 디자인 시스템 |
| 🚀 DevOps Agent | `devops_agent.md` | 배포, 운영, 모니터링 |
| 💬 Support Agent | `support_agent.md` | 고객지원, FAQ, 피드백 |

#### 도메인 특화 구성 (Domain-Specific)
| 에이전트 | SOP 파일 | 역할 |
|---------|---------|------|
| 🤖 AI Agent | `ai_agent.md` | GPT 추천 로직, 프롬프트 최적화 |
| 📈 Analytics Agent | `analytics_agent.md` | 방문자 분석, 추천 성과 분석 |
| 📣 Marketing Agent | `marketing_agent.md` | SEO, AdSense, 쿠팡 파트너스 |
| 🔒 Security Agent | `security_agent.md` | 보안 점검, API 키 보호 |
| 📚 Docs Agent | `docs_agent.md` | API/사용자 문서화 |
| 🌐 i18n Agent | `i18n_agent.md` | 다국어 지원, 번역 관리 |

### 에이전트 호출 방법

자연어로 요청하면 Master Orchestrator가 적절한 에이전트를 선택합니다:

```
# 일반 요청 (자동 분류)
"선물 추천 폼 UI 수정해줘"               → Design Agent → Dev Agent
"다음 개발 우선순위 알려줘"              → Product Agent
"선물 추천 기능 테스트해줘"              → QA Agent
"UI 개선해줘"                           → Design Agent
"배포해줘"                              → DevOps Agent
"FAQ 업데이트해줘"                      → Support Agent
"GPT 프롬프트 개선해줘"                 → AI Agent
"방문자 통계 분석해줘"                  → Analytics Agent
"블로그 포스트 작성해줘"                → Marketing Agent
"보안 점검해줘"                         → Security Agent
"API 문서 작성해줘"                     → Docs Agent
"일본어 번역 추가해줘"                  → i18n Agent

# 명시적 호출
"Dev Agent: 쿠팡 파트너스 링크 기능 수정해줘"
"QA Agent: 배포 전 점검해줘"
```

### 승인 정책

⚠️ **모든 코드/DB/배포 변경은 사용자 승인 후 실행**
