"use client";

import { useState } from "react";
import { ArrowRight, Sparkles, Heart, Brain, Shield, BarChart3, MessageSquare, User } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Personalized AI Companion",
    description:
      "An AI that genuinely learns your personality, preferences, emotional patterns, and communication style — getting better at understanding you over time.",
    color: "from-indigo-500 to-purple-600",
  },
  {
    icon: Heart,
    title: "Emotional Intelligence",
    description:
      "Active listening, empathy modeling, sentiment analysis, and reflective conversations that help you process emotions and gain clarity.",
    color: "from-pink-500 to-rose-600",
  },
  {
    icon: Brain,
    title: "Personality DNA Engine",
    description:
      "Integrated Big Five, MBTI, DISC, Attachment Theory, and Enneagram frameworks create a multidimensional portrait of who you are.",
    color: "from-violet-500 to-indigo-600",
  },
  {
    icon: BarChart3,
    title: "Mood & Wellness Tracking",
    description:
      "Track your mood daily, spot patterns, identify triggers, and watch your emotional trends evolve with beautiful visualizations.",
    color: "from-teal-500 to-emerald-600",
  },
  {
    icon: MessageSquare,
    title: "Journaling & Reflection",
    description:
      "Free-form journaling, AI-guided prompts, and conversation-based reflection — your thoughts become part of your personal growth journey.",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: Shield,
    title: "Clinical Safety First",
    description:
      "Crisis detection, risk escalation, professional referral pathways, and clear boundaries — because your safety is non-negotiable.",
    color: "from-green-500 to-teal-600",
  },
];

const stats = [
  { value: "24/7", label: "Always Available", icon: Heart },
  { value: "100%", label: "Personalized to You", icon: Brain },
  { value: "Private", label: "Your Data Stays Yours", icon: Shield },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">Y</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Youna
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="#features"
                className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors hidden sm:block"
              >
                Features
              </a>
              <a
                href="#about"
                className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors hidden sm:block"
              >
                About
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
              >
                Get Started
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/30 via-transparent to-purple-100/30" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-indigo-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full mb-8 animate-fade-in">
              <Sparkles size={16} />
              AI-Powered Emotional Wellness
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6 animate-fade-in">
              Your <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">AI Companion</span>
              <br />
              for Emotional Wellness
            </h1>

            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto animate-fade-in">
              Youna learns your personality, understands your emotions, and grows with you.
              Mood tracking, journaling, daily check-ins, and conversations that genuinely feel
              personal — because they are.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
              <a
                href="#"
                className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                Start Your Journey
                <ArrowRight size={20} />
              </a>
              <a
                href="#features"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-gray-200 text-gray-700 text-lg font-medium rounded-2xl hover:border-indigo-300 hover:text-indigo-600 transition-all"
              >
                See How It Works
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-gray-200/50 animate-fade-in">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Visual */}
          <div className="mt-20 relative max-w-5xl mx-auto animate-fade-in">
            <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-1">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 sm:p-12">
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 max-w-lg mx-auto">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl shadow-md">
                      Y
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Youna</div>
                      <div className="text-xs text-gray-500">Online • Ready to listen</div>
                    </div>
                  </div>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
                        Y
                      </div>
                      <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-3">
                        <p className="text-sm text-gray-700">
                          Hey there. I&apos;m here with you. How are you feeling today?
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 justify-end">
                      <div className="bg-indigo-50 rounded-2xl rounded-tr-sm px-4 py-3 max-w-xs">
                        <p className="text-sm text-gray-700">
                          Honestly? A bit overwhelmed. Work has been intense.
                        </p>
                      </div>
                      <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
                        U
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
                        Y
                      </div>
                      <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-3">
                        <p className="text-sm text-gray-700">
                          I hear you. That feeling of being overwhelmed — it&apos;s heavy, and it&apos;s real.
                          Want to talk through what&apos;s been piling up?
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    <button className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-md">
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need for{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Emotional Wellness
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A complete toolkit for your mental and emotional well-being, powered by AI that
              truly understands you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-gray-50 rounded-2xl p-6 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100"
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
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              How Youna Works
            </h2>
            <p className="text-xl text-gray-600">
              Designed to feel natural, personal, and genuinely supportive from day one.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Personalized Onboarding",
                description:
                  "Tell Youna about yourself — your personality, what brings you here, how you prefer to communicate. We use this to create your unique Personality DNA.",
                icon: User,
              },
              {
                step: "02",
                title: "Daily Conversations",
                description:
                  "Chat with Youna through text or voice. Every conversation builds your relationship — Youna remembers what matters and adapts to your style.",
                icon: MessageSquare,
              },
              {
                step: "03",
                title: "Grow Together",
                description:
                  "Track your mood, journal your thoughts, set goals, and build habits. Youna notices patterns and helps you become more self-aware over time.",
                icon: Heart,
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 h-full">
                  <div className="text-4xl font-bold text-indigo-100 mb-4">{item.step}</div>
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
                    <item.icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                    <ArrowRight size={16} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Built with{" "}
                <span className="bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
                  Safety
                </span>{" "}
                at Our Core
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Youna is not a therapist. We&apos;re a wellness companion — here to support your
                emotional well-being, never to replace professional care. Our safety architecture
                is designed from the ground up, not bolted on.
              </p>
              <ul className="space-y-4">
                {[
                  "Crisis detection and immediate resource provision",
                  "Clear boundaries: we&apos;re your companion, not your therapist",
                  "Your data is private, encrypted, and always under your control",
                  "Professional referral pathways when you need more support",
                  "100% transparent about being an AI — always",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl p-8 border border-rose-100">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Shield size={24} className="text-green-600" />
                  <span className="font-semibold text-gray-900">Safety First, Always</span>
                </div>
                <p className="text-gray-600 text-sm mb-6">
                  If you&apos;re ever in crisis or need professional support, Youna will recognize
                  that and help you connect with the right resources — immediately.
                </p>
                <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                  <p className="text-sm text-green-700">
                    <span className="font-medium">In an emergency:</span> If you or someone
                    you know is in immediate danger, please call your local emergency services
                    or a crisis hotline in your country.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Join thousands of people who are discovering a new way to support their emotional
            wellness. Your AI companion is waiting.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 text-lg font-semibold rounded-2xl hover:bg-indigo-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              Create Your Account
              <ArrowRight size={20} />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white text-lg font-medium rounded-2xl hover:bg-white/10 transition-all"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Y</span>
              </div>
              <span className="font-semibold text-gray-900">Youna</span>
            </div>
            <p className="text-sm text-gray-500">
              © 2026 Youna. Your wellness companion.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
