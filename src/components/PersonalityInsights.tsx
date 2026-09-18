"use client";

import { useState } from "react";
import { Sparkles, Heart, Brain, Shield, Users, Target, BookOpen } from "lucide-react";

// ── Framework cards config ─────────────────────────────────────

interface FrameworkCard {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  name: string;
  subtitle: string;
  color: string;
  description: string;
  stats: Array<{ label: string; value: string; detail: string }>;
}

const FRAMEWORK_CARDS: FrameworkCard[] = [
  {
    icon: Sparkles,
    name: "Big Five",
    subtitle: "The scientific standard",
    color: "from-indigo-500 to-purple-600",
    description: "Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism — the most validated personality model in academic psychology.",
    stats: [
      { label: "Openness", value: "84%", detail: "High — curious, imaginative" },
      { label: "Conscientiousness", value: "76%", detail: "Moderate — organized but flexible" },
      { label: "Extraversion", value: "58%", detail: "Moderate — warm but recharges alone" },
      { label: "Agreeableness", value: "82%", detail: "High — cooperative, trusting" },
      { label: "Neuroticism", value: "52%", detail: "Low-moderate — stable, handles stress" },
    ],
  },
  {
    icon: Heart,
    name: "Attachment Theory",
    subtitle: "How you connect",
    color: "from-pink-500 to-rose-600",
    description: "Your attachment style shapes how you relate to others in intimacy — how close you get, how you handle conflict, and what you need to feel secure.",
    stats: [
      { label: "Style", value: "Secure", detail: "Comfortable with closeness and independence" },
      { label: "Trust", value: "High", detail: "You tend to assume good intent" },
      { label: "Intimacy", value: "Comfortable", detail: "You can be close without losing yourself" },
      { label: "Conflict", value: "Direct but gentle", detail: "You address issues but prefer harmony" },
    ],
  },
  {
    icon: Brain,
    name: "HEXACO",
    subtitle: "Six-dimensional personality",
    color: "from-violet-500 to-indigo-600",
    description: "An extension of the Big Five that adds Honesty-Humility — capturing sincerity, fairness, greed-avoidance, and modesty.",
    stats: [
      { label: "Honesty-Humility", value: "85%", detail: "High — sincere, fair, not greedy" },
      { label: "Emotionality", value: "70%", detail: "Moderate — empathetic, attaches easily" },
      { label: "Extraversion", value: "55%", detail: "Moderate — socially confident but not dominant" },
      { label: "Agreeableness", value: "80%", detail: "High — patient, forgiving" },
      { label: "Conscientiousness", value: "76%", detail: "High — organized, disciplined" },
      { label: "Openness", value: "88%", detail: "High — creative, curious" },
    ],
  },
  {
    icon: Target,
    name: "Enneagram",
    subtitle: "Core motivation",
    color: "from-teal-500 to-emerald-600",
    description: "A model of nine personality types, each driven by a core fear and desire. It reveals what motivates you beneath the surface.",
    stats: [
      { label: "Type", value: "Type 5 — The Investigator", detail: "Analytical, perceptive, independent" },
      { label: "Core desire", value: "To be capable and competent", detail: "You want to understand the world deeply" },
      { label: "Core fear", value: "Being useless or incompetent", detail: "You worry about not knowing enough" },
      { label: "Growth direction", value: "Type 8 (Challenger)", detail: "Move toward action and asserting yourself" },
    ],
  },
  {
    icon: Shield,
    name: "DISC",
    subtitle: "Behavioral style",
    color: "from-amber-500 to-orange-600",
    description: "A behavioral assessment that describes how you act in work and social settings — your natural pace, your priorities, and your communication defaults.",
    stats: [
      { label: "Style", value: "IS — Influencer + Steadiness", detail: "Supportive, persuasive, patient" },
      { label: "Pace", value: "Moderate", detail: "You work steadily, not frantically" },
      { label: "Priority", value: "Relationships + accuracy", detail: "People and quality matter more than speed" },
      { label: "Communication", value: "Warm and detailed", detail: "You explain things thoughtfully" },
    ],
  },
  {
    icon: Users,
    name: "Love Languages",
    subtitle: "How you give and receive",
    color: "from-green-500 to-teal-600",
    description: "Five ways people express and experience love. Knowing yours helps you understand what makes you feel valued — and how to make others feel valued too.",
    stats: [
      { label: "1st", value: "Quality Time", detail: "Undivided attention — being fully present" },
      { label: "2nd", value: "Words of Affirmation", detail: "Verbal encouragement, kind words, appreciation" },
      { label: "3rd", value: "Acts of Service", detail: "Practical help — actions that ease the load" },
    ],
  },
];

// ── Mock personality data (LLM-synthesized in Phase Three) ─────

const PERSONALITY_SUMMARY =
  "You are someone who values depth over breadth, connection over status, and understanding over being right. Your high openness and agreeableness make you naturally curious about others and willing to explore new ideas, while your moderate extraversion means you need quiet time to recharge after social engagement. You have solid emotional stability — not immune to stress, but capable of working through it rather than being consumed by it.";

const STRENGTHS = [
  "Deep self-awareness — you can articulate what you're feeling and why",
  "Empathetic listening — people feel safe opening up to you",
  "Intellectual curiosity — you're not afraid to question your own assumptions",
  "Emotional resilience — you recover from setbacks without wallowing",
  "Relationship orientation — you invest in quality connections",
];

const GROWTH_AREAS = [
  "Speak up earlier when something bothers you — you tend to process internally first",
  "Take more social risks — your comfort zone is small by choice, not by limitation",
  "Celebrate wins more openly — you have a tendency to move on quickly from achievements",
];

const RELATIONSHIP_ADVICE =
  "Your most fulfilling relationships are those where feelings can be spoken openly, without judgment. You thrive with partners who are emotionally articulate and give you space when you need to process. Your love language is quality time — you feel most connected when you can be fully present with someone, undistracted.";

// ── Suggested next steps ────────────────────────────────────────

const SUGGESTED_INSIGHTS = [
  {
    icon: BookOpen,
    title: "Conversation style to try",
    content: "Since you're reflective, try voice conversations when you want to think out loud. Voice removes the friction of typing and lets you speak at the pace your thoughts move.",
    color: "from-indigo-500 to-purple-600",
  },
  {
    icon: Target,
    title: "Growth experiment",
    content: "Pick one growth area and practice it for a week. For example: when something bothers you, speak about it within 24 hours instead of processing internally first.",
    color: "from-teal-500 to-emerald-600",
  },
  {
    icon: Heart,
    title: "Relationship check-in",
    content: "Tell the important people in your life what your love language is. Many misunderstandings come from giving love in the language you prefer, not the one the other person receives.",
    color: "from-pink-500 to-rose-600",
  },
];

// ── Component ──────────────────────────────────────────────────

export default function PersonalityInsights() {
  const [activeFramework, setActiveFramework] = useState(0);
  const card = FRAMEWORK_CARDS[activeFramework];

  if (!card) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2 text-indigo-600 text-sm font-medium mb-2">
            <Sparkles size={16} />
            <span>Personality DNA</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Your Personality Insights</h1>
          <p className="text-gray-600 leading-relaxed max-w-2xl">
            Youna has built a multidimensional portrait of your personality using multiple frameworks.
            Each lens reveals something different — together they create a picture that's more complete than any single model.
          </p>
        </div>
      </div>

      {/* Framework selector */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {FRAMEWORK_CARDS.map((f, i) => (
              <button
                key={i}
                onClick={() => setActiveFramework(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  activeFramework === i
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <f.icon size={16} className={`bg-gradient-to-br ${f.color} rounded-lg p-1 text-white`} />
                {f.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Framework detail */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-fade-in space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center shadow-md`}>
              <card.icon size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{card.name}</h2>
              <p className="text-sm text-gray-500">{card.subtitle}</p>
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed max-w-2xl">{card.description}</p>

          <div className="grid sm:grid-cols-2 gap-3">
            {card.stats.map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-fade-in">
                <div className="text-sm text-gray-500 mb-1">{stat.label}</div>
                <div className="text-lg font-bold text-gray-900 mb-0.5">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.detail}</div>
              </div>
            ))}
          </div>

          {activeFramework === 0 && (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100 mt-8">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-md flex-shrink-0">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">What this means for your conversations</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Your high openness and agreeableness means Youna can push you with thoughtful questions —
                    you won't get defensive, and you'll probably find it interesting. Your moderate extraversion
                    means you'll do best with text first, voice when you want to think out loud.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeFramework === 5 && (
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-5 border border-green-100 mt-8">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white shadow-md flex-shrink-0">
                  <Users size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">How to use this with others</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Share your top love languages with the people you care about. It's one of the simplest
                    and highest-impact things you can do — most relationship friction comes from speaking
                    love in the language you prefer instead of the one the other person hears.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Strengths & Growth Areas */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 mt-6 mb-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Strengths & Growth Areas</h2>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center gap-2">
              <Target size={18} /> Strengths
            </h3>
            <ul className="space-y-2">
              {STRENGTHS.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-amber-700 mb-3 flex items-center gap-2">
              <Target size={18} /> Growth Areas
            </h3>
            <ul className="space-y-2">
              {GROWTH_AREAS.map((g, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                  <span className="text-amber-500 mt-0.5 flex-shrink-0">→</span>
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">About You</h3>
          <p className="text-gray-700 text-sm leading-relaxed">{PERSONALITY_SUMMARY}</p>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Relationship Guidance</h3>
          <p className="text-gray-700 text-sm leading-relaxed">{RELATIONSHIP_ADVICE}</p>
        </div>
      </div>

      {/* Suggested next steps */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Suggested Next Steps</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SUGGESTED_INSIGHTS.map((insight, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-fade-in">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${insight.color} rounded-full flex items-center justify-center text-white flex-shrink-0`}>
                  <insight.icon size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{insight.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{insight.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
