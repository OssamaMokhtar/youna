# Youna — Architecture & Status

> Status: AUTHORED · Updated 2026-09-23 · Owner: Ossama Mokhtar

**Purpose.** One place that says what Youna is, what is built vs designed, and what the honest deployment state is. Youna's README has drifted between versions; this doc is the canonical statement.

---

## What Youna is

An AI-native emotional wellness platform. It learns personality, tracks mood, guides journaling, supports voice conversations, and delivers daily check-ins — built with clinical safety as a first-class concern, not an afterthought.

## What Youna is not

A therapist. A diagnostic tool. A crisis service. Youna is a wellness companion — and it says so, clearly and persistently, in every interaction.

---

## What is built (Phase One + Phase Two — complete)

### Phase One (MVP — complete)
1. **AI Chat Companion** — mock AI with emotional tone detection (stressed / sad / anxious / happy / neutral), typing indicator, mood emoji, quick starters
2. **Personality DNA Engine** — Big Five assessment, attachment style selector, goals input, personality profile with progress tracking
3. **Conversational Memory** — session-based message history with mood context
4. **Mood Tracking UI** — mood-aware chat, mood check-in modal with emoji scale
5. **Journaling** — AI-guided journal prompt modal, prompt library
6. **Daily Check-ins** — daily check-in modal trigger, mood + short journal entry capture
7. **Goal & Habit Tracking UI** — foundation for goal/habit infrastructure
8. **Safety Layer** — crisis messaging in chat, persistent "not a therapist" disclaimers, real crisis resources modal
9. **Clinical Safety Architecture** — crisis detection keywords, severity-based messaging, resource provision, professional referral pathway (designed; hooks in place)

### Phase Two (complete — 9 commits, 13 routes, clean build on Node 22 LTS)
- **Mood Tracking** — daily mood logging (5-emoji), 7-day trend chart, weekly summary, full history (last 14), localStorage persistence, streak tracking
- **Journaling** — free-form entries by date, 15 AI-guided prompts, mood tagging, edit/delete, full history
- **Voice Chat** — Web Speech API mic input + speech synthesis output, live listening indicator, stop recording, graceful fallback, typing-to-send alongside voice
- **Personality Insights** — 6-framework DNA display: Big Five, Attachment Theory, HEXACO, Enneagram, DISC, Love Languages; framework switcher, score cards, strengths/growth areas, relationship guidance, 3 next-step cards
- **Safety Layer Hardening** — CrisisResources component (2-tier triage), 16 keyword crisis detection patterns across chat/mood/journal, persistent crisis banner, crisis OTA responses, mood ≤ 1.5 + entry ≤ 2 → crisis dialog
- **Daily Check-in** — persistent trigger banner, 5-level mood + energy slider + stress slider, free-text note, rotating reflection question, stats preview, success banner, streak (current/longest/last-checked-in), crisis detection on avg mood
- **Shared Types & Scoring** — types.ts (MoodEntry, JournalEntry, CheckInEntry, PersonalityProfile, PersonalityDNA, AttachmentStyle, LoveLanguage, CrisisLevel), personality.ts (HEXACO/DISC/Enneagram/Love Languages scoring — rule-based, deterministic)

### Routes (13 total)
1. `/` — Landing page
2. `/chat` — Full chat interface with Youna
3. `/assessment` — Personality assessment onboarding
4. `/features` — Feature overview cards
5. `/about` — Mission, story, values
6. `/mood` — Mood Tracking
7. `/journal` — Journaling
8. `/voice` — Voice Chat
9. `/insights` — Personality Insights (6-framework DNA)
10. `/checkin` — Daily Check-in
11. `/layout` — Root layout
12. `/` (home page entry) — Landing page entry
13. [reserved] — future route

---

## What is designed but not built (Phase Three — roadmap)

- **LLM Integration** — model routing (OpenAI / Claude / Gemini), cost optimization, fallback systems, prompt templates
- **Long-Term Memory** — vector store (pgvector / Qdrant), user context persistence, semantic + episodic memory
- **AI Coaching Engine** — goal-setting, progress tracking, coaching conversations, action planning
- **Relationship Coaching** — relationship-focused AI patterns, communication coaching
- **Wellness Programs** — structured programs (stress management, sleep, mindfulness, habit building)
- **Social Ecosystem Integrations** — LinkedIn, calendar, health apps — with explicit user consent only
- **Enterprise B2B2C** — corporate wellness, schools, telehealth partnerships, therapist marketplace

---

## What is not yet deployed

- **Live URL:** Not deployed. The README's Links section says "Live: coming soon." This is accurate.
- **AI reflection in journaling:** The journaling "AI reflection" is a static toast string displayed after saving. It is not AI-generated. Phase Three will add real LLM-based reflection.
- **Voice AI:** Phase Two voice uses Web Speech API (free, local to browser). No audio is sent to any server. Phase Three will add professional STT/TTS (Whisper / ElevenLabs / Deepgram).
- **Personality scoring:** Phase Two scoring is rule-based and deterministic. LLM-generated DNA synthesis comes in Phase Three.
- **Storage:** Phase Two uses localStorage only. No database, no auth, no encryption. Phase Three will add database (Supabase / Neon / Postgres) + auth (NextAuth / Clerk).
- **User identity:** Phase Two is anonymous localStorage session. No auth. Phase Three will add auth.

---

## Honest statement on encryption

**Youna does not encrypt user data in Phase Two.** Phase Two storage is localStorage only — there is no encryption layer. The README's Safety & Ethics section previously claimed "user data is private, encrypted, and under user control" which overstates the current state. Encryption (at-rest + in-transit) and authenticated access are Phase Three items. This doc and the README now say so plainly.

---

## Tech stack (Phase Two)

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| State | React useState / useEffect / useRef / useCallback (client components) |
| Storage (MVP) | localStorage for mood + journal + check-in persistence |
| Voice | Web Speech API (webkitSpeechRecognition + SpeechSynthesis) |
| Build | Static-generated pages, `next build` clean (13/13 routes) |

## CI

`ci.yml` — Node 22 LTS, typecheck + lint + build gates. Runs on every push and PR.

---

## Roadmap

- **Phase Three:** LLM integration, long-term memory, AI coaching engine, relationship coaching, wellness programs, social integrations, enterprise B2B2C
- **Phase Four:** Predictive wellness AI, digital twin, multi-agent AI team, global expansion + localization

---

Ossama Mokhtar · Dubai, UAE
