import Link from "next/link";
import { ArrowRight, Sparkles, Heart, Brain, Shield, MessageSquare } from "lucide-react";

export const metadata = {
  title: "About Youna — AI Wellness Companion",
  description: "Learn about Youna, your AI-powered emotional wellness companion that learns, adapts, and grows with you.",
};

export default function AboutPage() {
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
              <Link href="/features" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                Features
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full mb-6">
              <Sparkles size={16} />
              Our Mission
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Building the Future of{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Emotional Wellness
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Youna exists because millions of people need emotional support that&apos;s always
              available, always understanding, and always respectful of their privacy and safety.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Story</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>The idea for Youna came from watching the intersection of three trends: the growing loneliness epidemic, the rapid advancement of AI in emotional conversation, and the persistent gap in mental health access.</p>
              <p>We saw that AI companions existed, and mental health apps existed, but no one had built a platform that combined genuine, persistent personalization with clinical-safety-first design. A platform that didn&apos;t just chat — but truly knew you, got better at knowing you, and helped you grow.</p>
              <p>Youna is built on a simple belief: everyone deserves emotional support that feels personal, safe, and genuinely helpful. We&apos;re not therapists. We&apos;re your companion, your coach, your reflective thinking partner, and your daily wellness support — all in one.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { icon: Heart, title: "Empathy First", description: "Every conversation is designed with warmth, understanding, and genuine care." },
              { icon: Brain, title: "Personalization", description: "Youna learns your personality, preferences, and patterns. Real personalization." },
              { icon: Shield, title: "Safety & Privacy", description: "Crisis detection, encryption, clear boundaries. Your safety is non-negotiable." },
            ].map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <value.icon size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">What We Are — and What We&apos;re Not</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2">We Are</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start gap-2"><Sparkles size={14} className="text-indigo-500 flex-shrink-0 mt-0.5" />Your AI wellness companion</li>
                  <li className="flex items-start gap-2"><Sparkles size={14} className="text-indigo-500 flex-shrink-0 mt-0.5" />A daily emotional support presence</li>
                  <li className="flex items-start gap-2"><Sparkles size={14} className="text-indigo-500 flex-shrink-0 mt-0.5" />A reflective thinking partner</li>
                  <li className="flex items-start gap-2"><Sparkles size={14} className="text-indigo-500 flex-shrink-0 mt-0.5" />A coach for habits and goals</li>
                </ul>
              </div>
              <div className="bg-white rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2">We Are Not</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start gap-2"><Shield size={14} className="text-green-500 flex-shrink-0 mt-0.5" />A replacement for licensed therapists</li>
                  <li className="flex items-start gap-2"><Shield size={14} className="text-green-500 flex-shrink-0 mt-0.5" />A provider of medical or clinical treatment</li>
                  <li className="flex items-start gap-2"><Shield size={14} className="text-green-500 flex-shrink-0 mt-0.5" />An AI that pretends to be human</li>
                  <li className="flex items-start gap-2"><Shield size={14} className="text-green-500 flex-shrink-0 mt-0.5" />A replacement for real human connection</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">Ready to experience Youna for yourself?</p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              Start Your Journey
              <ArrowRight size={20} />
            </Link>
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
