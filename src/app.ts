import "./style.css";
import "./route-focus";
import { parseCardCsv, SUMMARY_TEMPLATE } from "./csv";
import { POLICY_META, simulateAll, validateInput } from "./forecast";
import { storage } from "./storage";
import type { ForecastInput, PolicyForecast, PolicyId, SavedPlan } from "./types";

const $ = <T extends HTMLElement>(selector: string): T => {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing element: ${selector}`);
  return element;
};

const form = $<HTMLFormElement>("#forecast-form");
const results = $("#results");
const emptyState = $("#empty-state");
const errorSummary = $("#error-summary");
const importMessage = $("#import-message");
const queueFile = $<HTMLInputElement>("#queue-file");
const savedStrip = $("#saved-strip");
const toast = $("#toast");
const toastMessage = $("#toast-message");
const toastAction = $<HTMLButtonElement>("#toast-action");
const main = $("#main");
const savePlanButton = $<HTMLButtonElement>("#save-plan");
const exportPlanButton = $<HTMLButtonElement>("#export-plan");
const forecastStatus = $("#forecast-status");
const isDemo = new URLSearchParams(window.location.search).get("demo") === "1";

const sampleInput: ForecastInput = {
  overdue: 320,
  dueToday: 48,
  dailyDue: 36,
  newCards: 0,
  secondsPerCard: 12,
  capMinutes: 30,
  deadlineDays: 14,
  studyDays: 6
};

let forecasts: PolicyForecast[] = [];
let currentInput: ForecastInput | null = null;
let selectedPolicy: PolicyId = "steady";
let savedPlan: SavedPlan | undefined;
let toastTimer = 0;
let forecastStale = false;
let inputSaveTimer = 0;

document.querySelector<HTMLAnchorElement>(".skip-link")?.addEventListener("click", (event) => {
  event.preventDefault();
  window.location.hash = main.id;
  main.focus({ preventScroll: true });
  main.scrollIntoView({ block: "start" });
});

function announce(message: string, action?: { label: string; run: () => void }): void {
  window.clearTimeout(toastTimer);
  toastMessage.textContent = message;
  toast.hidden = false;
  if (action) {
    toastAction.textContent = action.label;
    toastAction.hidden = false;
    toastAction.onclick = action.run;
  } else {
    toastAction.hidden = true;
    toastAction.onclick = null;
  }
  toastTimer = window.setTimeout(() => { toast.hidden = true; }, action ? 7000 : 4000);
}

function download(name: string, contents: string, type: string): void {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function replaceHeadingTag(selector: string, tagName: "h1" | "h2" | "p"): HTMLElement {
  const original = $(selector);
  if (original.tagName.toLowerCase() === tagName) return original;
  const replacement = document.createElement(tagName);
  for (const attribute of original.attributes) replacement.setAttribute(attribute.name, attribute.value);
  replacement.innerHTML = original.innerHTML;
  original.replaceWith(replacement);
  return replacement;
}

function setDemoHeading(): void {
  // Demo mode starts at the populated result, so its h1 must describe that
  // destination rather than the hidden landing hero.
  replaceHeadingTag("#page-title", "p");
  replaceHeadingTag("#results-title", "h1");
}

function readInput(): ForecastInput {
  const data = new FormData(form);
  const numeric = (name: string) => {
    const raw = data.get(name);
    return raw === null || raw === "" ? Number.NaN : Number(raw);
  };
  return {
    overdue: numeric("overdue"),
    dueToday: numeric("dueToday"),
    dailyDue: numeric("dailyDue"),
    newCards: numeric("newCards"),
    secondsPerCard: numeric("secondsPerCard"),
    capMinutes: numeric("capMinutes"),
    deadlineDays: numeric("deadlineDays"),
    studyDays: numeric("studyDays")
  };
}

function populateForm(input: ForecastInput): void {
  for (const [name, value] of Object.entries(input)) {
    const field = form.elements.namedItem(name);
    if (field instanceof HTMLInputElement) field.value = String(value);
  }
}

function setForecastActionsEnabled(enabled: boolean): void {
  savePlanButton.disabled = !enabled;
  exportPlanButton.disabled = !enabled;
}

function hasCurrentForecast(): boolean {
  return Boolean(currentInput && forecasts.length > 0 && !forecastStale);
}

function markForecastStale(): void {
  if (!currentInput || results.hidden || forecastStale) return;
  forecastStale = true;
  results.classList.add("is-stale");
  forecastStatus.hidden = false;
  forecastStatus.textContent = "This forecast is out of date. Run forecast before saving or exporting a schedule.";
  setForecastActionsEnabled(false);
}

function showErrors(errors: string[]): void {
  errorSummary.innerHTML = `<p><b>Check ${errors.length === 1 ? "this value" : "these values"}:</b></p><ul>${errors.map((error) => `<li>${error}</li>`).join("")}</ul>`;
  errorSummary.hidden = false;
  errorSummary.focus();
}

function formatDay(day: PolicyForecast["days"][number]): string {
  const parsed = new Date(`${day.date}T12:00:00`);
  return new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" }).format(parsed);
}

function finishLabel(forecast: PolicyForecast): string {
  if (currentInput?.overdue === 0) return "No overdue queue";
  return forecast.finishDay ? `Day ${forecast.finishDay}` : `After day ${forecast.days.length}`;
}

function renderPolicies(): void {
  const restorePolicyFocus = document.activeElement instanceof HTMLInputElement
    && document.activeElement.name === "policy";
  $("#policy-grid").innerHTML = forecasts.map((forecast) => {
    const status = forecast.onTarget ? "On target" : "Needs more time";
    const half = forecast.halfwayDay ? `Half by day ${forecast.halfwayDay}` : "Under half not reached";
    return `<label class="policy-card ${forecast.id === selectedPolicy ? "is-selected" : ""}">
      <input type="radio" name="policy" value="${forecast.id}" ${forecast.id === selectedPolicy ? "checked" : ""}>
      <span class="policy-top"><b>${forecast.name}</b><span class="status ${forecast.onTarget ? "success" : "warning"}">${status}</span></span>
      <span class="policy-description">${forecast.shortDescription}</span>
      <span class="policy-metrics"><span><small>Overdue queue clears</small><b>${finishLabel(forecast)}</b></span><span><small>Halfway</small><b>${half.replace("Half by ", "")}</b></span></span>
      <span class="select-label">${forecast.id === selectedPolicy ? "Selected" : "Select plan"}<i aria-hidden="true"></i></span>
    </label>`;
  }).join("");

  document.querySelectorAll<HTMLInputElement>('input[name="policy"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      selectedPolicy = radio.value as PolicyId;
      renderPolicies();
      renderDetail();
    });
  });
  if (restorePolicyFocus) {
    document.querySelector<HTMLInputElement>(`input[name="policy"][value="${selectedPolicy}"]`)?.focus({ preventScroll: true });
  }
}

function renderDetail(): void {
  const forecast = forecasts.find((item) => item.id === selectedPolicy);
  if (!forecast || !currentInput) return;
  $("#detail-title").textContent = `${forecast.name} plan`;
  $("#detail-description").textContent = forecast.shortDescription;
  const finish = forecast.finishDay ? `${forecast.finishDay} days` : `more than ${forecast.days.length} days`;
  $("#readout-grid").innerHTML = `
    <div><span>Original queue clear</span><strong>${currentInput.overdue === 0 ? "Already clear" : finish}</strong></div>
    <div><span>50% reduction</span><strong>${forecast.halfwayDay ? `Day ${forecast.halfwayDay}` : "Not reached"}</strong></div>
    <div><span>Largest session</span><strong>${forecast.peakCards} <small>cards</small></strong></div>
    <div><span>Peak time</span><strong>${forecast.peakMinutes} <small>min</small></strong></div>`;

  const warning = $("#plan-warning");
  if (forecast.finalRollover > 0) {
    warning.innerHTML = `<b>Regular reviews are still rolling over.</b> At this pace, ${forecast.finalRollover} regular reviews remain after the forecast window. Raise the cap, reduce new cards, or lower the regular reviews estimate before choosing this plan.`;
    warning.hidden = false;
  } else if (!forecast.onTarget) {
    warning.innerHTML = `<b>This recovery plan misses its ${forecast.goalDays}-day target.</b> It still respects your cap; the overdue queue is forecast to clear ${forecast.finishDay ? `on day ${forecast.finishDay}` : "after the visible window"}.`;
    warning.hidden = false;
  } else warning.hidden = true;

  const visibleDays = forecast.days.slice(0, 21);
  const maxCards = Math.max(1, ...visibleDays.map((day) => day.totalReviewed));
  $("#plot").innerHTML = visibleDays.map((day) => {
    const regularHeight = (day.regularReviewed / maxCards) * 100;
    const overdueHeight = (day.overdueReviewed / maxCards) * 100;
    const label = day.studyDay
      ? `${formatDay(day)}: ${day.regularReviewed} regular and ${day.overdueReviewed} overdue cards, ${day.minutes} minutes, ${day.overdueRemaining} overdue left.`
      : `${formatDay(day)}: rest day, ${day.regularRollover} regular cards roll forward.`;
    return `<div class="plot-day ${day.studyDay ? "" : "is-rest"}" role="img" aria-label="${label}">
      <div class="bar"><i class="bar-overdue" style="height:${overdueHeight}%"></i><i class="bar-regular" style="height:${regularHeight}%"></i></div>
      <span>${day.index}</span>
    </div>`;
  }).join("");

  const ledgerEnd = Math.min(forecast.days.length, Math.max(21, Math.min(60, forecast.finishDay ?? 28)));
  $("#ledger-range").textContent = `${ledgerEnd < (forecast.finishDay ?? ledgerEnd) ? `first ${ledgerEnd} days · ` : ""}regular + overdue = session total`;
  $("#schedule-body").innerHTML = forecast.days.slice(0, ledgerEnd).map((day) => `<tr class="${day.studyDay ? "" : "rest-row"}">
    <th scope="row"><span>${formatDay(day)}</span><small>Day ${day.index}${day.studyDay ? "" : " · Rest"}</small></th>
    <td>${day.regularReviewed}${day.regularRollover ? `<small>+${day.regularRollover} waiting</small>` : ""}</td>
    <td>${day.overdueReviewed}</td>
    <td><b>${day.totalReviewed}</b></td>
    <td>${day.minutes}</td>
    <td>${day.overdueRemaining}</td>
  </tr>`).join("");
}

function renderForecast(input: ForecastInput, focusResults = true): void {
  currentInput = input;
  forecasts = simulateAll(input);
  forecastStale = false;
  results.hidden = false;
  results.classList.remove("is-stale");
  emptyState.hidden = true;
  errorSummary.hidden = true;
  forecastStatus.hidden = true;
  forecastStatus.textContent = "";
  setForecastActionsEnabled(true);
  const capacity = Math.floor((input.capMinutes * 60) / input.secondsPerCard);
  $("#capacity-readout").innerHTML = `<b>${capacity} cards</b> fit inside the ${input.capMinutes}-minute cap at ${input.secondsPerCard} seconds each.`;
  renderPolicies();
  renderDetail();
  if (focusResults) {
    results.scrollIntoView({ behavior: "smooth", block: "start" });
    $("#results-title").setAttribute("tabindex", "-1");
    $("#results-title").focus({ preventScroll: true });
  }
}

async function updateSavedStrip(): Promise<void> {
  savedPlan = await storage.getPlan();
  savedStrip.hidden = !savedPlan;
  if (!savedPlan) return;
  const meta = POLICY_META[savedPlan.policy];
  $("#saved-summary").textContent = `${meta.name} · ${savedPlan.input.overdue.toLocaleString()} overdue · ${savedPlan.input.capMinutes}-minute cap · saved ${new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(savedPlan.savedAt))}`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  form.classList.add("was-validated");
  const input = readInput();
  const errors = validateInput(input);
  if (errors.length > 0) {
    markForecastStale();
    return showErrors(errors);
  }
  form.classList.remove("was-validated");
  renderForecast(input);
  storage.saveInput(input).catch(() => announce("The forecast works, but this browser could not save your inputs."));
});

function saveEditedInput(): void {
  window.clearTimeout(inputSaveTimer);
  inputSaveTimer = window.setTimeout(() => {
    const input = readInput();
    if (validateInput(input).length > 0) return;
    storage.saveInput(input).catch(() => announce("The forecast works, but this browser could not save your inputs."));
  }, 200);
}

form.addEventListener("input", () => {
  markForecastStale();
  saveEditedInput();
});
form.addEventListener("change", () => {
  markForecastStale();
  saveEditedInput();
});

$("#load-example").addEventListener("click", () => {
  populateForm(sampleInput);
  markForecastStale();
  importMessage.textContent = "Example loaded: 320 overdue cards with a 30-minute cap.";
  $("#overdue").focus();
});

queueFile.addEventListener("change", async () => {
  const file = queueFile.files?.[0];
  if (!file) return;
  if (file.size > 2_000_000) {
    importMessage.textContent = "That file is over 2 MB. Use a smaller export or enter totals manually.";
    queueFile.value = "";
    return;
  }
  try {
    const contents = await file.text();
    if (file.name.toLowerCase().endsWith(".json")) {
      const backup = JSON.parse(contents) as { input?: ForecastInput; plan?: SavedPlan };
      if (!backup.input || validateInput(backup.input).length > 0) throw new Error("This JSON backup does not contain valid forecast inputs.");
      populateForm(backup.input);
      await storage.saveInput(backup.input);
      if (backup.plan) {
        if (!["steady", "deadline", "gentle"].includes(backup.plan.policy) || validateInput(backup.plan.input).length > 0 || !Number.isFinite(Date.parse(backup.plan.savedAt))) {
          throw new Error("The saved plan in this JSON backup is invalid.");
        }
        await storage.savePlan(backup.plan);
      }
      await updateSavedStrip();
      markForecastStale();
      importMessage.textContent = "Local backup restored. Run the forecast to review it.";
    } else {
      const summary = parseCardCsv(contents);
      ($<HTMLInputElement>("#overdue")).value = String(summary.overdue);
      ($<HTMLInputElement>("#due-today")).value = String(summary.dueToday);
      if (summary.dailyDue !== undefined) ($<HTMLInputElement>("#daily-due")).value = String(summary.dailyDue);
      markForecastStale();
      importMessage.textContent = `Read ${summary.rowCount.toLocaleString()} ${summary.source === "summary" ? "summary row" : "card rows"}: ${summary.overdue.toLocaleString()} overdue and ${summary.dueToday.toLocaleString()} due today.${summary.dailyDue !== undefined ? ` Regular reviews estimate set to ${summary.dailyDue}.` : " Add your regular reviews estimate."}`;
      $("#overdue").focus();
    }
  } catch (error) {
    importMessage.textContent = error instanceof Error ? error.message : "This file could not be read. Check the format and try again.";
  } finally {
    queueFile.value = "";
  }
});

$("#download-template").addEventListener("click", () => download("review-backlog-template.csv", SUMMARY_TEMPLATE, "text/csv"));

savePlanButton.addEventListener("click", async () => {
  if (!hasCurrentForecast() || !currentInput) {
    announce("Run the forecast again before saving this plan.");
    return;
  }
  const previous = savedPlan;
  const plan: SavedPlan = { id: crypto.randomUUID(), savedAt: new Date().toISOString(), input: currentInput, policy: selectedPolicy };
  savePlanButton.disabled = true;
  savePlanButton.setAttribute("aria-busy", "true");
  savePlanButton.textContent = "Saving plan…";
  try {
    await storage.savePlan(plan);
    await updateSavedStrip();
    announce(`${POLICY_META[selectedPolicy].name} plan saved on this device.`, previous ? {
      label: "Undo",
      run: async () => { await storage.savePlan(previous); await updateSavedStrip(); announce("Previous plan restored."); }
    } : {
      label: "Undo",
      run: async () => { await storage.clearPlan(); await updateSavedStrip(); announce("Saved plan removed."); }
    });
  } catch {
    announce("This browser could not save the chosen plan. Try again.");
  } finally {
    savePlanButton.textContent = "Use this plan";
    savePlanButton.removeAttribute("aria-busy");
    setForecastActionsEnabled(hasCurrentForecast());
  }
});

$("#open-saved").addEventListener("click", () => {
  if (!savedPlan) return;
  selectedPolicy = savedPlan.policy;
  populateForm(savedPlan.input);
  renderForecast(savedPlan.input);
});

$("#remove-saved").addEventListener("click", async () => {
  if (!savedPlan || !window.confirm("Remove the saved recovery plan from this device? Your Anki collection is not affected.")) return;
  await storage.clearPlan();
  await updateSavedStrip();
  announce("Saved plan removed.");
});

exportPlanButton.addEventListener("click", () => {
  if (!hasCurrentForecast()) {
    announce("Run the forecast again before exporting a schedule.");
    return;
  }
  const forecast = forecasts.find((item) => item.id === selectedPolicy);
  if (!forecast) return;
  const rows = ["day,date,study_day,regular_reviewed,overdue_reviewed,total,minutes,overdue_remaining,regular_rollover"];
  for (const day of forecast.days.slice(0, Math.max(28, forecast.finishDay ?? 28))) {
    rows.push([day.index, day.date, day.studyDay, day.regularReviewed, day.overdueReviewed, day.totalReviewed, day.minutes, day.overdueRemaining, day.regularRollover].join(","));
  }
  download(`${selectedPolicy}-recovery-plan.csv`, `${rows.join("\n")}\n`, "text/csv");
  announce("Schedule exported. It is a forecast, not an Anki rescheduling file.");
});

$("#export-data").addEventListener("click", async () => {
  const input = currentInput ?? await storage.getInput();
  const plan = await storage.getPlan();
  download("review-backlog-forecast-backup.json", JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), input, plan }, null, 2), "application/json");
});

$("#clear-data").addEventListener("click", async () => {
  if (!window.confirm("Clear all forecast inputs and the saved plan from this device? Export a backup first if you want to keep them.")) return;
  await storage.clearAll();
  savedPlan = undefined;
  savedStrip.hidden = true;
  form.reset();
  currentInput = null;
  forecasts = [];
  forecastStale = false;
  setForecastActionsEnabled(false);
  results.hidden = true;
  emptyState.hidden = false;
  announce("All local forecast data cleared.");
});

const tooltip = $("#tooltip");
document.querySelectorAll<HTMLButtonElement>(".hint").forEach((button) => {
  const show = () => {
    tooltip.textContent = button.dataset.hint ?? "";
    tooltip.hidden = false;
    const rect = button.getBoundingClientRect();
    tooltip.style.left = `${Math.min(window.innerWidth - 280, Math.max(12, rect.left - 100))}px`;
    tooltip.style.top = `${rect.bottom + window.scrollY + 8}px`;
  };
  const hide = () => { tooltip.hidden = true; };
  button.addEventListener("click", () => tooltip.hidden ? show() : hide());
  button.addEventListener("focus", show);
  button.addEventListener("blur", hide);
  button.addEventListener("keydown", (event) => { if (event.key === "Escape") { hide(); button.focus(); } });
});

function updateConnection(): void {
  const status = $("#connection-status");
  status.innerHTML = `<span aria-hidden="true"></span> ${navigator.onLine ? "Ready offline" : "Offline · forecast still works"}`;
  status.classList.toggle("is-offline", !navigator.onLine);
}
window.addEventListener("online", updateConnection);
window.addEventListener("offline", updateConnection);
updateConnection();

async function registerServiceWorker(): Promise<void> {
  if (!("serviceWorker" in navigator)) return;
  const wasControlled = Boolean(navigator.serviceWorker.controller);
  const registration = await navigator.serviceWorker.register("/sw.js");
  const showUpdate = (worker: ServiceWorker) => announce("A new version is ready.", {
    label: "Update app",
    run: () => worker.postMessage({ type: "SKIP_WAITING" })
  });
  if (registration.waiting) showUpdate(registration.waiting);
  registration.addEventListener("updatefound", () => {
    const worker = registration.installing;
    worker?.addEventListener("statechange", () => {
      if (worker.state === "installed" && navigator.serviceWorker.controller) showUpdate(worker);
    });
  });
  if (wasControlled) navigator.serviceWorker.addEventListener("controllerchange", () => window.location.reload(), { once: true });
}

async function init(): Promise<void> {
  try {
    if (isDemo) {
      document.title = "Demo — Review Backlog Forecast";
      $("#demo-banner").hidden = false;
      setDemoHeading();
      const storedInput = await storage.getInput();
      const demoInput = storedInput && validateInput(storedInput).length === 0 ? storedInput : sampleInput;
      populateForm(demoInput);
      renderForecast(demoInput, false);
      const demoHeading = $("#results-title");
      demoHeading.tabIndex = -1;
      demoHeading.focus({ preventScroll: true });
      await updateSavedStrip();
      $("#reset-demo").addEventListener("click", async () => {
        await storage.clearAll();
        savedPlan = undefined;
        savedStrip.hidden = true;
        selectedPolicy = "steady";
        populateForm(sampleInput);
        renderForecast(sampleInput, false);
        announce("Demo reset to the sample overdue queue.");
      });
      $("#start-real").addEventListener("click", async (event) => {
        event.preventDefault();
        await storage.clearAll();
        window.location.assign("/");
      });
      if (window.location.hash === "#how-it-works") {
        requestAnimationFrame(() => $("#how-it-works").scrollIntoView({ block: "start" }));
      }
      registerServiceWorker().catch(() => { /* App remains usable without install support. */ });
      return;
    }
    await updateSavedStrip();
    const input = await storage.getInput();
    if (input && validateInput(input).length === 0) {
      populateForm(input);
      renderForecast(input, false);
    }
  } catch {
    announce("Local saving is unavailable; forecasting still works in this tab.");
  }
  registerServiceWorker().catch(() => { /* App remains usable without install support. */ });
}

void init();
