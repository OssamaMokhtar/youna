"use client";

import { useState, useRef, useEffect } from "react";
import { Send, ArrowRight, Loader2, Heart, AlertTriangle, BookOpen, Plus, Smile, Shield } from "lucide-react";
import CrisisResources from "./CrisisResources";

interface Message {
  id: string;
  text: string;
  sender: "user" | "youna";
  timestamp: Date;
  mood?: "happy" | "calm" | "sad" | "anxious" | "neutral";
}

const initialMessages = [
  {
    id: "1",
    text: "Hey there. I'm Youna. I'm here to support you — whether you want to talk through what's on your mind, track your mood, or just have someone listen. There's no right or wrong way to start. What's going on for you today?",
    sender: "youna" as const,
    timestamp: new Date(),
  },
];

const CRISIS_KEYWORDS: RegExp[] = [
  /\bsuic(id|de)\b/i,
  /\bend my life\b/i,
  /\bkill myself\b/i,
  /\bwant to die\b/i,
  /\bno reason to live\b/i,
  /\bnothing matters\b/i,
  /\bworthless\b/i,
  /\bharm myself\b/i,
  /\bcut myself\b/i,
  /\bself harm\b/i,
  /\bhurting myself\b/i,
  /\bhave a plan\b/i,
  /\bgoing to end it\b/i,
  /\bplease help me\b/i,
  /\bi can't go on\b/i,
  /\bnobody cares\b/i,
];

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

const mockResponses: Record<string, string[]> = {
  default: [
    "Thank you for sharing that with me. It takes courage to put feelings into words. Can you tell me more about what's been hardest?",
    "I hear you. That sounds really challenging. What's been going through your mind about it?",
    "It makes sense that you're feeling this way. A lot of people in your situation would feel the same. What would be most helpful right now — talking it through, or would you prefer a moment of quiet?",
    "I appreciate you trusting me with this. Let's take a breath together. What's one thing that feels manageable right now?",
    "That's a lot to carry. You don't have to carry it alone. Let's unpack it together — what part feels heaviest?",
  ],
  stressed: [
    "It sounds like you're under a lot of pressure right now. That weight you're feeling — it's real, and it matters. What's been contributing most to the stress lately?",
    "Pressure like that can really wear you down. Which part of it feels most overwhelming right now?",
    "I'm wondering — is the stress coming from a specific situation, or is it more of a constant hum in the background?",
    "Stress has a way of narrowing your vision so you only see what's in front of you. Let's step back for a moment — what would a small win look like today?",
    "You're carrying a lot, and I want to validate that. What would it mean to give yourself permission to not have everything figured out right now?",
  ],
  anxious: [
    "I hear the anxiety in your words, and that's okay. When anxiety shows up, what does it feel like in your body?",
    "Anxiety is a loud passenger. Sometimes naming it out loud takes away some of its power. What's the anxious thought that keeps repeating?",
    "That racing feeling — it's your nervous system trying to protect you, even when there's no immediate danger. Breathe with me for a second. In... and out. What's one thing in this moment that's actually safe?",
    "I notice you're carrying a lot of 'what ifs.' Would it help to write them down and look at them together — to see which ones are real and which ones are anxiety speaking?",
    "Your feelings are valid, and so is the discomfort. What if for the next five minutes, we just focused on getting through this moment — not fixing everything at once?",
  ],
  sad: [
    "I'm sorry you're feeling this heaviness. Sadness can make everything feel muted. What do you need most right now — to be heard, to be distracted, or to sit with it together?",
    "That sounds really painful. There's a difference between sadness that passes and sadness that lingers. You don't have to figure out which one it is right now — let's just sit with it.",
    "It's okay to not be okay. You don't have to perform happiness for me. What would it look like to give yourself grace today?",
    "Sometimes sadness is the body's way of saying something needs attention. I'm not here to fix it — I'm here to listen. Tell me what the sadness feels like.",
    "You're not alone in feeling this way, even if it feels like it right now. Would it help to talk about what's underneath the sadness, or would you rather just be quietly present together?",
  ],
  happy: [
    "That's wonderful — I'm genuinely glad to hear you're feeling this way. What's contributing to the good mood?",
    "I love this energy! What's going well that's making you feel this way?",
    "It's so nice to hear that. Good moments matter, even the small ones. What's one thing you're proud of this week?",
    "This is exactly what I hope for you. Keep savoring it — good feelings are worth giving attention to.",
    "That smile in your words — I can feel it. What made today different from the days that weren't like this?",
  ],
  calm: [
    "That sense of peace is precious. What's in your life right now that's bringing you this calm?",
    "I love this. Calm isn't nothing — it's a state you've earned or found. What helped you get here?",
    "This is what we're working toward. Let's hold onto this feeling. What can you do to protect this calm today?",
    "That's a beautiful place to be. What's one thing you can do to extend this calm into the rest of your day?",
    "Peace like this doesn't come by accident. You've put work into getting here, or something's aligned. What feels different today?",
  ],
  counseling: [
    "It's really healthy that you're thinking about professional support. Therapy isn't a sign of weakness — it's a sign that you're taking your wellbeing seriously.",
    "That's a great thought. A therapist can offer something I can't — licensed clinical support, structured interventions, and a safe space that's entirely about you.",
    "I'm glad you're considering this. Sometimes the hardest part is just making the first appointment. Would it help to talk through what kind of support you're looking for?",
    "That's exactly the kind of self-awareness that leads to real change. A professional can help you build on what you're already doing well.",
    "You're being really proactive about your mental health. If you're interested, I can share some information about finding the right therapist fit.",
  ],
};

function isCrisis(text: string): boolean {
  return CRISIS_KEYWORDS.some((kw) => kw.test(text));
}

function isCounselingRequest(text: string): boolean {
  return COUNSELING_INTENT.some((kw) => kw.test(text));
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showMoodCheck, setShowMoodCheck] = useState(false);
  const [showJournalPrompt, setShowJournalPrompt] = useState(false);
  const [showCrisisResources, setShowCrisisResources] = useState(false);
  const [crisisReason, setCrisisReason] = useState<"chat" | "mood_tracking" | "checkin">("chat");

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

  const getResponse = (userText: string): string => {
    const lower = userText.toLowerCase();

    if (lower.includes("thank")) {
      return "You're very welcome. I'm really glad I could be here for you. Remember — I'm always here when you need to talk, reflect, or just take a moment for yourself. What would you like to explore next?";
    }

    if (lower.includes("bye") || lower.includes("goodbye") || lower.includes("see you")) {
      return "Take care of yourself. I'm always here when you need me — whether it's tomorrow or next week. Remember: the feelings you're carrying right now don't have to be carried alone. See you soon.";
    }

    if (isCrisis(userText)) {
      setCrisisReason("chat");
      setShowCrisisResources(true);
      return "I can hear how much pain you're in, and I want you to know you're not alone in this. What you're feeling right now is incredibly heavy, and it matters that you reach out to people who can support you through it. I'm opening a list of immediate support resources for you — please take a moment to look through them. You deserve help, and there are people who want to support you.";
    }

    if (isCounselingRequest(userText)) {
      return mockResponses.counseling[Math.floor(Math.random() * mockResponses.counseling.length)];
    }

    if (lower.includes("stress") || lower.includes("overwhelm") || lower.includes("pressure") || lower.includes("burnout")) {
      return mockResponses.stressed[Math.floor(Math.random() * mockResponses.stressed.length)];
    }

    if (
      lower.includes("anxious") ||
      lower.includes("anxiety") ||
      lower.includes("worried") ||
      lower.includes("panic") ||
      lower.includes("nervous") ||
      lower.includes("scared") ||
      lower.includes("fear") ||
      lower.includes("overthink")
    ) {
      return mockResponses.anxious[Math.floor(Math.random() * mockResponses.anxious.length)];
    }

    if (
      lower.includes("sad") ||
      lower.includes("down") ||
      lower.includes("depressed") ||
      lower.includes("lonely") ||
      lower.includes("hopeless") ||
      lower.includes("cry") ||
      lower.includes("heavy")
    ) {
      return mockResponses.sad[Math.floor(Math.random() * mockResponses.sad.length)];
    }

    if (
      lower.includes("happy") ||
      lower.includes("good") ||
      lower.includes("great") ||
      lower.includes("wonderful") ||
      lower.includes("celebrate") ||
      lower.includes("proud")
    ) {
      return mockResponses.happy[Math.floor(Math.random() * mockResponses.happy.length)];
    }

    if (
      lower.includes("calm") ||
      lower.includes("peaceful") ||
      lower.includes("relaxed") ||
      lower.includes("better") ||
      lower.includes("okay")
    ) {
      return mockResponses.calm[Math.floor(Math.random() * mockResponses.calm.length)];
    }

    return mockResponses.default[Math.floor(Math.random() * mockResponses.default.length)];
  };

  const getMood = (text: string): Message["mood"] => {
    const lower = text.toLowerCase();
    if (lower.includes("happy") || lower.includes("good") || lower.includes("great") || lower.includes("love") || lower.includes("grateful") || lower.includes("better")) return "happy";
    if (lower.includes("sad") || lower.includes("down") || lower.includes("depressed") || lower.includes("cry") || lower.includes("heavy") || lower.includes("lonely")) return "sad";
    if (lower.includes("anxious") || lower.includes("anxiety") || lower.includes("worry") || lower.includes("panic") || lower.includes("nervous") || lower.includes("stress") || lower.includes("overwhelm")) return "anxious";
    if (lower.includes("calm") || lower.includes("peaceful") || lower.includes("relaxed") || lower.includes("okay")) return "calm";
    return "neutral";
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: "user",
      timestamp: new Date(),
      mood: getMood(text),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setShowMoodCheck(false);
    setShowJournalPrompt(false);

    setTimeout(() => {
      const responseText = getResponse(text);
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: "youna",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 1200);
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

      {/* Crisis Banner - visible when crisis resources open */}
      {showCrisisResources && (
        <div className="px-6 py-3 bg-red-50 border-b border-red-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-700 text-sm">
            <AlertTriangle size={16} />
            <span className="font-medium">If you are in immediate danger, please call your local emergency services.</span>
          </div>
          <button
            onClick={() => {
              setShowCrisisResources(false);
              setTimeout(() => setMessages((prev) => prev.filter((m) => m.id !== "crisis-banner")), 100);
            }}
            className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
          >
            Dismiss
            <ArrowRight size={14} />
          </button>
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
                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"})}
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
          Youna is not a replacement for professional therapy. If you're in crisis, please seek immediate help.
        </p>
      </footer>
    </div>
  );
}

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
        onClick={onClose}
        className="w-full mt-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-medium"
      >
        Start Journaling
      </button>
    </div>
  );
}
