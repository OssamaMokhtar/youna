"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, Sparkles, Brain, Heart, User, Check, Target, Shield, Users } from "lucide-react";

interface AssessmentQuestion {
  id: string;
  question: string;
  options: { label: string; value: number; description: string }[];
}

const phaseOneQuestions: AssessmentQuestion[] = [
  {
    id: "energy",
    question: "How do you typically recharge your energy?",
    options: [
      { label: "Time alone", value: 1, description: "Solitude restores me" },
      { label: "Time with others", value: 5, description: "Socializing energizes me" },
    ],
  },
  {
    id: "structure",
    question: "How do you approach plans and schedules?",
    options: [
      { label: "I love structure", value: 1, description: "Plans give me peace" },
      { label: "I prefer flexibility", value: 5, description: "I go with the flow" },
    ],
  },
  {
    id: "emotions",
    question: "How do you relate to your emotions?",
    options: [
      { label: "I feel deeply", value: 5, description: "Emotions are vivid to me" },
      { label: "I keep emotions private", value: 1, description: "I process internally" },
    ],
  },
  {
    id: "decisions",
    question: "How do you usually make decisions?",
    options: [
      { label: "Logic and analysis", value: 1, description: "I weigh the facts" },
      { label: "Values and feelings", value: 5, description: "I follow my gut" },
    ],
  },
  {
    id: "change",
    question: "How do you handle new experiences?",
    options: [
      { label: "I love novelty", value: 5, description: "New things excite me" },
      { label: "I prefer familiarity", value: 1, description: "Known is comfortable" },
    ],
  },
  {
    id: "conflict",
    question: "When there's disagreement, I tend to...",
    options: [
      { label: "Avoid it", value: 1, description: "Harmony matters" },
      { label: "Address it directly", value: 5, description: "I speak my truth" },
    ],
  },
];

const attachmentOptions = [
  { label: "Comfortable with closeness", value: "secure", description: "I trust and connect easily" },
  { label: "I worry about abandonment", value: "anxious", description: "I sometimes fear losing connection" },
  { label: "I value independence", value: "avoidant", description: "I keep some distance" },
  { label: "I want closeness but find it hard", value: "fearful", description: "I'm cautious about getting close" },
];

// ── HEXACO (8 questions) ──────────────────────────────────────

interface HexacoQuestion {
  id: string;
  dimension: "honestyHumility" | "emotionality" | "extraversion" | "agreeableness" | "conscientiousness" | "openness";
  question: string;
  options: { label: string; value: number; description: string }[];
}

const hexacoQuestions: HexacoQuestion[] = [
  {
    id: "HH_q1",
    dimension: "honestyHumility",
    question: "If I knew I could never get caught, I would still not cheat or steal.",
    options: [
      { label: "Strongly agree", value: 5, description: "My honesty isn't just about consequences" },
      { label: "Strongly disagree", value: 1, description: "I'd take the opportunity if there were no risks" },
    ],
  },
  {
    id: "HH_q2",
    dimension: "honestyHumility",
    question: "I would never accept a bribe, even if it were very large.",
    options: [
      { label: "Strongly agree", value: 5, description: "I don't let money sway my ethics" },
      { label: "Strongly disagree", value: 1, description: "Money changes what's reasonable" },
    ],
  },
  {
    id: "EM_q1",
    dimension: "emotionality",
    question: "I feel my emotions very intensely.",
    options: [
      { label: "Strongly agree", value: 5, description: "I feel things vividly" },
      { label: "Strongly disagree", value: 1, description: "I stay emotionally even" },
    ],
  },
  {
    id: "EM_q2",
    dimension: "emotionality",
    question: "When I'm stressed, I need someone to lean on.",
    options: [
      { label: "Strongly agree", value: 5, description: "I seek support when overwhelmed" },
      { label: "Strongly disagree", value: 1, description: "I handle stress alone" },
    ],
  },
  {
    id: "EX_q1",
    dimension: "extraversion",
    question: "I like to be the center of attention in social situations.",
    options: [
      { label: "Strongly agree", value: 5, description: "I enjoy being noticed" },
      { label: "Strongly disagree", value: 1, description: "I prefer to stay in the background" },
    ],
  },
  {
    id: "AG_q1",
    dimension: "agreeableness",
    question: "I usually forgive people who have hurt me.",
    options: [
      { label: "Strongly agree", value: 5, description: "I let go of grudges easily" },
      { label: "Strongly disagree", value: 1, description: "I hold onto hurts" },
    ],
  },
  {
    id: "CO_q1",
    dimension: "conscientiousness",
    question: "I always keep my promises, even when it's difficult.",
    options: [
      { label: "Strongly agree", value: 5, description: "My word is absolute" },
      { label: "Strongly disagree", value: 1, description: "Circumstances can change things" },
    ],
  },
  {
    id: "OP_q1",
    dimension: "openness",
    question: "I enjoy thinking about abstract ideas and philosophical questions.",
    options: [
      { label: "Strongly agree", value: 5, description: "I love abstract thinking" },
      { label: "Strongly disagree", value: 1, description: "I prefer concrete, practical thinking" },
    ],
  },
];

// ── Enneagram (5 questions) ───────────────────────────────────

interface EnneagramQuestion {
  id: string;
  question: string;
  options: { label: string; value: number; description: string }[];
}

const enneagramQuestions: EnneagramQuestion[] = [
  {
    id: "EN_q1",
    question: "What matters most to you in life?",
    options: [
      { label: "Being capable and knowledgeable", value: 5, description: "You want to understand things deeply" },
      { label: "Feeling secure and supported", value: 6, description: "You value stability and trust" },
      { label: "Being peaceful and happy", value: 9, description: "You want harmony and contentment" },
      { label: "Being loved and needed", value: 2, description: "You find meaning in helping others" },
      { label: "Being joyful and free", value: 7, description: "You want to experience everything" },
    ],
  },
  {
    id: "EN_q2",
    question: "Under stress, you tend to...",
    options: [
      { label: "Withdraw and analyze", value: 5, description: "You go inward to figure things out" },
      { label: "Worry and seek reassurance", value: 6, description: "You anticipate what could go wrong" },
      { label: "Numb out and tune out", value: 9, description: "You distract yourself to cope" },
      { label: "Become more helpful than usual", value: 2, description: "You pour energy into others" },
      { label: "Become scattered and active", value: 7, description: "You keep moving to avoid feeling" },
    ],
  },
  {
    id: "EN_q3",
    question: "What's your biggest fear?",
    options: [
      { label: "Being useless or incompetent", value: 5, description: "You worry about not knowing enough" },
      { label: "Being without support or guidance", value: 6, description: "You worry about facing things alone" },
      { label: "Loss and separation", value: 9, description: "You worry about things falling apart" },
      { label: "Being unloved or unwanted", value: 2, description: "You worry about being alone" },
      { label: "Being trapped or deprived", value: 7, description: "You worry about missing out" },
    ],
  },
  {
    id: "EN_q4",
    question: "Which word best describes your natural energy?",
    options: [
      { label: "Observant", value: 5, description: "You notice things others miss" },
      { label: "Loyal", value: 6, description: "You show up for people consistently" },
      { label: "Easygoing", value: 9, description: "You adapt to whatever's happening" },
      { label: "Caring", value: 2, description: "You bring warmth to every room" },
      { label: "Spontaneous", value: 7, description: "You keep things lively and unexpected" },
    ],
  },
];

// ── DISC (5 questions) ────────────────────────────────────────

interface DiscQuestion {
  id: string;
  question: string;
  options: { label: string; value: "D" | "I" | "S" | "C"; description: string }[];
}

const discQuestions: DiscQuestion[] = [
  {
    id: "DISC_q1",
    question: "In a team project, you naturally take the role of...",
    options: [
      { label: "The driver — pushing toward the goal", value: "D", description: "Results-oriented, decisive" },
      { label: "The motivator — keeping everyone energized", value: "I", description: "Enthusiastic, persuasive" },
      { label: "The stabilizer — making sure we get along", value: "S", description: "Patient, supportive" },
      { label: "The analyst — checking the details", value: "C", description: "Precise, quality-focused" },
    ],
  },
  {
    id: "DISC_q2",
    question: "When facing a deadline, you...",
    options: [
      { label: "Push hard and make quick calls", value: "D", description: "Time pressure sharpens your focus" },
      { label: "Bring energy and rally the team", value: "I", description: "You thrive in the sprint" },
      { label: "Stay steady and keep things on track", value: "S", description: "You're the calm in the crunch" },
      { label: "Double-check everything for accuracy", value: "C", description: "You won't ship anything sloppy" },
    ],
  },
  {
    id: "DISC_q3",
    question: "People usually describe you as...",
    options: [
      { label: "Direct and confident", value: "D", description: "You say what you mean" },
      { label: "Warm and charismatic", value: "I", description: "People are drawn to you" },
      { label: "Reliable and thoughtful", value: "S", description: "People know they can count on you" },
      { label: "Careful and thorough", value: "C", description: "You do things the right way" },
    ],
  },
  {
    id: "DISC_q4",
    question: "In a disagreement, you...",
    options: [
      { label: "State your position clearly and debate it", value: "D", description: "You engage head-on" },
      { label: "Try to find common ground and connect", value: "I", description: "You smooth things over with warmth" },
      { label: "Listen and look for a compromise", value: "S", description: "You want everyone to feel heard" },
      { label: "Use facts and logic to resolve it", value: "C", description: "You let the evidence decide" },
    ],
  },
  {
    id: "DISC_q5",
    question: "What environment helps you do your best work?",
    options: [
      { label: "Fast-paced with clear targets", value: "D", description: "You want to move and win" },
      { label: "Collaborative and social", value: "I", description: "You do best with people around" },
      { label: "Stable and predictable", value: "S", description: "You need consistency to thrive" },
      { label: "Quiet with time to focus deeply", value: "C", description: "You need space for precision" },
    ],
  },
];

// ── Love Languages (5 questions) ──────────────────────────────

interface LoveLanguageQuestion {
  id: string;
  question: string;
  options: { label: string; value: "words" | "acts" | "gifts" | "time" | "touch"; description: string }[];
}

const loveLanguageQuestions: LoveLanguageQuestion[] = [
  {
    id: "LL_q1",
    question: "When you feel most appreciated by someone, it's usually when they...",
    options: [
      { label: "Say something kind or encouraging", value: "words", description: "You hear it in their words" },
      { label: "Do something helpful for you", value: "acts", description: "Actions speak louder" },
      { label: "Give you a thoughtful gift", value: "gifts", description: "The gesture means a lot" },
      { label: "Give you their full, undivided attention", value: "time", description: "Presence is everything" },
      { label: "Show physical affection", value: "touch", description: "A hug, a hand on your shoulder" },
    ],
  },
  {
    id: "LL_q2",
    question: "The thing you value most in a relationship is...",
    options: [
      { label: "Feeling verbally affirmed", value: "words", description: "You need to hear the love" },
      { label: "Seeing effort and thoughtfulness", value: "acts", description: "Love shows up in what people do" },
      { label: "Receiving tokens and surprises", value: "gifts", description: "Gifts say 'I was thinking of you'" },
      { label: "Quality time together", value: "time", description: "Time is the real gift" },
      { label: "Physical closeness and warmth", value: "touch", description: "Touch connects you" },
    ],
  },
  {
    id: "LL_q3",
    question: "When someone is hurting, you show you care by...",
    options: [
      { label: "Saying the right thing to comfort them", value: "words", description: "Your words bring comfort" },
      { label: "Doing something practical to help", value: "acts", description: "You take action" },
      { label: "Bringing them something meaningful", value: "gifts", description: "A gift says 'I see you'" },
      { label: "Sitting with them, present and patient", value: "time", description: "You stay when it matters" },
      { label: "Offering a hug or physical presence", value: "touch", description: "Touch says 'I'm here'" },
    ],
  },
  {
    id: "LL_q4",
    question: "The worst way someone can ignore you is by...",
    options: [
      { label: "Never saying they appreciate you", value: "words", description: "Silence feels like rejection" },
      { label: "Never helping even when they could", value: "acts", description: "Inaction feels like indifference" },
      { label: "Never acknowledging special moments", value: "gifts", description: "Forgotten moments hurt" },
      { label: "Always being too busy for you", value: "time", description: "Absence feels like loss" },
      { label: "Pulling away physically", value: "touch", description: "Distance hurts deeply" },
    ],
  },
  {
    id: "LL_q5",
    question: "Which gesture would make your whole week?",
    options: [
      { label: "A heartfelt text or note", value: "words", description: "Words stick with you" },
      { label: "Someone doing something to make your life easier", value: "acts", description: "Acts lighten the load" },
      { label: "A small gift that shows they know you", value: "gifts", description: "Thoughtfulness is the gift" },
      { label: "An uninterrupted afternoon together", value: "time", description: "Time is the rarest gift" },
      { label: "A long hug or holding hands", value: "touch", description: "Touch grounds you" },
    ],
  },
];

// ── Step type ──────────────────────────────────────────────────

type Step =
  | "welcome"
  | "questions-phase1"
  | "questions-hexo"
  | "questions-enneagram"
  | "questions-disc"
  | "questions-love"
  | "attachment"
  | "goals"
  | "complete";

export default function PersonalityAssessment() {
  const [step, setStep] = useState<Step>("welcome");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [phaseOneAnswers, setPhaseOneAnswers] = useState<Record<string, number>>({});
  const [hexacoAnswers, setHexacoAnswers] = useState<Record<string, number>>({});
  const [enneagramAnswers, setEnneagramAnswers] = useState<Record<string, number>>({});
  const [discAnswers, setDiscAnswers] = useState<Record<string, "D" | "I" | "S" | "C">>({});
  const [loveLanguageAnswers, setLoveLanguageAnswers] = useState<
    Record<string, "words" | "acts" | "gifts" | "time" | "touch">
  >({});
  const [attachmentStyle, setAttachmentStyle] = useState<string>("");
  const [goals, setGoals] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalQuestions =
    phaseOneQuestions.length +
    hexacoQuestions.length +
    enneagramQuestions.length +
    discQuestions.length +
    loveLanguageQuestions.length +
    1;

  const answeredCount =
    Object.keys(phaseOneAnswers).length +
    Object.keys(hexacoAnswers).length +
    Object.keys(enneagramAnswers).length +
    Object.keys(discAnswers).length +
    Object.keys(loveLanguageAnswers).length;

  const progressPct = Math.min(100, (answeredCount / totalQuestions) * 100);

  const handlePhaseOneAnswer = (value: number) => {
    const q = phaseOneQuestions[currentQuestion];
    setPhaseOneAnswers((prev) => ({ ...prev, [q.id]: value }));
    if (currentQuestion < phaseOneQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion((prev) => prev + 1), 200);
    } else {
      setCurrentQuestion(0);
      setStep("questions-hexo");
    }
  };

  const handleHexacoAnswer = (value: number) => {
    const q = hexacoQuestions[currentQuestion];
    setHexacoAnswers((prev) => ({ ...prev, [q.id]: value }));
    if (currentQuestion < hexacoQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion((prev) => prev + 1), 200);
    } else {
      setCurrentQuestion(0);
      setStep("questions-enneagram");
    }
  };

  const handleEnneagramAnswer = (value: number) => {
    const q = enneagramQuestions[currentQuestion];
    setEnneagramAnswers((prev) => ({ ...prev, [q.id]: value }));
    if (currentQuestion < enneagramQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion((prev) => prev + 1), 200);
    } else {
      setCurrentQuestion(0);
      setStep("questions-disc");
    }
  };

  const handleDiscAnswer = (value: "D" | "I" | "S" | "C") => {
    const q = discQuestions[currentQuestion];
    setDiscAnswers((prev) => ({ ...prev, [q.id]: value }));
    if (currentQuestion < discQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion((prev) => prev + 1), 200);
    } else {
      setCurrentQuestion(0);
      setStep("questions-love");
    }
  };

  const handleLoveLanguageAnswer = (value: "words" | "acts" | "gifts" | "time" | "touch") => {
    const q = loveLanguageQuestions[currentQuestion];
    setLoveLanguageAnswers((prev) => ({ ...prev, [q.id]: value }));
    if (currentQuestion < loveLanguageQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion((prev) => prev + 1), 200);
    } else {
      setCurrentQuestion(0);
      setStep("attachment");
    }
  };

  const handleAttachmentSelect = (value: string) => {
    setAttachmentStyle(value);
    setTimeout(() => setStep("goals"), 200);
  };

  const handleSubmit = () => {
    if (!goals.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setStep("complete");
      setIsSubmitting(false);
    }, 1200);
  };

  // ── Scoring ──────────────────────────────────────────────────

  const bigFiveScores = {
    openness: phaseOneAnswers["change"] || 3,
    conscientiousness:
      phaseOneAnswers["structure"] === 1 ? 4.5 : phaseOneAnswers["structure"] === 5 ? 1.5 : 3,
    extraversion:
      phaseOneAnswers["energy"] === 5 ? 4.5 : phaseOneAnswers["energy"] === 1 ? 1.5 : 3,
    agreeableness:
      phaseOneAnswers["conflict"] === 5 ? 4.0 : phaseOneAnswers["conflict"] === 1 ? 2.0 : 3,
    neuroticism:
      phaseOneAnswers["emotions"] === 5 ? 3.5 : phaseOneAnswers["emotions"] === 1 ? 1.5 : 2.5,
  };

  const hexacoScores = {
    honestyHumility:
      (hexacoAnswers["HH_q1"] || 3 + hexacoAnswers["HH_q2"] || 3) / 2 +
      (hexacoAnswers["HH_q1"] || 0 + hexacoAnswers["HH_q2"] || 0) / 2,
    emotionality:
      (hexacoAnswers["EM_q1"] || 3 + hexacoAnswers["EM_q2"] || 3) / 2,
    extraversion: hexacoAnswers["EX_q1"] || 3,
    agreeableness: hexacoAnswers["AG_q1"] || 3,
    conscientiousness: hexacoAnswers["CO_q1"] || 3,
    openness: hexacoAnswers["OP_q1"] || 3,
  };

  const enneagramType = (() => {
    const vals = Object.values(enneagramAnswers);
    if (vals.length === 0) return null;
    const q1 = enneagramAnswers["EN_q1"] || 0;
    const q2 = enneagramAnswers["EN_q2"] || 0;
    const q3 = enneagramAnswers["EN_q3"] || 0;
    const q4 = enneagramAnswers["EN_q4"] || 0;
    const q5 = enneagramAnswers["EN_q5"] || 0;
    const scores = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
    if (q1 >= 4) scores[5] += 2;
    if (q1 >= 3) scores[6] += 1;
    if (q1 <= 2) scores[9] += 1;
    if (q2 === 5) scores[5] += 3;
    if (q2 === 6) scores[6] += 3;
    if (q2 === 9) scores[9] += 3;
    if (q2 === 2) scores[2] += 2;
    if (q2 === 7) scores[7] += 2;
    if (q3 === 5) scores[5] += 3;
    if (q3 === 6) scores[6] += 2;
    if (q3 === 9) scores[9] += 2;
    if (q3 === 2) scores[2] += 2;
    if (q3 === 7) scores[7] += 2;
    if (q4 === 5) scores[5] += 3;
    if (q4 === 6) scores[6] += 2;
    if (q4 === 9) scores[9] += 2;
    if (q4 === 2) scores[2] += 2;
    if (q4 === 7) scores[7] += 2;
    if (q5 === 5) scores[5] += 2;
    if (q5 === 6) scores[6] += 2;
    if (q5 === 9) scores[9] += 2;
    if (q5 === 2) scores[2] += 2;
    if (q5 === 7) scores[7] += 2;
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const top = parseInt(sorted[0][0]);
    if (sorted.length > 1 && sorted[1][1] > 0 && Math.abs(sorted[0][1] - sorted[1][1]) <= 1) {
      return top > parseInt(sorted[1][0]) ? top : parseInt(sorted[1][0]);
    }
    return top;
  })();

  const discType = (() => {
    const counts = { D: 0, I: 0, S: 0, C: 0 };
    Object.values(discAnswers).forEach((v) => counts[v]++);
    const max = Math.max(...Object.values(counts));
    if (counts.D === max) return "D";
    if (counts.I === max) return "I";
    if (counts.S === max) return "S";
    return "C";
  })();

  const loveLangs = (() => {
    const map: Record<string, number> = { words: 0, acts: 0, gifts: 0, time: 0, touch: 0 };
    Object.entries(loveLanguageAnswers).forEach(([k, v]) => {
      map[v as string] = (map[v as string] || 0) + 1;
    });
    return Object.entries(map)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([k]) => k as "words" | "acts" | "gifts" | "time" | "touch");
  })();

  const communicationStyle = (): string => {
    if (attachmentStyle === "secure") return "Warm and direct — you share your feelings openly";
    if (attachmentStyle === "anxious")
      return "Caring and reassuring — you value emotional validation";
    if (attachmentStyle === "avoidant")
      return "Respectful and patient — you appreciate space and autonomy";
    return "Gentle and inviting — you take time to build trust";
  };

  const personalityTypeLabel = (): string => {
    const vals = Object.values(phaseOneAnswers);
    if (vals.length === 0) return "Balanced";
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    if (avg >= 4) return "Explorer (High Openness, flexible, curious)";
    if (avg >= 2.5) return "Balancer (Moderate across traits, adaptable)";
    return "Anchorer (Values stability, loyal, grounded)";
  };

  const enneagramDescriptions: Record<number, { name: string; fear: string; desire: string; growth: string }> = {
    1: { name: "The Reformer", fear: "Being corrupt or defective", desire: "To be good and right", growth: "Type 7" },
    2: { name: "The Helper", fear: "Being unloved", desire: "To be loved and needed", growth: "Type 4" },
    3: { name: "The Achiever", fear: "Being worthless", desire: "To be valuable and admired", growth: "Type 6" },
    4: { name: "The Individualist", fear: "Having no identity", desire: "To be unique and authentic", growth: "Type 1" },
    5: { name: "The Investigator", fear: "Being useless or incompetent", desire: "To be capable and know", growth: "Type 8" },
    6: { name: "The Loyalist", fear: "Being without support", desire: "To have security and guidance", growth: "Type 9" },
    7: { name: "The Enthusiast", fear: "Being deprived or trapped", desire: "To be happy and free", growth: "Type 5" },
    8: { name: "The Challenger", fear: "Being harmed or controlled", desire: "To protect and be strong", growth: "Type 2" },
    9: { name: "The Peacemaker", fear: "Loss and separation", desire: "To have inner stability", growth: "Type 3" },
  };

  const loveLangLabels: Record<string, string> = {
    words: "Words of Affirmation",
    acts: "Acts of Service",
    gifts: "Receiving Gifts",
    time: "Quality Time",
    touch: "Physical Touch",
  };

  const loveLangEmojis: Record<string, string> = {
    words: "💬",
    acts: "🛠️",
    gifts: "🎁",
    time: "⏰",
    touch: "🤝",
  };

  const discDescriptions: Record<string, string> = {
    D: "Direct, results-driven, competitive — you take charge",
    I: "Enthusiastic, persuasive, social — you bring energy",
    S: "Patient, supportive, reliable — you keep things steady",
    C: "Precise, analytical, quality-focused — you get it right",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>
              {step === "welcome"
                ? "Welcome"
                : step === "questions-phase1"
                ? `Personality — Q${currentQuestion + 1}/${phaseOneQuestions.length}`
                : step === "questions-hexo"
                ? `HEXACO — Q${currentQuestion + 1}/${hexacoQuestions.length}`
                : step === "questions-enneagram"
                ? `Enneagram — Q${currentQuestion + 1}/${enneagramQuestions.length}`
                : step === "questions-disc"
                ? `DISC — Q${currentQuestion + 1}/${discQuestions.length}`
                : step === "questions-love"
                ? `Love Languages — Q${currentQuestion + 1}/${loveLanguageQuestions.length}`
                : step === "attachment"
                ? "Your relationships"
                : step === "goals"
                ? "Your intentions"
                : "Complete"}
            </span>
            <span>{Math.round(progressPct)}% complete</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Welcome */}
        {step === "welcome" && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-fade-in text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Brain size={36} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Let's Get to Know You</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              This helps Youna understand your personality, how you relate to others, and what you're
              looking for. It takes about 5 minutes — and every answer makes Youna more personal to you.
            </p>
            <ul className="text-left text-sm text-gray-600 mb-8 space-y-2 mx-auto max-w-sm">
              {[
                "No right or wrong answers — just be honest",
                "Your responses are private and encrypted",
                "You can skip anything you prefer not to answer",
                "We use multiple frameworks: Big Five, HEXACO, Enneagram, DISC, Love Languages",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setStep("questions-phase1")}
              className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-md"
            >
              Get Started
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Phase One Questions */}
        {step === "questions-phase1" && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-fade-in">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-indigo-600 text-sm font-medium mb-2">
                <Sparkles size={16} />
                <span>Big Five — Personality Fundamentals</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {phaseOneQuestions[currentQuestion].question}
              </h3>
            </div>
            <div className="space-y-4">
              {phaseOneQuestions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handlePhaseOneAnswer(option.value)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    phaseOneAnswers[phaseOneQuestions[currentQuestion].id] === option.value
                      ? "border-indigo-500 bg-indigo-50 shadow-md"
                      : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{option.label}</span>
                    {phaseOneAnswers[phaseOneQuestions[currentQuestion].id] === option.value && (
                      <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                </button>
              ))}
            </div>
            {currentQuestion < phaseOneQuestions.length - 1 && (
              <button
                onClick={() => setCurrentQuestion((prev) => prev - 1)}
                className="mt-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft size={16} />
                Go back
              </button>
            )}
          </div>
        )}

        {/* HEXACO */}
        {step === "questions-hexo" && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-fade-in">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-violet-600 text-sm font-medium mb-2">
                <Brain size={16} />
                <span>HEXACO — Six Dimensions of Personality</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {hexacoQuestions[currentQuestion].question}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Dimension:{" "}
                {hexacoQuestions[currentQuestion].dimension
                  .replace(/([A-Z])/g, " $1")
                  .trim()}
              </p>
            </div>
            <div className="space-y-4">
              {hexacoQuestions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleHexacoAnswer(option.value)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    hexacoAnswers[hexacoQuestions[currentQuestion].id] === option.value
                      ? "border-violet-500 bg-violet-50 shadow-md"
                      : "border-gray-200 hover:border-violet-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{option.label}</span>
                    {hexacoAnswers[hexacoQuestions[currentQuestion].id] === option.value && (
                      <div className="w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                </button>
              ))}
            </div>
            {currentQuestion < hexacoQuestions.length - 1 && (
              <button
                onClick={() => setCurrentQuestion((prev) => prev - 1)}
                className="mt-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft size={16} />
                Go back
              </button>
            )}
          </div>
        )}

        {/* Enneagram */}
        {step === "questions-enneagram" && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-fade-in">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-teal-600 text-sm font-medium mb-2">
                <Target size={16} />
                <span>Enneagram — Core Motivation & Fear</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {enneagramQuestions[currentQuestion].question}
              </h3>
            </div>
            <div className="space-y-3">
              {enneagramQuestions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleEnneagramAnswer(option.value)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    enneagramAnswers[enneagramQuestions[currentQuestion].id] === option.value
                      ? "border-teal-500 bg-teal-50 shadow-md"
                      : "border-gray-200 hover:border-teal-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{option.label}</span>
                    {enneagramAnswers[enneagramQuestions[currentQuestion].id] === option.value && (
                      <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                </button>
              ))}
            </div>
            {currentQuestion < enneagramQuestions.length - 1 && (
              <button
                onClick={() => setCurrentQuestion((prev) => prev - 1)}
                className="mt-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft size={16} />
                Go back
              </button>
            )}
          </div>
        )}

        {/* DISC */}
        {step === "questions-disc" && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-fade-in">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-amber-600 text-sm font-medium mb-2">
                <Shield size={16} />
                <span>DISC — Behavioral Style</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {discQuestions[currentQuestion].question}
              </h3>
            </div>
            <div className="space-y-3">
              {discQuestions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleDiscAnswer(option.value)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    discAnswers[discQuestions[currentQuestion].id] === option.value
                      ? "border-amber-500 bg-amber-50 shadow-md"
                      : "border-gray-200 hover:border-amber-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{option.label}</span>
                    {discAnswers[discQuestions[currentQuestion].id] === option.value && (
                      <div className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                </button>
              ))}
            </div>
            {currentQuestion < discQuestions.length - 1 && (
              <button
                onClick={() => setCurrentQuestion((prev) => prev - 1)}
                className="mt-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft size={16} />
                Go back
              </button>
            )}
          </div>
        )}

        {/* Love Languages */}
        {step === "questions-love" && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-fade-in">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-green-600 text-sm font-medium mb-2">
                <Users size={16} />
                <span>Love Languages — How You Give & Receive</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {loveLanguageQuestions[currentQuestion].question}
              </h3>
            </div>
            <div className="space-y-3">
              {loveLanguageQuestions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleLoveLanguageAnswer(option.value)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    loveLanguageAnswers[loveLanguageQuestions[currentQuestion].id] === option.value
                      ? "border-green-500 bg-green-50 shadow-md"
                      : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{option.label}</span>
                    {loveLanguageAnswers[loveLanguageQuestions[currentQuestion].id] === option.value && (
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                </button>
              ))}
            </div>
            {currentQuestion < loveLanguageQuestions.length - 1 && (
              <button
                onClick={() => setCurrentQuestion((prev) => prev - 1)}
                className="mt-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft size={16} />
                Go back
              </button>
            )}
          </div>
        )}

        {/* Attachment */}
        {step === "attachment" && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-fade-in">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-pink-600 text-sm font-medium mb-2">
                <Heart size={16} />
                <span>Relationship Style</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                How do you typically connect with others?
              </h3>
              <p className="text-gray-600 mt-2">
                This helps Youna understand how to best support you in conversations.
              </p>
            </div>
            <div className="space-y-3">
              {attachmentOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAttachmentSelect(option.value)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    attachmentStyle === option.value
                      ? "border-pink-500 bg-pink-50 shadow-md"
                      : "border-gray-200 hover:border-pink-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-900">{option.label}</span>
                      <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                    </div>
                    {attachmentStyle === option.value && (
                      <div className="w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Goals */}
        {step === "goals" && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-fade-in">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-teal-600 text-sm font-medium mb-2">
                <User size={16} />
                <span>Your Intentions</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">What brings you to Youna?</h3>
              <p className="text-gray-600 mt-2">
                What would you like to get out of this? There's no right answer — just whatever feels
                true for you.
              </p>
            </div>
            <textarea
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="For example: I've been feeling stressed lately and want someone to talk to. Or: I want to understand myself better and build better habits. Or simply: I'm curious."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-32 transition-all"
            />
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
              <Sparkles size={14} />
              <span>This helps Youna personalize your experience from day one.</span>
            </div>
          </div>
        )}

        {/* Complete */}
        {step === "complete" && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center animate-fade-in">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse-glow">
              <Check size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">You're All Set!</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Youna now understands you across six personality frameworks. The more you chat, the more
              personal it becomes.
            </p>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8 text-left space-y-3">
              <div className="flex items-center gap-2 text-indigo-600 text-sm font-medium mb-4">
                <Sparkles size={16} />
                <span>Your Personality DNA — Across 6 Frameworks</span>
              </div>

              {/* Big Five */}
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="text-sm font-medium text-gray-700 mb-2">Big Five</div>
                <div className="grid grid-cols-5 gap-1 text-center text-xs">
                  <div className="bg-green-50 rounded p-1">
                    <div className="text-green-700 font-semibold">O</div>
                    <div className="text-green-600">{Math.round(bigFiveScores.openness * 20)}%</div>
                  </div>
                  <div className="bg-blue-50 rounded p-1">
                    <div className="text-blue-700 font-semibold">C</div>
                    <div className="text-blue-600">{Math.round(bigFiveScores.conscientiousness * 20)}%</div>
                  </div>
                  <div className="bg-purple-50 rounded p-1">
                    <div className="text-purple-700 font-semibold">E</div>
                    <div className="text-purple-600">{Math.round(bigFiveScores.extraversion * 20)}%</div>
                  </div>
                  <div className="bg-pink-50 rounded p-1">
                    <div className="text-pink-700 font-semibold">A</div>
                    <div className="text-pink-600">{Math.round(bigFiveScores.agreeableness * 20)}%</div>
                  </div>
                  <div className="bg-amber-50 rounded p-1">
                    <div className="text-amber-700 font-semibold">N</div>
                    <div className="text-amber-600">{Math.round(bigFiveScores.neuroticism * 20)}%</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {bigFiveScores.openness >= 4 ? "Curious & open" : "Practical & grounded"} ·{" "}
                  {bigFiveScores.neuroticism <= 2 ? "Emotionally stable" : "Sensitive to stress"}
                </div>
              </div>

              {/* HEXACO */}
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="text-sm font-medium text-gray-700 mb-2">HEXACO</div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <div className="text-violet-700 font-medium">Honesty-Humility</div>
                    <div className="text-violet-600 text-xs">
                      {Math.round((hexacoScores.honestyHumility || 3) * 20)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-violet-700 font-medium">Emotionality</div>
                    <div className="text-violet-600 text-xs">
                      {Math.round((hexacoScores.emotionality || 3) * 20)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-violet-700 font-medium">Extraversion</div>
                    <div className="text-violet-600 text-xs">
                      {Math.round((hexacoScores.extraversion || 3) * 20)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-violet-700 font-medium">Agreeableness</div>
                    <div className="text-violet-600 text-xs">
                      {Math.round((hexacoScores.agreeableness || 3) * 20)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-violet-700 font-medium">Conscientiousness</div>
                    <div className="text-violet-600 text-xs">
                      {Math.round((hexacoScores.conscientiousness || 3) * 20)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-violet-700 font-medium">Openness</div>
                    <div className="text-violet-600 text-xs">
                      {Math.round((hexacoScores.openness || 3) * 20)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Enneagram */}
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="text-sm font-medium text-gray-700 mb-2">Enneagram</div>
                <div className="text-lg font-bold text-teal-700">
                  {enneagramType
                    ? `Type ${enneagramType} — ${enneagramDescriptions[enneagramType]?.name}`
                    : "Not assessed yet"}
                </div>
                {enneagramType && enneagramDescriptions[enneagramType] && (
                  <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                    <div>Fear: {enneagramDescriptions[enneagramType].fear}</div>
                    <div>Desire: {enneagramDescriptions[enneagramType].desire}</div>
                    <div>Growth: toward {enneagramDescriptions[enneagramType].growth}</div>
                  </div>
                )}
              </div>

              {/* DISC */}
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="text-sm font-medium text-gray-700 mb-2">DISC</div>
                <div className="text-lg font-bold text-amber-700">{discType || "Not assessed yet"}</div>
                {discType && (
                  <div className="text-xs text-gray-500 mt-1">{discDescriptions[discType]}</div>
                )}
              </div>

              {/* Love Languages */}
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="text-sm font-medium text-gray-700 mb-2">Love Languages (ranked)</div>
                <div className="flex flex-wrap gap-2">
                  {loveLangs.map((lang, i) => (
                    <span
                      key={lang}
                      className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full border border-green-200"
                    >
                      {loveLangEmojis[lang]} {loveLangLabels[lang]}
                      {i === 0 ? " ⭐" : ""}
                    </span>
                  ))}
                </div>
              </div>

              {/* Attachment */}
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="text-sm font-medium text-gray-700 mb-2">Attachment Style</div>
                <div className="text-lg font-bold text-pink-700 capitalize">{attachmentStyle}</div>
              </div>

              {/* Communication */}
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="text-sm font-medium text-gray-700 mb-2">Communication Style</div>
                <div className="text-sm text-gray-900">{communicationStyle()}</div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-md disabled:bg-gray-300"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving your profile...
                </>
              ) : (
                <>
                  Start Chatting
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
