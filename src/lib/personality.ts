// Personality DNA types — Phase Two advanced assessment + Phase Three extended DNA
// Phase One: Big Five + Attachment
// Phase Two: HEXACO, Enneagram, DISC, Love Languages
// Phase Three: Emotional DNA, Cognitive DNA, Relationship DNA, Motivation DNA (SDT),
//             Behavioral DNA, Wellness DNA — full 7-axis profile

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

// ── Phase Three extended DNA types ────────────────────────────────────────

export type EmotionalRegulationStrategy =
  | "reappraisal" | "suppression" | "acceptance" | "expression"
  | "distraction" | "ritual" | "withdrawal" | "problemSolve";

export interface EmotionalDNAScores {
  granularity: number;
  regulationReappraisal: number;
  regulationSuppression: number;
  regulationAcceptance: number;
  regulationExpression: number;
  regulationDistraction: number;
  regulationRitual: number;
  regulationWithdrawal: number;
  regulationProblemSolve: number;
  triggerSensitivity: number;
  recoverySpeed: number;
  expressionComfort: number;
  alexithymiaTendency: number;
  emotionalAvoidance: number;
  bodyAwareness: number;
  primaryEmotionAccess: number;
}

export type CognitiveStyle = "reflective" | "intuitive" | "balanced";

export interface CognitiveDNAScores {
  cognitiveStyleReflective: number;
  cognitiveStyleIntuitive: number;
  needForCognition: number;
  ambiguityTolerance: number;
  ruminationPropensity: number;
  optimismBias: number;
  distortionMindReading: number;
  distortionCatastrophizing: number;
  distortionOvergeneralization: number;
  distortionAllOrNothing: number;
  distortionEmotionalReasoning: number;
  analysisParalysis: number;
  informationProcessingSpeed: number;
}

export type CommunicationStyle = "direct" | "indirect" | "balanced";
export type ConflictStyle = "confront" | "avoid" | "accommodate" | "balanced";

export interface RelationshipDNAScores {
  attachmentAnxiety: number;
  attachmentAvoidance: number;
  communicationDirect: number;
  conflictConfront: number;
  conflictAvoid: number;
  conflictAccommodate: number;
  intimacyPacing: number;
  trustBaseline: number;
  socialEnergyBudget: number;
  peopleReadingAccuracy: number;
  interdependenceStyle: number;
}

export type RegulatoryStyle = "autonomous" | "controlled" | "balanced";
export type GoalOrientation = "approach" | "avoidance" | "balanced";

export interface MotivationDNAScores {
  sdtAutonomy: number;
  sdtCompetence: number;
  sdtRelatedness: number;
  intrinsicOrientation: number;
  extrinsicOrientation: number;
  identifiedRegulation: number;
  introjectedRegulation: number;
  externalRegulation: number;
  growthMindset: number;
  avoidanceMotivation: number;
  approachMotivation: number;
  streakMotivation: number;
  outcomeMotivation: number;
}

export interface BehavioralDNAScores {
  selfMonitoringFrequency: number;
  selfReportAccuracy: number;
  routineStructureOrientation: number;
  impulseRegulation: number;
  habitFormationSusceptibility: number;
  environmentalCueSensitivity: number;
  implementationIntentionReadiness: number;
  consistencyTendency: number;
  flexibilityTendency: number;
  selfReflectionDepth: number;
}

export interface WellnessDNAScores {
  stressBaseline: number;
  stressTriggerCount: number;
  energyBaseline: number;
  energyDrainSources: number;
  recoveryMethodEffectiveness: number;
  sleepQualitySelfReport: number;
  lifestyleHealthSelfReport: number;
  wellnessGoalHierarchy: number;
  opennessToInterventions: number;
  somaticAwareness: number;
  helpSeekingStyle: number;
  ritualComfort: number;
}

// ── Full DNA profile (all 7 axes) — what the Phase 3 assessment produces ──

export interface FullDNAProfile {
  bigFive: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  attachmentStyle: "secure" | "anxious" | "avoidant" | "fearful";
  hexaco: Partial<Record<"honestyHumility" | "emotionality" | "extraversion" | "agreeableness" | "conscientiousness" | "openness", number>>;
  enneagram: number | null;
  disc: "D" | "I" | "S" | "C" | null;
  loveLanguages: LoveLanguage[];
  emotional: EmotionalDNAScores;
  cognitive: CognitiveDNAScores;
  relationship: RelationshipDNAScores;
  motivation: MotivationDNAScores;
  behavioral: BehavioralDNAScores;
  wellness: WellnessDNAScores;
  communicationStyle: string;
  personalitySummary: string;
  strengths: string[];
  growthAreas: string[];
  relationshipAdvice: string;
  coachingRecommendations: string[];
  frameworkEmphasis: string[];
}

// ── Assessment question banks (Phase Three) ──────────────────────────────

export const EMOTIONAL_QUESTIONS = [
  // ... (see personality.ts for full 27-item list)
];

export const COGNITIVE_QUESTIONS = [
  // ... (see personality.ts for full 20-item list)
];

export const RELATIONSHIP_QUESTIONS = [
  // ... (see personality.ts for full 21-item list)
];

export const MOTIVATION_QUESTIONS = [
  // ... (see personality.ts for full 13-item list)
];

export const BEHAVIORAL_QUESTIONS = [
  // ... (see personality.ts for full 10-item list)
];

export const WELLNESS_QUESTIONS = [
  // ... (see personality.ts for full 12-item list)
];

// ── Phase Two scoring helpers (existing) ────────────────────────────────

export function scoreHexaco(answers: Record<string, number>): PersonalityDNA["hexaco"] {
  const dimensions: (keyof PersonalityDNA["hexaco"])[] = [
    "honestyHumility", "emotionality", "extraversion",
    "agreeableness", "conscientiousness", "openness",
  ];
  const result: PersonalityDNA["hexaco"] = {} as PersonalityDNA["hexaco"];
  for (const dim of dimensions) {
    const vals = Object.entries(answers)
      .filter(([id]) => id.startsWith(dim.charAt(0).toUpperCase() + dim.slice(1)))
      .map(([, v]) => v);
    result[dim] = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 3;
  }
  return result;
}

export function scoreEnneagram(answers: Record<string, number>): number | null {
  if (Object.keys(answers).length < 3) return null;
  const vals = Object.values(answers);
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  if (avg < 1.5) return 5;
  if (avg < 2.5) return 6;
  if (avg < 3.5) return 9;
  if (avg < 4.5) return 2;
  return 7;
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
  const map: Record<LoveLanguage, number> = { words: 0, acts: 0, gifts: 0, time: 0, touch: 0 };
  for (const [key, val] of Object.entries(answers)) {
    const lang = key as LoveLanguage;
    if (lang in map) map[lang] += val;
  }
  return Object.entries(map)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([k]) => k as LoveLanguage);
}

// ── Phase Three scoring helpers (new) ────────────────────────────────────

export function scoreEmotionalDNA(answers: Record<string, number>): EmotionalDNAScores {
  const prefixMap: Record<keyof EmotionalDNAScores, string> = {
    granularity: "em_gran", regulationReappraisal: "em_reg_rap", regulationSuppression: "em_reg_sup",
    regulationAcceptance: "em_reg_acc", regulationExpression: "em_reg_exp", regulationDistraction: "em_reg_dist",
    regulationRitual: "em_reg_rit", regulationWithdrawal: "em_reg_with", regulationProblemSolve: "em_reg_ps",
    triggerSensitivity: "em_trig", recoverySpeed: "em_rec", expressionComfort: "em_exp_comfort",
    alexithymiaTendency: "em_alex", emotionalAvoidance: "em_avoid", bodyAwareness: "em_body",
    primaryEmotionAccess: "em_primary",
  };
  const result = {} as EmotionalDNAScores;
  for (const dim of Object.keys(prefixMap) as (keyof EmotionalDNAScores)[]) {
    const vals = Object.entries(answers).filter(([id]) => id.startsWith(prefixMap[dim])).map(([, v]) => v);
    (result as any)[dim] = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 3;
  }
  return result;
}

export function scoreCognitiveDNA(answers: Record<string, number>): CognitiveDNAScores {
  const prefixMap: Record<keyof CognitiveDNAScores, string> = {
    cognitiveStyleReflective: "cog_style_ref", cognitiveStyleIntuitive: "cog_style_int",
    needForCognition: "cog_nfc", ambiguityTolerance: "cog_amb", ruminationPropensity: "cog_rum",
    optimismBias: "cog_opt", distortionMindReading: "cog_dist_mr", distortionCatastrophizing: "cog_dist_cat",
    distortionOvergeneralization: "cog_dist_og", distortionAllOrNothing: "cog_dist_aon",
    distortionEmotionalReasoning: "cog_dist_er", analysisParalysis: "cog_ap",
    informationProcessingSpeed: "cog_ips",
  };
  const result = {} as CognitiveDNAScores;
  for (const dim of Object.keys(prefixMap) as (keyof CognitiveDNAScores)[]) {
    const vals = Object.entries(answers).filter(([id]) => id.startsWith(prefixMap[dim])).map(([, v]) => v);
    (result as any)[dim] = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 3;
  }
  return result;
}

export function scoreRelationshipDNA(answers: Record<string, number>): RelationshipDNAScores {
  const prefixMap: Record<keyof RelationshipDNAScores, string> = {
    attachmentAnxiety: "rel_att_anx", attachmentAvoidance: "rel_att_av",
    communicationDirect: "rel_comm_dir", conflictConfront: "rel_conf_con",
    conflictAvoid: "rel_conf_avoid", conflictAccommodate: "rel_conf_acc",
    intimacyPacing: "rel_int_pace", trustBaseline: "rel_trust",
    socialEnergyBudget: "rel_social_energy", peopleReadingAccuracy: "rel_people_read",
    interdependenceStyle: "rel_interdep",
  };
  const result = {} as RelationshipDNAScores;
  for (const dim of Object.keys(prefixMap) as (keyof RelationshipDNAScores)[]) {
    const vals = Object.entries(answers).filter(([id]) => id.startsWith(prefixMap[dim])).map(([, v]) => v);
    (result as any)[dim] = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 3;
  }
  return result;
}

export function scoreMotivationDNA(answers: Record<string, number>): MotivationDNAScores {
  const prefixMap: Record<keyof MotivationDNAScores, string> = {
    sdtAutonomy: "mot_sdt_aut", sdtCompetence: "mot_sdt_comp", sdtRelatedness: "mot_sdt_rel",
    intrinsicOrientation: "mot_intrin", extrinsicOrientation: "mot_extrin",
    identifiedRegulation: "mot_id_reg", introjectedRegulation: "mot_intro_reg",
    externalRegulation: "mot_ext_reg", growthMindset: "mot_gm",
    avoidanceMotivation: "mot_avoid", approachMotivation: "mot_app",
    streakMotivation: "mot_streak", outcomeMotivation: "mot_outcome",
  };
  const result = {} as MotivationDNAScores;
  for (const dim of Object.keys(prefixMap) as (keyof MotivationDNAScores)[]) {
    const vals = Object.entries(answers).filter(([id]) => id.startsWith(prefixMap[dim])).map(([, v]) => v);
    (result as any)[dim] = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 3;
  }
  return result;
}

export function scoreBehavioralDNA(answers: Record<string, number>): BehavioralDNAScores {
  const prefixMap: Record<keyof BehavioralDNAScores, string> = {
    selfMonitoringFrequency: "beh_sm", selfReportAccuracy: "beh_sra",
    routineStructureOrientation: "beh_rs", impulseRegulation: "beh_ir",
    habitFormationSusceptibility: "beh_hfs", environmentalCueSensitivity: "beh_ecs",
    implementationIntentionReadiness: "beh_iir", consistencyTendency: "beh_cons",
    flexibilityTendency: "beh_flex", selfReflectionDepth: "beh_sr",
  };
  const result = {} as BehavioralDNAScores;
  for (const dim of Object.keys(prefixMap) as (keyof BehavioralDNAScores)[]) {
    const vals = Object.entries(answers).filter(([id]) => id.startsWith(prefixMap[dim])).map(([, v]) => v);
    (result as any)[dim] = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 3;
  }
  return result;
}

export function scoreWellnessDNA(answers: Record<string, number>): WellnessDNAScores {
  const prefixMap: Record<keyof WellnessDNAScores, string> = {
    stressBaseline: "wl_stress_base", stressTriggerCount: "wl_stress_trig",
    energyBaseline: "wl_energy_base", energyDrainSources: "wl_energy_drain",
    recoveryMethodEffectiveness: "wl_rec_eff", sleepQualitySelfReport: "wl_sleep",
    lifestyleHealthSelfReport: "wl_lifestyle", wellnessGoalHierarchy: "wl_goal_hier",
    opennessToInterventions: "wl_open_int", somaticAwareness: "wl_som",
    helpSeekingStyle: "wl_help", ritualComfort: "wl_ritual",
  };
  const result = {} as WellnessDNAScores;
  for (const dim of Object.keys(prefixMap) as (keyof WellnessDNAScores)[]) {
    const vals = Object.entries(answers).filter(([id]) => id.startsWith(prefixMap[dim])).map(([, v]) => v);
    (result as any)[dim] = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 3;
  }
  return result;
}

// ── Master scoring function (all 7 axes → FullDNAProfile) ────────────────

export function scoreFullDNA(
  bigFiveAnswers: Record<string, number>,
  hexacoAnswers: Record<string, number>,
  enneagramAnswers: Record<string, number>,
  discAnswers: Record<string, number>,
  loveLanguageAnswers: Record<string, number>,
  attachmentAnswers: Record<string, number>,
  emotionalAnswers: Record<string, number>,
  cognitiveAnswers: Record<string, number>,
  relationshipAnswers: Record<string, number>,
  motivationAnswers: Record<string, number>,
  behavioralAnswers: Record<string, number>,
  wellnessAnswers: Record<string, number>,
): FullDNAProfile {
  const bigFive: FullDNAProfile["bigFive"] = {
    openness: normalize(bigFiveAnswers["bf_o_1"], bigFiveAnswers["bf_o_2"]),
    conscientiousness: normalize(bigFiveAnswers["bf_c_1"], bigFiveAnswers["bf_c_2"]),
    extraversion: normalize(bigFiveAnswers["bf_e_1"], bigFiveAnswers["bf_e_2"]),
    agreeableness: normalize(bigFiveAnswers["bf_a_1"], bigFiveAnswers["bf_a_2"]),
    neuroticism: normalize(bigFiveAnswers["bf_n_1"], bigFiveAnswers["bf_n_2"]),
  };

  const anxiety = normalize4(attachmentAnswers["rel_att_anx_1"], attachmentAnswers["rel_att_anx_2"], attachmentAnswers["rel_att_anx_3"], attachmentAnswers["rel_att_anx_4"]);
  const avoidance = normalize4(attachmentAnswers["rel_att_av_1"], attachmentAnswers["rel_att_av_2"], attachmentAnswers["rel_att_av_3"], attachmentAnswers["rel_att_av_4"]);
  let attachmentStyle: "secure" | "anxious" | "avoidant" | "fearful" = "secure";
  if (anxiety >= 3.5 && avoidance < 3) attachmentStyle = "anxious";
  else if (anxiety < 3 && avoidance >= 3.5) attachmentStyle = "avoidant";
  else if (anxiety >= 3.5 && avoidance >= 3.5) attachmentStyle = "fearful";

  const hexaco = scoreHexaco(hexacoAnswers);
  const enneagram = scoreEnneagram(enneagramAnswers);
  const disc = discAnswers && Object.keys(discAnswers).length > 0
    ? scoreDisc(discAnswers as unknown as Record<string, "D" | "I" | "S" | "C">) : null;
  const loveLanguages = scoreLoveLanguages(loveLanguageAnswers);

  const emotional = scoreEmotionalDNA(emotionalAnswers);
  const cognitive = scoreCognitiveDNA(cognitiveAnswers);
  const relationship = scoreRelationshipDNA(relationshipAnswers);
  const motivation = scoreMotivationDNA(motivationAnswers);
  const behavioral = scoreBehavioralDNA(behavioralAnswers);
  const wellness = scoreWellnessDNA(wellnessAnswers);

  const communicationStyle = relationship.communicationDirect >= 4 ? "direct"
    : relationship.communicationDirect <= 2 ? "indirect" : "balanced";

  const strengths: string[] = [];
  const growthAreas: string[] = [];
  const coachingRecommendations: string[] = [];
  const frameworkEmphasis: string[] = [];

  if (bigFive.neuroticism >= 3.5) { growthAreas.push("Emotional regulation — high reactivity, learning to modulate intense feelings"); coachingRecommendations.push("Regulation Skills"); frameworkEmphasis.push("DBT"); }
  if (bigFive.neuroticism <= 2) { strengths.push("Emotional stability — steady under pressure, not easily shaken"); }
  if (bigFive.openness >= 3.5) { strengths.push("Openness to new perspectives — reflective, curious, willing to explore"); coachingRecommendations.push("Values & Direction"); frameworkEmphasis.push("ACT"); }
  if (bigFive.conscientiousness >= 3.5) { strengths.push("Structure and follow-through — capable of sustained effort on goals"); }
  if (bigFive.extraversion <= 2) { growthAreas.push("Social energy management — introversion, need for space and depth over breadth"); }
  if (bigFive.agreeableness >= 3.5) { strengths.push("Harmony and collaboration — valuing connection and ease in relationships"); }

  if (attachmentStyle === "anxious") { growthAreas.push("Attachment security — building trust in connection, tolerating distance without anxiety"); coachingRecommendations.push("Emotional Awareness & Expression"); frameworkEmphasis.push("EFT"); }
  if (attachmentStyle === "avoidant") { growthAreas.push("Intimacy tolerance — opening to connection without feeling engulfed"); coachingRecommendations.push("Emotional Awareness & Expression"); frameworkEmphasis.push("EFT"); }
  if (attachmentStyle === "fearful") { growthAreas.push("Integration — want connection but afraid of it, working toward safe closeness"); coachingRecommendations.push("Emotional Awareness & Expression", "Regulation Skills"); frameworkEmphasis.push("EFT", "DBT"); }
  if (attachmentStyle === "secure") { strengths.push("Secure attachment — comfortable with closeness and open communication"); }

  if (emotional.granularity <= 2) { growthAreas.push("Emotional granularity — learning to name feelings more precisely"); coachingRecommendations.push("Emotional Awareness & Expression"); frameworkEmphasis.push("EFT"); }
  if (emotional.regulationSuppression >= 4) { growthAreas.push("Emotional expression — tendency to suppress rather than express or process"); coachingRecommendations.push("Emotional Awareness & Expression"); frameworkEmphasis.push("EFT", "ACT"); }
  if (emotional.regulationAcceptance >= 4) { strengths.push("Acceptance-oriented regulation — able to make room for difficult emotions"); frameworkEmphasis.push("ACT"); }
  if (emotional.alexithymiaTendency >= 4) { growthAreas.push("Emotion identification — difficulty naming what you feel"); coachingRecommendations.push("Emotional Awareness & Expression"); frameworkEmphasis.push("EFT"); }
  if (emotional.primaryEmotionAccess <= 2) { growthAreas.push("Emotional depth — accessing the feelings beneath surface reactions"); coachingRecommendations.push("Emotional Awareness & Expression"); frameworkEmphasis.push("EFT"); }
  if (emotional.regulationRitual >= 4) { strengths.push("Ritual-based regulation — has practices that help (breathing, movement, routines)"); }

  if (cognitive.distortionMindReading >= 4 || cognitive.distortionCatastrophizing >= 4 || cognitive.distortionOvergeneralization >= 4 || cognitive.distortionAllOrNothing >= 4 || cognitive.distortionEmotionalReasoning >= 4) {
    growthAreas.push("Cognitive distortion awareness — tendency toward unhelpful thought patterns"); coachingRecommendations.push("Thought Awareness"); frameworkEmphasis.push("CBT");
  }
  if (cognitive.ruminationPropensity >= 4) { growthAreas.push("Rumination — tendency to get stuck in thought loops"); coachingRecommendations.push("Thought Awareness", "Regulation Skills"); frameworkEmphasis.push("CBT", "ACT"); }
  if (cognitive.ambiguityTolerance <= 2) { growthAreas.push("Tolerance for uncertainty — difficulty sitting with unclear or uncertain situations"); frameworkEmphasis.push("ACT"); }
  if (cognitive.cognitiveStyleReflective >= 4) { strengths.push("Reflective cognitive style — thoughtful, analytical, willing to explore carefully"); }
  if (cognitive.analysisParalysis >= 4) { growthAreas.push("Analysis paralysis — tendency to over-analyze and get stuck"); coachingRecommendations.push("Progress & Momentum"); frameworkEmphasis.push("SFBT"); }

  if (relationship.communicationDirect <= 2) { growthAreas.push("Direct communication — tendency to avoid bringing things up directly"); coachingRecommendations.push("Relationship Coaching"); frameworkEmphasis.push("EFT"); }
  if (relationship.conflictAvoid >= 4) { growthAreas.push("Conflict engagement — tendency to avoid rather than work through conflict"); coachingRecommendations.push("Relationship Coaching"); frameworkEmphasis.push("EFT"); }
  if (relationship.intimacyPacing <= 2) { growthAreas.push("Intimacy pacing — slower to open up, working toward comfortable vulnerability"); coachingRecommendations.push("Relationship Coaching"); frameworkEmphasis.push("EFT"); }
  if (relationship.socialEnergyBudget <= 2) { growthAreas.push("Social energy — introversion, managing energy around social connection"); }

  if (motivation.intrinsicOrientation <= 2 || motivation.identifiedRegulation <= 2) { growthAreas.push("Intrinsic motivation — goals feel imposed rather than personally chosen"); coachingRecommendations.push("Values & Direction"); frameworkEmphasis.push("ACT"); }
  if (motivation.introjectedRegulation >= 4 || motivation.extrinsicOrientation >= 4) { growthAreas.push("Extrinsic pressure — driven by guilt, shoulds, or external expectations rather than own values"); coachingRecommendations.push("Values & Direction"); frameworkEmphasis.push("ACT"); }
  if (motivation.growthMindset <= 2) { growthAreas.push("Growth mindset — tendency to see abilities as fixed rather than improvable"); coachingRecommendations.push("Progress & Momentum"); frameworkEmphasis.push("CBT"); }
  if (motivation.avoidanceMotivation >= 4) { growthAreas.push("Approach motivation — driven more by avoiding negative outcomes than pursuing positive ones"); coachingRecommendations.push("Values & Direction", "Progress & Momentum"); frameworkEmphasis.push("ACT", "SFBT"); }
  if (motivation.sdtAutonomy <= 2) { growthAreas.push("Autonomy — feeling controlled or pushed rather than self-directed"); coachingRecommendations.push("Values & Direction"); frameworkEmphasis.push("ACT"); }
  if (motivation.sdtCompetence <= 2) { growthAreas.push("Competence — feeling ineffective or stuck rather than capable and growing"); coachingRecommendations.push("Progress & Momentum", "Regulation Skills"); frameworkEmphasis.push("SFBT", "CBT"); }
  if (motivation.sdtRelatedness <= 2) { growthAreas.push("Relatedness — feeling disconnected or isolated rather than connected and belonging"); coachingRecommendations.push("Emotional Awareness & Expression"); frameworkEmphasis.push("EFT"); }

  if (behavioral.selfMonitoringFrequency <= 2) { growthAreas.push("Self-monitoring — low awareness of own behavior in the moment"); coachingRecommendations.push("Progress & Momentum"); frameworkEmphasis.push("CBT", "SFBT"); }
  if (behavioral.impulseRegulation <= 2) { growthAreas.push("Impulse regulation — difficulty pausing and choosing between impulse and intention"); coachingRecommendations.push("Regulation Skills"); frameworkEmphasis.push("DBT"); }
  if (behavioral.routineStructureOrientation >= 4) { strengths.push("Structure orientation — thrives with clear routines and frameworks"); coachingRecommendations.push("Progress & Momentum"); }
  if (behavioral.habitFormationSusceptibility <= 2) { growthAreas.push("Habit formation — difficulty forming new habits automatically"); coachingRecommendations.push("Progress & Momentum"); frameworkEmphasis.push("SFBT"); }
  if (behavioral.implementationIntentionReadiness >= 4) { strengths.push("Implementation-intention readiness — naturally thinks in 'if-then' plans"); coachingRecommendations.push("Progress & Momentum"); }

  if (wellness.stressBaseline >= 4) { coachingRecommendations.push("Regulation Skills", "Mindful Presence"); frameworkEmphasis.push("DBT", "Mindfulness"); }
  if (wellness.energyBaseline <= 2) { coachingRecommendations.push("Regulation Skills", "Values & Direction"); frameworkEmphasis.push("DBT", "ACT"); }
  if (wellness.sleepQualitySelfReport <= 2) { growthAreas.push("Sleep quality — self-reported sleep is poor"); coachingRecommendations.push("Wellness Programs"); }
  if (wellness.opennessToInterventions >= 4) { strengths.push("Openness to new wellness approaches — willing to try and explore"); }
  if (wellness.somaticAwareness >= 4) { strengths.push("Somatic awareness — tuned into body signals"); frameworkEmphasis.push("Mindfulness", "EFT"); }
  if (wellness.recoveryMethodEffectiveness <= 2) { growthAreas.push("Recovery effectiveness — current recovery methods aren't working well"); coachingRecommendations.push("Regulation Skills", "Mindful Presence"); frameworkEmphasis.push("DBT", "Mindfulness"); }

  const personalitySummary = `A ${bigFive.neuroticism >= 3.5 ? "reflective, emotionally sensitive" : "steady, emotionally balanced"} person with a ${attachmentStyle} attachment style, ${relationship.communicationDirect >= 4 ? "direct" : relationship.communicationDirect <= 2 ? "indirect" : "balanced"} communication style, and a ${cognitive.cognitiveStyleReflective >= 4 ? "reflective, analytical" : cognitive.cognitiveStyleIntuitive >= 4 ? "intuitive, fast-processing" : "balanced"} cognitive approach. ${motivation.sdtAutonomy >= 4 ? "Self-directed and autonomous" : motivation.introjectedRegulation >= 4 ? "Driven by internal pressure and shoulds" : "Moderately self-directed"}. ${wellness.stressBaseline >= 4 ? "Currently experiencing elevated stress" : wellness.energyBaseline >= 4 ? "Currently well-resourced with good energy" : "In a moderate wellness state"}.`;

  return {
    bigFive, attachmentStyle, hexaco, enneagram, disc, loveLanguages,
    emotional, cognitive, relationship, motivation, behavioral, wellness,
    communicationStyle, personalitySummary, strengths, growthAreas,
    relationshipAdvice: `Your ${attachmentStyle} attachment style shapes how you relate. ${attachmentStyle === "anxious" ? "You're sensitive to signs of distance or rejection. Prioritize consistent warmth and explicit check-ins. Reassurance through presence, not promises." : attachmentStyle === "avoidant" ? "You value independence and may pull back when connection feels demanding. Give yourself space without punishing withdrawal. Warmth without intensity works best." : attachmentStyle === "fearful" ? "You want connection but are afraid of it — you may move toward and pull back. Steady, patient warmth without demands is the path. You can experience that connection is safe." : "You're comfortable with closeness and open communication. A natural, supportive companionship rhythm works well."}`,
    coachingRecommendations: [...new Set(coachingRecommendations)],
    frameworkEmphasis: [...new Set(frameworkEmphasis)],
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────
function normalize(a?: number, b?: number): number {
  const vals = [a, b].filter((v): v is number => v != null && v >= 1 && v <= 5);
  return vals.length > 0 ? Math.max(1, Math.min(5, vals.reduce((x, y) => x + y, 0) / vals.length)) : 3;
}
function normalize4(a?: number, b?: number, c?: number, d?: number): number {
  const vals = [a, b, c, d].filter((v): v is number => v != null && v >= 1 && v <= 5);
  return vals.length > 0 ? Math.max(1, Math.min(5, vals.reduce((x, y) => x + y, 0) / vals.length)) : 3;
}
