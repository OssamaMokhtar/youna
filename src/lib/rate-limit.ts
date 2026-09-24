// src/lib/rate-limit.ts — fixed-window, per-key limiter for API routes.
//
// In-memory, so on serverless it limits per warm instance, not globally. That
// still stops a single client from running up inference cost in a loop; a
// shared store (Upstash/Redis) is the upgrade once Youna is deployed.

interface Window {
  start: number;
  count: number;
}

const windows = new Map<string, Window>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSec: number;
}

export function rateLimit(key: string, limit = 20, windowMs = 60_000, now = Date.now()): RateLimitResult {
  const w = windows.get(key);
  if (!w || now - w.start >= windowMs) {
    windows.set(key, { start: now, count: 1 });
    return { allowed: true, remaining: limit - 1, retryAfterSec: 0 };
  }
  if (w.count >= limit) {
    return { allowed: false, remaining: 0, retryAfterSec: Math.ceil((w.start + windowMs - now) / 1000) };
  }
  w.count += 1;
  return { allowed: true, remaining: limit - w.count, retryAfterSec: 0 };
}

export function clientKey(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}

/** Test helper. */
export function _resetRateLimits(): void {
  windows.clear();
}
