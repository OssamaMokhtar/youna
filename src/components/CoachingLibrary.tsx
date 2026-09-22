"use client";

import { useState, useEffect, useCallback } from "react";
import { Award, Brain, Heart, Sparkles, Loader2, X, ChevronRight, BookOpen } from "lucide-react";
import CoachingProgramClient from "@/components/CoachingProgramClient";

// ── Types ──────────────────────────────────────────────────────────────────────────

interface CoachingProgramSummary {
  id: string;
  name: string;
  framework: string;
  description: string;
  estimatedDuration: string;
  bestFor: string[];
  totalSteps: number;
  requiresAssessment: boolean;
}

interface CoachingLibraryState {
  programs: CoachingProgramSummary[];
  loading: boolean;
  error: string | null;
}

// ── Framework color map ────────────────────────────────────────────────────────────

const FRAMEWORK_COLORS: Record<string, string> = {
  CBT: "from-blue-500 to-cyan-500",
  DBT: "from-orange-500 to-amber-500",
  ACT: "from-green-500 to-emerald-500",
  EFT: "from-pink-500 to-rose-500",
  SFBT: "from-violet-500 to-purple-500",
  Mindfulness: "from-teal-500 to-cyan-500",
};

const FRAMEWORK_ICONS: Record<string, typeof Brain> = {
  CBT: Brain,
  DBT: Heart,
  ACT: Sparkles,
  EFT: Heart,
  SFBT: Award,
  Mindfulness: Sparkles,
};

// ── Component ──────────────────────────────────────────────────────────────────────

export default function CoachingLibrary() {
  const [state, setState] = useState<CoachingLibraryState>({
    programs: [],
    loading: true,
    error: null,
  });
  const [selectedProgram, setSelectedProgram] = useState<CoachingProgramSummary | null>(null);

  // Fetch program list from API
  const fetchPrograms = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await fetch("/api/coaching?action=programs", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setState({ programs: data.programs, loading: false, error: null });
    } catch (err) {
      setState((s) => ({
        ...s,
        loading: false,
        error: (err as Error).message || "Failed to load coaching programs",
      }));
    }
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const handleStart = (program: CoachingProgramSummary) => {
    setSelectedProgram(program);
  };

  const handleClose = () => {
    setSelectedProgram(null);
  };

  if (state.loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <Loader2 size={40} className="animate-spin text-indigo-500 mb-4" />
        <p className="text-sm text-gray-500">Loading coaching programs…</p>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 text-center">
        <Brain size={32} className="text-red-400 mb-3" />
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Unable to load programs</h2>
        <p className="text-sm text-gray-500 mb-4">{state.error}</p>
        <button
          onClick={fetchPrograms}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Award size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Coaching Programs</h1>
            <p className="text-xs text-gray-500">Structured exercises grounded in evidence-based frameworks</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-3 max-w-2xl">
          Each program guides you through a focused exercise in a specific therapeutic framework — CBT, DBT, ACT, EFT, SFBT, or mindfulness.
          They're sequential: you move step by step, at your own pace, and Youna stays with you through each one.
        </p>
      </div>

      {/* Program grid */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
        {state.programs.map((program) => {
          const FrameworkIcon = FRAMEWORK_ICONS[program.framework] || Brain;
          const gradient = FRAMEWORK_COLORS[program.framework] || "from-indigo-500 to-purple-600";

          return (
            <button
              key={program.id}
              onClick={() => handleStart(program)}
              className="w-full text-left p-4 rounded-xl border border-gray-200 bg-white hover:border-indigo-200 hover:shadow-sm hover:bg-indigo-50/30 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow`}>
                  <FrameworkIcon size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm">{program.name}</h3>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full bg-gradient-to-r ${gradient} text-white`}>
                      {program.framework}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">{program.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <BookOpen size={12} />
                      {program.totalSteps} steps
                    </span>
                    <span className="flex items-center gap-1">
                      <Sparkles size={12} />
                      {program.estimatedDuration}
                    </span>
                    {program.bestFor.length > 0 && (
                      <span className="flex items-center gap-1 truncate max-w-[160px]">
                        <Heart size={12} />
                        {program.bestFor.slice(0, 2).join(", ")}
                        {program.bestFor.length > 2 && "…"}
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-indigo-500 transition-colors mt-1" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Active program modal */}
      {selectedProgram && (
        <CoachingProgramClient
          programId={selectedProgram.id}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
