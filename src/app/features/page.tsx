import Link from "next/link";
import { ArrowRight, Sparkles, Heart, Brain, Shield, MessageSquare } from "lucide-react";

export const metadata = {
  title: "Features — Youna",
  description: "Explore Youna's features: personalized AI companion, mood tracking, journaling, personality DNA, and clinical safety.",
};

export default function FeaturesPage() {
  const features = [
    {
      icon: Sparkles,
      title: "Personalized AI Companion",
      description: "An AI that genuinely learns your personality, preferences, emotional patterns, and communication style — getting better at understanding you over time.",
      color: "from-indigo-500 to-purple-600",
    },
    {
      icon: Heart,
      title: "Emotional Intelligence",
      description: "Active listening, empathy modeling, sentiment analysis, and reflective conversations that help you process emotions and gain clarity.",
      color: "from-pink-500 to-rose-600",
    },
    {
      icon: Brain,
      title: "Personality DNA Engine",
      description: "Integrated Big Five, MBTI, DISC, Attachment Theory, and Enneagram frameworks create a multidimensional portrait of who you are.",
      color: "from-violet-500 to-indigo-600",
    },
    {
      icon: Shield,
      title: "Clinical Safety First",
      description: "Crisis detection, risk escalation, professional referral pathways, and clear boundaries — because your safety is non-negotiable.",
      color: "from-green-500 to-teal-600",
    },
    {
      icon: MessageSquare,
      title: "AI Chat Companion",
      description: "Text-based conversations with an AI that remembers your conversations, adapts to your style, and genuinely gets to know you over time.",
      color: "from-indigo-500 to-purple-600",
    },
    {
      icon: Heart,
      title: "Mood Tracking",
      description: "Check in with your mood daily. Youna notices patterns, helps you understand your emotional trends, and adapts to how you're feeling.",
      color: "from-pink-500 to-rose-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">Y</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Youna
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/about"
                className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              >
                About
              </Link>
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-md"
              >
                <MessageSquare size={16} />
                Start Chatting
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Features
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for emotional wellness, powered by AI that truly understands you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                  <feature.icon size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="py-8 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          &copy; 2026 Youna. Your wellness companion.
        </div>
      </footer>
    </div>
  );
}
