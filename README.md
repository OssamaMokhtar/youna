# Youna

**Youna — AI Therapist, Wellness Coach & Companion Platform**

Youna is an AI-native emotional wellness platform. It learns your personality, tracks your mood, guides your journaling, listens to your voice, and stays with you through daily check-ins — all wrapped in a safety-first architecture that never positions itself as a replacement for professional care.

**Phase Two is complete** (9 commits, 13 routes, clean build on Node 22 LTS). Phase One established the foundation; Phase Two delivers mood tracking, journaling, voice conversations, 6-framework personality insights, safety layer hardening, and daily check-in streaks. **Not yet deployed** — the live URL is coming soon.

## What Youna Is

A personal AI companion for emotional wellness — available 24/7, deeply personalized, and built from the ground up with clinical safety as a first-class concern, not an afterthought.

## What Youna Is Not

A therapist. A diagnostic tool. A crisis service. Youna is a wellness companion — and it says so, clearly and persistently, in every interaction.

## Routes (13 total)

| # | Route | Purpose |
|---|---|---|
| 1 | `/` | Landing page — hero, features, how-it-works, safety, CTA |
| 2 | `/chat` | Full chat interface with Youna — text + voice, mood-aware AI, crisis detection, quick actions, modals |
| 3 | `/assessment` | Personality assessment onboarding — Big Five, attachment style, goals → personality profile |
| 4 | `/features` | Feature overview cards |
| 5 | `/about` | Mission, story, values, what Youna is / is not |
| 6 | `/mood` | **Mood Tracking** — daily mood logging, 7-day trend chart, weekly summary, history, streak |
| 7 | `/journal` | **Journaling** — free-form entries, 15 AI-guided prompts, mood tagging, streak |
| 8 | `/voice` | **Voice Chat** — Web Speech API mic input + speech synthesis output, listening indicator |
| 9 | `/insights` | **Personality Insights** — 6-framework DNA: Big Five, Attachment, HEXACO, Enneagram, DISC, Love Languages |
| 10 | `/checkin` | **Daily Check-in** — mood/energy/stress, reflection prompts, streak tracking, crisis detection |
| 11 | `/layout` | Root layout (font, global styles) |
| 12 | `/` (entry) | Home page entry point |
| 13 | _reserved_ | Future route |

## Phase One Features (MVP — complete)

1. **AI Chat Companion** — mock AI with emotional tone detection (stressed / sad / anxious / happy / neutral), typing indicator, mood emoji in messages, quick conversation starters
2. **Personality DNA Engine** — Big Five assessment (5 questions across O/C/E/A/N), attachment style selector (Secure, Anxious, Avoidant, Fearful-Avoidant), goals input, personality profile output with progress tracking
3. **Conversational Memory** — session-based message history with mood context
4. **Mood Tracking UI** — mood-aware chat, mood check-in modal with emoji scale
5. **Journaling** — AI-guided journal prompt modal, prompt library (gratitude, stress, reflection, goals, relationships)
6. **Daily Check-ins** — daily check-in modal trigger, mood + short journal entry capture
7. **Goal & Habit Tracking UI** — foundation for goal/habit infrastructure
8. **Safety Layer** — crisis messaging in chat (suicide, self-harm, harm to others), persistent "not a therapist" disclaimers on every route, real crisis resources modal
9. **Clinical Safety Architecture** — crisis detection keywords, severity-based messaging, resource provision, professional referral pathway (designed; hooks in place)

## Phase Two Features (complete — not yet deployed)

### Mood Tracking (`/mood`)
- Daily mood logging with 5-emoji selector (😊😌😐😢😰)
- 7-day trend chart with mood scores (1-5 scale)
- Weekly summary (average mood + trend direction: improving / steady / needs attention)
- Full mood history list (last 14 entries)
- localStorage persistence
- Streak tracking (consecutive day counter)

### Journaling (`/journal`)
- Free-form journal entries organized by date
- 15 AI-guided prompts (randomly selected on entry creation)
- Mood tagging per entry (optional)
- Reflection toast displayed after saving (static message; AI-generated reflection is Phase Three)
- 30-day progress bar + streak counter
- Edit and delete entries
- Full history list with date + mood + prompt indicator

### Voice Chat (`/voice`)
- Web Speech API voice input — click mic to speak, text appears in input
- Speech Synthesis voice output — Youna speaks responses aloud
- Live listening indicator (red pulse animation)
- Stop recording button
- Works in Chrome, Safari, Edge (webkitSpeechRecognition / SpeechSynthesis)
- Graceful fallback — voice button hidden if browser doesn't support Web Speech API
- Typing-to-send still available alongside voice

### Personality Insights (`/insights`)
- 6-framework personality DNA display:
  - **Big Five** — Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism (with % scores + interpretation)
  - **Attachment Theory** — Secure / Anxious / Avoidant / Fearful with relationship style insights
  - **HEXACO** — Honesty-Humility, Emotionality, Extraversion, Agreeableness, Conscientiousness, Openness
  - **Enneagram** — Core type with motivation, fear, growth direction
  - **DISC** — Dominance / Influence / Steadiness / Conscientiousness behavioral style
  - **Love Languages** — ranked top 3 (Words, Acts, Gifts, Time, Touch)
- Framework switcher tab UI (sticky header)
- Score cards per framework dimension
- Strengths & growth areas panel
- Relationship guidance section
- 3 suggested next steps cards

### Safety Layer Hardening (`/chat` + `/mood` + `/checkin`)
- **CrisisResources component** — 2-tier triage (immediate crisis vs. ongoing support), regional helplines, distress warm-up message, professional detour narrative for counseling intent
- **Crisis detection pipeline** — 16 keyword patterns across sadness, self-harm, hopelessness, and crisis-intent language
- **Chat**: crisis keyword detection on every user message, professional counseling redirect (no-crisis path), Shield icon button opens resources, persistent crisis banner below header during active crisis context
- **Mood Tracking**: crisis resources integrated as modal, CrisisLevel awareness (MILD → wellness CTA, SEVERE → blocked dismiss + persistent resource access)
- **Journaling**: crisis resources integrated as modal, crisis OTA responses in chat when journaling triggers crisis language
- **Alert threshold**: mood ≤ 1.5 AND entry mood ≤ 2 → crisis dialog in both mood and check-in
- **Crisis banner in modal footer** when avgMoodLast7 ≤ 1.5 and ≥ 2 entries
- **Panic button** (bell icon) top-right opens CrisisResources with reason="checkin"

### Daily Check-in (`/checkin`)
- Persistent daily trigger banner (only shows when not yet checked in today)
- 5-level mood selector with emoji + score mapping
- Energy slider (0–100%) and Stress slider (0–100%)
- Free-text note field with persistence
- Rotating reflection question (7 prompts, rotates on modal open)
- Stats preview: total check-ins, current streak, avg mood (last 7 days)
- Success banner after submit (green, shows streak)
- Streak computed from consecutive check-in dates, persisted to localStorage
- Streak state: currentStreak, longestStreak, lastCheckedInDate
- Crisis detection: avg mood over last 7 days ≤ 1.5 AND today's mood score ≤ 2 AND no prior crisis trigger today → opens CrisisResources
- Crisis banner in modal footer when avgMoodLast7 ≤ 1.5 and ≥ 2 entries
- Panic button (bell icon) top-right opens CrisisResources with reason="checkin"

### Shared Types & Scoring (`src/lib/`)
- `types.ts` — shared type definitions (MoodEntry, JournalEntry, CheckInEntry, PersonalityProfile, PersonalityDNA, AttachmentStyle, LoveLanguage, CrisisLevel)
- `personality.ts` — HEXACO/DISC/Enneagram/Love Languages scoring helpers (rule-based, deterministic)

## Phase Three (roadmap)
- **LLM Integration** — model routing (OpenAI / Claude / Gemini), cost optimization, fallback systems, prompt templates
- **Long-Term Memory** — vector store (pgvector / Qdrant), user context persistence, semantic + episodic memory
- **AI Coaching Engine** — goal-setting, progress tracking, coaching conversations, action planning
- **Relationship Coaching** — relationship-focused AI patterns, communication coaching
- **Wellness Programs** — structured programs (stress management, sleep, mindfulness, habit building)
- **Social Ecosystem Integrations** — LinkedIn, calendar, health apps — with explicit user consent only
- **Enterprise B2B2C** — corporate wellness, schools, telehealth partnerships, therapist marketplace

## Phase Four (roadmap)
- Predictive wellness AI
- Digital twin model
- Multi-agent AI team (Therapist Agent, Coach Agent, Wellness Agent, Goal Agent, Social Agent)
- Global expansion + localization (AR/EN structural RTL)

## Tech Stack

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

## Architecture

- **App Router** with route-based layouts — all 13 routes
- **Client components** for all interactive surfaces — `use client` where needed
- **Mock AI** continues — deterministic responses by detected emotional tone; LLM integration is Phase Three
- **Voice** uses Web Speech API (free, no API key) — professional STT/TTS (Whisper / ElevenLabs / Deepgram) in Phase Three
- **Personality scoring** is rule-based and deterministic — LLM-generated DNA synthesis comes in Phase Three
- **Memory** is localStorage — vector store + user context persistence in Phase Three
- **Storage** is localStorage — database (Supabase / Neon / Postgres) in Phase Three
- **User identity** is anonymous localStorage session — auth (NextAuth / Clerk) in Phase Three
- **Safety** keywords and resource hooks carry forward; crisis detection pipeline matures across all routes

## Commands

```bash
# Install
npm install

# Dev server
npm run dev        # http://localhost:3000

# Production build
npm run build
npm start

# Lint
npm run lint

# Typecheck
npx tsc --noEmit
```

## Project Structure

```
youna/
├── src/
│   ├── app/                  # App Router pages (13 routes)
│   │   ├── page.tsx          # Landing page
│   │   ├── chat/             # Chat route
│   │   ├── assessment/       # Personality assessment route
│   │   ├── features/         # Feature overview
│   │   ├── about/            # About / mission
│   │   ├── mood/             # Mood Tracking (Phase Two)
│   │   ├── journal/          # Journaling (Phase Two)
│   │   ├── voice/            # Voice Chat (Phase Two)
│   │   ├── insights/         # Personality Insights (Phase Two)
│   │   ├── checkin/          # Daily Check-in (Phase Two)
│   │   ├── layout.tsx        # Root layout (font, global styles)
│   │   ├── globals.css       # Tailwind + CSS variables
│   │   └── page.tsx          # Home page entry
│   ├── components/
│   │   ├── Navbar.tsx        # Shared navbar
│   │   ├── LandingPage.tsx   # Full landing page
│   │   ├── ChatInterface.tsx # Chat UI (crisis detection, voice, modals)
│   │   ├── CrisisResources.tsx  # Crisis resources modal (Phase Two)
│   │   ├── DailyCheckIn.tsx  # Daily check-in (Phase Two)
│   │   ├── VoiceChat.tsx     # Voice chat interface (Phase Two)
│   │   ├── PersonalityAssessment.tsx  # Assessment flow
│   │   ├── MoodTracking.tsx  # Mood tracking (Phase Two)
│   │   ├── Journaling.tsx    # Journaling (Phase Two)
│   │   └── PersonalityInsights.tsx  # Insights page (Phase Two)
│   └── lib/
│       ├── types.ts          # Shared type definitions
│       └── personality.ts    # Personality scoring helpers
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── next-env.d.ts
├── .nvmrc                   # 22 (Node 22 LTS)
├── .gitignore
└── .github/
    └── workflows/
        └── ci.yml           # Node 22 LTS, typecheck + lint + build gates
```

## Safety & Ethics

Youna is designed with safety as a core architectural principle:

- **Not a therapist** — stated clearly on every screen
- **Crisis detection** — keyword-based detection for suicide, self-harm, and harm-to-others language across chat, mood, and check-in
- **Resource provision** — real crisis hotline resources surfaced immediately when crisis language is detected
- **Professional referral pathway** — designed and hooked; connects users to professional help when needed
- **Privacy** — Phase Two stores all user data in the browser's localStorage only. There is **no encryption layer** in Phase Two. Data is not sent to any server. Encrypted database storage + authenticated access are Phase Three items.
- **Transparency** — always clear that Youna is an AI
- **Voice data** — Web Speech API processes audio locally in the browser; no audio is sent to any server in Phase Two

## Roadmap

### Phase One (complete)
Landing page, chat UI, personality assessment, mood tracking UI, journaling prompts, daily check-ins, safety layer

### Phase Two (complete — not yet deployed)
- Mood tracking with history, charts, and streak
- Journaling with 15 prompts, reflection toast (static), streak
- Voice conversations (Web Speech API)
- Advanced personality DNA (6 frameworks)
- Safety layer hardening (CrisisResources modal, crisis detection pipeline, persistent banners, crisis OTA responses across chat + mood + check-in)
- Daily check-in with mood/energy/stress, reflection prompts, streak tracking
- 13 routes, 9 new components, shared type system, personality scoring library

### Phase Three
- LLM integration with model routing + cost optimization + fallbacks
- Long-term memory (vector store + user context persistence)
- AI Coaching engine
- Relationship coaching
- Wellness programs
- Social ecosystem integrations (LinkedIn, X, Instagram, calendars, health apps — explicit user consent only)
- Enterprise B2B2C (corporate wellness, schools, telehealth partnerships)

### Phase Four
- Predictive wellness AI
- Digital twin model
- Multi-agent AI team (Therapist Agent, Coach Agent, Wellness Agent, Goal Agent, Social Agent)
- Global expansion + localization

## CI

GitHub Actions workflow (`ci.yml`): Node 22 LTS, typecheck + lint + build gates. Runs on every push and PR.

## License

Proprietary — Youna is a commercial product. All rights reserved.

## Contributing

This is a proprietary product under active development. Internal contributors: see the team onboarding doc. External contributors: not open for external PRs at this time.

## Links

- **Repo:** `github.com/OssamaMokhtar/youna`
- **Live:** coming soon
- **Profile:** `github.com/OssamaMokhtar`
- **Architecture & Status:** [`docs/00-architecture-and-status.md`](docs/00-architecture-and-status.md) — canonical statement of what is built vs designed vs not-yet-deployed
- **PRD:** "The Companion Standard" — full blueprint with market research, competitive analysis, technical architecture, financial model, team structure, and GTM strategy
