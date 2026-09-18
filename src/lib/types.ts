// Shared types for Youna — Phase Two

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

export interface PersonalityProfile {
  id: string;
  createdAt: string;
  // Big Five (1-5 scale, from Phase One assessment)
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
  // Attachment style
  attachmentStyle: AttachmentStyle;
  // User-stated goals
  goals: string;
  // Phase Two: extended DNA fields (populated by assessment extension)
  hexaco: Partial<Record<"honesty" | "emotionality" | "extraversion" | "agreeableness" | "conscientiousness" | "openness", number>>;
  enneagram: number | null;
  disc: "d" | "i" | "s" | "c" | null;
  loveLanguages: Array<"words" | "acts" | "gifts" | "time" | "touch">;
  communicationStyle: string;
  personalitySummary: string;
}
