# Youna — Security and privacy

> Status: AUTHORED · Updated 2026-09-23 · Owner: Ossama Mokhtar

| Threat | Control today | Gap |
|---|---|---|
| API key exposure | Keys only in server env; client calls app routes | — |
| Cost abuse | 20 requests/min per client; mock mode by default | Per-instance limiter; needs a shared store once deployed |
| Information disclosure | Health endpoint returns status only | — |
| Sensitive data at rest | Browser only, nothing on the server | **Plaintext localStorage; readable by anyone with the device** |
| Data sent to third parties | Chat text goes to the LLM provider only when LLM mode is on | Needs an in-product disclosure and provider DPAs |
| Crisis mishandling | Deterministic reply; tested patterns | Keyword recall limits (see 04) |
| Regulatory positioning | "Not a therapist" everywhere; programs labelled as skills, not therapy | Legal review per market before launch (e.g. Illinois's 2025 law restricting AI therapy) |

**Before any real user:** encrypted server storage with accounts, export and delete, a DPIA, and a provider data-processing agreement.
