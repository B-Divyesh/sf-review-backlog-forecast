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
  it("@claim:three-policies builds all three distinct recovery policies", () => {
    const forecasts = simulateAll({ ...base, deadlineDays: 7 }, new Date("2026-08-27T12:00:00"));
    expect(forecasts.map((forecast) => forecast.id)).toEqual(["steady", "deadline", "gentle"]);
    expect(forecasts.every((forecast) => forecast.days.length >= 42)).toBe(true);
    const schedules = forecasts.map((forecast) => JSON.stringify(forecast.days.map((day) => day.overdueReviewed)));
    expect(new Set(schedules).size).toBe(3);
    expect(forecasts[1].finishDay).toBeLessThanOrEqual(7);
    expect(forecasts[2].days[0].overdueReviewed).toBeLessThan(forecasts[0].days[0].overdueReviewed);
  });

  it("@claim:hard-session-cap never exceeds the hard session cap", () => {
    for (const forecast of simulateAll(base)) {
      expect(Math.max(...forecast.days.map((day) => day.minutes))).toBeLessThanOrEqual(base.capMinutes);
      expect(Math.max(...forecast.days.map((day) => day.totalReviewed))).toBeLessThanOrEqual(150);
    }
  });

  it("@claim:due-today-priority protects due-today cards before overdue recovery", () => {
    const constrained = { ...base, dueToday: 100, overdue: 100, capMinutes: 20, secondsPerCard: 12 };
    const firstDay = simulatePolicy(constrained, "deadline").days[0];
    expect(firstDay.regularReviewed).toBe(100);
    expect(firstDay.overdueReviewed).toBe(0);
    expect(firstDay.overdueRemaining).toBe(100);
  });

  it("@claim:rollover-visible keeps regular rollover visible when normal demand exceeds capacity", () => {
    const overloaded = { ...base, dueToday: 200, dailyDue: 200, capMinutes: 10 };
    const forecast = simulatePolicy(overloaded, "deadline");
    expect(forecast.days[0].regularRollover).toBe(150);
    expect(forecast.finalRollover).toBeGreaterThan(0);
    expect(forecast.onTarget).toBe(false);
  });

  it("@claim:steady-recovery-target makes the sample halve within one week and clear within two", () => {
    const forecast = simulatePolicy(base, "steady", new Date("2026-08-27T12:00:00"));
    const firstWeek = forecast.days.filter((day) => day.index <= 7).at(-1);
    expect(firstWeek?.overdueRemaining).toBeLessThanOrEqual(base.overdue / 2);
    expect(forecast.finishDay).toBeLessThanOrEqual(14);
    expect(forecast.onTarget).toBe(true);
  });

  it("@claim:deadline-feasibility identifies both a reachable and unreachable deadline", () => {
    const reachable = simulatePolicy(base, "deadline", new Date("2026-08-27T12:00:00"));
    const unreachable = simulatePolicy({ ...base, dueToday: 150, dailyDue: 150 }, "deadline", new Date("2026-08-27T12:00:00"));
    expect(reachable.finishDay).toBeLessThanOrEqual(base.deadlineDays);
    expect(reachable.onTarget).toBe(true);
    expect(unreachable.finishDay).toBeNull();
    expect(unreachable.onTarget).toBe(false);
  });

  it("@claim:gentle-ramp uses half, then three-quarter, then full allowance over five study sessions", () => {
    const steady = simulatePolicy(base, "steady", new Date("2026-08-27T12:00:00"));
    const gentle = simulatePolicy(base, "gentle", new Date("2026-08-27T12:00:00"));
    const steadyAllowance = steady.days.find((day) => day.studyDay)?.overdueReviewed;
    const ramp = gentle.days.filter((day) => day.studyDay).slice(0, 6).map((day) => day.overdueReviewed);
    expect(ramp).toEqual([14, 14, 21, 21, 21, steadyAllowance]);
  });

  it("marks an achievable steady plan on target", () => {
    const forecast = simulatePolicy(base, "steady", new Date("2026-08-27T12:00:00"));
    expect(forecast.finishDay).toBeLessThanOrEqual(14);
    expect(forecast.halfwayDay).toBeLessThanOrEqual(7);
    expect(forecast.onTarget).toBe(true);
  });

  it("reports validation errors for impossible inputs", () => {
    expect(validateInput({ ...base, overdue: -1, secondsPerCard: 1, studyDays: 8 })).toEqual([
      "Overdue cards must be a whole number between 0 and 100,000.",
      "Seconds per card must be between 3 and 300.",
      "Study days must be between 1 and 7 per week."
    ]);
  });

  it("rejects every declared count maximum before simulation", () => {
    expect(validateInput({ ...base, overdue: 100_001 })).toContain("Overdue cards must be a whole number between 0 and 100,000.");
    expect(validateInput({ ...base, dueToday: 100_001 })).toContain("Due today must be a whole number between 0 and 100,000.");
    expect(validateInput({ ...base, dailyDue: 100_001 })).toContain("Regular reviews per day must be a whole number between 0 and 100,000.");
    expect(validateInput({ ...base, newCards: 10_001 })).toContain("New cards per day must be a whole number between 0 and 10,000.");
  });
});
