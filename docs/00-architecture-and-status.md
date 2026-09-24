# Youna — Architecture & Status

> Status: AUTHORED · Updated 2026-09-23 (audit pass) · Owner: Ossama Mokhtar

The canonical statement of what is built, what is scaffolded, and what is not deployed. The README summarises this; if they disagree, this file wins and the README is a bug.

## Positioning

An AI wellness companion. **Not** a therapist, a diagnostic tool or a crisis service. The earlier "AI Therapist" title was removed on 23 Sep 2026: it contradicted the product's own "What Youna is not" section, and several jurisdictions now restrict AI tools that present as therapy (for example Illinois's 2025 Wellness and Oversight for Psychological Resources Act).

## Built

| Component | Notes |
|---|---|
| Next.js 15 app, 11 pages | `/`, `/chat`, `/voice`, `/checkin`, `/mood`, `/journal`, `/insights`, `/coaching`, `/assessment`, `/features`, `/about` |
| Chat API with LLM fallback chain | OpenAI → Claude → Gemini → mock. Mock by default (`YOUNA_MOCK_MODE`). Per-provider keys. Rate limited 20/min per client, per instance |
| Crisis safety module | `src/lib/safety.ts`. Shared by UI and API; deterministic reply; golden-set tests in CI |
| Local persistence | localStorage for mood, journal, check-ins; no encryption |
| Voice | Web Speech API, on device |
| Coaching programs | Scripted, self-guided exercises. Not therapy |

## Scaffolded, not wired

- NextAuth + Prisma 7 schema. Prisma 7 needs a driver adapter and a `prisma.config.ts` before `PrismaClient` can connect; neither exists yet, so the auth route is not usable.

## Not built

- Server-side or encrypted storage; accounts in the core flows.
- Model-based crisis classification and any recall figure beyond the keyword golden set.
- Long-term memory, predictive features, multi-agent roadmap items.

## Not deployed

No public URL. Do not deploy until the "Before any user" items in the README roadmap are done.

## Safety test results (CI, every push)

| Set | n | Result |
|---|---|---|
| Direct crisis phrases | 10 | 10/10 detected |
| Indirect crisis phrases | 10 | 10/10 detected |
| Everyday phrases that must not trigger | 9 | 0 false positives |
| Mood/check-in dialog rules | 6 cases | pass |

These numbers describe a hand-written regression set, not real-world recall.
