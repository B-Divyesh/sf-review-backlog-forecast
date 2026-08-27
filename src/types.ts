export type PolicyId = "steady" | "deadline" | "gentle";

export interface ForecastInput {
  overdue: number;
  dueToday: number;
  dailyDue: number;
  newCards: number;
  secondsPerCard: number;
  capMinutes: number;
  deadlineDays: number;
  studyDays: number;
}

export interface ForecastDay {
  index: number;
  date: string;
  studyDay: boolean;
  regularAdded: number;
  regularReviewed: number;
  overdueReviewed: number;
  totalReviewed: number;
  minutes: number;
  overdueRemaining: number;
  regularRollover: number;
}

export interface PolicyForecast {
  id: PolicyId;
  name: string;
  shortDescription: string;
  goalDays: number;
  days: ForecastDay[];
  finishDay: number | null;
  halfwayDay: number | null;
  totalPlanned: number;
  peakCards: number;
  peakMinutes: number;
  finalRollover: number;
  onTarget: boolean;
}

export interface SavedPlan {
  id: string;
  savedAt: string;
  input: ForecastInput;
  policy: PolicyId;
}

export interface ImportSummary {
  overdue: number;
  dueToday: number;
  dailyDue?: number;
  rowCount: number;
  source: "summary" | "card rows";
}
