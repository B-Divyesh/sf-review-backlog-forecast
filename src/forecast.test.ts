import { describe, expect, it } from "vitest";
import { simulateAll, simulatePolicy, validateInput } from "./forecast";
import type { ForecastInput } from "./types";

const base: ForecastInput = {
  overdue: 320,
  dueToday: 48,
  dailyDue: 36,
  newCards: 0,
  secondsPerCard: 12,
  capMinutes: 30,
  deadlineDays: 14,
  studyDays: 6
};

describe("forecast simulation", () => {
  it("builds all three distinct recovery policies", () => {
    const forecasts = simulateAll(base, new Date("2026-08-27T12:00:00"));
    expect(forecasts.map((forecast) => forecast.id)).toEqual(["steady", "deadline", "gentle"]);
    expect(forecasts.every((forecast) => forecast.days.length >= 42)).toBe(true);
    expect(forecasts[0].days.map((day) => day.overdueReviewed)).not.toEqual(forecasts[2].days.map((day) => day.overdueReviewed));
  });

  it("@claim:hard-session-cap never exceeds the hard session cap", () => {
    for (const forecast of simulateAll(base)) {
      expect(Math.max(...forecast.days.map((day) => day.minutes))).toBeLessThanOrEqual(base.capMinutes);
      expect(Math.max(...forecast.days.map((day) => day.totalReviewed))).toBeLessThanOrEqual(150);
    }
  });

  it("protects due-today cards before overdue recovery", () => {
    const constrained = { ...base, dueToday: 100, overdue: 100, capMinutes: 20, secondsPerCard: 12 };
    const firstDay = simulatePolicy(constrained, "deadline").days[0];
    expect(firstDay.regularReviewed).toBe(100);
    expect(firstDay.overdueReviewed).toBe(0);
    expect(firstDay.overdueRemaining).toBe(100);
  });

  it("keeps regular rollover visible when normal demand exceeds capacity", () => {
    const overloaded = { ...base, dueToday: 200, dailyDue: 200, capMinutes: 10 };
    const forecast = simulatePolicy(overloaded, "deadline");
    expect(forecast.days[0].regularRollover).toBe(150);
    expect(forecast.finalRollover).toBeGreaterThan(0);
    expect(forecast.onTarget).toBe(false);
  });

  it("marks an achievable steady plan on target", () => {
    const forecast = simulatePolicy(base, "steady", new Date("2026-08-27T12:00:00"));
    expect(forecast.finishDay).toBeLessThanOrEqual(14);
    expect(forecast.halfwayDay).toBeLessThanOrEqual(7);
    expect(forecast.onTarget).toBe(true);
  });

  it("reports validation errors for impossible inputs", () => {
    expect(validateInput({ ...base, overdue: -1, secondsPerCard: 1, studyDays: 8 })).toEqual([
      "Overdue cards must be a whole number of 0 or more.",
      "Seconds per card must be between 3 and 300.",
      "Study days must be between 1 and 7 per week."
    ]);
  });
});
