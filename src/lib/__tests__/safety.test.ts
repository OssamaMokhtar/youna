import { describe, it, expect } from "vitest";
import { detectCrisis, isCrisisText, shouldOpenCrisisDialog, CRISIS_REPLY } from "@/lib/safety";

// Golden set. Small on purpose: it is a regression floor, not a validation
// study. Every case that a real user report or review surfaces gets added here.
const DIRECT = [
  "I want to kill myself",
  "i've been thinking about suicide",
  "I feel suicidal tonight",
  "I want to end my life",
  "I keep cutting myself",
  "I have a plan to do it",
  "thinking about self-harm again",
  "I want to die",
  "going to end it this weekend",
  "I might take an overdose",
];

const INDIRECT = [
  "everyone would be better off without me",
  "I don't want to be here anymore",
  "I just want to sleep and never wake up",
  "I can't do this anymore",
  "there's no point in living like this",
  "I wish I was dead",
  "nobody would notice if I was gone, nobody would miss me",
  "I've started giving away my things",
  "honestly nothing matters anymore",
  "I feel worthless",
];

// Everyday phrasing that must NOT trigger the crisis path.
const BENIGN = [
  "this workout is killing me",
  "I'm dying to try that new cafe",
  "my deadline will be the death of me lol",
  "I had a great day with friends",
  "feeling a bit stressed about exams",
  "can you help me plan my week",
  "I want to kill it at my interview tomorrow",
  "I'm tired but okay",
  "I have a plan for the weekend",
];

describe("crisis detection golden set", () => {
  const positives = [...DIRECT, ...INDIRECT];
  const hits = positives.filter(isCrisisText);
  const falsePositives = BENIGN.filter(isCrisisText);

  it(`recall on ${positives.length} crisis phrases is 100%`, () => {
    const missed = positives.filter((t) => !isCrisisText(t));
    expect(missed).toEqual([]);
    expect(hits.length).toBe(positives.length);
  });

  it(`no false positives on ${BENIGN.length} everyday phrases`, () => {
    expect(falsePositives).toEqual([]);
  });

  it("matches 'suicide' (the old client regex /\\bsuic(id|de)\\b/ did not)", () => {
    expect(/\bsuic(id|de)\b/i.test("suicide")).toBe(false);
    expect(isCrisisText("suicide")).toBe(true);
    expect(isCrisisText("suicidal")).toBe(true);
  });

  it("reports which patterns matched", () => {
    expect(detectCrisis("I want to die").matched.length).toBeGreaterThan(0);
    expect(detectCrisis("").level).toBe("none");
    expect(detectCrisis(undefined).level).toBe("none");
  });

  it("the crisis reply is fixed text that points to real help", () => {
    expect(CRISIS_REPLY).toMatch(/not a crisis service/);
    expect(CRISIS_REPLY).toMatch(/emergency/);
  });
});

describe("mood / check-in crisis dialog", () => {
  const base = { avgThreshold: 1.5, todayMax: 2 };

  it("opens on a low day after a low week (check-in 0-4 scale)", () => {
    expect(shouldOpenCrisisDialog({ ...base, todayScore: 0, previousScores: [1, 1, 2] })).toBe(true);
  });

  it("opens again on a second low entry the same day (no suppression)", () => {
    const first = shouldOpenCrisisDialog({ ...base, todayScore: 1, previousScores: [1, 1] });
    const second = shouldOpenCrisisDialog({ ...base, todayScore: 0, previousScores: [1, 1] });
    expect(first).toBe(true);
    expect(second).toBe(true);
  });

  it("includes today in the average", () => {
    // previous avg 2.0 would not trigger; with today's 0 the avg is 1.33
    expect(shouldOpenCrisisDialog({ ...base, todayScore: 0, previousScores: [2, 2] })).toBe(true);
  });

  it("opens on crisis language in the note even on an okay mood", () => {
    expect(
      shouldOpenCrisisDialog({ ...base, todayScore: 3, previousScores: [3, 3], note: "I don't want to be here anymore" })
    ).toBe(true);
  });

  it("stays closed on a good week", () => {
    expect(shouldOpenCrisisDialog({ ...base, todayScore: 3, previousScores: [3, 4, 3] })).toBe(false);
  });

  it("works with no history (first-ever entry)", () => {
    expect(shouldOpenCrisisDialog({ ...base, todayScore: 0, previousScores: [] })).toBe(true);
    expect(shouldOpenCrisisDialog({ ...base, todayScore: 4, previousScores: [] })).toBe(false);
  });
});
