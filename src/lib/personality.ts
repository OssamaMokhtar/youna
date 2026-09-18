// Personality DNA types — Phase Two advanced assessment
// Extends Phase One's Big Five + Attachment with HEXACO, Enneagram, DISC, Love Languages

export type LoveLanguage = "words" | "acts" | "gifts" | "time" | "touch";

export interface PersonalityDNA {
  // ── Phase One (already collected) ──────────────────────────
  bigFive: {
    openness: number;        // 1-5
    conscientiousness: number; // 1-5
    extraversion: number;    // 1-5
    agreeableness: number;   // 1-5
    neuroticism: number;     // 1-5
  };
  attachmentStyle: "secure" | "anxious" | "avoidant" | "fearful";
  goals: string;

  // ── Phase Two additions ─────────────────────────────────────
  hexaco: {
    honestyHumility: number;   // 1-5
    emotionality: number;      // 1-5
    extraversion: number;      // 1-5
    agreeableness: number;     // 1-5
    conscientiousness: number; // 1-5
    openness: number;          // 1-5
  };

  enneagram: number | null;    // 1-9, null if not assessed

  disc: "D" | "I" | "S" | "C" | null;  // Dominance, Influence, Steadiness, Conscientiousness

  loveLanguages: LoveLanguage[];  // ranked, top 2-3

  // ── Derived summaries (populated by scoring engine) ─────────
  communicationStyle: string;
  personalitySummary: string;
  strengths: string[];
  growthAreas: string[];
  relationshipAdvice: string;
}

// ── Assessment question types for Phase Two extension ─────────

export interface HexacoQuestion {
  id: string;
  dimension: keyof Pick<
    PersonalityDNA["hexaco"],
    "honestyHumility" | "emotionality" | "extraversion" | "agreeableness" | "conscientiousness" | "openness"
  >;
  question: string;
  options: { label: string; value: number; description: string }[];
}

export interface EnneagramQuestion {
  id: string;
  question: string;
  options: { label: string; value: number; description: string }[];
}

export interface DiscQuestion {
  id: string;
  question: string;
  options: { label: string; value: "D" | "I" | "S" | "C"; description: string }[];
}

export interface LoveLanguageQuestion {
  id: string;
  question: string;
  options: { label: string; value: LoveLanguage; description: string }[];
}

// ── Scoring helpers ────────────────────────────────────────────

export function scoreHexaco(answers: Record<string, number>): PersonalityDNA["hexaco"] {
  const dimensions: (keyof PersonalityDNA["hexaco"])[] = [
    "honestyHumility",
    "emotionality",
    "extraversion",
    "agreeableness",
    "conscientiousness",
    "openness",
  ];
  const result: PersonalityDNA["hexaco"] = {} as PersonalityDNA["hexaco"];
  for (const dim of dimensions) {
    // In Phase Two, each dimension has 4+ questions; for MVP we derive from available
    const vals = Object.entries(answers)
      .filter(([id]) => id.startsWith(dim.charAt(0).toUpperCase() + dim.slice(1)))
      .map(([, v]) => v);
    result[dim] = vals.length > 0
      ? vals.reduce((a, b) => a + b, 0) / vals.length
      : 3;
  }
  return result;
}

export function scoreEnneagram(answers: Record<string, number>): number | null {
  if (Object.keys(answers).length < 3) return null;
  // Simplified: map answer pattern to closest Enneagram type
  // Full implementation: 9-type classifier with wings and arrows
  const vals = Object.values(answers);
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  if (avg < 1.5) return 5;  // Investigator
  if (avg < 2.5) return 6;  // Loyalist
  if (avg < 3.5) return 9;  // Peacemaker
  if (avg < 4.5) return 2;  // Helper
  return 7;                  // Enthusiast
}

export function scoreDisc(answers: Record<string, "D" | "I" | "S" | "C">): "D" | "I" | "S" | "C" | null {
  if (Object.keys(answers).length === 0) return null;
  const counts = { D: 0, I: 0, S: 0, C: 0 };
  for (const v of Object.values(answers)) counts[v]++;
  const max = Math.max(...Object.values(counts));
  if (counts.D === max) return "D";
  if (counts.I === max) return "I";
  if (counts.S === max) return "S";
  return "C";
}

export function scoreLoveLanguages(answers: Record<string, number>): LoveLanguage[] {
  const map: Record<LoveLanguage, number> = {
    words: 0,
    acts: 0,
    gifts: 0,
    time: 0,
    touch: 0,
  };
  for (const [key, val] of Object.entries(answers)) {
    const lang = key as LoveLanguage;
    if (lang in map) map[lang] += val;
  }
  return Object.entries(map)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([k]) => k as LoveLanguage);
}
