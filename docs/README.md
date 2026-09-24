# Youna — Architecture docs

> Status: AUTHORED · Updated 2026-09-23 · Owner: Ossama Mokhtar

Start with the status doc; it says what is built, scaffolded and not built. Every other doc describes the code as it is, and marks anything that is designed but not built.

| # | Doc | What it answers |
|---|---|---|
| 00 | [Architecture and status](00-architecture-and-status.md) | What exists, what doesn't, deployment state |
| 01 | [System architecture](01-system-architecture.md) | Components, request flow, where state lives |
| 02 | [Data model](02-data-model.md) | Browser storage today; Prisma schema for later |
| 03 | [API](03-api.md) | The three server routes |
| 04 | [AI and safety architecture](04-ai-and-safety.md) | LLM fallback chain, prompts, crisis gate |
| 05 | [Evaluation](05-evaluation.md) | What is tested, with n, and what is not |
| 06 | [Security and privacy](06-security-and-privacy.md) | Threats, controls, gaps |
| 10 | [Decision log](10-decision-log.md) | ADRs with reversal triggers |
| — | [Gaps](GAPS.md) | What is unresolved, ranked |
| — | [Feature impact analysis](feature-impact-analysis.md) | Planning doc (Sep 2026) |
