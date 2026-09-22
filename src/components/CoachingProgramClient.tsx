"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, ChevronRight, Loader2, CheckCircle, MessageSquare } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────────

interface CoachingStepResponse {
  stepId: string;
  answer: string;
  timestamp: number;
}

interface CoachingSessionState {
  sessionId: string;
  programId: string;
  stepIndex: number;
  stepTitle: string;
  instruction: string;
  responseType: "text" | "multiple_choice" | "scale_1_10" | "journal" | "none";
  options?: string[];
  isComplete: boolean;
  totalSteps: number;
  error: string | null;
  younaResponse?: string;
  showYounaResponse?: boolean;
}

interface CoachingProgramClientProps {
  programId: string;
  onClose: () => void;
}

// ── Coaching step component ────────────────────────────────────────────────────────

export default function CoachingProgramClient({ programId, onClose }: CoachingProgramClientProps) {
  const [state, setState] = useState<CoachingSessionState | null>(null);
  const [answer, setAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [scaleValue, setScaleValue] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Start session when programId changes
  useEffect(() => {
    const startSession = async () => {
      try {
        const res = await fetch("/api/coaching?action=start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ programId }),
        });
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Start failed: ${res.status} ${errText}`);
        }
        const data = await res.json();
        setState({
          sessionId: data.sessionId,
          programId: data.programId,
          stepIndex: data.stepIndex,
          stepTitle: data.stepTitle,
          instruction: data.instruction,
          responseType: data.responseType,
          options: data.options,
          isComplete: data.isComplete,
          totalSteps: data.totalSteps,
          error: null,
        });
        setAnswer("");
        setSelectedOption(null);
        setScaleValue(null);
        setLocalError(null);
        scrollToBottom();
      } catch (err) {
        setLocalError((err as Error).message || "Failed to start coaching session");
      }
    };
    startSession();
  }, [programId]);

  // Scroll when state updates
  useEffect(() => {
    if (state) scrollToBottom();
  }, [state]);

  const handleSend = useCallback(async () => {
    if (!state || sending) return;

    // Validate input based on response type
    if (state.responseType === "text" && !answer.trim()) return;
    if (state.responseType === "multiple_choice" && !selectedOption) return;
    if (state.responseType === "scale_1_10" && scaleValue === null) return;

    const payload = {
      sessionId: state.sessionId,
      answer: state.responseType === "multiple_choice" ? selectedOption! : answer.trim(),
    };

    setSending(true);
    setLocalError(null);

    try {
      const res = await fetch("/api/coaching?action=respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Respond failed: ${res.status} ${errText}`);
      }
      const data = await res.json();

      setState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          stepIndex: data.stepIndex,
          isComplete: data.isComplete,
          instruction: data.isComplete ? "" : prev.instruction,
          stepTitle: data.stepIndex < prev.totalSteps ? prev.stepTitle : "Complete",
          younaResponse: data.younaResponse,
          showYounaResponse: true,
        };
      });

      if (data.isComplete) {
        // Show completion state
        setAnswer("");
        setSelectedOption(null);
        setScaleValue(null);
      } else {
        // Reset input for next step
        setAnswer("");
        setSelectedOption(null);
        setScaleValue(null);
      }
      scrollToBottom();
    } catch (err) {
      setLocalError((err as Error).message || "Failed to send response");
    } finally {
      setSending(false);
    }
  }, [state, answer, selectedOption, scaleValue, sending]);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleScaleChange = (val: number) => {
    setScaleValue(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && state?.responseType === "text") {
      e.preventDefault();
      handleSend();
    }
  };

  const progressPercent = state ? ((state.stepIndex) / state.totalSteps) * 100 : 0;

  if (localError) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <X size={24} className="text-red-500" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Coaching session error</h2>
        <p className="text-sm text-gray-500 mb-4 max-w-sm">{localError}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors"
        >
          Close
        </button>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6">
        <Loader2 size={32} className="animate-spin text-indigo-500 mb-4" />
        <p className="text-sm text-gray-500">Starting coaching session…</p>
      </div>
    );
  }

  if (state.isComplete) {
    return (
      <div className="flex flex-col h-full">
        {/* Progress */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={16} className="text-green-500" />
            <span className="text-sm font-medium text-gray-700">Program complete</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full w-full bg-gradient-to-r from-green-400 to-green-500 rounded-full" />
          </div>
        </div>

        {/* Completion message */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-xl mx-auto space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md">
                <CheckCircle size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">You did it</h2>
                <p className="text-sm text-gray-500">{state.totalSteps} steps completed</p>
              </div>
            </div>

            {state.younaResponse && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MessageSquare size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{state.younaResponse}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full mt-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-medium text-sm shadow-md hover:shadow-lg"
            >
              Return to programs
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active step UI
  return (
    <div className="flex flex-col h-full">
      {/* Header with progress */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">Step {state.stepIndex + 1} of {state.totalSteps}</span>
            <span className="text-xs text-gray-300">·</span>
            <span className="text-xs text-gray-400">{state.stepTitle}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Instructions / Youna response */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="max-w-2xl mx-auto space-y-5">
          {/* Youna reflection from previous step (if any) */}
          {state.showYounaResponse && state.younaResponse && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MessageSquare size={14} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{state.younaResponse}</p>
                </div>
              </div>
            </div>
          )}

          {/* Current step instruction */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100">
            <h3 className="text-sm font-semibold text-indigo-700 mb-3">{state.stepTitle}</h3>
            <div
              className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: state.instruction.replace(/\n/g, "<br />") }}
            />

            {/* Multiple choice options */}
            {state.responseType === "multiple_choice" && state.options && (
              <div className="mt-5 space-y-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Choose one</p>
                {state.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOptionSelect(option)}
                    className={`w-full text-left p-3 rounded-xl border-2 transition-all text-sm ${
                      selectedOption === option
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {/* Scale input */}
            {state.responseType === "scale_1_10" && (
              <div className="mt-5">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Rate from 0 to 10</p>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={scaleValue ?? 0}
                    onChange={(e) => handleScaleChange(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-indigo-600"
                    style={{
                      background: `linear-gradient(to right, #6366f1 ${((scaleValue ?? 0) / 10) * 100}%, #e5e7eb ${((scaleValue ?? 0) / 10) * 100}%)`,
                    }}
                  />
                  <span className="text-lg font-semibold text-indigo-600 w-8 text-center">{scaleValue ?? 0}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
                  <span>0 — Not at all</span>
                  <span>10 — As strong as it gets</span>
                </div>
              </div>
            )}

            {/* Text input */}
            {state.responseType === "text" && (
              <div className="mt-5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">
                  Your response
                </label>
                <textarea
                  ref={textareaRef}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your answer here…"
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-gray-400 transition-all"
                />
              </div>
            )}
          </div>

          {/* Current responses so far */}
          <div className="text-xs text-gray-400 text-right">
            {state.stepIndex} of {state.totalSteps} steps completed
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="px-6 py-4 border-t border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1.5"
          >
            <X size={14} />
            Close
          </button>
          <button
            onClick={handleSend}
            disabled={!canSend(state, answer, selectedOption, scaleValue) || sending}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-medium text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {sending ? <Loader2 size={16} className="animate-spin" /> : <ChevronRight size={16} />}
            {sending ? "Sending…" : canSend(state, answer, selectedOption, scaleValue) ? "Continue" : "Answer required"}
          </button>
        </div>
        {localError && (
          <p className="text-xs text-red-500 mt-2">{localError}</p>
        )}
      </div>
    </div>
  );
}

function canSend(
  state: CoachingSessionState,
  answer: string,
  selectedOption: string | null,
  scaleValue: number | null,
): boolean {
  if (state.responseType === "text") return answer.trim().length > 0;
  if (state.responseType === "multiple_choice") return selectedOption !== null;
  if (state.responseType === "scale_1_10") return scaleValue !== null;
  return true;
}
