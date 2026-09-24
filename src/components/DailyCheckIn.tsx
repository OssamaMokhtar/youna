"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar, TrendingUp, AlertTriangle, Sparkles, Check } from "lucide-react";
import CrisisResources from "./CrisisResources";
import { shouldOpenCrisisDialog } from "@/lib/safety";

// ── Constants ──────────────────────────────────────────────────────────────

const MOODS = ["awful", "bad", "okay", "good", "great"] as const;
type MoodValue = typeof MOODS[number];

const MOOD_SCORES: Record<MoodValue, number> = {
  awful: 0,
  bad: 1,
  okay: 2,
  good: 3,
  great: 4,
};

const MOOD_EMOJI: Record<MoodValue, string> = {
  awful: "😔",
  bad: "😟",
  okay: "😐",
  good: "😊",
  great: "😄",
};

const REFLECTION_QUESTIONS = [
  "What was the best thing that happened today?",
  "What's one thing you're letting go of before tomorrow?",
  "What's one win — big or small — you want to remember?",
  "How did you take care of yourself today?",
  "What felt hard today, and what made it hard?",
  "What would you tell yourself tomorrow morning?",
  "What's one thing you're grateful for right now?",
];

const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

// ── Types ────────────────────────────────────────────────────────────────

interface CheckInEntry {
  id: string;
  date: string;       // ISO date "2024-01-15"
  mood: MoodValue;
  energy: number;     // 0–100
  stress: number;     // 0–100
  note: string;
  createdAt: string;  // ISO timestamp
}

interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastCheckedInDate: string;
}

// ── Storage helpers ──────────────────────────────────────────────────────

const STORAGE_KEYS = {
  entries: "youna-checkin-entries",
  streak: "youna-checkin-streak",
} as const;

function loadEntries(): CheckInEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.entries);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CheckInEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveEntriesToStorage(entries: CheckInEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.entries, JSON.stringify(entries));
  } catch {}
}

function loadStreak(): StreakState {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.streak);
    if (!raw) return { currentStreak: 0, longestStreak: 0, lastCheckedInDate: "" };
    const parsed = JSON.parse(raw) as StreakState;
    return {
      currentStreak: typeof parsed.currentStreak === "number" ? parsed.currentStreak : 0,
      longestStreak: typeof parsed.longestStreak === "number" ? parsed.longestStreak : 0,
      lastCheckedInDate: typeof parsed.lastCheckedInDate === "string" ? parsed.lastCheckedInDate : "",
    };
  } catch {
    return { currentStreak: 0, longestStreak: 0, lastCheckedInDate: "" };
  }
}

function saveStreakToStorage(streak: StreakState): void {
  try {
    localStorage.setItem(STORAGE_KEYS.streak, JSON.stringify(streak));
  } catch {}
}

// ── Date helpers ─────────────────────────────────────────────────────────

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysAgoStr(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

// ── Streak computation ──────────────────────────────────────────────────

function computeStreak(entries: CheckInEntry[], today: string): StreakState {
  // Sort entries descending by date
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  // Count consecutive check-ins from today backwards
  let streak = 0;
  const todayDate = new Date(today + "T00:00:00.000Z");

  for (let i = 0; i < sorted.length; i++) {
    const entryDate = new Date(sorted[i].date + "T00:00:00.000Z");
    const diffDays = Math.round((todayDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === streak) {
      streak++;
      todayDate.setDate(todayDate.getDate() - 1);
    } else if (diffDays === 0 && streak === 0) {
      // Today's entry exists, start from yesterday
      streak = 1;
      todayDate.setDate(todayDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Find longest streak from all historical data
  let longest = streak;
  let tempStreak = 0;
  let tempDate = new Date(sorted.length > 0 ? sorted[sorted.length - 1].date + "T00:00:00.000Z" : today + "T00:00:00.000Z");

  for (let i = sorted.length - 1; i >= 0; i--) {
    const entryDate = new Date(sorted[i].date + "T00:00:00.000Z");
    const diffDays = Math.round((tempDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === tempStreak || (diffDays === 0 && tempStreak === 0)) {
      tempStreak++;
      tempDate = entryDate;
    } else {
      longest = Math.max(longest, tempStreak);
      tempStreak = 1;
      tempDate = entryDate;
    }
  }
  longest = Math.max(longest, tempStreak);

  return { currentStreak: streak, longestStreak: longest, lastCheckedInDate: today };
}

// ── Component ──────────────────────────────────────────────────────────────

export default function DailyCheckIn() {
  // State
  const [show, setShow] = useState(false);
  const [mood, setMood] = useState<MoodValue | "">("");
  const [energy, setEnergy] = useState(50);
  const [stress, setStress] = useState(50);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showCrisisDialog, setShowCrisisDialog] = useState(false);
  const [entries, setEntries] = useState<CheckInEntry[]>([]);
  const [streak, setStreak] = useState<StreakState>({ currentStreak: 0, longestStreak: 0, lastCheckedInDate: "" });
  const [crisisReason, setCrisisReason] = useState<"checkin" | "mood_tracking" | "chat">("checkin");
  const [selectedReflection, setSelectedReflection] = useState(0);

  // Load from localStorage on mount
  useEffect(() => {
    setEntries(loadEntries());
    setStreak(loadStreak());
  }, []);

  const todayDate = todayStr();
  const todayEntry = entries.find((e) => e.date === todayDate);
  const hasCheckedInToday = !!todayEntry;

  // Recompute streak whenever entries change
  useEffect(() => {
    const newStreak = computeStreak(entries, todayDate);
    setStreak(newStreak);
    saveStreakToStorage(newStreak);
  }, [entries, todayDate]);

  // Rotate reflection question
  useEffect(() => {
    setSelectedReflection(Math.floor(Math.random() * REFLECTION_QUESTIONS.length));
  }, [show]);

  // Persist entries whenever they change
  useEffect(() => {
    saveEntriesToStorage(entries);
  }, [entries]);

  const handleSubmit = useCallback(() => {
    if (!mood) return;

    const weekAgo = daysAgoStr(7);
    const previousScores = entries
      .filter((e) => e.date >= weekAgo && e.date !== todayDate)
      .map((e) => MOOD_SCORES[e.mood]);

    // Crisis check (src/lib/safety.ts): 7-day average INCLUDING today <= 1.5 and
    // today <= 2 on the 0-4 scale, or crisis language in the note. There is no
    // same-day suppression: the old guard compared against a streak date that
    // was always today, so this dialog could never open.
    const openCrisis = shouldOpenCrisisDialog({
      todayScore: MOOD_SCORES[mood],
      previousScores,
      avgThreshold: 1.5,
      todayMax: 2,
      note,
    });
    if (openCrisis) {
      setShowCrisisDialog(true);
      setCrisisReason("checkin");
    }

    const newEntry: CheckInEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      date: todayDate,
      mood,
      energy,
      stress,
      note: note.trim(),
      createdAt: new Date().toISOString(),
    };

    // Remove any existing entry for today, then add new one
    const filtered = entries.filter((e) => e.date !== todayDate);
    const updated = [...filtered, newEntry].sort((a, b) => a.date.localeCompare(b.date));

    setEntries(updated);
    setSubmitted(true);

    // Reset form after short delay
    setTimeout(() => {
      setSubmitted(false);
      setShow(false);
      setMood("");
      setEnergy(50);
      setStress(50);
      setNote("");
      // The crisis dialog stays open until the user closes it.
    }, 1200);
  }, [mood, energy, stress, note, entries, todayDate]);

  // Computed stats for the last 7 days
  const weekAgo = daysAgoStr(7);
  const last7Entries = entries.filter((e) => e.date >= weekAgo);

  const avgMoodLast7 = last7Entries.length > 0
    ? last7Entries.reduce((sum, e) => sum + MOOD_SCORES[e.mood], 0) / last7Entries.length
    : 0;

  const avgEnergyLast7 = last7Entries.length > 0
    ? last7Entries.reduce((sum, e) => sum + e.energy, 0) / last7Entries.length
    : 0;

  const avgStressLast7 = last7Entries.length > 0
    ? last7Entries.reduce((sum, e) => sum + e.stress, 0) / last7Entries.length
    : 0;

  // Crisis trigger in banner (when average mood is low)
  const showCrisisTrigger = avgMoodLast7 <= 1.5 && last7Entries.length >= 2;

  return (
    <>
      {/* ── Trigger Banner ─────────────────────────────────────────────── */}
      {!show && !hasCheckedInToday && (
        <div className="mx-auto max-w-2xl px-4 py-4 bg-gradient-to-r from-indigo-50 via-white to-purple-50 border border-indigo-100 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Daily check-in</p>
              <p className="text-xs text-gray-500">Take 2 minutes to check in with yourself</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {streak.currentStreak > 0 && (
              <span className="text-xs text-gray-400">Streak: {streak.currentStreak} days</span>
            )}
            <button
              onClick={() => setShow(true)}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm"
            >
              Check in
            </button>
          </div>
        </div>
      )}

      {/* ── Success Banner ──────────────────────────────────────────────── */}
      {submitted && !show && (
        <div className="mx-auto max-w-2xl px-4 py-4 bg-green-50 border border-green-200 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Check size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-800">Check-in logged</p>
              <p className="text-xs text-green-600">Streak: {streak.currentStreak} days — keep going</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Modal ───────────────────────────────────────────────────── */}
      {show && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Daily Check-in</h2>
                  <p className="text-sm text-gray-500">How are you feeling today?</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShow(false);
                  setMood("");
                  setEnergy(50);
                  setStress(50);
                  setNote("");
                }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5">
              {/* Mood selector */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  How are you feeling?
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {MOODS.map((m) => (
                    <button
                      key={m}
                      onClick={() => setMood(m)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                        mood === m
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-2xl">{MOOD_EMOJI[m]}</span>
                      <span className="text-xs font-medium capitalize">{m}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Energy slider */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Energy</span>
                  <span className="text-gray-700 font-medium">{energy}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={energy}
                  onChange={(e) => setEnergy(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Drained</span>
                  <span>Energetic</span>
                </div>
              </div>

              {/* Stress slider */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Stress</span>
                  <span className="text-gray-700 font-medium">{stress}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={stress}
                  onChange={(e) => setStress(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-red-500"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Relaxed</span>
                  <span>Overwhelmed</span>
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Quick note — what's on your mind?
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="One sentence is enough..."
                  rows={2}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-gray-400 transition-all"
                />
              </div>

              {/* Reflection prompt */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                <p className="text-xs font-medium text-indigo-600 mb-1">Today's reflection</p>
                <p className="text-sm text-gray-700 italic">
                  "{REFLECTION_QUESTIONS[selectedReflection]}"
                </p>
              </div>

              {/* Stats preview */}
              {entries.length > 0 && (
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <Calendar size={16} className="text-indigo-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Check-ins</p>
                    <p className="text-lg font-semibold text-gray-900">{entries.length}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <TrendingUp size={16} className="text-indigo-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Streak</p>
                    <p className="text-lg font-semibold text-gray-900">{streak.currentStreak} days</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <Sparkles size={16} className="text-indigo-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Avg Mood</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {avgMoodLast7 > 0 ? MOODS[Math.min(Math.round(avgMoodLast7), MOODS.length - 1)] : "—"}
                    </p>
                  </div>
                </div>
              )}

              {/* Crisis trigger banner */}
              {showCrisisTrigger && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-sm">
                  <AlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-red-800 font-medium">You've been feeling low lately</p>
                    <p className="text-red-700 mt-1">
                      If you want support right now,{" "}
                      <button
                        onClick={() => {
                          setCrisisReason("checkin");
                          setShowCrisisDialog(true);
                        }}
                        className="font-medium underline hover:text-red-900"
                      >
                        these resources are available
                      </button>{" "}
                      — you don't have to go through this alone.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 mt-6 justify-end">
              <button
                onClick={() => {
                  setShow(false);
                  setMood("");
                  setEnergy(50);
                  setStress(50);
                  setNote("");
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Skip for today
              </button>
              <button
                onClick={handleSubmit}
                disabled={!mood}
                className="px-5 py-2 text-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                Log check-in
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Crisis Resources Dialog ──────────────────────────────────────── */}
      {showCrisisDialog && (
        <CrisisResources
          onClose={() => {
            setShowCrisisDialog(false);
            // Don't auto-close the modal — let user decide when to leave
          }}
          reason={crisisReason}
        />
      )}
    </>
  );
}
