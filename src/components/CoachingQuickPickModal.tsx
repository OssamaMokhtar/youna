"use client";

import { useState } from "react";
import { X, ChevronRight, Sparkles } from "lucide-react";
import CoachingProgramClient from "@/components/CoachingProgramClient";

interface QuickPickProgram {
  id: string;
  name: string;
  framework: string;
  description: string;
  estimatedDuration: string;
  bestFor: string[];
}

// Pre-selected programs shown in the quick-pick (curated shortlist for in-chat discovery)
const QUICK_PICK_PROGRAMS: QuickPickProgram[] = [
  {
    id: "cbt_thought_record",
    name: "Thought Record",
    framework: "CBT",
    description: "Work through a situation, automatic thought, and find a more balanced perspective.",
    estimatedDuration: "8-12 min",
    bestFor: ["anxiety", "negative thoughts"],
  },
  {
    id: "dbt_distress_tolerance",
    name: "Distress Tolerance",
    framework: "DBT",
    description: "TIPP skills (Temperature, Intense exercise, Paced breathing, Paired relaxation) for high-intensity moments.",
    estimatedDuration: "6-10 min",
    bestFor: ["overwhelm", "high intensity"],
  },
  {
    id: "mindfulness_three_minutes",
    name: "3-Minute Breathing Space",
    framework: "Mindfulness",
    description: "A quick three-step mindfulness exercise: arriving, gathering, expanding.",
    estimatedDuration: "3-4 min",
    bestFor: ["quick reset", "stress"],
  },
  {
    id: "act_values_clarification",
    name: "Values Clarification",
    framework: "ACT",
    description: "Clarify what matters and identify one small committed action.",
    estimatedDuration: "5-7 min",
    bestFor: ["feeling stuck", "direction"],
  },
  {
    id: "eft_emotion_mapping",
    name: "Emotion Mapping",
    framework: "EFT",
    description: "Trace a secondary emotion to the primary emotion underneath and respond with self-compassion.",
    estimatedDuration: "5-7 min",
    bestFor: ["strong emotions", "self-compassion"],
  },
  {
    id: "sfbt_solutions_focus",
    name: "Solutions Focus",
    framework: "SFBT",
    description: "Find what's already working, define the preferred future, take the next small step.",
    estimatedDuration: "4-6 min",
    bestFor: ["problem-solving", "small steps"],
  },
  {
    id: "mindfulness_body_scan",
    name: "Body Scan",
    framework: "Mindfulness",
    description: "A guided scan from feet to face — noticing sensations without judgment.",
    estimatedDuration: "8-12 min",
    bestFor: ["relaxation", "body awareness"],
  },
  {
    id: "cbt_cognitive_distortion",
    name: "Cognitive Distortion Check",
    framework: "CBT",
    description: "Identify a sticky thought, label the distortion pattern, and reframe it.",
    estimatedDuration: "4-6 min",
    bestFor: ["negative thoughts", "overthinking"],
  },
];

interface CoachingQuickPickModalProps {
  onClose: () => void;
}

export default function CoachingQuickPickModal({ onClose }: CoachingQuickPickModalProps) {
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [launching, setLaunching] = useState(false);

  const handleLaunch = (programId: string) => {
    setSelectedProgramId(programId);
    setLaunching(true);
  };

  const FRAMEWORK_COLORS: Record<string, string> = {
    CBT: "from-blue-500 to-cyan-500",
    DBT: "from-orange-500 to-amber-500",
    ACT: "from-green-500 to-emerald-500",
    EFT: "from-pink-500 to-rose-500",
    SFBT: "from-violet-500 to-purple-500",
    Mindfulness: "from-teal-500 to-cyan-500",
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      {/* Backdrop click to dismiss */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Choose a program</h2>
              <p className="text-xs text-gray-500">Built for you, right from this conversation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Program list */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {QUICK_PICK_PROGRAMS.map((program) => {
            const gradient = FRAMEWORK_COLORS[program.framework] || "from-indigo-500 to-purple-600";
            return (
              <button
                key={program.id}
                onClick={() => handleLaunch(program.id)}
                className="w-full text-left p-3.5 rounded-xl border border-gray-200 bg-white hover:border-indigo-200 hover:shadow-sm hover:bg-indigo-50/30 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow`}>
                    <Sparkles size={16} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-gray-900 text-sm">{program.name}</h3>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-gradient-to-r ${gradient} text-white`}>
                        {program.framework}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-1.5">{program.description}</p>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <Sparkles size={10} />
                        {program.estimatedDuration}
                      </span>
                      {program.bestFor.length > 0 && (
                        <span className="flex items-center gap-1 truncate">
                          <span className="w-1 h-1 rounded-full bg-gray-300" />
                          {program.bestFor[0]}
                          {program.bestFor.length > 1 && `, ${program.bestFor[1]}`}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-indigo-500 transition-colors mt-1 flex-shrink-0" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Not now — I'll browse later
          </button>
        </div>

        {/* Launching overlay (program client replaces modal content) */}
        {selectedProgramId && !launching && (
          <div className="absolute inset-0 bg-white z-10">
            <CoachingProgramClient
              programId={selectedProgramId}
              onClose={() => {
                setSelectedProgramId(null);
                setLaunching(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
