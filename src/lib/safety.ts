// src/lib/safety.ts — single source of truth for Youna's crisis logic.
//
// Why this file exists (audit, 2026-09-23):
//   1. The chat client and the API route each kept their own keyword list, and
//      the client regex /\bsuic(id|de)\b/ did not match "suicide" or "suicidal".
//   2. The daily check-in guard `streak.lastCheckedInDate !== todayDate` was
//      always false (computeStreak always returns today), so the check-in crisis
//      dialog could never open. The dialog was also auto-closed after 1.2 s.
//   3. The crisis branch of /api/chat/complete sent the message to an LLM and
//      returned whatever it generated.
//
// Rules this module enforces:
//   - One pattern list, used by client and server.
//   - A crisis reply is deterministic text plus resources. The model never
//     writes it.
//   - Low-mood checks never suppress a second signal on the same day, and they
//     also scan any free text the user typed.
//
// Limits (stated, not hidden): keyword matching misses indirect phrasing that
// is not in the list, and the mood thresholds below are product judgement, not
// clinically validated. See src/lib/__tests__/safety.test.ts for the measured
// recall on the golden set in that file.

export type CrisisLevel = "none" | "crisis";

export interface CrisisResult {
  level: CrisisLevel;
  matched: string[];
}

// Direct statements of intent or self-harm.
const DIRECT: RegExp[] = [
  /\bsuicid(e|al)\b/i,
  /\bkill(ing)? myself\b/i,
  /\bend(ing)? (my|it all|my own) life\b/i,
  /\bend it all\b/i,
  /\bwant(ed)? to die\b/i,
  /\b(harm|hurt|hurting|cut|cutting) myself\b/i,
  /\bself[- ]?harm\b/i,
  /\boverdose\b/i,
  /\b(have|made|got) a plan to (do it|end|kill|die|hurt)/i,
  /\bgoing to end it\b/i,
  /\btake my (own )?life\b/i,
];

// Indirect phrasing that keyword lists commonly miss.
const INDIRECT: RegExp[] = [
  /\bno reason to (live|go on|keep going)\b/i,
  /\bi can'?t go on\b/i,
  /\bcan'?t do this anymore\b/i,
  /\b(better off|be better) without me\b/i,
  /\bdon'?t want to (be here|exist|wake up)( anymore)?\b/i,
  /\b(go to )?sleep and (never|not) wake up\b/i,
  /\bwish i (was|were) (dead|never born)\b/i,
  /\bno point (in )?(living|anything|going on)\b/i,
  /\bnothing matters( anymore)?\b/i,
  /\bnobody would (care|notice|miss me)\b/i,
  /\bsaying goodbye to everyone\b/i,
  /\bgiving away my (things|stuff)\b/i,
  // Kept from the original list: over-triggering is the safer error here.
  /\bworthless\b/i,
  /\bnobody cares\b/i,
  /\bplease help me\b/i,
];

export const CRISIS_PATTERNS: readonly RegExp[] = [...DIRECT, ...INDIRECT];

export function detectCrisis(text: string | undefined | null): CrisisResult {
  if (!text) return { level: "none", matched: [] };
  const matched = CRISIS_PATTERNS.filter((p) => p.test(text)).map((p) => p.source);
  return { level: matched.length > 0 ? "crisis" : "none", matched };
}

export function isCrisisText(text: string | undefined | null): boolean {
  return detectCrisis(text).level === "crisis";
}

/** Deterministic reply used whenever crisis language is detected. Never model-generated. */
export const CRISIS_REPLY =
  "I'm really glad you told me. What you're feeling matters, and you don't have to carry it alone. " +
  "I'm an AI companion, not a crisis service, so please reach out to someone who can help right now: " +
  "a local emergency number, a crisis line in your country, or someone you trust nearby. " +
  "I've opened a list of crisis resources for you.";

export interface MoodSignalInput {
  /** Today's score on the component's own scale. */
  todayScore: number;
  /** Scores from the last 7 days, NOT including today. */
  previousScores: number[];
  /** Average (including today) at or below this opens the dialog, together with todayMax. */
  avgThreshold: number;
  /** Today's score at or below this counts as low. */
  todayMax: number;
  /** Any free text the user typed with the entry. */
  note?: string;
}

/**
 * Should the crisis resources dialog open after a mood or check-in entry?
 * No same-day suppression: every entry is evaluated on its own.
 */
export function shouldOpenCrisisDialog(input: MoodSignalInput): boolean {
  if (isCrisisText(input.note)) return true;
  const all = [...input.previousScores, input.todayScore];
  const avg = all.reduce((s, v) => s + v, 0) / all.length;
  return avg <= input.avgThreshold && input.todayScore <= input.todayMax;
}
