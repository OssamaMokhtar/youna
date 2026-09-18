"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar, TrendingUp, Clock, Check, Sparkles, AlertTriangle } from "lucide-react";
import CrisisResources from "./CrisisResources";

// ── Types ──────────────────────────────────────────────────────

export interface MoodEntry {
  id: string;
  date: string;
  mood: "happy" | "calm" | "sad" | "anxious" | "neutral";
  note?: string;
  createdAt: string;
}

// ── Constants ───────────────────────────────────────────────────

const MOOD_EMOJI: Record<MoodEntry["mood"], string> = {
  happy: "😊",
  calm: "😌",
  neutral: "😐",
  sad: "😢",
  anxious: "😰",
};

const MOOD_COLOR: Record<MoodEntry["mood"], string> = {
  happy: "bg-green-400 text-white",
  calm: "bg-blue-400 text-white",
  neutral: "bg-gray-400 text-white",
  sad: "bg-purple-400 text-white",
  anxious: "bg-amber-400 text-white",
};

const STORAGE_KEY = "youna_mood_entries";

// ── Storage ────────────────────────────────────────────────────

function loadEntries(): MoodEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: MoodEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

// ── Component ──────────────────────────────────────────────────

export default function MoodTracking() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<MoodEntry["mood"] | "">("");
  const [note, setNote] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showChart, setShowChart] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [todayEntry, setTodayEntry] = useState<MoodEntry | null>(null);
  const [showCrisisDialog, setShowCrisisDialog] = useState(false);
  const [lastTriggeredDate, setLastTriggeredDate] = useState<string | null>(null);

  useEffect(() => {
    const loaded = loadEntries();
    setEntries(loaded);
    const today = getToday();
    const existing = loaded.find((e) => e.date === today);
    if (existing) setTodayEntry(existing);
  }, []);

  useEffect(() => {
    saveEntries(entries);
  }, [entries]);

  const today = getToday();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split("T")[0];

  const weekEntries = entries
    .filter((e) => e.date >= weekAgoStr && e.date <= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  const moodScore = (mood: MoodEntry["mood"]): number => {
    const map: Record<MoodEntry["mood"], number> = {
      happy: 5,
      calm: 4,
      neutral: 3,
      sad: 2,
      anxious: 1,
    };
    return map[mood];
  };

  const handleSubmit = useCallback(() => {
    if (!selectedMood) return;

    const recentEntries = entries.filter((e) => e.date >= weekAgoStr);
    const avgMood =
      recentEntries.length > 0
        ? recentEntries.reduce((sum, e) => sum + moodScore(e.mood), 0) /
          recentEntries.length
        : 0;

    if (avgMood <= 1.5 && moodScore(selectedMood) <= 2 && lastTriggeredDate !== today) {
      setShowCrisisDialog(true);
      setLastTriggeredDate(today);
    }

    const newEntry: MoodEntry = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      date: today,
      mood: selectedMood,
      note: note.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    setEntries((prev) => {
      const filtered = prev.filter((e) => e.date !== today);
      return [...filtered, newEntry].sort((a, b) => a.date.localeCompare(b.date));
    });
    setTodayEntry(newEntry);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
      setSelectedMood("");
      setNote("");
      setShowCrisisDialog(false);
    }, 1200);
  }, [selectedMood, note, today, entries, lastTriggeredDate]);

  const moodAvg =
    weekEntries.length > 0
      ? weekEntries.reduce((sum, e) => sum + moodScore(e.mood), 0) / weekEntries.length
      : 0;

  const moodTrend =
    weekEntries.length >= 2
      ? weekEntries[0].mood === weekEntries[weekEntries.length - 1].mood
        ? "stable"
        : moodScore(weekEntries[weekEntries.length - 1].mood) >
          moodScore(weekEntries[0].mood)
        ? "up"
        : "down"
      : "stable";

  const trendLabel = {
    up: "Improving",
    down: "Needs attention",
    stable: "Steady",
  }[moodTrend];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>Mood Tracking</span>
            <span>
              {weekEntries.length} {weekEntries.length === 1 ? "entry" : "entries"} this week
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (weekEntries.length / 7) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Today's entry card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-indigo-600 text-sm font-medium">
              <Calendar size={16} />
              <span>Today's Check-in</span>
            </div>
            {todayEntry && (
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <Check size={14} />
                <span className="font-medium">Logged</span>
              </div>
            )}
          </div>

          {showForm ? (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How are you feeling right now?
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {(["happy", "calm", "neutral", "sad", "anxious"] as const).map((mood) => (
                    <button
                      key={mood}
                      onClick={() => setSelectedMood(selectedMood === mood ? "" : mood)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all ${
                        selectedMood === mood
                          ? "border-indigo-500 bg-indigo-50 shadow-md scale-110"
                          : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-2xl">{MOOD_EMOJI[mood]}</span>
                      <span className="text-xs font-medium text-gray-700">
                        {mood.charAt(0).toUpperCase() + mood.slice(1)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Anything you want to capture about today..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-24 transition-all"
                />
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
                  disabled={!selectedMood}
                  className="flex-1 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {submitted ? "Logged!" : "Log Mood"}
                </button>
              </div>
            </div>
          ) : todayEntry ? (
            <div className="text-center py-2 animate-fade-in">
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${MOOD_COLOR[todayEntry.mood]} mb-3 shadow-md`}
              >
                <span className="text-3xl">{MOOD_EMOJI[todayEntry.mood]}</span>
              </div>
              <p className="text-lg font-semibold text-gray-900 capitalize">{todayEntry.mood}</p>
              {todayEntry.note && (
                <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">{todayEntry.note}</p>
              )}
              <button
                onClick={() => {
                  setShowForm(true);
                  setSelectedMood(todayEntry.mood);
                  setNote(todayEntry.note || "");
                }}
                className="mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Update today's entry
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="w-full py-3 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <Calendar size={18} />
              Log today's mood
            </button>
          )}
        </div>

        {/* Chart toggle */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">This Week</h2>
          <button
            onClick={() => setShowChart(!showChart)}
            className={`text-sm transition-colors ${
              showChart ? "text-indigo-600" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {showChart ? "Hide" : "Show"} chart
          </button>
        </div>

        {/* Chart */}
        {showChart && (
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 animate-fade-in">
            <div className="flex items-center gap-2 text-indigo-600 text-sm font-medium mb-4">
              <TrendingUp size={16} />
              <span>Mood Trend — Last 7 Days</span>
            </div>

            {weekEntries.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Calendar size={32} className="mx-auto mb-3 opacity-50" />
                <p className="text-sm">No entries yet this week</p>
                <p className="text-xs mt-1">Log your first mood to see your trend</p>
              </div>
            ) : (
              <div className="space-y-2">
                {weekEntries.map((entry) => {
                  const score = moodScore(entry.mood);
                  const maxScore = 5;
                  const barHeight = (score / maxScore) * 100;
                  return (
                    <div key={entry.id} className="flex items-center gap-3">
                      <div className="w-12 text-right text-sm text-gray-500 font-medium">
                        {new Date(entry.date).toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden relative">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            entry.mood === "happy"
                              ? "bg-gradient-to-r from-green-400 to-emerald-500"
                              : entry.mood === "calm"
                              ? "bg-gradient-to-r from-blue-400 to-indigo-500"
                              : entry.mood === "neutral"
                              ? "bg-gradient-to-r from-gray-400 to-gray-500"
                              : entry.mood === "sad"
                              ? "bg-gradient-to-r from-purple-400 to-purple-600"
                              : "bg-gradient-to-r from-amber-400 to-orange-500"
                          }`}
                          style={{ height: `${barHeight}%` }}
                        />
                        <div className="absolute inset-0 flex items-center px-2">
                          <span className="text-xs font-semibold text-white drop-shadow-sm">
                            {MOOD_EMOJI[entry.mood]}
                          </span>
                        </div>
                      </div>
                      <div className="w-20 text-sm text-gray-600">
                        {entry.note ? (
                          <span className="truncate block max-w-[160px]">{entry.note}</span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {weekEntries.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={14} />
                    <span>Average mood:</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {moodAvg >= 4 ? "Good" : moodAvg >= 3 ? "Okay" : "Needs attention"}{" "}
                    ({moodAvg.toFixed(1)}/5.0)
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <TrendingUp size={14} />
                    <span>Trend:</span>
                  </div>
                  <span
                    className={`font-semibold ${
                      moodTrend === "up"
                        ? "text-green-600"
                        : moodTrend === "down"
                        ? "text-amber-600"
                        : "text-gray-600"
                    }`}
                  >
                    {trendLabel}
                  </span>
                </div>

                {moodAvg <= 2 && weekEntries.length >= 3 && (
                  <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
                    <div className="flex items-start gap-2">
                      <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-800">
                        We've noticed your mood has been low this week. You don't have to carry this
                        alone.{" "}
                        <button
                          onClick={() => setShowCrisisDialog(true)}
                          className="font-medium underline hover:text-amber-900"
                        >
                          Explore support resources
                        </button>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* History */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent History</h2>
          {entries.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">No mood entries yet</p>
              <p className="text-xs mt-1">Start logging to build your history</p>
            </div>
          ) : (
            <div className="space-y-2">
              {entries
                .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
                .slice(0, 14)
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 animate-fade-in"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${MOOD_COLOR[entry.mood]} shadow-sm`}
                    >
                      <span className="text-lg">{MOOD_EMOJI[entry.mood]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 capitalize">{entry.mood}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(entry.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      {entry.note && (
                        <p className="text-sm text-gray-500 truncate mt-0.5">{entry.note}</p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {showCrisisDialog && <CrisisResources onClose={() => setShowCrisisDialog(false)} reason="mood_tracking" />}
    </div>
  );
}
