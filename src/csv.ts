import type { ImportSummary } from "./types";

function parseRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ",") {
      row.push(field.trim());
      field = "";
    } else if (char === "\n") {
      row.push(field.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") field += char;
  }
  row.push(field.trim());
  if (row.some(Boolean)) rows.push(row);
  if (quoted) throw new Error("The CSV has an unclosed quoted field.");
  return rows;
}

function safeWhole(value: string | undefined, label: string): number {
  const parsed = Number(value ?? "");
  if (!Number.isInteger(parsed) || parsed < 0) throw new Error(`${label} must be a whole number of 0 or more.`);
  return parsed;
}

export function parseCardCsv(text: string, today = new Date()): ImportSummary {
  if (!text.trim()) throw new Error("The CSV is empty.");
  const rows = parseRows(text);
  if (rows.length < 2) throw new Error("The CSV needs a header and at least one data row.");
  if (rows.length > 100_001) throw new Error("This CSV has more than 100,000 cards. Import a smaller export or use the totals form.");
  const headers = rows[0].map((header) => header.trim().toLowerCase().replace(/[ -]/g, "_"));
  const find = (...names: string[]) => names.map((name) => headers.indexOf(name)).find((index) => index >= 0) ?? -1;

  const overdueIndex = find("overdue", "overdue_cards");
  const todayIndex = find("due_today", "today");
  if (overdueIndex >= 0 && todayIndex >= 0) {
    const dailyIndex = find("daily_due", "usual_daily_due");
    return {
      overdue: safeWhole(rows[1][overdueIndex], "Overdue"),
      dueToday: safeWhole(rows[1][todayIndex], "Due today"),
      dailyDue: dailyIndex >= 0 ? safeWhole(rows[1][dailyIndex], "Regular reviews per day") : undefined,
      rowCount: 1,
      source: "summary"
    };
  }

  const dueIndex = find("due_date", "due", "date");
  const overdueDaysIndex = find("days_overdue");
  if (dueIndex < 0 && overdueDaysIndex < 0) {
    throw new Error("Use summary columns overdue,due_today,daily_due, or one card per row with due_date or days_overdue.");
  }
  const quantityIndex = find("count", "quantity");
  const todayKey = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  let overdue = 0;
  let dueToday = 0;
  let future = 0;

  for (const [rowNumber, row] of rows.slice(1).entries()) {
    const quantity = quantityIndex >= 0 ? safeWhole(row[quantityIndex], `Count on row ${rowNumber + 2}`) : 1;
    if (overdueDaysIndex >= 0) {
      const days = Number(row[overdueDaysIndex]);
      if (!Number.isFinite(days)) throw new Error(`days_overdue on row ${rowNumber + 2} is not a number.`);
      if (days > 0) overdue += quantity;
      else if (days === 0) dueToday += quantity;
      else future += quantity;
    } else {
      const parts = row[dueIndex]?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (!parts) throw new Error(`Due date on row ${rowNumber + 2} must use YYYY-MM-DD.`);
      const year = Number(parts[1]);
      const month = Number(parts[2]);
      const day = Number(parts[3]);
      const dueDate = new Date(year, month - 1, day);
      if (
        !Number.isFinite(dueDate.getTime())
        || dueDate.getFullYear() !== year
        || dueDate.getMonth() !== month - 1
        || dueDate.getDate() !== day
      ) {
        throw new Error(`Due date on row ${rowNumber + 2} must be a real calendar date in YYYY-MM-DD format.`);
      }
      const dueKey = dueDate.getTime();
      if (dueKey < todayKey) overdue += quantity;
      else if (dueKey === todayKey) dueToday += quantity;
      else future += quantity;
    }
  }

  return {
    overdue,
    dueToday,
    dailyDue: future > 0 ? Math.ceil(future / 28) : undefined,
    rowCount: rows.length - 1,
    source: "card rows"
  };
}

export const SUMMARY_TEMPLATE = "overdue,due_today,daily_due\n320,48,36\n";
