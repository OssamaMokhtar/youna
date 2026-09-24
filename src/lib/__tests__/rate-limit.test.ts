import { describe, it, expect, beforeEach } from "vitest";
import { rateLimit, _resetRateLimits } from "@/lib/rate-limit";

describe("rateLimit", () => {
  beforeEach(() => _resetRateLimits());

  it("allows up to the limit, then blocks with Retry-After", () => {
    const t = 1_000_000;
    for (let i = 0; i < 3; i++) expect(rateLimit("ip", 3, 60_000, t).allowed).toBe(true);
    const blocked = rateLimit("ip", 3, 60_000, t + 1_000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSec).toBe(59);
  });

  it("resets after the window", () => {
    const t = 2_000_000;
    for (let i = 0; i < 3; i++) rateLimit("ip", 3, 60_000, t);
    expect(rateLimit("ip", 3, 60_000, t + 60_000).allowed).toBe(true);
  });

  it("keys are independent", () => {
    const t = 3_000_000;
    for (let i = 0; i < 3; i++) rateLimit("a", 3, 60_000, t);
    expect(rateLimit("b", 3, 60_000, t).allowed).toBe(true);
  });
});
