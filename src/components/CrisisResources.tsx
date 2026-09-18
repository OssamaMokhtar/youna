"use client";

import { X } from "lucide-react";

interface CrisisResourcesProps {
  onClose: () => void;
  reason: "mood_tracking" | "chat" | "checkin";
}

// Crisis resources — organized by severity level
// In production, these would be localized per user region

const RESOURCES = {
  immediate: [
    {
      icon: "🚨",
      title: "Immediate crisis support",
      items: [
        {
          title: "Call emergency services",
          detail: "If you or someone else is in immediate danger, call your local emergency number right now.",
          note: "Available 24/7 in every country",
        },
        {
          title: "Crisis Text Line",
          detail: "Text HOME to 741741 (US/Canada) — free, 24/7 crisis counseling via text.",
          note: "Also available in UK (text SHOUT to 85258) and Ireland (text HELLO to 50808)",
        },
      ],
    },
  ],
  urgent: [
    {
      icon: "📞",
      title: "Talk to someone now",
      items: [
        {
          title: "988 Suicide & Crisis Lifeline (US)",
          detail: "Call or text 988 — free, confidential support 24/7 for anyone in crisis.",
          note: "Press 1 for Veterans, Press 2 for Spanish, Press 3 for LGBTQ+ youth",
        },
        {
          title: "Samaritans (UK & Ireland)",
          detail: "Call 116 123 — free, 24/7 emotional support. Email: jo@samaritans.org",
          note: "Available 24/7, completely confidential",
        },
        {
          title: "Lifeline (Australia)",
          detail: "Call 13 11 14 — 24/7 crisis support and suicide prevention.",
          note: "Text 0477 13 11 14 available 24/7",
        },
        {
          title: "Talk Suicide Canada",
          detail: "Call 1-833-456-4566 (24/7) or text 45645 (4pm-12am ET).",
          note: "Toll-free, confidential",
        },
      ],
    },
  ],
  support: [
    {
      icon: "🌿",
      title: "Ongoing support resources",
      items: [
        {
          title: "Psychology Today Therapist Finder",
          detail: "psychologytoday.com — search for licensed therapists in your area by specialty, insurance, and approach.",
          note: "Free directory. Many offer sliding-scale fees.",
        },
        {
          title: "Open Path Collective",
          detail: "openpathcollective.org — affordable therapy ($40-70/session) for people without insurance or with high deductibles.",
          note: "One-time membership fee, then low-cost sessions",
        },
        {
          title: "NAMI HelpLine (US)",
          detail: "Call 1-800-950-6264 (M-F 10am-10pm ET) or text HELPLINE to 62640.",
          note: "Free mental health information, referrals, and support",
        },
      ],
    },
  ],
};

const CLOSING_MESSAGES = [
  "You reached out — that matters. Keep going.",
  "You're not alone in this, even when it feels that way.",
  "Asking for support is one of the strongest things you can do.",
  "This moment will pass. You will not always feel this way.",
  "You deserve support. Don't wait to get it.",
];

export default function CrisisResources({ onClose, reason }: CrisisResourcesProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center text-white shadow-md">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.572-1.667 1.78-3L13.78 4c-1.145-1.333-2.776-1.333-3.922 0L3.78 16c-.793 1.333.226 3 1.78 3z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Support Resources</h2>
              <p className="text-sm text-gray-500">
                Help is available right now
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Immediate help — always shown first */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🚨</span>
            <h3 className="font-bold text-red-800">If you're in immediate danger</h3>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-red-700 font-medium">
              Call your local emergency services right now.
            </p>
            <p className="text-red-600">
              You don't have to wait. If the danger is immediate, emergency services can help
              right now — faster than any online resource.
            </p>
          </div>
        </div>

        {/* Crisis text lines */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">💬</span>
            <h3 className="font-bold text-amber-800">Crisis Text Lines</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="bg-white rounded-xl p-3 border border-amber-100">
              <div className="font-medium text-amber-900 mb-1">US / Canada</div>
              <div className="text-lg font-bold text-indigo-600">Text HOME to 741741</div>
              <div className="text-amber-700 text-xs">Free, 24/7 crisis counseling via text</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-amber-100 mt-2">
              <div className="font-medium text-amber-900 mb-1">UK</div>
              <div className="text-lg font-bold text-indigo-600">Text SHOUT to 85258</div>
              <div className="text-amber-700 text-xs">Free, 24/7 crisis text service</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-amber-100 mt-2">
              <div className="font-medium text-amber-900 mb-1">Ireland</div>
              <div className="text-lg font-bold text-indigo-600">Text HELLO to 50808</div>
              <div className="text-amber-700 text-xs">Free, 24/7 crisis text service</div>
            </div>
          </div>
        </div>

        {/* Phone hotlines */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📞</span>
            <h3 className="font-bold text-blue-800">Phone Hotlines</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="bg-white rounded-xl p-3 border border-blue-100">
              <div className="font-medium text-blue-900 mb-1">US — 988 Suicide & Crisis Lifeline</div>
              <div className="text-lg font-bold text-indigo-600">Call or text 988</div>
              <div className="text-blue-700 text-xs">
                24/7 · Press 1 for Veterans · Press 2 for Spanish
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-blue-100 mt-2">
              <div className="font-medium text-blue-900 mb-1">UK — Samaritans</div>
              <div className="text-lg font-bold text-indigo-600">Call 116 123</div>
              <div className="text-blue-700 text-xs">
                Free, 24/7, completely confidential
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-blue-100 mt-2">
              <div className="font-medium text-blue-900 mb-1">Australia — Lifeline</div>
              <div className="text-lg font-bold text-indigo-600">Call 13 11 14</div>
              <div className="text-blue-700 text-xs">
                24/7 crisis support · Text 0477 13 11 14
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-blue-100 mt-2">
              <div className="font-medium text-blue-900 mb-1">Canada — Talk Suicide</div>
              <div className="text-lg font-bold text-indigo-600">Call 1-833-456-4566</div>
              <div className="text-blue-700 text-xs">
                24/7 · Text 45645 (4pm-12am ET)
              </div>
            </div>
          </div>
        </div>

        {/* Ongoing support */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🌿</span>
            <h3 className="font-bold text-green-800">Finding Ongoing Support</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="bg-white rounded-xl p-3 border border-green-100">
              <div className="font-medium text-green-900 mb-1">Psychology Today — Therapist Finder</div>
              <div className="text-green-700">
                psychologytoday.com — find licensed therapists by location, specialty, insurance.
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Free directory. Many offer sliding-scale fees.
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-green-100 mt-2">
              <div className="font-medium text-green-900 mb-1">Open Path Collective</div>
              <div className="text-green-700">
                openpathcollective.org — affordable therapy ($40-70/session) for people without
                insurance.
              </div>
              <div className="text-xs text-gray-500 mt-1">
                One-time membership fee, then low-cost sessions.
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-green-100 mt-2">
              <div className="font-medium text-green-900 mb-1">NAMI HelpLine (US)</div>
              <div className="text-lg font-bold text-indigo-600">Call 1-800-950-6264</div>
              <div className="text-green-700 text-xs">
                M-F 10am-10pm ET · Text HELPLINE to 62640
              </div>
            </div>
          </div>
        </div>

        {/* Empathy close */}
        <div className="text-center mt-6 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 italic">
            {CLOSING_MESSAGES[Math.floor(Math.random() * CLOSING_MESSAGES.length)]}
          </p>
          <button
            onClick={onClose}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
