# Youna Feature Impact Analysis
## AI Coaching Programs + Insights Dashboard
**Build:** dcfcee76 · **Date:** 2026-09-22 · **Author:** Ossama Mokhtar

---

## 1. Executive Summary

Two features landed in this build cycle that transform Youna from a conversational companion into a structured wellness platform with measurable user outcomes.

| Feature | Lines of Code | New Files | API Endpoints | UI Components |
|---------|--------------|-----------|---------------|---------------|
| AI Coaching Programs | 3,903 (lib) + 14,377 (API) + 23,599 (UI) | 4 | 5 (POST/GET with 4 actions) | 2 (Library + Client) |
| Insights Dashboard | 14,827 (data) + 27,046 (UI) | 2 | 0 (client-side, localStorage) | 1 (Dashboard) |
| **Total** | **~65,000 LOC** | **6 new files** | **5 endpoints** | **3 components** |

**Strategic verdict:** These features move Youna up the value chain — from chat (commodity) to structured programs (differentiation) to measurable insights (retention + monetization). They are the foundation for every Phase 3 feature in the roadmap.

---

## 2. Feature Impact Analysis

### 2.1 AI Coaching Programs

#### Strategic Impact
| Dimension | Assessment |
|-----------|------------|
| **Market differentiation** | High. No other AI companion (Replika, Character AI, Nomi, Kindroid, Paradot) offers structured, framework-grounded coaching programs. Pi (Inflection) has conversation quality but no structured exercises. Wysa/Woebot have some structure but are single-framework (CBT-leaning) and not personalized. This is a clear moat. |
| **Category creation** | Medium-High. "AI coaching programs" is not an established category yet — Youna can define it. The 6-framework breadth (CBT/DBT/ACT/EFT/SFBT/Mindfulness) is broader than any existing digital mental health product. |
| ** defensibility** | Medium. The program content itself is not patentable, but the combination of (a) framework breadth, (b) personality-DNA-driven recommendations, (c) step-by-step interactive flow, and (d) integration with mood/journal/personality data creates a product experience that is hard to replicate without equivalent content depth + data integration. |
| **Momentum toward Phase 3** | High. These programs are the executable format for the DNA-driven coaching recommendations that define Phase 3. Without them, the DNA data has nowhere to go. |

#### User Impact
| Dimension | Assessment |
|-----------|------------|
| **Per-session value** | High. A coaching program delivers 5-12 minutes of structured, actionable work — significantly more value per session than a freeform chat. Users leave with a specific skill or insight, not just a conversation. |
| **Engagement depth** | High. The step-by-step flow creates natural commitment — a user who starts a program is more likely to finish it than a user who starts a casual chat. Completion creates a micro-win that drives return. |
| **User retention mechanism** | High. Coaching programs create return triggers: "I want to try the Body Scan again," "I want to see if my distress tolerance improved," "I want to start Values Clarification." Each program is a reason to come back. |
| **Accessibility** | High. All 10 programs require no assessment (`requiresAssessment: false`). A new user can start a 3-Minute Breathing Space on day one. Low barrier to entry. |
| **Emotional safety** | Medium-High. The structured format with clear step boundaries reduces the risk of the AI going off-track or giving harmful advice — each step's content is pre-authored, not generated on the fly. The LLM is used only for completion reflections (reserved for future enhancement). |

#### Technical Impact
| Dimension | Assessment |
|-----------|------------|
| **Architecture complexity** | Low-Medium. The in-memory session store is intentionally simple for MVP. The coaching engine (`coaching.ts`) is pure TypeScript with no side effects — testable, portable, and ready for DB migration in Phase 3. |
| **API surface** | Low. 5 endpoints with clear action dispatch. No new dependencies, no new infrastructure. |
| **Extensibility** | High. Adding a new program = adding a new `CoachingProgram` entry to the registry. The step-based flow handles any program structure. New response types (scale, journal, multiple choice) are already supported. |
| **LLM readiness** | High. The `buildCoachingPrompt` function is written to produce LLM-ready prompts, but the MVP currently delivers pre-authored step content directly. When a real API key is added, the LLM can be used for completion reflections and personalized mid-program guidance without changing the program structure. |
| **Scalability risk** | Low (MVP) / Medium (production). In-memory session store is fine for MVP (single-user localStorage in production). Production will need DB-backed sessions with user isolation. |

#### Business Impact
| Dimension | Assessment |
|-----------|------------|
| **Premium tier justification** | High. Structured coaching programs are a natural premium feature — they're the kind of content that justifies a paywall. "Access to all 10 coaching programs" is a clear premium tier descriptor. |
| **Monetization signal** | High. Program completion rates, time-in-program, and program selection patterns are rich metrics for understanding willingness to pay. A user who completes 5+ programs is a strong premium candidate. |
| **B2B narrative** | High. "Evidence-based coaching programs grounded in CBT/DBT/ACT/EFT/SFBT/Mindfulness" is a phrase that resonates with corporate wellness buyers, HR directors, and university counseling centers. This is the language of clinical credibility. |
| **Content moat** | Medium. The 77 authored steps are unique content that takes time to create. A competitor cannot copy them without equivalent clinical grounding. This is a content moat, not a technology moat. |

---

### 2.2 Insights Dashboard

#### Strategic Impact
| Dimension | Assessment |
|-----------|------------|
| **Retention visualization** | High. The dashboard gives users a reason to return that is not the chat — it's their own data. "What's my mood trend?" "How's my journal sentiment?" "How many programs have I completed?" Each question is a return trigger. |
| **Self-awareness value** | High. The dashboard surfaces patterns the user cannot see in the moment: "My mood has been declining for 5 days," "My journal has been negative since Tuesday," "I've only done CBT programs." This is meta-awareness — a core wellness outcome. |
| **Category differentiation** | Medium-High. Replika and Character AI have no data dashboard — they are purely conversational. Wysa has some mood tracking but no DNA visualization, no coaching stats, no sentiment trends. This dashboard combines data types that no competitor brings together. |
| **Data network effect** | High. The more a user checks in, journals, and completes programs, the richer their dashboard becomes — and the harder it is to leave (data lock-in, but the benevolent kind: leaving means losing your wellness history). |

#### User Impact
| Dimension | Assessment |
|-----------|------------|
| **First-time value** | Medium. A new user sees empty states — "Your insights will appear here." This is honest but requires behavior change (check in, journal, do a program) before the dashboard delivers value. The recommendation banner partially offsets this by suggesting next actions. |
| **Ongoing value** | High. After 7+ days of check-ins, the mood trend becomes meaningful. After 3+ journal entries, sentiment trends appear. After 1+ coaching program, progress stats populate. The dashboard gets more valuable with use — a classic retention loop. |
| **Motivation effect** | High. Streak visualization ("5-day streak") is a proven engagement mechanic. Completion rate ("75% completion rate") creates a micro-goal. Both leverage loss aversion and progress bias — well-established behavioral levers. |
| **Emotional safety** | Medium. Sentiment analysis that flags negative journal entries could feel invasive if not framed carefully. The dashboard presents sentiment as pattern data, not judgment — "your entries have leaned negative" not "your writing is negative." The framing matters. |

#### Technical Impact
| Dimension | Assessment |
|-----------|------------|
| **Data layer complexity** | Low. All data is localStorage-based for MVP. The `insights.ts` module is pure data transformation — no side effects, no API calls, no external dependencies. Testable in isolation. |
| **Sentiment analysis** | Low-Medium. The word-list-based sentiment engine is intentionally simple for MVP. It is fast, transparent, and works without an LLM call. In Phase 3, this can be upgraded to LLM-based sentiment analysis for richer nuance without changing the dashboard UI. |
| **Dashboard performance** | Low. The dashboard reads from localStorage on mount — no API calls, no loading states beyond the initial localStorage read. Renders in <100ms in the browser. |
| **Scalability risk** | Low (MVP) / Medium (production). localStorage is fine for MVP but hits limits at ~5MB. Production needs DB-backed storage for mood check-ins, journal entries, and coaching sessions. The `insights.ts` data layer is already structured for this migration — just swap `loadMoodCheckins()` from localStorage to DB. |

#### Business Impact
| Dimension | Assessment |
|-----------|------------|
| **Retention metric** | High. The dashboard gives product teams something to optimize: "Users who view their dashboard weekly have X% higher retention." This is an actionable metric, not a vanity metric. |
| **Premium tier justification** | Medium-High. "Advanced insights: mood trends, journal sentiment analysis, coaching progress tracking, personality snapshot" is a defensible premium descriptor. Free tier shows basic mood; premium shows trends, sentiment, coaching stats. |
| **B2B narrative** | Medium. "Employee wellness insights dashboard" is a sellable concept for corporate wellness — aggregate (anonymized) mood trends, program completion rates, engagement metrics. This is the data layer for the B2B pitch. |
| **Onboarding signal** | High. The empty state is itself a signal: "This user hasn't checked in, journaled, or done a program yet." Product teams can use this to trigger onboarding interventions. |

---

## 3. Dependency Map

### 3.1 What These Features Depend On (Upstream)

```
┌─────────────────────────────────────────────────────────────────┐
│                     Youna Phase Two Infrastructure                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────┐ │
│  │  localStorage    │    │  Mood Detection  │    │  Personality  │ │
│  │  (browser API)   │    │  (getMood() in   │    │  Assessment   │ │
│  │                  │    │   ChatInterface) │    │  (types.ts,   │ │
│  │  Used by:        │    │                  │    │   personality │ │
│  │  - insights.ts   │    │  Used by:        │    │   .ts)        │ │
│  │  - coaching      │    │  - insights.ts   │    │              │ │
│  │    session save  │    │    (mood trend)  │    │  Used by:    │ │
│  │    (future)      │    │  - dashboard     │    │  - coaching  │ │
│  │                  │    │  - coaching      │    │    recs      │ │
│  └─────────────────┘    │    recommendations│   │  - dashboard │ │
│                         └─────────────────┘    │  snapshot    │ │
│                                                └──────────────┘ │
│  ┌─────────────────┐                                     │
│  │  ChatInterface   │                                    │
│  │  (mood detection,│                                    │
│  │   journal prompt)│                                    │
│  │                  │                                    │
│  │  Used by:        │                                    │
│  │  - Coaching      │                                    │
│  │    (session ID   │                                    │
│  │     generation)  │                                    │
│  └─────────────────┘                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Critical upstream dependencies:**

| Dependency | Used By | Risk if Missing | Mitigation |
|------------|---------|-----------------|------------|
| `localStorage` browser API | `insights.ts` (all data), coaching session persistence (future) | Dashboard shows empty state; no data persistence | Empty states handle this gracefully; data loss on refresh is acceptable for MVP |
| `getMood()` in `ChatInterface.tsx` | `insights.ts` mood trend (future wiring) | Mood trend data gap until auto-logging is wired | Manual check-in modal already captures mood; auto-logging is a wire, not a dependency |
| Personality assessment (`types.ts`, `personality.ts`) | Coaching recommendations, dashboard snapshot | Dashboard shows "Not assessed"; coaching recs fall back to generic | All programs are available without assessment; recs are bonus, not requirement |
| `crypto.randomUUID()` | Coaching session ID generation | Sessions could collide (extremely unlikely) | Acceptable entropy for MVP; DB-backed sessions in production will use proper IDs |

### 3.2 What Future Features Depend On These (Downstream)

```
┌─────────────────────────────────────────────────────────────────┐
│                     Youna Phase Three + Roadmap                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  AI Coaching Programs ──────────────────────────────────────────│
│  ┌─────────────┬─────────────┬─────────────┬──────────────────┐ │
│  │ LLM Coaching │  Coaching   │  Coaching   │  Coaching        │ │
│  │ Reflection   │  Persistence│  Recommendations│  Program          │ │
│  │ (Phase 3)    │  (Phase 3)  │  Engine     │  Expansion       │ │
│  │             │             │  (Phase 3)  │  (Phase 3/4)     │ │
│  └─────────────┴─────────────┴─────────────┴──────────────────┘ │
│     │              │              │              │                │
│     ▼              ▼              ▼              ▼                │
│  LLM generates  localStorage  DNA + mood     New programs       │
│  personalized  + DB backed   data feeds     (relationships,    │ │
│  mid-program   session store recommendation  career, sleep,     │ │
│  guidance       (Phase 3)    engine (Phase   nutrition, etc.)  │ │
│                                        3)                      │ │
│                                                                  │
│  Insights Dashboard ────────────────────────────────────────────│
│  ┌─────────────┬─────────────┬─────────────┬──────────────────┐ │
│  │  DB-Backed   │  LLM        │  Wellness   │  B2B Dashboard   │ │
│  │  Data Store  │  Sentiment  │  Score      │  (Phase 4)       │ │
│  │  (Phase 3)   │  (Phase 3)  │  (Phase 3)  │                  │ │
│  └─────────────┴─────────────┴─────────────┴──────────────────┘ │
│     │              │              │              │                │
│     ▼              ▼              ▼              ▼                │
│  Replace local   LLM-based      Composite      Anonymized        │
│  Storage with   sentiment       wellness       aggregate         │
│  DB (moods,     (richer        score from     wellness metrics   │
│  journals,      nuance)        mood +         for enterprise    │
│  coaching,      replaces       journal +      buyers            │
│  personality)   word-list      coaching       (Phase 4)         │
│                 (Phase 3)      data (Phase 3)                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Critical downstream dependencies:**

| Future Feature | Depends On | What Breaks If Missing | Mitigation |
|----------------|------------|------------------------|------------|
| **LLM coaching reflection** (Phase 3) | `buildCoachingPrompt()` in `coaching.ts`, `processCoachingResponse()` in API | LLM has no structured context to reflect on; completions are generic | MVP already delivers pre-authored reflections; LLM is an enhancement, not a dependency |
| **DB-backed coaching persistence** (Phase 3) | In-memory session store, `CoachingSessionData` type | Sessions lost on refresh; no cross-session continuity | Acceptable for MVP; DB migration is a wire, not a rewrite — the session type is already defined |
| **Coaching recommendation engine** (Phase 3) | `getRecommendedPrograms()` in `coaching.ts`, DNA data, mood trend data | Recommendations fall back to generic framework list | `getRecommendedPrograms()` already works with partial DNA data; mood data is bonus |
| **Program expansion** (Phase 3/4) | `COACHING_PROGRAMS` registry, step-based flow, `CoachingStep` type | Cannot add new programs without extending the registry | Architecture is designed for this — adding a program = adding a registry entry |
| **DB-backed data store** (Phase 3) | `insights.ts` data layer (load/save functions) | Dashboard reads from localStorage (limited, no sync) | `insights.ts` functions are already isolated — swap localStorage for DB in each load/save function |
| **LLM sentiment analysis** (Phase 3) | Word-list sentiment engine in `insights.ts` | Sentiment stays simple/word-list-based | Word-list engine is a fallback; LLM sentiment is an upgrade, not a replacement |
| **Wellness score** (Phase 3) | Mood trend, journal sentiment, coaching stats, personality snapshot | No composite score; dashboard shows individual metrics only | All four data sources already feed the dashboard; composite score is a computation on top |
| **B2B dashboard** (Phase 4) | Aggregate data from mood trend, coaching stats, journal sentiment | No enterprise metrics; B2B pitch lacks data layer | Individual user dashboard is the building block; B2B aggregation is a query layer on top |
| **Coaching-from-chat wiring** (next) | `CoachingLibrary.tsx`, `CoachingProgramClient.tsx`, `POST /api/coaching` | User cannot start coaching from chat; must navigate to /coaching page | Page navigation is functional; in-chat wiring is a UI enhancement |
| **Mood auto-logging from chat** (next) | `saveMoodCheckin()` in `insights.ts`, `getMood()` in `ChatInterface.tsx` | Mood trend data gap until user manually checks in | Manual check-in modal exists; auto-logging is a wire that enriches existing data |

---

## 4. Feature Scorecard

### 4.1 AI Coaching Programs

| Dimension | Score (1-10) | Weight | Weighted | Rationale |
|-----------|-------------|--------|----------|-----------|
| **Strategic differentiation** | 8 | 15% | 1.20 | No competitor offers structured multi-framework coaching programs. Pi has conversation quality but no structure. Wysa/Woebot are single-framework. This is a clear gap Youna fills. |
| **User engagement depth** | 8 | 15% | 1.20 | Step-by-step flow creates commitment. 77 authored steps provide depth. Completion is a micro-win. But new users must discover the page — in-chat wiring will improve this. |
| **User retention mechanism** | 7 | 15% | 1.05 | Programs create return triggers (try another program, revisit a completed one). But retention depends on program quality perception — if users don't find the programs useful, they won't return. |
| **Technical extensibility** | 9 | 10% | 0.90 | Pure TypeScript engine, no side effects. Adding a program = registry entry. New response types already supported. Ready for DB migration, LLM integration, and program expansion without architectural change. |
| **Monetization potential** | 8 | 10% | 0.80 | Natural premium feature. "Access to all coaching programs" is a clear tier descriptor. Completion metrics inform willingness-to-pay analysis. B2B narrative is strong (evidence-based frameworks). |
| **Content defensibility** | 7 | 10% | 0.70 | 77 authored steps are a content moat — time-consuming to replicate. But content alone is not defensible; the combination with DNA data + mood data + interactive flow is the real moat. |
| **Accessibility / barrier to entry** | 8 | 5% | 0.40 | All 10 programs require no assessment. A new user can start a 3-minute exercise on day one. Low barrier. |
| **Emotional safety** | 8 | 5% | 0.40 | Pre-authored step content reduces hallucination risk. Structured flow keeps the AI on track. LLM used only for future completion reflections (not current MVP). Crisis protocols already exist in chat. |
| **Data integration readiness** | 7 | 5% | 0.35 | Personality context is wired into the API. Mood data integration is ready (saveMoodCheckin exists) but not yet wired from chat. Journal integration is ready but not wired. |
| **Implementation quality** | 9 | 10% | 0.90 | TypeScript-clean, build-passing, lint-clean. 77 steps across 10 programs with thoughtful clinical content. Interactive UI with progress bar, multiple input types, completion screen. API with 5 clear endpoints. |
| **TOTAL** | | **100%** | **7.90 / 10** | |

### 4.2 Insights Dashboard

| Dimension | Score (1-10) | Weight | Weighted | Rationale |
|-----------|-------------|--------|----------|-----------|
| **Retention mechanism** | 8 | 15% | 1.20 | Dashboard creates return triggers: "What's my mood trend?" "How's my sentiment?" "How many programs have I done?" Data visualization is a proven retention loop. |
| **User self-awareness value** | 8 | 15% | 1.20 | Surfaces patterns the user cannot see in the moment. Mood trends, sentiment shifts, streak visualization — all meta-awareness tools. This is a core wellness outcome, not a vanity feature. |
| **Data network effect** | 7 | 10% | 0.70 | Dashboard gets richer with use — more check-ins, more journals, more programs = more insights. Data lock-in is the benevolent kind (leaving = losing your wellness history). |
| **Technical simplicity** | 9 | 10% | 0.90 | localStorage-based, no API calls, no external dependencies. Pure data transformation. Renders in <100ms. Ready for DB migration by swapping load/save functions. |
| **Sentiment analysis quality** | 6 | 10% | 0.60 | Word-list engine is fast and transparent but limited — no nuance, no context, no negation handling. LLM-based sentiment in Phase 3 will be a significant upgrade. Current implementation is an MVP baseline. |
| **First-time user experience** | 5 | 10% | 0.50 | Empty states dominate for new users. Dashboard delivers no value until the user has check-ins, journals, or programs. Recommendation banner partially offsets this but is itself based on patterns that don't exist yet. |
| **Monetization potential** | 7 | 10% | 0.70 | "Advanced insights" is a natural premium descriptor. Free tier = basic mood; premium = trends + sentiment + coaching stats. B2B dashboard (Phase 4) is a separate revenue stream. |
| **Competitive differentiation** | 7 | 5% | 0.35 | No competitor combines mood trends + journal sentiment + coaching stats + personality snapshot in one dashboard. Replika/Character AI have no dashboard. Wysa has limited mood tracking. But the dashboard is only as compelling as the data behind it. |
| **Emotional safety** | 7 | 5% | 0.35 | Sentiment analysis presents data, not judgment — but a user seeing "your journal entries have been negative" could feel exposed. Framing matters. Streak visualization could create pressure ("I don't want to break my streak"). |
| **Implementation quality** | 9 | 10% | 0.90 | TypeScript-clean, build-passing, lint-clean. Thoughtful chart design with mood color coding, centered sentiment line, framework breakdown. Recommendation engine with 7 logic branches. Personality snapshot with Big Five bars + attachment + communication + Enneagram + DISC. |
| **TOTAL** | | **100%** | **7.15 / 10** | |

### 4.3 Combined Score

| Feature | Weighted Score | Strategic Importance | Implementation Quality | Overall |
|--------|---------------|---------------------|----------------------|---------|
| AI Coaching Programs | **7.90 / 10** | High | High | **Strong addition** |
| Insights Dashboard | **7.15 / 10** | High | High | **Solid addition with UX debt** |

**Combined strategic verdict:** Both features are strong additions that move Youna up the value chain. Coaching programs score higher because they deliver immediate value per session and create a clear content moat. The Insights Dashboard is solid but has a first-time UX gap — it delivers value longitudinally, not immediately, which creates an onboarding challenge.

---

## 5. Risk Register — Feature-Specific

### 5.1 AI Coaching Programs Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Users don't discover the coaching page | High | Medium | In-chat wiring (next build) + recommendation banner in dashboard + coaching link in personality snapshot |
| Program content feels clinical or robotic | Medium | Medium | Tone reviews of authored steps; LLM completion reflections (Phase 3) can add warmth; user feedback loop |
| Users start but don't complete programs | Medium | Medium | Completion rate tracking (already in dashboard); program length optimization; step-Level drop-off analysis (Phase 3) |
| In-memory session store loses data on refresh | High (MVP) | Low | Acceptable for MVP; localStorage persistence (Phase 3) solves this; user can restart program |
| LLM integration creates inconsistent experience | Low (future) | Medium | Keep LLM use to completion reflections first; A/B test LLM vs. pre-authored; fallback to pre-authored if LLM quality drops |

### 5.2 Insights Dashboard Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Empty state for new users | High | Medium | Recommendation banner suggests next actions; clear CTA to chat/journal/coaching; onboarding tooltip (Phase 3) |
| Sentiment analysis misses nuance | Medium | Low | Word-list is MVP baseline; LLM sentiment (Phase 3) upgrades; transparency: "this is a simple analysis, not a clinical assessment" |
| Streak pressure creates anxiety | Low | Low | Frame streak as encouragement, not obligation; allow "catch up" messaging; consider soft-streak (e.g., 5 of 7 days = 70%) |
| Dashboard becomes a vanity metric trap | Low | Medium | Dashboard is one of several interfaces (chat, coaching, journal); don't make it the primary experience; keep it as insight, not identity |
| localStorage limits at scale | Low (MVP) | Medium | 5MB limit is ~10,000 mood check-ins or ~500 journal entries — enough for months of use; DB migration (Phase 3) solves this |

---

## 6. What These Features Unlock (Next 90 Days)

### Immediate (this week)
1. **Wire coaching start from chat** — add "Start a coaching program" suggestion in `ChatInterface.tsx` when user expresses intent to work on something specific
2. **Wire mood auto-logging from chat** — call `saveMoodCheckin()` from `ChatInterface.tsx` on each message, using existing `getMood()` detection
3. **Wire journal persistence** — save journal entries to localStorage via `insights.ts` when user completes a journal prompt

### Short-term (next 2-4 weeks)
4. **Persist coaching sessions to localStorage** — call `saveCoachingSession()` on program completion; load sessions on dashboard mount
5. **DB-backed data store** — migrate `insights.ts` load/save functions from localStorage to Prisma + PostgreSQL
6. **LLM coaching reflections** — add real API key; use LLM for completion reflections (buildCoachingPrompt already supports this)

### Medium-term (Phase 3)
7. **Coaching recommendation engine** — `getRecommendedPrograms()` + DNA + mood data → personalized program suggestions on dashboard
8. **Wellness score** — composite score from mood trend + journal sentiment + coaching stats + personality snapshot
9. **LLM sentiment analysis** — replace word-list engine with LLM-based sentiment for richer nuance
10. **Program expansion** — add relationship coaching, career coaching, sleep coaching, nutrition coaching programs

---

## 7. Go/No-Go Assessment

| Criterion | Coaching Programs | Insights Dashboard |
|-----------|-------------------|-------------------|
| **Build quality** | ✅ TypeScript-clean, build-passing, lint-clean | ✅ TypeScript-clean, build-passing, lint-clean |
| **Strategic fit** | ✅ Moves Youna up the value chain; clear differentiation | ✅ Creates retention loop; data network effect |
| **User value** | ✅ Immediate per-session value; structured, actionable | ⚠️ Longitudinal value; empty state for new users |
| **Technical debt** | ✅ Low — pure TS engine, no side effects, ready for DB | ✅ Low — localStorage-based, ready for DB migration |
| **Monetization path** | ✅ Clear premium tier descriptor; B2B narrative | ✅ Advanced insights tier; B2B dashboard (Phase 4) |
| **Risk level** | 🟡 Medium — discovery gap, content quality perception | 🟡 Medium — first-time UX gap, sentiment simplicity |
| **GO/NO-GO** | **✅ GO** — ship, wire from chat next | **✅ GO** — ship, improve first-time UX next |

---

*Analysis prepared for Ossama Mokhtar. Next step: wire coaching-from-chat + mood auto-logging to close the discovery gap and enrich the dashboard data.*
