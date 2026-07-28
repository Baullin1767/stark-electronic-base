import { beforeEach, describe, expect, it } from "vitest";
import {
  checkRateLimit,
  createFingerprint,
  resetRateLimitForTests,
} from "@/lib/rate-limit";

describe("rate limiter", () => {
  beforeEach(() => resetRateLimitForTests());

  it("allows a first request", () => {
    expect(checkRateLimit("ip", createFingerprint("first"), 1_000)).toEqual({
      allowed: true,
    });
  });

  it("blocks an identical request during the duplicate window", () => {
    const fingerprint = createFingerprint("same");
    checkRateLimit("ip", fingerprint, 1_000);
    expect(checkRateLimit("ip", fingerprint, 2_000).allowed).toBe(false);
  });

  it("blocks a fourth distinct request in ten minutes", () => {
    checkRateLimit("ip", createFingerprint("one"), 1_000);
    checkRateLimit("ip", createFingerprint("two"), 2_000);
    checkRateLimit("ip", createFingerprint("three"), 3_000);
    expect(
      checkRateLimit("ip", createFingerprint("four"), 4_000).allowed,
    ).toBe(false);
  });
});
