"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, Sparkles, Brain, Heart, User, Check, ChevronRight } from "lucide-react";

interface AssessmentQuestion {
  id: string;
  question: string;
  options: { label: string; value: number; description: string }[];
}

const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: "energy",
    question: "How do you typically recharge your energy?",
    options: [
      { label: "Time alone", value: 1, description: "Solitude restores me" },
      { label: "Time with others", value: 5, description: "Socializing energizes me" },
    ],
  },
  {
    id: "structure",
    question: "How do you approach plans and schedules?",
    options: [
      { label: "I love structure", value: 1, description: "Plans give me peace" },
      { label: "I prefer flexibility", value: 5, description: "I go with the flow" },
    ],
  },
  {
    id: "emotions",
    question: "How do you relate to your emotions?",
    options: [
      { label: "I feel deeply", value: 5, description: "Emotions are vivid to me" },
      { label: "I keep emotions private", value: 1, description: "I process internally" },
    ],
  },
  {
    id: "decisions",
    question: "How do you usually make decisions?",
    options: [
      { label: "Logic and analysis", value: 1, description: "I weigh the facts" },
      { label: "Values and feelings", value: 5, description: "I follow my gut" },
    ],
  },
  {
    id: "change",
    question: "How do you handle new experiences?",
    options: [
      { label: "I love novelty", value: 5, description: "New things excite me" },
      { label: "I prefer familiarity", value: 1, description: "Known is comfortable" },
    ],
  },
  {
    id: "conflict",
    question: "When there's disagreement, I tend to...",
    options: [
      { label: "Avoid it", value: 1, description: "Harmony matters" },
      { label: "Address it directly", value: 5, description: "I speak my truth" },
    ],
  },
];

const attachmentOptions = [
  { label: "Comfortable with closeness", value: "secure", description: "I trust and connect easily" },
  { label: "I worry about abandonment", value: "anxious", description: "I sometimes fear losing connection" },
  { label: "I value independence", value: "avoidant", description: "I keep some distance" },
  { label: "I want closeness but find it hard", value: "fearful", description: "I'm cautious about getting close" },
];

export default function PersonalityAssessment() {
  const [step, setStep] = useState<"welcome" | "questions" | "attachment" | "goals" | "complete">("welcome");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [attachmentStyle, setAttachmentStyle] = useState<string>("");
  const [goals, setGoals] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questionsList = Object.entries(answers).length;

  const handleAnswer = (value: number) => {
    const currentQ = assessmentQuestions[currentQuestion];
    setAnswers(prev => ({ ...prev, [currentQ.id]: value }));
    if (currentQuestion < assessmentQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion(prev => prev + 1), 300);
    } else {
      setTimeout(() => setStep("attachment"), 300);
    }
  };

  const handleAttachmentSelect = (value: string) => {
    setAttachmentStyle(value);
    setTimeout(() => setStep("goals"), 300);
  };

  const handleSubmit = () => {
    if (!goals.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setStep("complete");
      setIsSubmitting(false);
    }, 1500);
  };

  const personalityType = (): string => {
    const avg = Object.values(answers).reduce((a, b) => a + b, 0) / Object.values(answers).length;
    if (avg >= 4) return "Explorer (High Openness, flexible, curious)";
    if (avg >= 2.5) return "Balancer (Moderate across traits, adaptable)";
    return "Anchorer (Values stability, loyal, grounded)";
  };

  const communicationStyle = (): string => {
    if (attachmentStyle === "secure") return "Warm and direct";
    if (attachmentStyle === "anxious") return "Caring and reassuring";
    if (attachmentStyle === "avoidant") return "Respectful and patient";
    return "Gentle and inviting";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>
              {step === "welcome" ? "Welcome" :
               step === "questions" ? `Question ${currentQuestion + 1} of ${assessmentQuestions.length}` :
               step === "attachment" ? "Your relationships" :
               step === "goals" ? "Your intentions" :
               "Complete"}
            </span>
            <span>{Math.round((Object.keys(answers).length + (step !== "welcome" ? 1 : 0)) / 5 * 100)}% complete</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (Object.keys(answers).length / (assessmentQuestions.length + 2)) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Welcome Step */}
        {step === "welcome" && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-fade-in text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Brain size={36} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Let's Get to Know You</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              This helps Youna understand your personality, how you relate to others, and what
              you're looking for. It takes about 3 minutes — and every answer makes Youna more
              personal to you.
            </p>
            <ul className="text-left text-sm text-gray-600 mb-8 space-y-2 mx-auto max-w-sm">
              {[
                "No right or wrong answers — just be honest",
                "Your responses are private and encrypted",
                "You can skip anything you prefer not to answer",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setStep("questions")}
              className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-md"
            >
              Get Started
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Questions Step */}
        {step === "questions" && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-fade-in">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-indigo-600 text-sm font-medium mb-2">
                <Sparkles size={16} />
                <span>Personality Assessment</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {assessmentQuestions[currentQuestion].question}
              </h3>
            </div>

            <div className="space-y-4">
              {assessmentQuestions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.value)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    answers[assessmentQuestions[currentQuestion].id] === option.value
                      ? "border-indigo-500 bg-indigo-50 shadow-md"
                      : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{option.label}</span>
                    {answers[assessmentQuestions[currentQuestion].id] === option.value && (
                      <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                </button>
              ))}
            </div>

            {currentQuestion < assessmentQuestions.length - 1 && (
              <button
                onClick={() => setCurrentQuestion(prev => prev - 1)}
                className="mt-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft size={16} />
                Go back
              </button>
            )}
          </div>
        )}

        {/* Attachment Step */}
        {step === "attachment" && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-fade-in">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-pink-600 text-sm font-medium mb-2">
                <Heart size={16} />
                <span>Relationship Style</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                How do you typically connect with others?
              </h3>
              <p className="text-gray-600 mt-2">
                This helps Youna understand how to best support you in conversations.
              </p>
            </div>

            <div className="space-y-3">
              {attachmentOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAttachmentSelect(option.value)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    attachmentStyle === option.value
                      ? "border-pink-500 bg-pink-50 shadow-md"
                      : "border-gray-200 hover:border-pink-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-900">{option.label}</span>
                      <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                    </div>
                    {attachmentStyle === option.value && (
                      <div className="w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Goals Step */}
        {step === "goals" && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-fade-in">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-teal-600 text-sm font-medium mb-2">
                <User size={16} />
                <span>Your Intentions</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                What brings you to Youna?
              </h3>
              <p className="text-gray-600 mt-2">
                What would you like to get out of this? There's no right answer — just whatever
                feels true for you.
              </p>
            </div>

            <textarea
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="For example: I've been feeling stressed lately and want someone to talk to. Or: I want to understand myself better and build better habits. Or simply: I'm curious."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-32 transition-all"
            />

            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
              <Sparkles size={14} />
              <span>This helps Youna personalize your experience from day one.</span>
            </div>
          </div>
        )}

        {/* Complete Step */}
        {step === "complete" && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center animate-fade-in">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse-glow">
              <Check size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">You're All Set!</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Youna now understands you a bit better. The more you chat, the more personal it
              becomes.
            </p>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8 text-left">
              <div className="flex items-center gap-2 text-indigo-600 text-sm font-medium mb-4">
                <Sparkles size={16} />
                <span>Your Personality Profile</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Personality Type</span>
                  <span className="font-medium text-gray-900">{personalityType()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Communication Style</span>
                  <span className="font-medium text-gray-900">{communicationStyle()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Attachment Style</span>
                  <span className="font-medium text-gray-900 capitalize">{attachmentStyle}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-md disabled:bg-gray-300"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Building your profile...
                </>
              ) : (
                <>
                  Start Chatting
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
