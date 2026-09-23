// ── Insights Dashboard Data Layer ───────────────────────────────────────────────────
// Fetches and processes data from localStorage:
//   - Mood check-ins (mood-checkins)
//   - Journal entries (youna-journal-entries)
//   - Personality/DNA (youna-personality)
//   - Coaching sessions (tracked in-memory; localStorage persistence coming in Phase 3)
//
// Provides computed insights:
//   - Mood trend (last 14 days)
//   - Mood distribution
//   - Journal sentiment trend
//   - Streak calculation
//   - Top emotions
//   - Coaching recommendations based on DNA + mood patterns

// ── Types (local aliases aligned with @/lib/types) ────────────────────────────────

export type Mood = "happy" | "calm" | "sad" | "anxious" | "neutral";

export interface MoodCheckin {
  id: string;
  mood: Mood;
  note?: string;
  timestamp: string;
  source: "manual" | "chat" | "checkin" | "journal";
}

export interface JournalEntryData {
  id: string;
  title: string;
  content: string;
  mood: Mood;
  prompt?: string;
  timestamp: string;
}

// ── Storage keys ────────────────────────────────────────────────────────────────────

const MOOD_STORAGE_KEY = "youna-mood-checkins";
const JOURNAL_STORAGE_KEY = "youna-journal-entries";
const PERSONALITY_STORAGE_KEY = "youna-personality";

// ── Mood data ───────────────────────────────────────────────────────────────────────

export function loadMoodCheckins(): MoodCheckin[] {
  try {
    const raw = localStorage.getItem(MOOD_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveMoodCheckin(checkin: Omit<MoodCheckin, "id" | "timestamp">): MoodCheckin {
  const entry: MoodCheckin = {
    ...checkin,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };
  const existing = loadMoodCheckins();
  existing.push(entry);
  localStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(existing));
  return entry;
}

// ── Journal persistence ────────────────────────────────────────────────────────────

const JOURNAL_SAVE_KEY = "youna-saved-journal-entries";

export interface SavedJournalEntry {
  id: string;
  title: string;
  content: string;
  mood: Mood;
  timestamp: string;
}

export function loadSavedJournalEntries(): SavedJournalEntry[] {
  try {
    const raw = localStorage.getItem(JOURNAL_SAVE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveJournalEntry(entry: Omit<SavedJournalEntry, "id" | "timestamp">): SavedJournalEntry {
  const saved: SavedJournalEntry = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };
  const existing = loadSavedJournalEntries();
  existing.push(saved);
  localStorage.setItem(JOURNAL_SAVE_KEY, JSON.stringify(existing));
  return saved;
}

export function getMoodTrend(days: number = 14): { date: string; mood: Mood; count: number }[] {
  const checkins = loadMoodCheckins();
  const map = new Map<string, { mood: Mood; count: number }>();

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  for (const checkin of checkins) {
    const ts = new Date(checkin.timestamp);
    if (ts < cutoff) continue;
    const dateKey = ts.toISOString().slice(0, 10);
    const existing = map.get(dateKey);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(dateKey, { mood: checkin.mood, count: 1 });
    }
  }

  return Array.from(map.entries())
    .map(([date, value]) => ({ date, mood: value.mood, count: value.count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getMoodDistribution(): Record<Mood, number> {
  const checkins = loadMoodCheckins();
  const dist: Record<Mood, number> = { happy: 0, calm: 0, sad: 0, anxious: 0, neutral: 0 };
  for (const c of checkins) {
    dist[c.mood] += 1;
  }
  return dist;
}

export function getDailyCheckinCount(): number {
  const checkins = loadMoodCheckins();
  const today = new Date().toISOString().slice(0, 10);
  return checkins.filter((c) => c.timestamp.slice(0, 10) === today).length;
}

export function getStreak(): number {
  const checkins = loadMoodCheckins();
  if (checkins.length === 0) return 0;

  const dates = [...new Set(checkins.map((c) => c.timestamp.slice(0, 10)))].sort().reverse();
  let streak = 0;
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  // Streak requires today or yesterday as the most recent check-in
  if (dates[0] !== today && dates[0] !== yesterday) return 0;

  for (let i = 0; i < dates.length; i++) {
    const expected = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    if (dates[i] === expected) streak += 1;
    else break;
  }
  return streak;
}

// ── Journal data ────────────────────────────────────────────────────────────────────

export interface JournalEntryData {
  id: string;
  title: string;
  content: string;
  mood: Mood;
  prompt?: string;
  timestamp: string;
}

export function loadJournalEntries(): JournalEntryData[] {
  try {
    const raw = localStorage.getItem(JOURNAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// ── Simple sentiment analysis ───────────────────────────────────────────────────────

export type Sentiment = "positive" | "neutral" | "negative";

const POSITIVE_WORDS = new Set([
  "happy", "great", "good", "love", "grateful", "thankful", "joy", "excited",
  "proud", "better", "calm", "peaceful", "relaxed", "hopeful", "appreciate",
  "wonderful", "amazing", "blessed", "fulfilled", "content", "optimistic", "lighter",
  "progress", "growth", "learned", "achieved", "accomplished", "victory", "smile",
  "laugh", "fun", "beautiful", "kind", "connected", "supported", "understood",
  "healing", "strong", "capable", "confident", "worthy", "enough",
]);

const NEGATIVE_WORDS = new Set([
  "sad", "depressed", "anxious", "worried", "scared", "afraid", "lonely",
  "overwhelmed", "stressed", "angry", "frustrated", "hurt", "hate", "fail",
  "failure", "stuck", "trapped", "hopeless", "helpless", "lost", "empty",
  "numb", "pain", "suffering", "struggle", "difficult", "hard", "tired",
  "exhausted", "drained", "heavy", "dark", "anxiety", "panic", "cry", "tears",
  "miss", "grief", "guilt", "shame", "regret", "sorry", "wrong", "not enough",
  "can't", "can't go on", "end it", "suicide", "death", "die", "nobody",
]);

export function analyzeSentiment(text: string): { sentiment: Sentiment; score: number; reasons: string[] } {
  const words = text.toLowerCase().split(/[\s\n.,!?;:'"]+/).filter(Boolean);
  let score = 0;
  const reasons: string[] = [];

  for (const word of words) {
    if (POSITIVE_WORDS.has(word)) {
      score += 1;
      if (reasons.length < 3) reasons.push(`Positive: "${word}"`);
    }
    if (NEGATIVE_WORDS.has(word)) {
      score -= 1.5;
      if (reasons.length < 3) reasons.push(`Negative: "${word}"`);
    }
  }

  // Normalize to -1..1
  const normalizedScore = words.length > 0 ? Math.max(-1, Math.min(1, score / words.length)) : 0;

  let sentiment: Sentiment = "neutral";
  if (normalizedScore > 0.15) sentiment = "positive";
  else if (normalizedScore < -0.15) sentiment = "negative";

  return { sentiment, score: normalizedScore, reasons };
}

export function getJournalSentimentTrend(days: number = 14): { date: string; sentiment: Sentiment; avgScore: number; count: number }[] {
  const entries = [...loadJournalEntries(), ...loadSavedJournalEntries()];
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const byDate = new Map<string, { scores: number[]; sentiments: Sentiment[] }>();

  for (const entry of entries) {
    const ts = entry.timestamp ? new Date(entry.timestamp) : null;
    if (!ts) continue;
    if (ts < cutoff) continue;
    const dateKey = ts.toISOString().slice(0, 10);
    const content = entry.content ?? "";
    if (!content) continue;
    const analysis = analyzeSentiment(content);
    const existing = byDate.get(dateKey) || { scores: [], sentiments: [] };
    existing.scores.push(analysis.score);
    existing.sentiments.push(analysis.sentiment);
    byDate.set(dateKey, existing);
  }

  return Array.from(byDate.entries())
    .map(([date, value]) => {
      const avgScore = value.scores.reduce((a, b) => a + b, 0) / value.scores.length;
      const pos = value.sentiments.filter((s) => s === "positive").length;
      const neg = value.sentiments.filter((s) => s === "negative").length;
      const neutral = value.sentiments.filter((s) => s === "neutral").length;
      let overall: Sentiment = "neutral";
      if (pos > neg) overall = "positive";
      else if (neg > pos) overall = "negative";
      return { date, sentiment: overall, avgScore, count: value.scores.length };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getLatestJournalSentiment(): { sentiment: Sentiment; score: number } | null {
  const entries = [...loadJournalEntries(), ...loadSavedJournalEntries()];
  if (entries.length === 0) return null;
  const latest = entries[entries.length - 1];
  const content = latest.content ?? "";
  if (!content) return null;
  const analysis = analyzeSentiment(content);
  return { sentiment: analysis.sentiment, score: analysis.score };
}

// ── Personality / DNA data ──────────────────────────────────────────────────────────

// PersonalityProfile is imported from @/lib/types in production; for MVP we accept
// any object since the structure evolves across phases (see personality.ts for the
// canonical FullDNAProfile shape)
export function loadPersonality(): Record<string, unknown> | null {
  try {
    const raw = localStorage.getItem(PERSONALITY_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ── Coaching data (localStorage for session history) ───────────────────────────────

const COACHING_STORAGE_KEY = "youna-coaching-sessions";

export interface CoachingSessionSummary {
  id: string;
  programId: string;
  programName: string;
  framework: string;
  startedAt: string;
  completedAt?: string;
  durationMinutes?: number;
  stepsCompleted: number;
  totalSteps: number;
  isComplete: boolean;
}

export function loadCoachingSessions(): CoachingSessionSummary[] {
  try {
    const raw = localStorage.getItem(COACHING_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCoachingSession(session: Omit<CoachingSessionSummary, "id">): CoachingSessionSummary {
  const entry: CoachingSessionSummary = {
    ...session,
    id: crypto.randomUUID(),
  };
  const existing = loadCoachingSessions();
  existing.push(entry);
  localStorage.setItem(COACHING_STORAGE_KEY, JSON.stringify(existing));
  return entry;
}

export function getRecentCoachingSessions(limit: number = 5): CoachingSessionSummary[] {
  const sessions = loadCoachingSessions()
    .filter((s) => s.isComplete)
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  return sessions.slice(0, limit);
}

export function getMoodSourceBreakdown(): Record<string, number> {
  const checkins = loadMoodCheckins();
  const breakdown: Record<string, number> = { manual: 0, chat: 0, checkin: 0, journal: 0 };
  for (const c of checkins) {
    breakdown[c.source] = (breakdown[c.source] || 0) + 1;
  }
  return breakdown;
}

export function getCoachingStats(): {
  totalSessions: number;
  completedSessions: number;
  completionRate: number;
  sessionsByFramework: Record<string, number>;
  totalStepsCompleted: number;
  lastSessionDate: string | null;
} {
  const sessions = loadCoachingSessions();
  const total = sessions.length;
  const completed = sessions.filter((s) => s.isComplete).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const byFramework: Record<string, number> = {};
  for (const s of sessions) {
    byFramework[s.framework] = (byFramework[s.framework] || 0) + 1;
  }

  let totalSteps = 0;
  for (const s of sessions) {
    totalSteps += s.stepsCompleted;
  }

  let lastDate: string | null = null;
  if (sessions.length > 0) {
    const sorted = [...sessions].sort((a, b) => b.startedAt.localeCompare(a.startedAt));
    lastDate = sorted[0].startedAt;
  }

  return { totalSessions: total, completedSessions: completed, completionRate, sessionsByFramework: byFramework, totalStepsCompleted: totalSteps, lastSessionDate: lastDate };
}

// ── Aggregated insights ─────────────────────────────────────────────────────────────

export interface InsightsSummary {
  moodTrend: { date: string; mood: Mood; count: number }[];
  moodDistribution: Record<Mood, number>;
  moodStreak: number;
  todayCheckins: number;
  journalSentimentTrend: { date: string; sentiment: Sentiment; avgScore: number; count: number }[];
  latestJournalSentiment: { sentiment: Sentiment; score: number } | null;
  coachingStats: ReturnType<typeof getCoachingStats>;
  recentSessions: CoachingSessionSummary[];
  personality: Record<string, unknown> | null;
  totalJournalEntries: number;
  totalMoodCheckins: number;
  dominantMood: Mood | null;
  recommendation: string | null;
  moodSourceBreakdown: Record<string, number>;
}

export function getInsightsSummary(): InsightsSummary {
  const moodTrend = getMoodTrend(14);
  const moodDistribution = getMoodDistribution();
  const moodStreak = getStreak();
  const todayCheckins = getDailyCheckinCount();
  const journalSentimentTrend = getJournalSentimentTrend(14);
  const latestJournalSentiment = getLatestJournalSentiment();
  const coachingStats = getCoachingStats();
  const personality = loadPersonality();
  const journalEntries = [...loadJournalEntries(), ...loadSavedJournalEntries()];

  // Dominant mood (most frequent in last 14 days)
  let dominantMood: Mood | null = null;
  let maxCount = 0;
  for (const mood of Object.keys(moodDistribution) as Mood[]) {
    if (moodDistribution[mood] > maxCount) {
      maxCount = moodDistribution[mood];
      dominantMood = mood;
    }
  }

  // Generate a recommendation based on patterns
  let recommendation: string | null = null;
  if (moodStreak >= 3 && coachingStats.totalSessions < 3) {
    recommendation = "You've built a check-in streak — that's great momentum. Try a coaching program to go deeper on what you're noticing.";
  } else if (moodDistribution.sad > moodDistribution.happy && moodDistribution.sad > moodDistribution.calm) {
    recommendation = "Your recent mood pattern shows more low moments than calm or happy ones. A 'Thought Record' or 'Emotion Mapping' exercise might help you understand what's underneath.";
  } else if (coachingStats.completedSessions > 0 && coachingStats.completionRate >= 50 && coachingStats.totalSessions < 5) {
    recommendation = "You're completing coaching programs — that's real engagement. Which framework resonated most? Your DNA suggests specific programs that fit how you work.";
  } else if (journalEntries.length >= 5 && latestJournalSentiment?.sentiment === "negative") {
    recommendation = "Your journal entries have leaned negative lately. That's valuable data — not a problem. A mindfulness exercise or mood check-in might help you slow down and look at what's behind it.";
  } else if (moodStreak === 0 && coachingStats.totalSessions === 0) {
    recommendation = "You're new here — that's OK. A mood check-in or a 3-minute breathing space is a low-pressure way to start.";
  } else if (moodStreak >= 7) {
    recommendation = `${moodStreak}-day streak — that's meaningful consistency. What's the habit underneath it? A coaching program could help you understand your own patterns better.`;
  }

  return {
    moodTrend,
    moodDistribution,
    moodStreak,
    todayCheckins,
    journalSentimentTrend,
    latestJournalSentiment,
    coachingStats,
    recentSessions: getRecentCoachingSessions(5),
    moodSourceBreakdown: getMoodSourceBreakdown(),
    personality,
    totalJournalEntries: journalEntries.length,
    totalMoodCheckins: loadMoodCheckins().length,
    dominantMood,
    recommendation,
  };
}
