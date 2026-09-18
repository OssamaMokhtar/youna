// src/lib/llm.ts — LLM client with model routing, fallback chain, cost tracking
// Phase Three: replaces mock AI with real LLM while keeping mock as fallback

export type ModelProvider = "openai" | "claude" | "gemini" | "mock";

export interface LLMChoice {
  provider: ModelProvider;
  model: string;
  label: string;
  costPer1kInputTokens: number;
  costPer1kOutputTokens: number;
  maxTokens: number;
  supportsSystemRole: boolean;
  supportsStreaming: boolean;
}

export const MODELS: Record<ModelProvider, LLMChoice> = {
  openai: {
    provider: "openai",
    model: "gpt-4.1-mini",
    label: "OpenAI GPT-4.1 Mini",
    costPer1kInputTokens: 0.00035,
    costPer1kOutputTokens: 0.0014,
    maxTokens: 128000,
    supportsSystemRole: true,
    supportsStreaming: true,
  },
  claude: {
    provider: "claude",
    model: "claude-sonnet-4-20250514",
    label: "Claude Sonnet 4",
    costPer1kInputTokens: 0.003,
    costPer1kOutputTokens: 0.015,
    maxTokens: 200000,
    supportsSystemRole: true,
    supportsStreaming: true,
  },
  gemini: {
    provider: "gemini",
    model: "gemini-2.5-flash",
    label: "Gemini 2.5 Flash",
    costPer1kInputTokens: 0.000125,
    costPer1kOutputTokens: 0.000375,
    maxTokens: 1024000,
    supportsSystemRole: true,
    supportsStreaming: true,
  },
  mock: {
    provider: "mock",
    model: "mock",
    label: "Mock (fallback)",
    costPer1kInputTokens: 0,
    costPer1kOutputTokens: 0,
    maxTokens: 4000,
    supportsSystemRole: false,
    supportsStreaming: false,
  },
};

export interface LLMConfig {
  provider: ModelProvider;
  apiKey?: string;
  fallbackProviders?: ModelProvider[];
  maxTokens?: number;
  temperature?: number;
  mockMode?: boolean;
}

export interface LLMUsage {
  inputTokens: number;
  outputTokens: number;
  provider: ModelProvider;
  model: string;
  estimatedCost: number;
  timestamp: string;
}

export interface LLMResponse {
  text: string;
  usage: LLMUsage;
  provider: ModelProvider;
  model: string;
  latencyMs: number;
}

function estimateCostForProvider(
  inputTokens: number,
  outputTokens: number,
  provider: ModelProvider,
  model: string
): number {
  const m = MODELS[provider];
  if (!m || provider === "mock") return 0;
  return (
    (inputTokens / 1000) * m.costPer1kInputTokens +
    (outputTokens / 1000) * m.costPer1kOutputTokens
  );
}

export function estimateSingleTurnCost(
  inputTokens: number,
  outputTokens: number,
  provider: ModelProvider,
  model: string
): number {
  return estimateCostForProvider(inputTokens, outputTokens, provider, model);
}

function estimateCost(usage: LLMUsage): number {
  return estimateCostForProvider(
    usage.inputTokens,
    usage.outputTokens,
    usage.provider,
    usage.model
  );
}

// ── Config ──────────────────────────────────────────────────────────────────

const DEFAULT_CONFIG: LLMConfig = {
  provider: "openai",
  fallbackProviders: ["claude", "gemini", "mock"],
  maxTokens: 2000,
  temperature: 0.7,
  mockMode: true,
};

let config: LLMConfig = { ...DEFAULT_CONFIG };
let totalCost = 0;
let totalTokens = 0;

export function setLLMConfig(c: Partial<LLMConfig>): void {
  config = { ...config, ...c };
}

export function getLLMConfig(): LLMConfig {
  return { ...config };
}

export function getTotalCost(): number {
  return totalCost;
}

export function getTotalTokens(): number {
  return totalTokens;
}

export function resetCostTracking(): void {
  totalCost = 0;
  totalTokens = 0;
}

// ── Mock LLM ───────────────────────────────────────────────────────────────

function mockResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  if (lower.includes("thank")) return "You're very welcome. I'm really glad I could be here for you. Remember — I'm always here when you need to talk, reflect, or just take a moment for yourself.";
  if (lower.includes("bye") || lower.includes("goodbye")) return "Take care of yourself. I'm always here when you need me. See you soon.";
  if (lower.includes("stress") || lower.includes("overwhelm") || lower.includes("pressure") || lower.includes("burnout")) return "It sounds like you're under a lot of pressure right now. That weight you're feeling — it's real, and it matters. What's been contributing most to the stress lately?";
  if (lower.includes("anxious") || lower.includes("anxiety") || lower.includes("worried") || lower.includes("panic") || lower.includes("nervous") || lower.includes("scared") || lower.includes("fear") || lower.includes("overthink")) return "I hear the anxiety in your words. When anxiety shows up, what does it feel like in your body? Sometimes naming it takes away some of its power. What's the anxious thought that keeps repeating?";
  if (lower.includes("sad") || lower.includes("down") || lower.includes("depressed") || lower.includes("lonely") || lower.includes("hopeless") || lower.includes("cry") || lower.includes("heavy")) return "I'm sorry you're feeling this heaviness. There's no rush to fix anything right now. What do you need most — to be heard, to be distracted, or to sit with it together?";
  if (lower.includes("happy") || lower.includes("good") || lower.includes("great") || lower.includes("wonderful") || lower.includes("celebrate") || lower.includes("proud")) return "That's wonderful — I'm genuinely glad to hear you're feeling this way. What's contributing to the good mood? Good moments matter, even the small ones.";
  if (lower.includes("calm") || lower.includes("peaceful") || lower.includes("relaxed") || lower.includes("better") || lower.includes("okay")) return "That sense of peace is precious. What's in your life right now that's bringing you this calm? Calm isn't nothing — it's a state you've earned or found.";
  return "Thank you for sharing that with me. It takes courage to put feelings into words. Can you tell me more about what's been hardest?";
}

export async function mockComplete(
  _systemPrompt: string,
  _history: Array<{ role: "user" | "assistant"; content: string }>,
  userMessage: string
): Promise<LLMResponse> {
  const startTime = Date.now();
  const text = mockResponse(userMessage);
  const latencyMs = Date.now() - startTime;
  const outputTokens = Math.ceil(text.length / 4);
  totalCost += 0;
  totalTokens += outputTokens;
  return {
    text,
    usage: { inputTokens: 0, outputTokens, provider: "mock", model: "mock", estimatedCost: 0, timestamp: new Date().toISOString() },
    provider: "mock",
    model: "mock",
    latencyMs,
  };
}

// ── OpenAI ────────────────────────────────────────────────────────────────

async function completeOpenAI(
  systemPrompt: string,
  history: Array<{ role: "user" | "assistant"; content: string }>,
  userMessage: string
): Promise<LLMResponse> {
  const startTime = Date.now();
  if (!config.apiKey) throw new Error("OpenAI API key not configured");

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map((m) => ({ role: m.role as "system" | "user" | "assistant", content: m.content })),
    { role: "user", content: userMessage },
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODELS.openai.model,
      messages,
      max_tokens: config.maxTokens ?? 2000,
      temperature: config.temperature ?? 0.7,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(`OpenAI error ${response.status}: ${errorBody.slice(0, 200)}`);
  }

  const data = await response.json();
  const latencyMs = Date.now() - startTime;
  const inputTokens = data.usage?.prompt_tokens ?? 0;
  const outputTokens = data.usage?.completion_tokens ?? 0;
  const choice = data.choices?.[0]?.message?.content ?? "";
  if (!choice) throw new Error("OpenAI returned empty response");

  const usage: LLMUsage = {
    inputTokens, outputTokens, provider: "openai", model: MODELS.openai.model,
    estimatedCost: estimateCostForProvider(inputTokens, outputTokens, "openai", MODELS.openai.model),
    timestamp: new Date().toISOString(),
  };
  totalCost += usage.estimatedCost;
  totalTokens += inputTokens + outputTokens;
  return { text: choice, usage, provider: "openai", model: MODELS.openai.model, latencyMs };
}

// ── Claude ────────────────────────────────────────────────────────────────

async function completeClaude(
  systemPrompt: string,
  history: Array<{ role: "user" | "assistant"; content: string }>,
  userMessage: string
): Promise<LLMResponse> {
  const startTime = Date.now();
  if (!config.apiKey) throw new Error("Claude API key not configured");

  const messages = [
    ...history.map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content })),
    { role: "user", content: userMessage },
  ];

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODELS.claude.model,
      max_tokens: config.maxTokens ?? 2000,
      temperature: config.temperature ?? 0.7,
      system: systemPrompt,
      messages,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(`Claude error ${response.status}: ${errorBody.slice(0, 200)}`);
  }

  const data = await response.json();
  const latencyMs = Date.now() - startTime;
  const inputTokens = data.usage?.input_tokens ?? 0;
  const outputTokens = data.usage?.output_tokens ?? 0;
  const contentBlock = data.content?.[0]?.type === "text" ? data.content[0].text : "";
  if (!contentBlock) throw new Error("Claude returned empty response");

  const usage: LLMUsage = {
    inputTokens, outputTokens, provider: "claude", model: MODELS.claude.model,
    estimatedCost: estimateCostForProvider(inputTokens, outputTokens, "claude", MODELS.claude.model),
    timestamp: new Date().toISOString(),
  };
  totalCost += usage.estimatedCost;
  totalTokens += inputTokens + outputTokens;
  return { text: contentBlock, usage, provider: "claude", model: MODELS.claude.model, latencyMs };
}

// ── Gemini ────────────────────────────────────────────────────────────────

async function completeGemini(
  systemPrompt: string,
  history: Array<{ role: "user" | "assistant"; content: string }>,
  userMessage: string
): Promise<LLMResponse> {
  const startTime = Date.now();
  if (!config.apiKey) throw new Error("Gemini API key not configured");

  const messages: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [
    { role: "user", parts: [{ text: systemPrompt }] },
    ...history.map((m) => ({
      role: (m.role === "assistant" ? "model" : "user") as "user" | "model",
      parts: [{ text: m.content }],
    })),
    { role: "user", parts: [{ text: userMessage }] },
  ];

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODELS.gemini.model}:generateContent?key=${config.apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: messages,
        generationConfig: {
          maxOutputTokens: config.maxTokens ?? 2000,
          temperature: config.temperature ?? 0.7,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(`Gemini error ${response.status}: ${errorBody.slice(0, 200)}`);
  }

  const data = await response.json();
  const latencyMs = Date.now() - startTime;
  const inputTokens = data.usageMetadata?.promptTokenCount ?? 0;
  const outputTokens = data.usageMetadata?.candidatesTokenCount ?? 0;
  const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  if (!candidate) throw new Error("Gemini returned empty response");

  const usage: LLMUsage = {
    inputTokens, outputTokens, provider: "gemini", model: MODELS.gemini.model,
    estimatedCost: estimateCostForProvider(inputTokens, outputTokens, "gemini", MODELS.gemini.model),
    timestamp: new Date().toISOString(),
  };
  totalCost += usage.estimatedCost;
  totalTokens += inputTokens + outputTokens;
  return { text: candidate, usage, provider: "gemini", model: MODELS.gemini.model, latencyMs };
}

// ── Main completion with fallback chain ──────────────────────────────────

export async function complete(
  systemPrompt: string,
  history: Array<{ role: "user" | "assistant"; content: string }>,
  userMessage: string,
  _personality: string
): Promise<LLMResponse> {
  if (config.mockMode) return mockComplete(systemPrompt, history, userMessage);

  const providers: ModelProvider[] = [config.provider, ...(config.fallbackProviders ?? [])];
  for (const provider of providers) {
    try {
      switch (provider) {
        case "openai": return await completeOpenAI(systemPrompt, history, userMessage);
        case "claude": return await completeClaude(systemPrompt, history, userMessage);
        case "gemini": return await completeGemini(systemPrompt, history, userMessage);
        default: continue;
      }
    } catch (error) {
      console.warn(`[Youna LLM] ${provider} failed:`, (error as Error).message);
      continue;
    }
  }
  console.warn("[Youna LLM] All providers failed, using mock fallback");
  return mockComplete(systemPrompt, history, userMessage);
}

// ── Formatting helpers ──────────────────────────────────────────────────

export function formatCost(cost: number): string {
  if (cost === 0) return "Free";
  if (cost < 0.0001) return `< $0.0001`;
  return `$${cost.toFixed(4)}`;
}

export function formatLatency(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}
