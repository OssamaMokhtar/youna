# Youna — AI and safety architecture

> Status: AUTHORED · Updated 2026-09-23 · Owner: Ossama Mokhtar

**The model is allowed to reflect and ask questions. It is never allowed to answer someone in crisis.** That boundary is code, not a prompt instruction.

## Layers

| Layer | Where | Behaviour |
|---|---|---|
| 1. Client crisis gate | `ChatInterface`, `VoiceChat`, `Journaling`, `DailyCheckIn`, `MoodTracking` | `isCrisisText()` on every message, journal entry and note; low-mood rule on check-ins. On a match: fixed reply plus resources panel, and no server call from chat |
| 2. Server crisis gate | `/api/chat/complete` | Same patterns; `mode: "crisis"` also forces the fixed reply |
| 3. Prompt guardrails | `src/lib/prompts.ts` | Reflect and ask; no advice, diagnosis or promises; support seeking professional help; say it is AI |
| 4. Provider fallback | `src/lib/llm.ts` | OpenAI `gpt-4.1-mini` → Claude Sonnet 4 → Gemini 2.5 Flash → mock. Each provider uses its own key |
| 5. Cost control | `llm.ts`, rate limiter | Estimated cost per call from list prices; 20 requests/min per client |

## Why the crisis reply is fixed text

A generated reply to someone in crisis can be warm and still be wrong: it might miss the resources, give advice, or misread the risk. A fixed reply is reviewable once, testable in CI, and the same every time. The trade-off is that it feels less personal. That trade-off is accepted (ADR-002).

## What detection can and cannot do

Keyword and phrase patterns catch direct statements and a list of common indirect ones. They will miss novel indirect phrasing, sarcasm, other languages and context spread over several messages. That is the main safety gap (GAPS #1). The planned replacement is a small classifier run before generation, measured on a labelled set of at least 200 cases, with recall reported per release and a recall gate in CI.

## Coaching programs

Coaching programs are scripted sequences in `coaching.ts` drawn from CBT, DBT, ACT, EFT, SFBT and mindfulness. No model generates the steps. The UI states they are skills exercises, not therapy.
