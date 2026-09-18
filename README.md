# Youna

**Youna — AI Therapist, Wellness Coach & Companion Platform**

Youna is an AI-native emotional wellness platform. It learns your personality, tracks your mood, guides your journaling, and stays with you through daily check-ins — all wrapped in a safety-first architecture that never positions itself as a replacement for professional care.

**Phase Two is live** (Next.js 15, TypeScript, Tailwind CSS). Phase One established the foundation; Phase Two delivers persistent mood tracking, journaling, voice conversations, and 6-framework personality insights.

## What Youna Is

A personal AI companion for emotional wellness — available 24/7, deeply personalized, and built from the ground up with clinical safety as a first-class concern, not an afterthought.

## What Youna Is Not

A therapist. A diagnostic tool. A crisis service. Youna is a wellness companion — and it says so, clearly and persistently, in every interaction.

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page — hero, features, how-it-works, safety, CTA |
| `/chat` | Full chat interface with Youna — text conversations, mood-aware AI, quick actions, mood check-in modal, journal prompt modal |
| `/assessment` | Personality assessment onboarding — Big Five, attachment style, goals → personality profile |
| `/features` | Feature overview cards |
| `/about` | Mission, story, values, what Youna is / is not |
| `/mood` | **Mood Tracking** — daily mood logging, 7-day trend chart, weekly summary, full history |
| `/journal` | **Journaling** — free-form entries, AI-guided prompts (15), mood tagging, AI reflection on save, streak tracking, edit/delete |
| `/voice` | **Voice Chat** — Web Speech API voice input (mic) + speech synthesis output (Youna speaks back), listening indicator |
| `/insights` | **Personality Insights** — 6-framework personality DNA: Big Five, Attachment Theory, HEXACO, Enneagram, DISC, Love Languages |

## Phase One Features (MVP)

1. **AI Chat Companion** — mock AI with emotional tone detection (stressed / sad / anxious / happy / neutral), typing indicator, mood emoji in messages, quick conversation starters
2. **Personality DNA Engine** — Big Five assessment (5 questions across O/C/E/A/N), attachment style selector (Secure, Anxious, Avoidant, Fearful-Avoidant), goals input, personality profile output with progress tracking
3. **Conversational Memory** — session-based message history with mood context
4. **Mood Tracking UI** — mood-aware chat, mood check-in modal with emoji scale
5. **Journaling** — AI-guided journal prompt modal, prompt library (gratitude, stress, reflection, goals, relationships)
6. **Daily Check-ins** — daily check-in modal trigger, mood + short journal entry capture
7. **Goal & Habit Tracking UI** — foundation for goal/habit infrastructure
8. **Safety Layer** — crisis messaging in chat (suicide, self-harm, harm to others), persistent "not a therapist" disclaimers on every route, real crisis resources modal
9. **Clinical Safety Architecture** — crisis detection keywords, severity-based messaging, resource provision, professional referral pathway (designed; hooks in place)

## Phase Two Features (live)

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
- AI reflection toast displayed after saving ("Thank you for writing this down...")
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

### Shared Types & Scoring (`src/lib/`)
- `types.ts` — shared type definitions (MoodEntry, JournalEntry, PersonalityProfile, PersonalityDNA, AttachmentStyle, LoveLanguage)
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
| Storage (MVP) | localStorage for mood + journal persistence |
| Voice | Web Speech API (webkitSpeechRecognition + SpeechSynthesis) |
| Build | Static-generated pages, `next build` clean (12/12 routes) |

## Architecture Notes

- **App Router** with route-based layouts — `/`, `/chat`, `/assessment`, `/features`, `/about`, `/mood`, `/journal`, `/voice`, `/insights`
- **Client components** for all interactive surfaces — `use client` where needed (all Phase Two pages are client components)
- **Mock AI** continues from Phase One — deterministic responses by detected emotional tone; LLM integration is Phase Three
- **Voice** uses Web Speech API (free, no API key) in Phase Two — professional STT/TTS (Whisper / ElevenLabs / Deepgram) in Phase Three
- **Personality scoring** is rule-based and deterministic in Phase Two (HEXACO/DISC/Enneagram/Love Languages helpers in `src/lib/personality.ts`) — LLM-generated DNA synthesis comes in Phase Three
- **Memory** is localStorage in Phase Two — vector store + user context persistence in Phase Three
- **Storage** is localStorage for mood entries + journal entries in Phase Two — database (Supabase / Neon / Postgres) in Phase Three
- **User identity** is anonymous localStorage session in Phase Two — auth (NextAuth / Clerk) in Phase Three
- **Safety** keywords and resource hooks carry forward from Phase One; crisis detection pipeline matures in Phase Two/Three

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
│   ├── app/                  # App Router pages (12 routes)
│   │   ├── page.tsx          # Landing page
│   │   ├── chat/             # Chat route
│   │   ├── assessment/       # Personality assessment route
│   │   ├── features/         # Feature overview
│   │   ├── about/            # About / mission
│   │   ├── mood/             # Mood Tracking (Phase Two)
│   │   ├── journal/          # Journaling (Phase Two)
│   │   ├── voice/            # Voice Chat (Phase Two)
│   │   ├── insights/         # Personality Insights (Phase Two)
│   │   ├── layout.tsx        # Root layout (font, global styles)
│   │   ├── globals.css       # Tailwind + CSS variables
│   │   └── page.tsx          # Home page entry
│   ├── components/
│   │   ├── Navbar.tsx        # Shared navbar
│   │   ├── LandingPage.tsx   # Full landing page
│   │   ├── ChatInterface.tsx # Chat UI (with voice button)
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
├── .github/
│   └── workflows/
│       └── ci.yml           # Node 22 LTS, typecheck + lint + build gates
└── README.md
```

## Safety & Ethics

Youna is designed with safety as a core architectural principle:

- **Not a therapist** — stated clearly on every screen
- **Crisis detection** — keyword-based detection for suicide, self-harm, and harm-to-others language (carried forward from Phase One)
- **Resource provision** — real crisis hotline resources surfaced immediately when crisis language is detected
- **Professional referral pathway** — designed and hooked; connects users to professional help when needed
- **Privacy** — user data is private, encrypted, and under user control (localStorage in Phase Two; encrypted DB + auth in Phase Three)
- **Transparency** — always clear that Youna is an AI
- **Voice data** — Web Speech API processes audio locally in the browser; no audio is sent to any server in Phase Two

## Roadmap

### Phase One (complete)
- Landing page, chat UI, personality assessment, mood tracking UI, journaling prompts, daily check-ins, safety layer

### Phase Two (live)
- Voice conversations (Web Speech API)
- Advanced personality DNA (HEXACO, Enneagram, DISC, Jungian cognitive functions, Love Languages)
- Real mood tracking with history and charts
- Real journaling with AI reflection
- Daily check-ins with streaks
- Safety layer hardening (crisis detection pipeline, resource provider)
- 9 new routes, 5 new components, shared type system, personality scoring library

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

## License

Proprietary — Youna is a commercial product. All rights reserved.

## Contributing

This is a proprietary product under active development. Internal contributors: see the team onboarding doc. External contributors: not open for external PRs at this time.

## Links

- **Repo:** `github.com/OssamaMokhtar/youna`
- **Live:** coming soon
- **Profile:** `github.com/OssamaMokhtar`
- **PRD:** "The Companion Standard" — full blueprint with market research, competitive analysis, technical architecture, financial model, team structure, and GTM strategy
