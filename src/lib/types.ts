// Shared types for Youna — Phase Two (extended with Phase Three DNA axes)

export type MoodValue = "happy" | "calm" | "sad" | "anxious" | "neutral";

export interface MoodEntry {
  id: string;
  date: string; // ISO date YYYY-MM-DD
  mood: MoodValue;
  note?: string;
  createdAt: string; // ISO timestamp
}

export interface JournalEntry {
  id: string;
  date: string; // ISO date YYYY-MM-DD
  content: string;
  prompt?: string;
  mood?: MoodValue;
  createdAt: string;
  updatedAt: string;
}

export type AttachmentStyle = "secure" | "anxious" | "avoidant" | "fearful";

// ── Phase Three extended DNA types (imported from personality.ts in production;
//    duplicated here for component-level type safety without circular deps) ──

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

// ── Full personality profile (all frameworks + extended DNA) ──────────────────

export interface PersonalityProfile {
  id: string;
  createdAt: string;

  // ── Phase One (Big Five + Attachment) ──────────────────────────
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
  attachmentStyle: AttachmentStyle;
  goals: string;

  // ── Phase Two (HEXACO, Enneagram, DISC, Love Languages) ────────
  hexaco: Partial<Record<"honestyHumility" | "emotionality" | "extraversion" | "agreeableness" | "conscientiousness" | "openness", number>>;
  enneagram: number | null;
  disc: "D" | "I" | "S" | "C" | null;
  loveLanguages: Array<"words" | "acts" | "gifts" | "time" | "touch">;

  // ── Phase Three extended DNA axes ───────────────────────────────
  emotional: EmotionalDNAScores;
  cognitive: CognitiveDNAScores;
  relationship: RelationshipDNAScores;
  motivation: MotivationDNAScores;
  behavioral: BehavioralDNAScores;
  wellness: WellnessDNAScores;

  // ── Derived summaries ───────────────────────────────────────────
  communicationStyle: string;
  personalitySummary: string;
  strengths: string[];
  growthAreas: string[];
  relationshipAdvice: string;
  coachingRecommendations: string[];
  frameworkEmphasis: string[];
}
