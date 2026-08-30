import type { ForecastDay, ForecastInput, PolicyForecast, PolicyId } from "./types";

export const POLICY_META: Record<PolicyId, { name: string; shortDescription: string }> = {
  steady: {
    name: "Steady",
    shortDescription: "A consistent overdue allowance, aiming to halve the queue in one week and clear it in two."
  },
  deadline: {
    name: "Deadline",
    shortDescription: "Uses the spare capacity needed for your chosen finish date, or all available space if that date is out of reach."
  },
  gentle: {
    name: "Gentle",
    shortDescription: "Starts at half the steady allowance, then steps up over five sessions to protect your return rhythm."
  }
};

export function validateInput(input: ForecastInput): string[] {
  const errors: string[] = [];
  const counts: Array<[keyof ForecastInput, string, number]> = [
    ["overdue", "Overdue cards", 100_000],
    ["dueToday", "Due today", 100_000],
    ["dailyDue", "Usual daily due", 100_000],
    ["newCards", "New cards per day", 10_000]
  ];
  for (const [key, label, maximum] of counts) {
    if (!Number.isInteger(input[key]) || input[key] < 0 || input[key] > maximum) {
      errors.push(`${label} must be a whole number between 0 and ${maximum.toLocaleString("en-US")}.`);
    }
  }
  if (!Number.isFinite(input.secondsPerCard) || input.secondsPerCard < 3 || input.secondsPerCard > 300) {
    errors.push("Seconds per card must be between 3 and 300.");
  }
  if (!Number.isFinite(input.capMinutes) || input.capMinutes < 5 || input.capMinutes > 480) {
    errors.push("Session cap must be between 5 and 480 minutes.");
  }
  if (!Number.isInteger(input.deadlineDays) || input.deadlineDays < 2 || input.deadlineDays > 90) {
    errors.push("Deadline must be between 2 and 90 days.");
  }
  if (!Number.isInteger(input.studyDays) || input.studyDays < 1 || input.studyDays > 7) {
    errors.push("Study days must be between 1 and 7 per week.");
  }
  return errors;
}

function sessionsWithin(days: number, studyDays: number): number {
  let sessions = 0;
  for (let index = 0; index < days; index += 1) {
    if (index % 7 < studyDays) sessions += 1;
  }
  return Math.max(1, sessions);
}

function sessionsBetween(startDay: number, endDay: number, studyDays: number): number {
  let sessions = 0;
  for (let index = startDay; index < endDay; index += 1) {
    if (index % 7 < studyDays) sessions += 1;
  }
  return Math.max(1, sessions);
}

function lastStudyDay(days: ForecastDay[]): ForecastDay | undefined {
  for (let index = days.length - 1; index >= 0; index -= 1) {
    if (days[index].studyDay) return days[index];
  }
  return undefined;
}

function overdueTarget(
  policy: PolicyId,
  input: ForecastInput,
  remaining: number,
  dayIndex: number,
  studySessionIndex: number,
  steadyAllowance: number
): number {
  if (policy === "steady") return Math.min(remaining, steadyAllowance);
  if (policy === "gentle") {
    const ramp = studySessionIndex <= 2 ? 0.5 : studySessionIndex <= 5 ? 0.75 : 1;
    return Math.min(remaining, Math.max(1, Math.ceil(steadyAllowance * ramp)));
  }
  const sessionsLeft = sessionsBetween(dayIndex, input.deadlineDays, input.studyDays);
  return Math.min(remaining, Math.ceil(remaining / sessionsLeft));
}

export function simulatePolicy(input: ForecastInput, policy: PolicyId, start = new Date()): PolicyForecast {
  const errors = validateInput(input);
  if (errors.length > 0) throw new Error(errors.join(" "));

  const capacity = Math.max(1, Math.floor((input.capMinutes * 60) / input.secondsPerCard));
  const steadySessions = sessionsWithin(14, input.studyDays);
  const steadyAllowance = input.overdue === 0 ? 0 : Math.max(1, Math.ceil(input.overdue / steadySessions));
  const typicalSpare = Math.max(0, capacity - input.dailyDue - input.newCards);
  const expectedSessions = typicalSpare > 0 ? Math.ceil(input.overdue / typicalSpare) : 730;
  const expectedCalendarDays = Math.ceil((expectedSessions / input.studyDays) * 7) + 14;
  const horizon = Math.max(42, input.deadlineDays + 14, Math.min(730, expectedCalendarDays));
  let overdueRemaining = input.overdue;
  let regularPending = 0;
  let sessionIndex = 0;
  let finishDay: number | null = input.overdue === 0 ? 0 : null;
  let halfwayDay: number | null = input.overdue === 0 ? 0 : null;
  const days: ForecastDay[] = [];

  for (let index = 0; index < horizon; index += 1) {
    const date = new Date(start);
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + index);
    const studyDay = index % 7 < input.studyDays;
    const regularAdded = (index === 0 ? input.dueToday : input.dailyDue) + input.newCards;
    regularPending += regularAdded;
    let regularReviewed = 0;
    let overdueReviewed = 0;

    if (studyDay) {
      sessionIndex += 1;
      regularReviewed = Math.min(regularPending, capacity);
      regularPending -= regularReviewed;
      const spare = capacity - regularReviewed;
      const target = overdueTarget(policy, input, overdueRemaining, index, sessionIndex, steadyAllowance);
      overdueReviewed = Math.min(overdueRemaining, spare, target);
      overdueRemaining -= overdueReviewed;
    }

    const totalReviewed = regularReviewed + overdueReviewed;
    days.push({
      index: index + 1,
      date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
      studyDay,
      regularAdded,
      regularReviewed,
      overdueReviewed,
      totalReviewed,
      minutes: Math.round(((totalReviewed * input.secondsPerCard) / 60) * 10) / 10,
      overdueRemaining,
      regularRollover: regularPending
    });
    if (halfwayDay === null && overdueRemaining <= input.overdue / 2) halfwayDay = index + 1;
    if (finishDay === null && overdueRemaining === 0) finishDay = index + 1;
  }

  const goalDays = policy === "deadline" ? input.deadlineDays : policy === "steady" ? 14 : 21;
  const goalDay = days[Math.min(goalDays, days.length) - 1];
  const goalStudyDay = lastStudyDay(days.slice(0, goalDays)) ?? goalDay;
  const finalStudyDay = lastStudyDay(days) ?? days.at(-1);
  const peakCards = Math.max(0, ...days.map((day) => day.totalReviewed));
  const peakMinutes = Math.max(0, ...days.map((day) => day.minutes));

  return {
    id: policy,
    ...POLICY_META[policy],
    goalDays,
    days,
    finishDay,
    halfwayDay,
    totalPlanned: days.reduce((sum, day) => sum + day.totalReviewed, 0),
    peakCards,
    peakMinutes,
    finalRollover: finalStudyDay?.regularRollover ?? 0,
    onTarget: goalDay.overdueRemaining === 0 && goalStudyDay.regularRollover === 0
  };
}

export function simulateAll(input: ForecastInput, start = new Date()): PolicyForecast[] {
  return (["steady", "deadline", "gentle"] as PolicyId[]).map((policy) => simulatePolicy(input, policy, start));
}
