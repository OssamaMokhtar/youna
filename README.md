# Youna

**AI wellness companion: daily check-ins, mood tracking, journaling and reflective conversation, with safety logic that is tested rather than asserted.**

Youna is a companion, not a therapist, a diagnostic tool or a crisis service. It says so on every screen, and the crisis path is deterministic: when crisis language is detected, the model is never asked to write the reply.

> **Status (23 Sep 2026): pre-release prototype, not deployed, no users.** Runs locally. The LLM path is built but off by default (`YOUNA_MOCK_MODE` defaults to mock). Nothing below is a measured outcome.

---

## What is built

| Area | State | Where |
|---|---|---|
| Chat companion | Built. Mock replies by default; real LLM with fallback chain (OpenAI → Claude → Gemini → mock) when keys are set and `YOUNA_MOCK_MODE=false` | `src/app/api/chat/complete`, `src/lib/llm.ts`, `src/lib/prompts.ts` |
| Crisis safety | Built and **unit-tested**: one shared pattern list for client and server; fixed crisis reply; check-in, mood, journal and voice all gated | `src/lib/safety.ts`, `src/lib/__tests__/safety.test.ts` |
| Daily check-in, mood tracking, journaling | Built. Stored in the browser's localStorage only | `src/components/*` |
| Voice chat | Built. Web Speech API in the browser; no audio leaves the device | `src/components/VoiceChat.tsx` |
| Personality profile | Built. Rule-based scoring from a short questionnaire; the six "frameworks" are derived views, not six validated instruments | `src/lib/personality.ts` |
| Coaching programs | Built. Self-guided skills exercises drawn from CBT, DBT, ACT, EFT, SFBT and mindfulness. **Not therapy or treatment** | `src/lib/coaching.ts`, `/coaching` |
| Insights dashboard | Built, from local data | `/insights` |
| Accounts and database | Scaffolded (NextAuth + Prisma 7). Not wired into the core flows | `src/lib/auth.ts`, `prisma/` |
| Rate limiting | Built: 20 requests/min per client on the chat API (per instance) | `src/lib/rate-limit.ts` |

### Pages

`/` · `/chat` · `/voice` · `/checkin` · `/mood` · `/journal` · `/insights` · `/coaching` · `/assessment` · `/features` · `/about`, plus API routes `/api/chat/complete`, `/api/coaching` and `/api/auth/[...nextauth]`.

## Safety design

- **Detection.** `src/lib/safety.ts` holds one list of direct and indirect crisis phrases, used by the chat UI, voice chat, journal, check-in, mood tracker and the API route.
- **Response.** A crisis match returns fixed text that points to emergency and crisis-line help and opens the resources panel. The model does not write it.
- **Low-mood signals.** A check-in or mood entry opens the resources panel when the 7-day average (including today) and today's score are both low, or when the entry's note contains crisis language. There is no same-day suppression.
- **Tests.** The golden set covers 10 direct phrases, 10 indirect phrases and 9 everyday phrases that must not trigger (for example "this workout is killing me"). Current result: 20/20 detected, 0/9 false positives. CI fails if any case regresses.

**Known limits.** Keyword matching will miss indirect phrasing that is not on the list, and it only covers English. The mood thresholds are product judgement, not clinically validated. Before any real users, the next step is a model-based classifier evaluated against a labelled set of at least 200 cases, with recall reported per release.

### Fixed in the 23 Sep 2026 audit

- The check-in crisis dialog could never open: its guard compared against a streak date that was always today.
- The client regex `/\bsuic(id|de)\b/` did not match "suicide" or "suicidal".
- The server's crisis branch sent the message to an LLM and returned the generated text.
- Voice chat and journaling had no crisis detection at all.
- The Claude fallback used a Bearer header instead of `x-api-key`, and one key was passed to every provider.
- `GET /api/chat/complete` exposed running cost and key presence.
- `main` did not build (unclosed JSX in the Insights dashboard), and `/coaching` was linked but had no page.

## Privacy

Everything is stored in the browser's localStorage. There is **no encryption layer and no server-side storage** in the current build. With LLM mode on, chat messages are sent to the configured provider. Encrypted server storage and authenticated access are required before any deployment.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000, mock AI
npm test             # safety + rate-limit tests
npm run build
```

To use a real model, copy `.env.local.example` to `.env.local`, set `OPENAI_API_KEY` (and optionally `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`), and set `YOUNA_MOCK_MODE=false`.

## CI

`.github/workflows/ci.yml` on every push and PR: install → Prisma generate → typecheck → lint → safety tests → build → `npm audit` (high and critical fail the build). No step is allowed to pass on failure.

## Roadmap

1. **Before any user:** model-based crisis classifier with a published recall figure; encrypted storage; auth wired to real flows; a DPIA.
2. **Private beta (20 users, check-ins only):** pass bar set in advance, with day-14 retention of at least 30% and zero missed crisis cases on manual audit.
3. Later: long-term memory, structured wellness programs, B2B2C through employers or clinics with a clinical partner.

## Tech

Next.js 15 (App Router) · TypeScript (strict) · Tailwind CSS · Lucide · Vitest · Prisma 7 + NextAuth (scaffolded)

## Licence

Proprietary. All rights reserved. Source is public for review; not open to external contributions.

---

Ossama Mokhtar · Dubai, UAE · [Architecture and status](docs/00-architecture-and-status.md)
