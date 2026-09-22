"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Calendar, BookOpen, Award, Flame, BarChart3, Sparkles, ArrowRight, Activity } from "lucide-react";
import type { InsightsSummary } from "@/lib/insights";
import { getInsightsSummary } from "@/lib/insights";

function MoodTrendChart({ trend }: { trend: { date: string; mood: string; count: number }[] }) {
  const moodColors: Record<string, string> = {
    happy: "#22c55e",
    calm: "#3b82f6",
    sad: "#6366f1",
    anxious: "#f59e0b",
    neutral: "#9ca3af",
  };

  if (trend.length === 0) return null;

  const startDate = new Date(trend[0].date);
  const endDate = new Date(trend[trend.length - 1].date);
  const moodByDate = new Map<string, string>();
  const countByDate = new Map<string, number>();
  for (const t of trend) { moodByDate.set(t.date, t.mood); countByDate.set(t.date, t.count); }

  const fullRange: { date: string; mood: string; count: number }[] = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().slice(0, 10);
    fullRange.push({
      date: dateStr,
      mood: moodByDate.get(dateStr) ?? "none",
      count: countByDate.get(dateStr) ?? 0,
    });
  }

  const maxCount = Math.max(...trend.map((t) => t.count), 1);

  return (
    <div className="space-y-2">
      <div className="flex items-end gap-1 h-32">
        {fullRange.map((point, i) => {
          const height = point.count > 0 ? (point.count / maxCount) * 100 : 4;
          const color = point.mood !== "none" ? (moodColors[point.mood] ?? "#e5e7eb") : "#e5e7eb";
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t transition-all"
                style={{ height: `${Math.max(height, 4)}%`, backgroundColor: color, opacity: point.count > 0 ? 1 : 0.3 }}
              />
              <span className="text-[9px] text-gray-400 whitespace-nowrap">
                {new Date(point.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 text-xs text-gray-500 mt-2 flex-wrap">
        {Object.entries(moodColors).map(([mood, color]) => (
          <div key={mood} className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="capitalize">{mood}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MoodDistributionBars({ distribution }: { distribution: Record<string, number> }) {
  const total = Object.values(distribution).reduce((a, b) => a + b, 0) || 1;
  const moodOrder: Array<{ key: string; label: string; color: string }> = [
    { key: "happy", label: "Happy", color: "#22c55e" },
    { key: "calm", label: "Calm", color: "#3b82f6" },
    { key: "neutral", label: "Neutral", color: "#9ca3af" },
    { key: "sad", label: "Sad", color: "#6366f1" },
    { key: "anxious", label: "Anxious", color: "#f59e0b" },
  ];

  return (
    <div className="space-y-3">
      {moodOrder.map(({ key, label, color }) => {
        const count = distribution[key] ?? 0;
        if (count === 0) return null;
        const pct = Math.round((count / total) * 100);
        return (
          <div key={key}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                {label}
              </span>
              <span className="text-gray-900 font-medium">{count} ({pct}%)</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function JournalSentimentTrend({ trend }: { trend: { date: string; sentiment: string; avgScore: number; count: number }[] }) {
  const sentimentColors: Record<string, string> = {
    positive: "#22c55e",
    neutral: "#9ca3af",
    negative: "#ef4444",
  };

  if (trend.length === 0) return null;

  const startDate = new Date(trend[0].date);
  const endDate = new Date(trend[trend.length - 1].date);
  const map = new Map<string, { sentiment: string; score: number }>();
  for (const t of trend) map.set(t.date, { sentiment: t.sentiment, score: t.avgScore });

  const fullRange: { date: string; sentiment: string; score: number }[] = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().slice(0, 10);
    const existing = map.get(dateStr);
    fullRange.push({
      date: dateStr,
      sentiment: existing?.sentiment ?? "none",
      score: existing?.score ?? 0,
    });
  }

  const maxAbsScore = Math.max(...trend.map((t) => Math.abs(t.avgScore)), 0.1);

  return (
    <div className="space-y-2">
      <div className="flex items-end gap-1 h-32 relative">
        <div className="absolute left-0 right-0 h-px bg-gray-200" style={{ bottom: "50%" }} />
        {fullRange.map((point, i) => {
          const isPos = point.sentiment === "positive";
          const isNeg = point.sentiment === "negative";
          const isNone = point.sentiment === "none";
          const bottomPct = isPos ? 50 : isNeg ? 50 - (Math.abs(point.score) / maxAbsScore) * 50 : 50;
          const topPct = isPos ? 50 + (point.score / maxAbsScore) * 50 : isNeg ? 50 : 50;
          const color = point.sentiment !== "none" ? (sentimentColors[point.sentiment] ?? "#e5e7eb") : "#e5e7eb";
          return (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div
                className="w-full rounded transition-all"
                style={{
                  height: isNone ? "2%" : `${Math.abs(topPct - bottomPct)}%`,
                  backgroundColor: color,
                  bottom: `${Math.min(bottomPct, 50)}%`,
                  opacity: isNone ? 0.2 : 1,
                }}
              />
              <span className="text-[9px] text-gray-400 whitespace-nowrap mt-0.5">
                {new Date(point.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 text-xs text-gray-500 mt-2 flex-wrap">
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sentimentColors.positive }} />
          <span>Positive</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sentimentColors.neutral }} />
          <span>Neutral</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sentimentColors.negative }} />
          <span>Negative</span>
        </div>
      </div>
    </div>
  );
}

function PersonalitySnapshot({ personality }: { personality: Record<string, unknown> }) {
  const bigFive = personality.bigFive as Record<string, number> | undefined;
  const attachmentStyle = personality.attachmentStyle as string | undefined;
  const communicationStyle = personality.communicationStyle as string | undefined;
  const enneagram = personality.enneagramType as number | undefined;
  const discStyle = personality.discStyle as string | undefined;

  const bfLabels: Array<{ key: string; label: string; emoji: string }> = [
    { key: "openness", label: "Openness", emoji: "🧠" },
    { key: "conscientiousness", label: "Conscientiousness", emoji: "📋" },
    { key: "extraversion", label: "Extraversion", emoji: "🎉" },
    { key: "agreeableness", label: "Agreeableness", emoji: "🤝" },
    { key: "neuroticism", label: "Neuroticism", emoji: "🌊" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Big Five Traits</h3>
        <div className="space-y-4">
          {bfLabels.map(({ key, label, emoji }) => {
            const val = bigFive?.[key] as number | undefined;
            if (val === undefined) return null;
            const pct = ((val - 1) / 4) * 100;
            return (
              <div key={key}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">{emoji} {label}</span>
                  <span className="text-gray-900 font-medium">{val.toFixed(1)} / 5</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      backgroundColor:
                        key === "neuroticism"
                          ? pct > 60 ? "#f59e0b" : pct > 30 ? "#3b82f6" : "#22c55e"
                          : pct > 60 ? "#6366f1" : pct > 30 ? "#3b82f6" : "#22c55e",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Relationship & Style</h3>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Attachment Style</p>
            <p className="text-lg font-semibold text-gray-900 capitalize">{attachmentStyle ?? "Not assessed"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Communication Style</p>
            <p className="text-lg font-semibold text-gray-900 capitalize">{communicationStyle ?? "Not assessed"}</p>
          </div>
          {enneagram && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Enneagram Type</p>
              <p className="text-lg font-semibold text-gray-900">Type {enneagram}</p>
            </div>
          )}
          {discStyle && (
            <div>
              <p className="text-xs text-gray-500 mb-1">DISC Style</p>
              <p className="text-lg font-semibold text-gray-900 uppercase">{discStyle}</p>
            </div>
          )}
          {(!attachmentStyle && !communicationStyle && !enneagram && !discStyle) && (
            <p className="text-sm text-gray-400 italic">Complete the personality assessment to see your profile</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function InsightsDashboard() {
  const [data, setData] = useState<InsightsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const summary = getInsightsSummary();
      setData(summary);
    } catch (err) {
      console.error("[Insights] Failed to load:", (err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <Activity size={32} className="animate-pulse text-indigo-400" />
          <p className="text-sm text-gray-500">Loading your insights…</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Unable to load insights.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Insights</h1>
              <p className="text-xs text-gray-500">Your wellness patterns at a glance</p>
            </div>
          </div>
          <a href="/" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1.5 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
            </svg>
            Back to chat
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Recommendation banner */}
          {data.recommendation && (
            <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-indigo-700 mb-1">Suggested for you</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{data.recommendation}</p>
              </div>
            </div>
          )}

          {/* Row 1: Streak + Today + Journals */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-sm">
                  <Flame size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Check-in Streak</p>
                  <p className="text-3xl font-bold text-gray-900">{data.moodStreak}</p>
                  <p className="text-xs text-gray-400">consecutive days</p>
                </div>
              </div>
              {data.moodStreak > 0 ? (
                <div className="mt-3 flex gap-1">
                  {Array.from({ length: Math.min(data.moodStreak, 7) }).map((_, i) => (
                    <div key={i} className="flex-1 h-1.5 rounded-full bg-gradient-to-r from-orange-300 to-amber-400" />
                  ))}
                  {data.moodStreak > 7 && (
                    <div className="flex-1 h-1.5 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-[10px] text-gray-400 font-medium">+{data.moodStreak - 7}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-400 mt-2 italic">Start your streak with a mood check-in</p>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-sm">
                  <Calendar size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Today</p>
                  <p className="text-3xl font-bold text-gray-900">{data.todayCheckins}</p>
                  <p className="text-xs text-gray-400">check-in{data.todayCheckins !== 1 ? "s" : ""}</p>
                </div>
              </div>
              {data.todayCheckins > 0 ? (
                <p className="text-xs text-gray-400 mt-2">{data.totalMoodCheckins} total check-ins all time</p>
              ) : (
                <p className="text-xs text-gray-400 mt-2 italic">No check-ins yet today</p>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-sm">
                  <BookOpen size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Journal Entries</p>
                  <p className="text-3xl font-bold text-gray-900">{data.totalJournalEntries}</p>
                  <p className="text-xs text-gray-400">total entries</p>
                </div>
              </div>
              {data.totalJournalEntries > 0 ? (
                <p className="text-xs text-gray-400 mt-2">{data.totalMoodCheckins} mood check-ins recorded</p>
              ) : (
                <p className="text-xs text-gray-400 mt-2 italic">Start journaling to see your entries here</p>
              )}
            </div>
          </div>

          {/* Row 2: Mood trend + Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp size={18} className="text-indigo-500" /> Mood Trend
                </h2>
                <span className="text-xs text-gray-400">Last 14 days</span>
              </div>
              {data.moodTrend.length === 0 ? (
                <div className="text-center py-10">
                  <Calendar size={32} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-sm text-gray-500">No mood data yet</p>
                  <p className="text-xs text-gray-400 mt-1">Check in daily to see your mood trend</p>
                </div>
              ) : (
                <MoodTrendChart trend={data.moodTrend} />
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 size={18} className="text-indigo-500" /> Mood Distribution
                </h2>
                <span className="text-xs text-gray-400">All time</span>
              </div>
              {data.moodDistribution.happy + data.moodDistribution.calm + data.moodDistribution.sad + data.moodDistribution.anxious + data.moodDistribution.neutral === 0 ? (
                <div className="text-center py-10">
                  <BarChart3 size={32} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-sm text-gray-500">No data yet</p>
                </div>
              ) : (
                <MoodDistributionBars distribution={data.moodDistribution} />
              )}
            </div>
          </div>

          {/* Row 3: Journal sentiment + Coaching stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <BookOpen size={18} className="text-indigo-500" /> Journal Sentiment
                </h2>
                <span className="text-xs text-gray-400">Last 14 days</span>
              </div>
              {data.journalSentimentTrend.length === 0 ? (
                <div className="text-center py-10">
                  <BookOpen size={32} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-sm text-gray-500">No journal entries yet</p>
                  <p className="text-xs text-gray-400 mt-1">Write in your journal to see sentiment trends</p>
                </div>
              ) : (
                <JournalSentimentTrend trend={data.journalSentimentTrend} />
              )}
              {data.latestJournalSentiment && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
                  <span className="text-xs text-gray-500">Latest entry:</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    data.latestJournalSentiment.sentiment === "positive" ? "bg-green-100 text-green-700"
                      : data.latestJournalSentiment.sentiment === "negative" ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {data.latestJournalSentiment.sentiment}
                  </span>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Award size={18} className="text-indigo-500" /> Coaching Progress
                </h2>
                <a href="/coaching" className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 transition-colors">
                  Browse programs <ArrowRight size={12} />
                </a>
              </div>
              {data.coachingStats.totalSessions === 0 ? (
                <div className="text-center py-10">
                  <Award size={32} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-sm text-gray-500">No coaching sessions yet</p>
                  <p className="text-xs text-gray-400 mt-1">Start a program to track your progress</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Completion rate</span>
                    <span className="text-sm font-semibold text-gray-900">{data.coachingStats.completionRate}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all" style={{ width: `${data.coachingStats.completionRate}%` }} />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500">Sessions completed</p>
                      <p className="text-xl font-bold text-gray-900">{data.coachingStats.completedSessions}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500">Total steps done</p>
                      <p className="text-xl font-bold text-gray-900">{data.coachingStats.totalStepsCompleted}</p>
                    </div>
                  </div>
                  {Object.keys(data.coachingStats.sessionsByFramework).length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-2">By framework</p>
                      <div className="space-y-1.5">
                        {Object.entries(data.coachingStats.sessionsByFramework).map(([framework, count]) => (
                          <div key={framework} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 capitalize">{framework}</span>
                            <span className="text-gray-900 font-medium">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Row 4: Personality snapshot */}
          {data.personality && Object.keys(data.personality).length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Sparkles size={18} className="text-indigo-500" /> Your Personality Snapshot
                </h2>
                <a href="/personality" className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 transition-colors">
                  Full assessment <ArrowRight size={12} />
                </a>
              </div>
              <PersonalitySnapshot personality={data.personality} />
            </div>
          )}

          {/* Empty state */}
          {data.totalMoodCheckins === 0 && data.totalJournalEntries === 0 && data.coachingStats.totalSessions === 0 && !data.recommendation && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
                <Activity size={28} className="text-indigo-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Your insights will appear here</h2>
              <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                Start checking in with your mood, journaling, or trying a coaching program — your patterns will show up here over time.
              </p>
              <a href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-medium text-sm shadow-md hover:shadow-lg">
                Go to chat <ArrowRight size={16} />
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
