"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Calendar, TrendingUp, Clock, Check, Sparkles } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  content: string;
  prompt?: string;
  mood?: "happy" | "calm" | "sad" | "anxious" | "neutral";
  createdAt: string;
  updatedAt: string;
}

// ── Storage ────────────────────────────────────────────────────

const STORAGE_KEY = "youna_journal_entries";

function loadEntries(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: JournalEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

// ── Prompts ────────────────────────────────────────────────────

const JOURNAL_PROMPTS = [
  "What's something you're carrying that you'd like to put down, even for a moment?",
  "What felt heavy today? What felt light?",
  "If you could give your future self one piece of advice, what would it be?",
  "What's a small thing that brought you joy today, no matter how small?",
  "What are you avoiding thinking about — and what would happen if you faced it?",
  "Complete this sentence: Right now, what I really need is...",
  "What's a conversation you've been avoiding? What makes it hard?",
  "What does 'taking care of yourself' actually look like today?",
  "What's something you believed about yourself five years ago that you've changed your mind about?",
  "If your best friend described your day, what would they say?",
  "What's the gap between how you want to show up and how you actually showed up today?",
  "What emotion have you been feeling most often this week, and what is it trying to tell you?",
  "Write about a moment this week when you felt truly present.",
  "What's one thing you can let go of right now?",
  "Describe a boundary you wish you had set this week. What got in the way?",
];

const REFLECTIONS = [
  "Thank you for writing this down. Getting it out of your head and onto the page is itself a kind of release. You don't have to solve anything right now — just having named it matters.",
  "I can feel the honesty in what you wrote. That takes courage. Sometimes the act of writing is the work — you don't need to figure it all out on the other side.",
  "Reading this, I notice there's a lot going on beneath the surface. That's okay. You don't have to sort it all out today. Just knowing it's there is a kind of clarity.",
  "What you wrote matters — not because it's polished, but because it's true. There's something powerful about being honest with yourself, even when it's uncomfortable.",
  "I hear you. And I want to say: it's okay that this is still unresolved. Some things take time, and writing about them is one of the ways we give them room to shift.",
  "There's a lot of self-awareness in what you wrote. That's not easy to access. Give yourself credit for showing up to this — it matters more than you might think.",
];

// ── Component ──────────────────────────────────────────────────

export default function Journaling() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [mood, setMood] = useState<JournalEntry["mood"] | "">("");
  const [submitted, setSubmitted] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showReflection, setShowReflection] = useState(false);

  useEffect(() => {
    const loaded = loadEntries();
    setEntries(loaded);
  }, []);

  useEffect(() => {
    saveEntries(entries);
  }, [entries]);

  const today = getToday();
  const todayEntry = entries.find(e => e.date === today);
  const recent = [...entries].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));

  const pickRandomPrompt = useCallback(() => {
    const prompt = JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)];
    setSelectedPrompt(prompt);
    setContent("");
    setMood("");
  }, []);

  const handleSubmit = useCallback(() => {
    if (!content.trim()) return;
    const now = new Date().toISOString();
    if (editingId) {
      setEntries(prev => prev.map(e =>
        e.id === editingId
          ? { ...e, content: content.trim(), updatedAt: now }
          : e
      ));
    } else {
      const newEntry: JournalEntry = {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        date: today,
        content: content.trim(),
        prompt: selectedPrompt || undefined,
        mood: mood || undefined,
        createdAt: now,
        updatedAt: now,
      };
      setEntries(prev => {
        const filtered = prev.filter(e => e.date !== today || e.id !== editingId);
        return [...filtered, newEntry].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
      });
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
      setContent("");
      setSelectedPrompt(null);
      setMood("");
      setEditingId(null);
      setShowReflection(true);
    }, 800);
  }, [content, selectedPrompt, mood, today, editingId, entries]);

  const startEdit = (entry: JournalEntry) => {
    setEditingId(entry.id);
    setContent(entry.content);
    setSelectedPrompt(entry.prompt || null);
    setMood(entry.mood || "");
    setShowForm(true);
  };

  const deleteEntry = (id: string) => {
    if (!confirm("Delete this entry?")) return;
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const moodEmoji: Record<NonNullable<JournalEntry["mood"]>, string> = {
    happy: "😊",
    calm: "😌",
    neutral: "😐",
    sad: "😢",
    anxious: "😰",
  };

  const totalEntries = entries.length;
  const streak = (() => {
    let count = 0;
    const d = new Date();
    while (true) {
      const date = d.toISOString().split("T")[0];
      if (entries.some(e => e.date === date)) {
        count++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return count;
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>Journaling</span>
            <span>
              {totalEntries} {totalEntries === 1 ? "entry" : "entries"}
              {streak > 0 && (
                <span className="ml-2 inline-flex items-center gap-1 text-amber-600">
                  <span className="text-base">🔥</span> {streak}-day streak
                </span>
              )}
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (totalEntries / 30) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Today's entry */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-indigo-600 text-sm font-medium">
              <Sparkles size={16} />
              <span>Today's Entry</span>
            </div>
            <div className="flex items-center gap-2">
              {todayEntry && (
                <span className="text-xs text-gray-400">
                  Updated {new Date(todayEntry.updatedAt).toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={() => {
                  if (todayEntry) {
                    startEdit(todayEntry);
                  } else {
                    setShowForm(true);
                    pickRandomPrompt();
                  }
                }}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                {todayEntry ? "Edit today's entry" : "Write today"}
              </button>
            </div>
          </div>

          {showForm && (
            <div className="space-y-4 animate-fade-in">
              {selectedPrompt && (
                <div className="bg-indigo-50 rounded-xl p-4">
                  <p className="text-sm text-indigo-700 leading-relaxed">{selectedPrompt}</p>
                  <button
                    onClick={pickRandomPrompt}
                    className="mt-2 text-xs text-indigo-500 hover:text-indigo-700"
                  >
                    Try a different prompt
                  </button>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your entry
                </label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Write freely — no right or wrong way..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-40 transition-all"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <span>How are you feeling?</span>
                  <select
                    value={mood}
                    onChange={e => setMood(e.target.value as JournalEntry["mood"] | "")}
                    className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select mood...</option>
                    <option value="happy">😊 Happy</option>
                    <option value="calm">😌 Calm</option>
                    <option value="neutral">😐 Neutral</option>
                    <option value="sad">😢 Sad</option>
                    <option value="anxious">😰 Anxious</option>
                  </select>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!content.trim()}
                  className="flex-1 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {submitted ? "Saved!" : editingId ? "Update Entry" : "Save Entry"}
                </button>
              </div>
            </div>
          )}

          {!showForm && (
            <div className="text-center py-6 animate-fade-in">
              {todayEntry ? (
                <div className="text-left space-y-3">
                  {todayEntry.prompt && (
                    <div className="bg-indigo-50 rounded-xl p-3">
                      <p className="text-xs text-indigo-600 font-medium mb-1">Today's prompt</p>
                      <p className="text-sm text-indigo-800 italic">{todayEntry.prompt}</p>
                    </div>
                  )}
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{todayEntry.content}</p>
                  {todayEntry.mood && (
                    <div className="text-sm text-gray-500">
                      Feeling: <span className="font-medium">{moodEmoji[todayEntry.mood]} {todayEntry.mood}</span>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => startEdit(todayEntry)}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteEntry(todayEntry.id)}
                      className="text-sm text-red-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-gray-500 text-sm">You haven't written today yet.</p>
                  <button
                    onClick={() => {
                      setShowForm(true);
                      pickRandomPrompt();
                    }}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Write your first entry →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* AI Reflection toast */}
        {showReflection && (
          <div className="bg-white rounded-2xl p-4 shadow-md border border-indigo-100 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">
                Y
              </div>
              <div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {REFLECTIONS[Math.floor(Math.random() * REFLECTIONS.length)]}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* History */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">History</h2>
          {entries.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">No entries yet</p>
              <p className="text-xs mt-1">Start journaling to build your history</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recent.map(entry => (
                <div
                  key={entry.id}
                  className="flex items-start gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 animate-fade-in"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(entry.date).toLocaleDateString(undefined, {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <div className="flex items-center gap-2">
                        {entry.mood && (
                          <span className="text-sm">{moodEmoji[entry.mood]}</span>
                        )}
                        {entry.prompt && (
                          <span className="text-xs text-indigo-500">prompted</span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 whitespace-pre-wrap">
                      {entry.content}
                    </p>
                  </div>
                  <button
                    onClick={() => startEdit(entry)}
                    className="p-1 text-gray-400 hover:text-indigo-600 rounded transition-colors flex-shrink-0"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
