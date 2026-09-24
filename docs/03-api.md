# Youna — API

> Status: AUTHORED · Updated 2026-09-23 · Owner: Ossama Mokhtar

| Route | Method | Purpose | Notes |
|---|---|---|---|
| `/api/chat/complete` | POST | One chat turn | Body: `message`, `history` (last 12), `personality`, `mode`. Returns `text`, `provider`, `model`, `usage`, `latencyMs`, and `crisis: true` on the crisis path. 429 with `Retry-After` over 20/min |
| `/api/chat/complete` | GET | Health | Returns `status` and `mockMode` only (cost and key presence were removed 23 Sep 2026) |
| `/api/coaching?action=programs` | GET | List programs | Static catalogue from `coaching.ts` |
| `/api/coaching?action=start` | POST | Start a program | Returns session id and first step |
| `/api/coaching?action=respond` | POST | Next step | Deterministic script; no model call |
| `/api/auth/[...nextauth]` | GET/POST | Auth | Scaffold only; returns errors until a database is configured |

Crisis requests never reach a model: `mode: "crisis"` or matching text returns the fixed reply from `src/lib/safety.ts`.
