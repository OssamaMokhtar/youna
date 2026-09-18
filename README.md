# Youna

**Youna — AI Therapist, Wellness Coach & Companion Platform**

Youna is an AI-native emotional wellness platform. It learns your personality, tracks your mood, guides your journaling, and stays with you through daily check-ins — all wrapped in a safety-first architecture that never positions itself as a replacement for professional care.

This is Phase One: the foundational MVP. Voice, advanced personality DNA, social ecosystem integrations, AI coaching, and enterprise B2B2C come in Phase Two and beyond.

## What Youna Is

A personal AI companion for emotional wellness — available 24/7, deeply personalized, and built from the ground up with clinical safety as a first-class concern, not an afterthought.

## What Youna Is Not

A therapist. A diagnostic tool. A crisis service. Youna is a wellness companion — and it says so, clearly and persistently, in every interaction.

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page — hero, features, how-it-works, safety, CTA |
| `/chat` | Full chat interface with Youna — text conversations, mood-aware AI, quick actions, mood check-in modal, journal prompt modal |
| `/assessment` | Personality assessment onboarding — Big Five axes, attachment style, goals, produces a personality profile |
| `/features` | Feature overview cards |
| `/about` | Mission, story, values, what we are / are not |

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

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| State | React useState / useEffect (client components) |
| Storage (MVP) | In-memory / localStorage-ready interfaces |
| Build | Static-generated pages, `next build` clean |

## Architecture Notes

- **App Router** with route-based layouts — `/`, `/chat`, `/assessment`, `/features`, `/about`
- **Client components** for interactive surfaces (chat, assessment, modals) — `use client` where needed
- **Mock AI** for Phase One — deterministic responses by detected emotional tone; LLM integration (OpenAI / Claude / Gemini with model routing) is Phase Three
- **Personality scoring** is rule-based from assessment answers in Phase One; LLM-generated DNA synthesis comes in Phase Three
- **Memory** is session-based in Phase One; long-term user memory (vector store, user context persistence) is Phase Two/Three
- **Safety** keywords and resource hooks are in place now; full crisis detection pipeline matures in Phase Two

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
```

## Project Structure

```
youna/
├── src/
│   ├── app/                  # App Router pages
│   │   ├── page.tsx          # Landing page
│   │   ├── chat/             # Chat route
│   │   ├── assessment/       # Personality assessment route
│   │   ├── features/         # Feature overview
│   │   ├── about/            # About / mission
│   │   ├── layout.tsx        # Root layout (font, global styles)
│   │   ├── globals.css       # Tailwind + CSS variables
│   │   └── page.tsx          # Home page entry
│   └── components/
│       ├── Navbar.tsx        # Shared navbar
│       ├── LandingPage.tsx   # Full landing page
│       ├── ChatInterface.tsx # Chat UI
│       └── PersonalityAssessment.tsx  # Assessment flow
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── next-env.d.ts
├── README.md
└── .gitignore
```

## Roadmap

### Phase One (current)
- Landing page, chat UI, personality assessment, mood tracking UI, journaling prompts, daily check-ins, safety layer

### Phase Two (next)
- Voice conversations (STT/TTS)
- Advanced personality DNA (HEXACO, Enneagram, DISC, Jungian cognitive functions, Love Languages)
- Real mood tracking with history and charts
- Real journaling with AI reflection
- Daily check-ins with streaks
- Safety layer hardening (crisis detection pipeline, resource provider)

### Phase Three
- LLM integration (model routing, cost optimization, fallbacks)
- Long-term memory (vector store, user context persistence)
- AI Coaching engine
- Social ecosystem integrations (LinkedIn, X, Instagram, calendars, health apps — with explicit user consent)
- Enterprise B2B2C (corporate wellness, schools, telehealth partnerships)

### Phase Four
- Predictive wellness AI
- Digital twin model
- Multi-agent AI team (Therapist Agent, Coach Agent, Wellness Agent, Goal Agent, Social Agent)
- Global expansion and localization

## Safety & Ethics

Youna is designed with safety as a core architectural principle:

- **Not a therapist** — stated clearly on every screen
- **Crisis detection** — keyword-based detection for suicide, self-harm, and harm-to-others language
- **Resource provision** — real crisis hotline resources surfaced immediately when crisis language is detected
- **Professional referral pathway** — designed and hooked; connects users to professional help when needed
- **Privacy** — user data is private, encrypted, and under user control (architecture designed; implementation matures with auth + DB in later phases)
- **Transparency** — always clear that Youna is an AI

## License

Proprietary — Youna is a commercial product. All rights reserved.

## Contributing

This is a proprietary product under active development. Internal contributors: see the team onboarding doc. External contributors: not open for external PRs at this time.

## Links

- **Repo:** `github.com/OssamaMokhtar/youna`
- **Live:** coming soon
- **PRD:** "The Companion Standard" — full blueprint with market research, competitive analysis, technical architecture, financial model, team structure, and GTM strategy
