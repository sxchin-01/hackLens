// @vitest-environment jsdom

import { beforeEach, describe, expect, test, vi } from "vitest";

import { canMakeAIRequest, getCooldownTime } from "../lib/ai/rate-limiter";

describe("rate limiter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
    window.localStorage.clear();
  });

  test("allows requests under limit", () => {
    for (let i = 0; i < 5; i += 1) {
      expect(canMakeAIRequest()).toBe(true);
      vi.advanceTimersByTime(1);
    }
  });

  test("blocks requests over limit", () => {
    for (let i = 0; i < 5; i += 1) {
      canMakeAIRequest();
      vi.advanceTimersByTime(1);
    }

    expect(canMakeAIRequest()).toBe(false);
    expect(getCooldownTime()).toBeGreaterThan(0);
  });

  test("cooldown resets after one minute", () => {
    for (let i = 0; i < 5; i += 1) {
      canMakeAIRequest();
      vi.advanceTimersByTime(1);
    }

    expect(canMakeAIRequest()).toBe(false);

    vi.advanceTimersByTime(60_000);

    expect(getCooldownTime()).toBe(0);
    expect(canMakeAIRequest()).toBe(true);
  });
});
