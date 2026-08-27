import { describe, expect, it } from "vitest";
import { parseCardCsv } from "./csv";

describe("CSV import", () => {
  it("reads a one-row queue summary", () => {
    expect(parseCardCsv("overdue,due_today,daily_due\n320,48,36\n")).toEqual({
      overdue: 320,
      dueToday: 48,
      dailyDue: 36,
      rowCount: 1,
      source: "summary"
    });
  });

  it("classifies one-card-per-row due dates", () => {
    const csv = "card,due_date\n\"Alpha, one\",2026-08-25\nBeta,2026-08-27\nGamma,2026-09-03\n";
    expect(parseCardCsv(csv, new Date("2026-08-27T12:00:00"))).toEqual({
      overdue: 1,
      dueToday: 1,
      dailyDue: 1,
      rowCount: 3,
      source: "card rows"
    });
  });

  it("supports days_overdue and grouped counts", () => {
    const csv = "days_overdue,count\n12,4\n0,3\n-2,8\n";
    expect(parseCardCsv(csv)).toMatchObject({ overdue: 4, dueToday: 3, dailyDue: 1 });
  });

  it("rejects unknown files with an actionable message", () => {
    expect(() => parseCardCsv("front,back\na,b\n")).toThrow("Use summary columns overdue,due_today,daily_due");
  });

  it("rejects empty and malformed CSV", () => {
    expect(() => parseCardCsv("")).toThrow("The CSV is empty");
    expect(() => parseCardCsv('due_date\n"2026-08-27')).toThrow("unclosed quoted field");
  });
});
