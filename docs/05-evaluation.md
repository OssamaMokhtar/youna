# Youna — Evaluation

> Status: AUTHORED · Updated 2026-09-23 · Owner: Ossama Mokhtar

**What is measured is the deterministic safety layer. Nothing measures the quality of model replies yet.**

| Set | n | Result (23 Sep 2026) | Gate in CI |
|---|---|---|---|
| Direct crisis phrases | 10 | 10/10 detected | All must pass |
| Indirect crisis phrases | 10 | 10/10 detected | All must pass |
| Everyday phrases that must not trigger ("this workout is killing me") | 9 | 0 false positives | All must pass |
| Mood / check-in dialog rules (same-day repeat, today counted, note scan, no history) | 6 cases | Pass | All must pass |
| Rate limiter | 3 cases | Pass | All must pass |

Source: `src/lib/__tests__/`. Run: `npm test`.

**How to read this.** These are hand-written regression cases; they show the code does what it says. They are not a measure of real-world recall.

## Not measured

| Question | How it will be measured |
|---|---|
| Real-world crisis recall | Labelled set of at least 200 messages (clinician-reviewed), recall ≥ 0.95 as a CI gate |
| Reply quality (reflects, doesn't advise) | 50-case rubric graded by two reviewers per release |
| Cost per active user per week | Log per-call cost estimates once deployed |
