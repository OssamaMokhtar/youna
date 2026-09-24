import { NextRequest, NextResponse } from "next/server";
import { complete, setLLMConfig, getLLMConfig } from "@/lib/llm";
import { buildChatPrompt, type PersonalityContext } from "@/lib/prompts";
import { isCrisisText, CRISIS_REPLY } from "@/lib/safety";
import { rateLimit, clientKey } from "@/lib/rate-limit";

// ── Config (loaded once at module init from environment) ──────────────────────

const DEFAULT_PROVIDER = (process.env.YOUNA_LLM_PROVIDER as "openai" | "claude" | "gemini") ?? "openai";
const MOCK_MODE = process.env.YOUNA_MOCK_MODE === "false" ? false : true;
// Each provider gets its own key. Passing one shared key to every provider made
// the fallback chain fail silently into mock replies.
const API_KEYS = {
  openai: process.env.OPENAI_API_KEY,
  claude: process.env.ANTHROPIC_API_KEY ?? process.env.CLAUDE_API_KEY,
  gemini: process.env.GEMINI_API_KEY,
};

let configured = false;

function ensureConfigured() {
  if (configured) return;
  setLLMConfig({
    provider: DEFAULT_PROVIDER,
    apiKeys: API_KEYS,
    fallbackProviders: ["claude", "gemini", "mock"],
    maxTokens: 2000,
    temperature: 0.7,
    mockMode: MOCK_MODE,
  });
  configured = true;
}

// ── Crisis detection ─────────────────────────────────────────────────────────
// Patterns are shared with the client in src/lib/safety.ts. The server is the
// second gate for any client that skips the first.

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

  const rl = rateLimit(`chat:${clientKey(req.headers)}`, 20, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }

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

  // Server-side crisis gate. The reply is deterministic: the model never
  // writes the response to someone in crisis.
  if (isCrisisText(message) || mode === "crisis") {
    return NextResponse.json({ text: CRISIS_REPLY, provider: "safety", model: "deterministic", crisis: true });
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

// ── GET /api/chat/complete (health) ──────────────────────────────────────────
// Public health check. It no longer returns running cost or whether keys are
// set: neither belongs in an unauthenticated response.

export async function GET() {
  ensureConfigured();
  return NextResponse.json({ status: "ok", mockMode: getLLMConfig().mockMode, timestamp: new Date().toISOString() });
}
