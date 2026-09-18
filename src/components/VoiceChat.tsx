"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Send, ArrowRight, Loader2, Heart, AlertTriangle, BookOpen, Plus } from "lucide-react";

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

export default function ChatInterfaceV2() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showMoodCheck, setShowMoodCheck] = useState(false);
  const [showJournalPrompt, setShowJournalPrompt] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);
  useEffect(() => inputRef.current?.focus(), []);
  useEffect(() => setVoiceSupported(typeof window !== "undefined" && "webkitSpeechRecognition" in window), []);

  const mockResponses: Record<string, string[]> = {
    default: [
      "Thank you for sharing that with me. It takes courage to put feelings into words. Can you tell me more about what's been hardest?",
      "I hear you. That sounds really challenging. What's been going through your mind about it?",
      "It makes sense that you're feeling this way. What would be most helpful right now — talking it through, or would you prefer a moment of quiet?",
      "I appreciate you trusting me with this. Let's take a breath together. What's one thing that feels manageable right now?",
      "That's a lot to carry. You don't have to carry it alone. Let's unpack it together — what part feels heaviest?",
    ],
    stressed: [
      "It sounds like you're under a lot of pressure right now. What's been contributing most to the stress lately?",
      "Stress can feel like everything is urgent and nothing is important. Let's slow down. If you could only focus on one thing today, what would it be?",
      "I'm noticing how much you're juggling. What if we just looked at the next right step?",
    ],
    sad: [
      "I'm sorry you're feeling this heaviness. Sadness can be so isolating. I'm here with you in it.",
      "It's okay to not be okay. You don't need to rush past this feeling. Would it help to just sit with it for a moment?",
      "Thank you for being honest about this. What's one small thing that might bring a moment of comfort?",
    ],
    anxious: [
      "I can feel the anxiety in your words. Let's take a moment to ground ourselves. Can you feel your feet on the floor?",
      "Anxiety often lies to us — it tells us things are worse than they are. What's the truth you know deep down?",
      "You're not alone in feeling this way. What's the specific thing your anxiety is telling you right now? Sometimes naming it takes away some of its power.",
    ],
    happy: [
      "I love seeing this. Your happiness matters — really. What's behind this good feeling? Let's savor it together.",
      "This is wonderful. Moments like this are worth holding onto. What made today feel good?",
      "It's so clear that you're feeling light right now. These moments remind us that things can be good. What would you want to remember about today?",
    ],
  };

  const getResponse = (text: string): string => {
    const lower = text.toLowerCase();
    if (lower.includes("stress") || lower.includes("overwhelm") || lower.includes("busy") || lower.includes("pressure"))
      return mockResponses.stressed[Math.floor(Math.random() * mockResponses.stressed.length)];
    if (lower.includes("sad") || lower.includes("down") || lower.includes("depressed") || lower.includes("cry") || lower.includes("heavy"))
      return mockResponses.sad[Math.floor(Math.random() * mockResponses.sad.length)];
    if (lower.includes("anxious") || lower.includes("anxiety") || lower.includes("worry") || lower.includes("panic") || lower.includes("nervous"))
      return mockResponses.anxious[Math.floor(Math.random() * mockResponses.anxious.length)];
    if (lower.includes("happy") || lower.includes("good") || lower.includes("great") || lower.includes("better") || lower.includes("love") || lower.includes("grateful"))
      return mockResponses.happy[Math.floor(Math.random() * mockResponses.happy.length)];
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

  const speakResponse = useCallback((text: string) => {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, []);

  const startVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) return;
    const sr = new (window as any).webkitSpeechRecognition();
    sr.continuous = false;
    sr.interimResults = false;
    sr.lang = "en-US";
    sr.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(prev => prev + (prev ? " " : "") + transcript);
    };
    sr.onerror = () => setIsListening(false);
    sr.onend = () => setIsListening(false);
    setIsListening(true);
    try { sr.start(); } catch {}
  };

  const stopVoiceInput = () => setIsListening(false);

  const handleSend = (text: string = input.trim()) => {
    if (!text.trim()) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
      mood: getMood(text),
    };
    setMessages(prev => [...prev, userMessage]);
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
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
      setShowMoodCheck(true);
      speakResponse(responseText);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">Y</div>
            <div>
              <h1 className="font-semibold text-gray-900">Youna</h1>
              <p className="text-xs text-gray-500">Your wellness companion</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowJournalPrompt(true)} className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Journal"><BookOpen size={20} /></button>
            <button onClick={() => setShowMoodCheck(true)} className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Check in"><Heart size={20} /></button>
          </div>
        </div>
      </header>

      {isListening && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2">
          <div className="max-w-4xl mx-auto flex items-center gap-2 text-red-600 text-sm">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" /> Listening... speak now
            <button onClick={stopVoiceInput} className="ml-2 text-red-500 hover:text-red-700 font-medium">Stop</button>
          </div>
        </div>
      )}

      {messages.length <= 1 && (
        <div className="px-4 py-3 border-b border-gray-100 bg-white/50">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs text-gray-500 mb-2 font-medium">Quick start:</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "💬 Talk about my mind", action: () => handleSend("I want to talk about something that's been on my mind lately.") },
                { label: "😊 How am I feeling?", action: () => setShowMoodCheck(true) },
                { label: "📝 Journal prompt", action: () => setShowJournalPrompt(true) },
                { label: "🧘 Need to calm down", action: () => handleSend("I'm feeling anxious and need help calming down.") },
              ].map((a, i) => (
                <button key={i} onClick={a.action} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-sm rounded-lg hover:bg-indigo-100 transition-colors">{a.label}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
              <div className={`max-w-xs sm:max-w-md lg:max-w-lg ${m.sender === "user" ? "bg-indigo-600 text-white rounded-2xl rounded-tr-sm" : "bg-white text-gray-800 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100"} px-4 py-3 ${isSpeaking && m.sender === "youna" ? "ring-2 ring-indigo-400 ring-offset-2" : ""}`}>
                <p className="text-sm leading-relaxed">{m.text}</p>
                {m.sender === "user" && m.mood && (
                  <div className="mt-1 text-xs opacity-70">{m.mood === "happy" && "😊"} {m.mood === "calm" && "😌"} {m.mood === "neutral" && "😐"} {m.mood === "sad" && "😢"} {m.mood === "anxious" && "😰"}</div>
                )}
                <p className={`text-xs mt-1 ${m.sender === "user" ? "text-indigo-200" : "text-gray-400"} text-right`}>{m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
                <div className="flex items-center gap-1">
                  <Loader2 size={14} className="text-gray-400 animate-spin" />
                  <Loader2 size={14} className="text-gray-400 animate-spin" style={{ animationDelay: "100ms" }} />
                  <Loader2 size={14} className="text-gray-400 animate-spin" style={{ animationDelay: "200ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {showMoodCheck && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">How are you feeling?</h3>
              <button onClick={() => setShowMoodCheck(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { emoji: "😊", label: "Good", value: "happy" as const },
                { emoji: "😌", label: "Calm", value: "calm" as const },
                { emoji: "😐", label: "Okay", value: "neutral" as const },
                { emoji: "😢", label: "Down", value: "sad" as const },
                { emoji: "😰", label: "Anxious", value: "anxious" as const },
              ].map(m => (
                <button key={m.value} onClick={() => { handleSend(`I'm feeling ${m.label.toLowerCase()}.`); setShowMoodCheck(false); }} className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                  <span className="text-3xl">{m.emoji}</span>
                  <span className="text-sm font-medium text-gray-700">{m.label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setShowMoodCheck(false)} className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">Skip for now</button>
          </div>
        </div>
      )}

      {showJournalPrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Journal Reflection</h3>
              <button onClick={() => setShowJournalPrompt(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="bg-indigo-50 rounded-xl p-4 mb-6"><p className="text-gray-700 text-sm leading-relaxed">What's something you're carrying that you'd like to put down, even for a moment?</p></div>
            <div className="flex gap-3">
              <button onClick={() => { setShowJournalPrompt(false); handleSend("I wrote in my journal. Here's what came up:"); }} className="flex-1 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors">Share with Youna</button>
              <button onClick={() => setShowJournalPrompt(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">Keep it private</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border-t border-gray-100 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-3">
            <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-2 border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
              <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Type your message... (press Enter to send)" className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 text-sm focus:outline-none py-1" disabled={isTyping} />
              {voiceSupported && (
                <button onClick={isListening ? stopVoiceInput : startVoiceInput} disabled={isTyping} className={`p-2 rounded-full transition-colors ${isListening ? "text-red-500 bg-red-50 animate-pulse" : "text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"}`} title={isListening ? "Stop recording" : "Voice input"}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7v3a7 7 0 01-7-7V8a7 7 0 017-7h3a7 7 0 017 7v3a7 7 0 017 7z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                    {isListening && (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2" />)}
                  </svg>
                </button>
              )}
            </div>
            <button onClick={() => handleSend()} disabled={!input.trim() || isTyping} className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-md disabled:shadow-none">
              {isTyping ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-400">Youna is your wellness companion, not a therapist. If you're in crisis, please reach out to a professional or call your local emergency services.</p>
            {voiceSupported && <p className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">🎤 Click mic to speak</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
