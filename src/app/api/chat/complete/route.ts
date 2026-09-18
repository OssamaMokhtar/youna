import { NextRequest, NextResponse } from "next/server";
import { complete, resetCostTracking, getTotalCost, getTotalTokens, setLLMConfig, getLLMConfig } from "@/lib/llm";
import { buildChatPrompt, type PersonalityContext } from "@/lib/prompts";

// ── Config (loaded once at module init from environment) ──────────────────────

const DEFAULT_PROVIDER = (process.env.YOUNA_LLM_PROVIDER as "openai" | "claude" | "gemini") ?? "openai";
const MOCK_MODE = process.env.YOUNA_MOCK_MODE === "false" ? false : true;
const API_KEY = process.env.OPENAI_API_KEY ?? process.env.CLAUDE_API_KEY ?? process.env.GEMINI_API_KEY;

let configured = false;

function ensureConfigured() {
  if (configured) return;
  setLLMConfig({
    provider: DEFAULT_PROVIDER,
    apiKey: API_KEY,
    fallbackProviders: ["claude", "gemini", "mock"],
    maxTokens: 2000,
    temperature: 0.7,
    mockMode: MOCK_MODE,
  });
  configured = true;
}

// ── Crisis keywords (mirrors client-side detection as a second gate) ──────────

const CRISIS_PATTERNS = [
  /suic(ide|al)/i,
  /end my life/i,
  /kill myself/i,
  /want to die/i,
  /no reason to live/i,
  /nothing matters/i,
  /worthless/i,
  /harm myself/i,
  /cut myself/i,
  /self harm/i,
  /hurting myself/i,
  /have a plan/i,
  /going to end it/i,
  /please help me/i,
  /i can't go on/i,
  /nobody cares/i,
];

function detectCrisis(text: string): boolean {
  return CRISIS_PATTERNS.some((p) => p.test(text));
}

// ── Parse personality context from request body ─────────────────────────────

function parsePersonality(body: unknown): PersonalityContext | undefined {
  if (!body || typeof body !== "object") return undefined;
  const obj = body as Record<string, unknown>;
  if (!obj.personality || typeof obj.personality !== "object") return undefined;

  const p = obj.personality as Record<string, unknown>;
  const result: PersonalityContext = { assessmentComplete: p.assessmentComplete === true };

  if (p.bigFive && typeof p.bigFive === "object") {
    const bf = p.bigFive as Record<string, number>;
    result.bigFive = {
      openness: bf.openness as number | undefined,
      conscientiousness: bf.conscientiousness as number | undefined,
      extraversion: bf.extraversion as number | undefined,
      agreeableness: bf.agreeableness as number | undefined,
      neuroticism: bf.neuroticism as number | undefined,
    };
  }

  if (typeof p.attachmentStyle === "string") result.attachmentStyle = p.attachmentStyle;
  if (Array.isArray(p.loveLanguages)) result.loveLanguages = p.loveLanguages as string[];
  if (typeof p.enneagramType === "number") result.enneagramType = p.enneagramType;
  if (typeof p.discStyle === "string") result.discStyle = p.discStyle;
  if (p.hexaco && typeof p.hexaco === "object") result.hexaco = p.hexaco as Record<string, number>;
  if (typeof p.goals === "string") result.goals = p.goals;

  return result;
}

// ── POST /api/chat/complete ──────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  ensureConfigured();

  let body: { message?: string; history?: Array<{ role: "user" | "assistant"; content: string }>; personality?: unknown; mode?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.message || typeof body.message !== "string" || body.message.trim().length === 0) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const message = body.message.trim();
  const history = Array.isArray(body.history) ? body.history as Array<{ role: "user" | "assistant"; content: string }> : [];
  const personality = parsePersonality(body);
  const mode = (body.mode as "default" | "crisis" | "counseling") ?? "default";

  // Server-side crisis gate
  if (detectCrisis(message) || mode === "crisis") {
    const crisisPrompt = buildChatPrompt(personality, "crisis");
    try {
      const response = await complete(crisisPrompt, history, message, "");
      return NextResponse.json({
        text: response.text,
        provider: response.provider,
        model: response.model,
        usage: response.usage,
        latencyMs: response.latencyMs,
        crisis: true,
      });
    } catch (err) {
      console.error("[Youna API] crisis completion failed:", (err as Error).message);
      return NextResponse.json(
        { error: "Failed to generate crisis response", crisis: true, text: "I can hear how much pain you're in. You don't have to go through this alone. Please reach out to a crisis counselor — they're available 24/7. I've included resources in the app." },
        { status: 500 }
      );
    }
  }

  if (mode === "counseling") {
    const counselingPrompt = buildChatPrompt(personality, "counseling");
    try {
      const response = await complete(counselingPrompt, history, message, "");
      return NextResponse.json({
        text: response.text,
        provider: response.provider,
        model: response.model,
        usage: response.usage,
        latencyMs: response.latencyMs,
        counseling: true,
      });
    } catch (err) {
      console.error("[Youna API] counseling completion failed:", (err as Error).message);
      return NextResponse.json(
        { error: "Failed to generate response", counseling: true, text: "That's a really healthy thing to be thinking about. A therapist can offer something I can't — licensed clinical support, and a space that's entirely about you." },
        { status: 500 }
      );
    }
  }

  // Default mode
  const prompt = buildChatPrompt(personality, "default");
  try {
    const response = await complete(prompt, history, message, "");
    return NextResponse.json({
      text: response.text,
      provider: response.provider,
      model: response.model,
      usage: response.usage,
      latencyMs: response.latencyMs,
    });
  } catch (err) {
    console.error("[Youna API] completion failed:", (err as Error).message);
    return NextResponse.json(
      { error: "Failed to generate response", text: "I'm sorry — I'm having trouble responding right now. Could you try again in a moment?" },
      { status: 500 }
    );
  }
}

// ── GET /api/chat/health ──────────────────────────────────────────────────────

export async function GET() {
  ensureConfigured();

  const provider = getLLMConfig().provider;
  const mockMode = getLLMConfig().mockMode;
  const totalCost = getTotalCost();
  const totalTokens = getTotalTokens();

  return NextResponse.json({
    status: "ok",
    provider,
    mockMode,
    configured: configured,
    apiKeyPresent: !!API_KEY,
    fallbackProviders: ["claude", "gemini", "mock"],
    totalCost,
    totalTokens,
    timestamp: new Date().toISOString(),
  });
}
