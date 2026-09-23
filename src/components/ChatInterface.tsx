"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Send, ArrowRight, Loader2, Heart, AlertTriangle, BookOpen, Plus, Smile, Shield, MessageSquare, Sparkles, ChevronRight } from "lucide-react";
import CrisisResources from "./CrisisResources";
import { isCrisisText, CRISIS_REPLY } from "@/lib/safety";
import { formatDisclaimer } from "@/lib/prompts";
import { saveMoodCheckin, saveJournalEntry, type Mood } from "@/lib/insights";
import CoachingQuickPickModal from "@/components/CoachingQuickPickModal";

// ── Types ──────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  text: string;
  sender: "user" | "youna";
  timestamp: Date;
  mood?: "happy" | "calm" | "sad" | "anxious" | "neutral";
}

interface ChatApiResponse {
  text: string;
  provider?: string;
  model?: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
    estimatedCost: number;
  };
  latencyMs?: number;
  crisis?: boolean;
  counseling?: boolean;
  error?: boolean;
}

// ── Crisis keyword detection (client-side first gate) ──────────────────

// Crisis patterns live in src/lib/safety.ts (shared with the API route).

const COUNSELING_INTENT: RegExp[] = [
  /\btherap(y|ist)\b/i,
  /\bcounsel(or|ing)\b/i,
  /\bmental health professional\b/i,
  /\bjoin a support group\b/i,
  /\bneed medication\b/i,
  /\bpsychiatric\b/i,
  /\bget professional help\b/i,
  /\bsomeone to talk to\b/i,
];

const COACHING_INTENT: RegExp[] = [
  /\bhelp me (with|through|improve|work on|change|stop|start)\b/i,
  /\bi want to (work on|change|improve|stop|start|figure out|understand)\b/i,
  /\bi need to (work on|change|improve|stop|start)\b/i,
  /\bi'm struggling (with|to|in)\b/i,
  /\bhow do i (deal with|handle|stop|start|improve|work on)\b/i,
  /\bwhat should i (do|work on|focus on|start)\b/i,
  /\bcoach me\b/i,
  /\bmentor me\b/i,
  /\bi want a (coach|mentor|guide|program)\b/i,
  /\bcbt\b/i,
  /\bdbt\b/i,
  /\bact\b/i,
  /\bmindfulness\b/i,
  /\bguided (exercise|session|meditation|program)\b/i,
  /\bi want to work on\b/i,
  /\bi want to improve\b/i,
  /\bi want to stop\b/i,
  /\bi want to start\b/i,
];

const MAX_HISTORY_MESSAGES = 12;

function isCrisis(text: string): boolean {
  return isCrisisText(text);
}

function isCounselingRequest(text: string): boolean {
  return COUNSELING_INTENT.some((kw) => kw.test(text));
}

// ── Personality context loader ───────────────────────────────────────────

interface PersonalityContext {
  bigFive?: {
    openness?: number;
    conscientiousness?: number;
    extraversion?: number;
    agreeableness?: number;
    neuroticism?: number;
  };
  attachmentStyle?: string;
  loveLanguages?: string[];
  enneagramType?: number;
  discStyle?: string;
  hexaco?: Record<string, number>;
  goals?: string;
  assessmentComplete?: boolean;
}

function loadPersonality(): PersonalityContext | null {
  try {
    const stored = localStorage.getItem("youna-personality");
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed as PersonalityContext;
  } catch {
    return null;
  }
}

function buildHistoryForApi(messages: Message[], maxLen: number): Array<{ role: "user" | "assistant"; content: string }> {
  const recent = messages.slice(-maxLen);
  return recent
    .filter((m) => m.sender === "user" || m.sender === "youna")
    .map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
    }));
}

async function callChatApi(
  message: string,
  history: Array<{ role: "user" | "assistant"; content: string }>,
  personality: PersonalityContext | null,
  mode: "default" | "crisis" | "counseling"
): Promise<ChatApiResponse> {
  try {
    const body = {
      message,
      history,
      personality: personality ?? undefined,
      mode,
    };

    const response = await fetch("/api/chat/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      console.error("[Youna Chat] API returned", response.status, errorBody.slice(0, 200));
      return {
        text: getFallbackResponse(mode),
        error: true,
      };
    }

    const data = await response.json();
    return {
      text: data.text ?? getFallbackResponse(mode),
      provider: data.provider,
      model: data.model,
      usage: data.usage ? {
        inputTokens: data.usage.inputTokens,
        outputTokens: data.usage.outputTokens,
        estimatedCost: data.usage.estimatedCost,
      } : undefined,
      latencyMs: data.latencyMs,
      crisis: data.crisis === true,
      counseling: data.counseling === true,
    };
  } catch (err) {
    console.error("[Youna Chat] API call failed:", (err as Error).message);
    return {
      text: getFallbackResponse(mode),
      error: true,
    };
  }
}

function getFallbackResponse(mode: "default" | "crisis" | "counseling"): string {
  if (mode === "crisis") {
    return "I can hear how much pain you're in, and I'm really glad you're here. You don't have to go through this alone. Please reach out to a crisis counselor — trained people are available 24/7 who can help you through this moment. You matter, and there are people who want to support you.";
  }
  if (mode === "counseling") {
    return "That's a really healthy thing to be thinking about. A therapist can offer something I can't — licensed clinical support, structured interventions, and a space that's entirely about you. I'm glad you're considering this.";
  }
  return "Thank you for sharing that with me. It takes courage to put feelings into words. What's been going through your mind about it?";
}

// ── Initial message ───────────────────────────────────────────────────────

const initialMessages: Message[] = [
  {
    id: "1",
    text: "Hey there. I'm Youna. I'm here to support you — whether you want to talk through what's on your mind, track your mood, or just have someone listen. There's no right or wrong way to start. What's going on for you today?",
    sender: "youna" as const,
    timestamp: new Date(),
  },
];

// ── Component ─────────────────────────────────────────────────────────────

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [apiLatency, setApiLatency] = useState<number | null>(null);
  const [lastProvider, setLastProvider] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showMoodCheck, setShowMoodCheck] = useState(false);
  const [showJournalPrompt, setShowJournalPrompt] = useState(false);
  const [showCrisisResources, setShowCrisisResources] = useState(false);
  const [crisisReason, setCrisisReason] = useState<"chat" | "mood_tracking" | "checkin">("chat");
  const [showCoachingSuggestion, setShowCoachingSuggestion] = useState(false);
  const [showQuickPick, setShowQuickPick] = useState(false);
  const [showJournalSavePrompt, setShowJournalSavePrompt] = useState(false);
  const [pendingJournalContent, setPendingJournalContent] = useState("");
  const [pendingJournalMood, setPendingJournalMood] = useState<Mood>("neutral");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [input]);

  const getDetectedMode = (text: string): "default" | "crisis" | "counseling" => {
    if (isCrisis(text)) return "crisis";
    if (isCounselingRequest(text)) return "counseling";
    return "default";
  };

  const isCoachingIntent = (text: string): boolean => {
    return COACHING_INTENT.some((kw) => kw.test(text));
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    const detectedMode = getDetectedMode(text);

    // Crisis: show resources immediately, don't send to API
    if (detectedMode === "crisis") {
      setCrisisReason("chat");
      setShowCrisisResources(true);
      const crisisMessage: Message = {
        id: Date.now().toString(),
        text,
        sender: "user",
        timestamp: new Date(),
        mood: "sad",
      };
      setMessages((prev) => [...prev, crisisMessage]);

      // Auto-log mood for crisis messages
      try {
        saveMoodCheckin({ mood: "sad", source: "chat" });
      } catch {}

      const crisisResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: CRISIS_REPLY,
        sender: "youna",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, crisisResponse]);
      setInput("");
      scrollToBottom();
      return;
    }

    // Build user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
      mood: getMood(text),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Auto-log mood from chat (silent, no UI interruption)
    try {
      saveMoodCheckin({ mood: userMessage.mood as Mood, source: "chat" });
    } catch {
      // localStorage may be unavailable (private mode, quota exceeded) — silent fail
    }

    // Show coaching suggestion if message expresses coaching intent
    if (isCoachingIntent(text) && !isCrisis(text)) {
      setShowCoachingSuggestion(true);
      setTimeout(() => setShowCoachingSuggestion(false), 12000);
    }

    setInput("");
    setIsTyping(true);
    setApiLatency(null);
    setShowMoodCheck(false);
    setShowJournalPrompt(false);

    // Load personality context
    const personality = loadPersonality();

    // Build history (last N messages)
    const history = buildHistoryForApi([...messages, userMessage], MAX_HISTORY_MESSAGES);

    // Call API
    const startTime = Date.now();
    const apiResult = await callChatApi(text, history, personality, detectedMode);
    const latencyMs = Date.now() - startTime;

    const response: Message = {
      id: (Date.now() + 1).toString(),
      text: apiResult.text,
      sender: "youna",
      timestamp: new Date(),
      mood: getMood(apiResult.text),
    };

    setMessages((prev) => [...prev, response]);
    setIsTyping(false);
    setApiLatency(latencyMs);
    setLastProvider(apiResult.provider ?? null);
    scrollToBottom();
  };

  const getMood = (text: string): Message["mood"] => {
    const lower = text.toLowerCase();
    if (lower.includes("happy") || lower.includes("good") || lower.includes("great") || lower.includes("love") || lower.includes("grateful") || lower.includes("better")) return "happy";
    if (lower.includes("sad") || lower.includes("down") || lower.includes("depressed") || lower.includes("cry") || lower.includes("heavy") || lower.includes("lonely")) return "sad";
    if (lower.includes("anxious") || lower.includes("anxiety") || lower.includes("worry") || lower.includes("panic") || lower.includes("nervous") || lower.includes("stress") || lower.includes("overwhelm")) return "anxious";
    if (lower.includes("calm") || lower.includes("peaceful") || lower.includes("relaxed") || lower.includes("okay")) return "calm";
    return "neutral";
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
            <Heart size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Youna</h1>
            <p className="text-xs text-gray-500">AI Wellness Companion</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowJournalPrompt(!showJournalPrompt)}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Journal"
          >
            <BookOpen size={20} />
          </button>
          <button
            onClick={() => setShowMoodCheck(!showMoodCheck)}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Check in"
          >
            <Heart size={20} />
          </button>
          <button
            onClick={() => {
              setCrisisReason("chat");
              setShowCrisisResources(true);
            }}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Get support"
          >
            <Shield size={18} />
          </button>
        </div>
      </header>

      {/* LLM status badge */}
      {lastProvider && (
        <div className="px-4 py-1.5 bg-white/80 backdrop-blur-sm border-b border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            {isTyping ? (
              <>
                <Loader2 size={12} className="animate-spin text-indigo-500" />
                <span>Thinking</span>
              </>
            ) : (
              <>
                <MessageSquare size={12} className="text-green-500" />
                <span>Powered by {lastProvider}</span>
                {apiLatency !== null && (
                  <span className="text-gray-400">· {apiLatency}ms</span>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Crisis Banner */}
      {showCrisisResources && (
        <div className="px-6 py-3 bg-red-50 border-b border-red-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-700 text-sm">
            <AlertTriangle size={16} />
            <span className="font-medium">If you are in immediate danger, please call your local emergency services.</span>
          </div>
          <button
            onClick={() => {
              setShowCrisisResources(false);
            }}
            className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
          >
            Dismiss
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Coaching suggestion banner */}
      {showCoachingSuggestion && (
        <div className="px-6 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
              <Sparkles size={14} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-indigo-700">Want to work on this together?</p>
              <p className="text-xs text-indigo-500">Try a structured coaching program — CBT, mindfulness, or more.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowCoachingSuggestion(false);
                setShowQuickPick(true);
              }}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              Choose a program
              <ChevronRight size={12} />
            </button>
            <button
              onClick={() => setShowCoachingSuggestion(false)}
              className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "youna" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.sender === "youna"
                  ? "bg-white border border-gray-200 text-gray-800 rounded-tl-md shadow-sm"
                  : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-tr-md shadow-md"
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              {msg.sender === "youna" && (
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-400">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  {msg.mood && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white/90">
                      {msg.mood}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      {/* Crisis Resources Modal */}
      {showCrisisResources && (
        <CrisisResources
          onClose={() => setShowCrisisResources(false)}
          reason={crisisReason}
        />
      )}

      {/* Mood Check Modal */}
      {showMoodCheck && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">How are you feeling?</h2>
            <p className="text-sm text-gray-500 mb-6">Take a moment to check in with yourself.</p>
            <MoodCheckModal onClose={() => setShowMoodCheck(false)} />
          </div>
        </div>
      )}

      {/* Journal Prompt Modal */}
      {showJournalPrompt && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Journal Prompt</h2>
              <button
                onClick={() => setShowJournalPrompt(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <ArrowRight size={20} className="rotate-180" />
              </button>
            </div>
            <JournalPromptModal onClose={() => setShowJournalPrompt(false)} />
          </div>
        </div>
      )}

      {/* Coaching Quick Pick Modal */}
      {showQuickPick && (
        <CoachingQuickPickModal onClose={() => setShowQuickPick(false)} />
      )}

      {/* Input Area */}
      <footer className="px-4 py-4 bg-white/80 backdrop-blur-sm border-t border-gray-100">
        <div className="flex gap-3">
          <button className="p-3 text-gray-400 hover:text-indigo-500 transition-colors" title="Add emotion">
            <Smile size={22} />
          </button>
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type your message..."
              rows={1}
              className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-gray-400 transition-all max-h-32"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isTyping ? <Loader2 size={22} className="animate-spin" /> : <Send size={22} />}
          </button>
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">
          {formatDisclaimer()}
        </p>
      </footer>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function MoodCheckModal({ onClose }: { onClose: () => void }) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const moods = [
    { value: "great", emoji: "😄", label: "Great" },
    { value: "good", emoji: "😊", label: "Good" },
    { value: "okay", emoji: "😐", label: "Okay" },
    { value: "low", emoji: "😔", label: "Low" },
    { value: "struggling", emoji: "😢", label: "Struggling" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {moods.map((mood) => (
          <button
            key={mood.value}
            onClick={() => setSelectedMood(mood.value)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
              selectedMood === mood.value
                ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
            }`}
          >
            <span className="text-3xl">{mood.emoji}</span>
            <span className="text-sm font-medium">{mood.label}</span>
          </button>
        ))}
      </div>
      <div className="flex gap-3 justify-end">
        <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
          Cancel
        </button>
        <button
          onClick={() => {
            if (selectedMood) {
              const moodMap: Record<string, Mood> = {
                "great": "happy",
                "good": "happy",
                "okay": "neutral",
                "low": "sad",
                "struggling": "sad",
              };
              try {
                saveMoodCheckin({ mood: moodMap[selectedMood] ?? "neutral", source: "checkin" });
              } catch {
                // silent fail
              }
              onClose();
            }
          }}
          disabled={!selectedMood}
          className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Done
        </button>
      </div>
    </div>
  );
}

function JournalPromptModal({ onClose }: { onClose: () => void }) {
  const [promptIndex, setPromptIndex] = useState(0);
  const [journalContent, setJournalContent] = useState("");
  const [journalMood, setJournalMood] = useState<Mood>("neutral");
  const [saving, setSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const prompts = [
    "What's one thing you're grateful for today?",
    "What's been on your mind lately that you haven't shared with anyone?",
    "Write about a moment today when you felt truly present.",
    "What would you tell your younger self about how to handle today?",
    "What does your ideal tomorrow look like? Describe it in detail.",
    "What emotion are you avoiding right now? Let's give it space.",
    "Write a letter to yourself — what would you say if no one else would ever read it?",
    "What's one small thing you can do today to take care of yourself?",
    "Describe a relationship that has shaped who you are.",
    "What does 'healing' mean to you, personally?",
  ];

  const handleSave = async () => {
    if (!journalContent.trim()) return;
    setSaving(true);
    try {
      saveJournalEntry({
        title: prompts[promptIndex].slice(0, 50),
        content: journalContent.trim(),
        mood: journalMood,
      });
    } catch {
      // silent fail
    } finally {
      setSaving(false);
    }
    onClose();
  };

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <span className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
          Y
        </span>
        <span>Youna</span>
      </div>
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
        <p className="text-gray-700 italic">"{prompts[promptIndex]}"</p>
      </div>

      {/* Journal text input */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Your entry</label>
        <textarea
          ref={textareaRef}
          value={journalContent}
          onChange={(e) => setJournalContent(e.target.value)}
          placeholder="Write your thoughts here…"
          rows={4}
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-gray-400 transition-all"
        />
      </div>

      {/* Mood selector */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">How are you feeling about this?</label>
        <div className="grid grid-cols-5 gap-2">
          {(["happy", "calm", "neutral", "sad", "anxious"] as Mood[]).map((mood) => (
            <button
              key={mood}
              onClick={() => setJournalMood(mood)}
              className={`flex flex-col items-center p-2 rounded-lg border-2 text-xs transition-all ${
                journalMood === mood
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300"
              }`}
            >
              <span className="text-base">
                {mood === "happy" ? "😊" : mood === "calm" ? "😌" : mood === "neutral" ? "😐" : mood === "sad" ? "😔" : "😰"}
              </span>
              <span className="capitalize">{mood}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setPromptIndex((prev) => (prev - 1 + prompts.length) % prompts.length)}
          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Previous
        </button>
        <span className="text-xs text-gray-400">{promptIndex + 1} / {prompts.length}</span>
        <button
          onClick={() => setPromptIndex((prev) => (prev + 1) % prompts.length)}
          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Next
        </button>
      </div>

      <button
        onClick={handleSave}
        disabled={!journalContent.trim() || saving}
        className="w-full mt-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? "Saving…" : "Save Entry"}
      </button>
    </div>
  );
}
