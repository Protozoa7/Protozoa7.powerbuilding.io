const PROGRAM = {
  day1: {
    name: "Day 1 — Squat Strength + Legs",
    focus: "Heavy squat strength, quads, hamstrings, and controlled posterior-chain volume.",
    exercises: [
      { slot: "Squat Strength", primary: "Back Squat", subA: "Pendulum Squat", subB: "Hack Squat / Belt Squat", rx: "Top 4–6 + 3×5", type: "mainSquat", increment: 5, sets: ["TOP", "BO1", "BO2", "BO3"], low: 4, high: 6 },
      { slot: "Hip Hinge", primary: "Romanian Deadlift", subA: "DB Romanian Deadlift", subB: "45° Back Extension", rx: "3×6–8", type: "accessory", increment: 5, sets: ["1","2","3"], low: 6, high: 8 },
      { slot: "Quad Volume", primary: "Pendulum Squat", subA: "Hack Squat", subB: "Leg Press", rx: "3×8–12", type: "accessory", increment: 10, sets: ["1","2","3"], low: 8, high: 12 },
      { slot: "Hamstrings", primary: "Seated Leg Curl", subA: "Lying Leg Curl", subB: "Standing Single-Leg Curl", rx: "3×10–15", type: "accessory", increment: 5, sets: ["1","2","3"], low: 10, high: 15 }
    ]
  },
  day2: {
    name: "Day 2 — Chest + Back + Triceps",
    focus: "Shoulder-friendly pressing, back thickness/width, and triceps volume.",
    exercises: [
      { slot: "Chest Press", primary: "Converging / Plate-Loaded Chest Press", subA: "Neutral-Grip DB Press", subB: "Standing Cable Chest Press", rx: "4×6–10", type: "accessory", increment: 5, sets: ["1","2","3","4"], low: 6, high: 10 },
      { slot: "Heavy Row", primary: "Chest-Supported Row", subA: "Seated Cable Row", subB: "1-Arm Cable Row", rx: "4×6–10", type: "accessory", increment: 5, sets: ["1","2","3","4"], low: 6, high: 10 },
      { slot: "Vertical Pull", primary: "Neutral-Grip Lat Pulldown", subA: "Single-Arm Lat Pulldown", subB: "Assisted Neutral-Grip Pull-Up", rx: "3×8–12", type: "accessory", increment: 5, sets: ["1","2","3"], low: 8, high: 12 },
      { slot: "Triceps", primary: "Rope Pressdown", subA: "Single-Arm Cable Pressdown", subB: "Cross-Body Cable Extension", rx: "3×10–15", type: "accessory", increment: 5, sets: ["1","2","3"], low: 10, high: 15 }
    ]
  },
  day3: {
    name: "Day 3 — Deadlift Strength + Back + Biceps",
    focus: "Heavy deadlift strength with back thickness, lat width, and biceps/brachialis work.",
    exercises: [
      { slot: "Deadlift Strength", primary: "Conventional Deadlift", subA: "Block Pull", subB: "45° Back Extension / Hip Extension", rx: "Top 3–5 + 3×4", type: "mainDeadlift", increment: 5, sets: ["TOP", "BO1", "BO2", "BO3"], low: 3, high: 5 },
      { slot: "Heavy Row", primary: "T-Bar Row", subA: "Plate-Loaded Machine Row", subB: "Seated Cable Row", rx: "4×6–10", type: "accessory", increment: 5, sets: ["1","2","3","4"], low: 6, high: 10 },
      { slot: "Lat Width", primary: "Single-Arm Lat Pulldown", subA: "Neutral-Grip Pulldown", subB: "Straight-Arm Cable Pulldown", rx: "3×8–12", type: "accessory", increment: 5, sets: ["1","2","3"], low: 8, high: 12 },
      { slot: "Biceps / Brachialis", primary: "DB Hammer Curl", subA: "Rope Hammer Curl", subB: "Incline DB Curl", rx: "3×8–12", type: "accessory", increment: 5, sets: ["1","2","3"], low: 8, high: 12 }
    ]
  },
  day4: {
    name: "Day 4 — Legs + Delts + Arms",
    focus: "Lower-fatigue hypertrophy day for quads, side delts, biceps, and triceps.",
    exercises: [
      { slot: "Quad Volume", primary: "Leg Press", subA: "Pendulum Squat", subB: "Hack Squat", rx: "3×10–15", type: "accessory", increment: 10, sets: ["1","2","3"], low: 10, high: 15 },
      { slot: "Side Delts", primary: "Cable Lateral Raise", subA: "DB Lateral Raise", subB: "Lateral Raise Machine", rx: "4×12–20", type: "accessory", increment: 5, sets: ["1","2","3","4"], low: 12, high: 20 },
      { slot: "Biceps", primary: "Preacher Curl", subA: "EZ-Bar Curl", subB: "Cable Curl", rx: "3×8–12", type: "accessory", increment: 5, sets: ["1","2","3"], low: 8, high: 12 },
      { slot: "Triceps", primary: "Overhead Cable Extension", subA: "Rope Pressdown", subB: "Single-Arm Cross-Body Extension", rx: "3×10–15", type: "accessory", increment: 5, sets: ["1","2","3"], low: 10, high: 15 }
    ]
  }
};

const STORAGE_KEY = "evanPowerbuildingHistoryV1";
const STATE_KEY = "evanPowerbuildingStateV1";

const daySelect = document.getElementById("daySelect");
const recoverySelect = document.getElementById("recoverySelect");
const workoutGrid = document.getElementById("workoutGrid");
const dayHeader = document.getElementById("dayHeader");
const sessionDate = document.getElementById("sessionDate");
const bodyweight = document.getElementById("bodyweight");
const sessionNotes = document.getElementById("sessionNotes");
const saveStatus = document.getElementById("saveStatus");
const autosaveStatus = document.getElementById("autosaveStatus");
const historyList = document.getElementById("historyList");
const installBtn = document.getElementById("installBtn");

let currentDay = "day1";
let deferredPrompt;
let autosaveTimer;
let lastAutosaveAt = null;

function todayISO() {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0,10);
}

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function saveHistory(history) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function loadState() {
  try { return JSON.parse(localStorage.getItem(STATE_KEY)) || {}; }
  catch { return {}; }
}

function saveState(state, { quiet = false } = {}) {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
  lastAutosaveAt = new Date();
  if (!quiet) updateAutosaveStatus();
}

function ensureDayState(state, dayKey) {
  if (!state[dayKey] || typeof state[dayKey] !== "object") {
    state[dayKey] = {};
  }
  const dayState = state[dayKey];
  if (!Array.isArray(dayState.selections)) dayState.selections = [];
  if (!Array.isArray(dayState.inputs)) dayState.inputs = [];
  if (!dayState.recovery) dayState.recovery = "primary";
  if (!dayState.sessionDate) dayState.sessionDate = todayISO();
  if (dayState.bodyweight === undefined || dayState.bodyweight === null) dayState.bodyweight = "";
  if (dayState.notes === undefined || dayState.notes === null) dayState.notes = "";
  return dayState;
}

function populateDays() {
  Object.entries(PROGRAM).forEach(([key, day]) => {
    const o = document.createElement("option");
    o.value = key;
    o.textContent = day.name;
    daySelect.appendChild(o);
  });
}

function getDayState(dayKey = currentDay) {
  const state = loadState();
  const dayState = ensureDayState(state, dayKey);
  if (!state._meta || typeof state._meta !== "object") state._meta = {};
  return { state, dayState };
}

function persistCurrentSession({ quiet = false } = {}) {
  const { state, dayState } = getDayState();
  dayState.recovery = recoverySelect.value || "primary";
  dayState.sessionDate = sessionDate.value || todayISO();
  dayState.bodyweight = bodyweight.value;
  dayState.notes = sessionNotes.value;
  state[currentDay] = dayState;
  state._meta.currentDay = currentDay;
  state._meta.lastAutosaveAt = new Date().toISOString();
  saveState(state, { quiet });
}

function queueAutosave() {
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(() => persistCurrentSession(), 150);
}

function flushAutosave() {
  clearTimeout(autosaveTimer);
  persistCurrentSession({ quiet: true });
  updateAutosaveStatus();
}

function restoreSessionFields() {
  const { state, dayState } = getDayState();
  recoverySelect.value = dayState.recovery || "primary";
  sessionDate.value = dayState.sessionDate || todayISO();
  bodyweight.value = dayState.bodyweight || "";
  sessionNotes.value = dayState.notes || "";
  state._meta.currentDay = currentDay;
  saveState(state, { quiet: true });
  updateAutosaveStatus();
}

function formatAutosaveTime(date) {
  if (!date) return "";
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function updateAutosaveStatus() {
  if (!autosaveStatus) return;
  const online = navigator.onLine;
  const timeText = lastAutosaveAt ? ` · last saved ${formatAutosaveTime(lastAutosaveAt)}` : "";
  if (online) {
    autosaveStatus.textContent = `Autosaving on this device${timeText} · offline-ready after first load.`;
    autosaveStatus.classList.remove("offline");
  } else {
    autosaveStatus.textContent = `Offline — current session is still autosaving on this device${timeText}.`;
    autosaveStatus.classList.add("offline");
  }
}

function renderDay() {
  const day = PROGRAM[currentDay];
  const { dayState } = getDayState();
  dayHeader.innerHTML = `<h2>${day.name}</h2><p>${day.focus}</p>`;
  workoutGrid.innerHTML = "";

  day.exercises.forEach((ex, idx) => {
    const card = document.createElement("article");
    card.className = "card exercise-card";
    const selected = dayState.selections?.[idx] || ex.primary;

    card.innerHTML = `
      <div class="exercise-top">
        <div>
          <div class="exercise-slot">Slot ${idx+1} — ${ex.slot}</div>
          <div class="exercise-name" id="ex-name-${idx}">${escapeHtml(selected)}</div>
        </div>
        <div class="rx">${ex.rx}</div>
      </div>
      <select class="exercise-select" data-idx="${idx}">
        <option value="${escapeHtml(ex.primary)}">Primary — ${escapeHtml(ex.primary)}</option>
        <option value="${escapeHtml(ex.subA)}">Sub A — ${escapeHtml(ex.subA)}</option>
        <option value="${escapeHtml(ex.subB)}">Sub B — ${escapeHtml(ex.subB)}</option>
      </select>
      <div class="set-table" id="sets-${idx}">
        <div class="head">Set</div><div class="head">Weight</div><div class="head">Reps</div>
      </div>
      <div class="recommendation" id="rec-${idx}"></div>
    `;
    workoutGrid.appendChild(card);

    const select = card.querySelector("select");
    select.value = selected;
    select.addEventListener("change", () => {
      document.getElementById(`ex-name-${idx}`).textContent = select.value;
      const { state, dayState } = getDayState();
      dayState.selections[idx] = select.value;
      state[currentDay] = dayState;
      state._meta.currentDay = currentDay;
      saveState(state);
      updateRecommendation(idx);
    });

    const sets = card.querySelector(`#sets-${idx}`);
    ex.sets.forEach((label, setIdx) => {
      const labelEl = document.createElement("div");
      labelEl.className = "set-label";
      labelEl.textContent = label;

      const w = document.createElement("input");
      w.type = "number";
      w.inputMode = "decimal";
      w.placeholder = "lb";
      w.dataset.kind = "weight";
      w.dataset.idx = idx;
      w.dataset.set = setIdx;

      const r = document.createElement("input");
      r.type = "number";
      r.inputMode = "numeric";
      r.placeholder = "reps";
      r.dataset.kind = "reps";
      r.dataset.idx = idx;
      r.dataset.set = setIdx;

      const stored = dayState.inputs?.[idx]?.[setIdx] || {};
      if (stored.weight !== undefined && stored.weight !== "") w.value = stored.weight;
      if (stored.reps !== undefined && stored.reps !== "") r.value = stored.reps;

      [w, r].forEach(inp => inp.addEventListener("input", handleInput));
      sets.append(labelEl, w, r);
    });
    updateRecommendation(idx);
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
}

function handleInput(e) {
  const idx = Number(e.target.dataset.idx);
  const setIdx = Number(e.target.dataset.set);
  const kind = e.target.dataset.kind;
  const { state, dayState } = getDayState();
  dayState.inputs[idx] ||= [];
  dayState.inputs[idx][setIdx] ||= {};
  dayState.inputs[idx][setIdx][kind] = e.target.value;
  state[currentDay] = dayState;
  state._meta.currentDay = currentDay;
  state._meta.lastAutosaveAt = new Date().toISOString();
  saveState(state);
  updateRecommendation(idx);
}

function updateRecommendation(idx) {
  const ex = PROGRAM[currentDay].exercises[idx];
  const { dayState } = getDayState();
  const data = dayState.inputs?.[idx] || [];
  const rec = document.getElementById(`rec-${idx}`);
  if (!rec) return;

  if (ex.type === "mainSquat" || ex.type === "mainDeadlift") {
    const top = data[0] || {};
    const w = Number(top.weight);
    const reps = Number(top.reps);
    if (!w || !reps) {
      rec.textContent = "Enter the top set to calculate next-session guidance.";
      return;
    }
    if (reps >= ex.high) rec.textContent = `Next top set: ~${w + ex.increment} lb`;
    else if (reps >= ex.low) rec.textContent = `Next top set: repeat ${w} lb`;
    else rec.textContent = `Next top set: consider ~${Math.max(0, w - ex.increment)} lb`;
    return;
  }

  const completed = data.filter(s => Number(s.weight) > 0 && Number(s.reps) > 0);
  if (completed.length < ex.sets.length) {
    rec.textContent = "Complete all working sets for progression guidance.";
    return;
  }
  const sameWeight = completed.every(s => Number(s.weight) === Number(completed[0].weight));
  const allTop = completed.every(s => Number(s.reps) >= ex.high);
  const anyBelow = completed.some(s => Number(s.reps) < ex.low);
  const base = Number(completed[completed.length - 1].weight);
  if (allTop && sameWeight) rec.textContent = `Next time: increase to about ${base + ex.increment} lb.`;
  else if (anyBelow) rec.textContent = "Next time: repeat or reduce slightly until the rep floor is solid.";
  else rec.textContent = `Next time: repeat ${base || "current load"} and build reps toward ${ex.high}.`;
}

function applyRecovery(level) {
  const day = PROGRAM[currentDay];
  const { state, dayState } = getDayState();
  dayState.recovery = level;
  dayState.selections = day.exercises.map(ex => ex[level]);
  state[currentDay] = dayState;
  state._meta.currentDay = currentDay;
  saveState(state);
  renderDay();
}

function clearInputs() {
  const { state, dayState } = getDayState();
  dayState.inputs = [];
  dayState.bodyweight = "";
  dayState.notes = "";
  state[currentDay] = dayState;
  saveState(state);
  bodyweight.value = "";
  sessionNotes.value = "";
  renderDay();
}

function resetDay() {
  const state = loadState();
  state[currentDay] = {
    selections: [],
    inputs: [],
    recovery: "primary",
    sessionDate: todayISO(),
    bodyweight: "",
    notes: ""
  };
  if (!state._meta || typeof state._meta !== "object") state._meta = {};
  state._meta.currentDay = currentDay;
  saveState(state);
  restoreSessionFields();
  renderDay();
}

function buildWorkoutRecord() {
  persistCurrentSession({ quiet: true });
  const day = PROGRAM[currentDay];
  const { dayState } = getDayState();
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    savedAt: new Date().toISOString(),
    date: dayState.sessionDate || sessionDate.value || todayISO(),
    dayKey: currentDay,
    dayName: day.name,
    recovery: dayState.recovery || recoverySelect.value,
    bodyweight: dayState.bodyweight || "",
    notes: (dayState.notes || "").trim(),
    exercises: day.exercises.map((ex, idx) => ({
      slot: ex.slot,
      exercise: dayState.selections?.[idx] || ex.primary,
      rx: ex.rx,
      sets: (dayState.inputs?.[idx] || []).map((s, setIdx) => ({
        label: ex.sets[setIdx],
        weight: s?.weight || "",
        reps: s?.reps || ""
      }))
    }))
  };
}

function saveWorkout() {
  const record = buildWorkoutRecord();
  const history = loadHistory();
  history.unshift(record);
  saveHistory(history);
  saveStatus.textContent = "Workout saved to history. Current session remains autosaved too.";
  renderHistory();
  setTimeout(() => saveStatus.textContent = "", 3000);
}

function renderHistory() {
  const history = loadHistory();
  if (!history.length) {
    historyList.innerHTML = '<div class="empty">No saved workouts yet.</div>';
    return;
  }
  historyList.innerHTML = history.slice(0, 30).map(item => {
    const detail = item.exercises.map(ex => {
      const sets = ex.sets.filter(s => s.weight || s.reps).map(s => `${s.label}: ${s.weight || "—"} × ${s.reps || "—"}`).join(" | ");
      return `${ex.exercise}${sets ? ` — ${sets}` : ""}`;
    }).join("\n");
    return `<article class="history-item">
      <div class="history-title"><span>${escapeHtml(item.dayName)}</span><span>${escapeHtml(item.date)}</span></div>
      <div class="history-meta">Bodyweight: ${escapeHtml(item.bodyweight || "—")} lb · Recovery: ${escapeHtml(item.recovery || "—")}</div>
      <div class="history-details">${escapeHtml(detail)}${item.notes ? `\nNotes: ${escapeHtml(item.notes)}` : ""}</div>
    </article>`;
  }).join("");
}

function exportHistory() {
  flushAutosave();
  const payload = {
    exportedAt: new Date().toISOString(),
    programVersion: 2,
    history: loadHistory(),
    state: loadState()
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `evan-powerbuilding-backup-${todayISO()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

async function importHistory(file) {
  try {
    const text = await file.text();
    const payload = JSON.parse(text);
    if (Array.isArray(payload.history)) saveHistory(payload.history);
    if (payload.state && typeof payload.state === "object") saveState(payload.state, { quiet: true });

    const state = loadState();
    const restoredDay = state?._meta?.currentDay;
    if (restoredDay && PROGRAM[restoredDay]) currentDay = restoredDay;
    daySelect.value = currentDay;
    restoreSessionFields();
    renderHistory();
    renderDay();
    saveStatus.textContent = "Backup imported.";
    setTimeout(() => saveStatus.textContent = "", 2500);
  } catch {
    saveStatus.textContent = "Could not import that backup file.";
  }
}

function clearHistory() {
  if (confirm("Delete all saved workout history from this browser? Current in-progress session will remain.")) {
    localStorage.removeItem(STORAGE_KEY);
    renderHistory();
  }
}

async function requestPersistentStorage() {
  if (!navigator.storage?.persist) return;
  try {
    await navigator.storage.persist();
  } catch {
    // Browser may reject or not support persistent storage. Local autosave still works.
  }
}

function restoreAppState() {
  const state = loadState();
  const savedDay = state?._meta?.currentDay;
  if (savedDay && PROGRAM[savedDay]) currentDay = savedDay;

  if (state?._meta?.lastAutosaveAt) {
    const d = new Date(state._meta.lastAutosaveAt);
    if (!Number.isNaN(d.getTime())) lastAutosaveAt = d;
  }
}

restoreAppState();
populateDays();
daySelect.value = currentDay;
restoreSessionFields();
renderDay();
renderHistory();
requestPersistentStorage();

daySelect.addEventListener("change", () => {
  flushAutosave();
  currentDay = daySelect.value;
  const { state } = getDayState();
  state._meta.currentDay = currentDay;
  saveState(state, { quiet: true });
  restoreSessionFields();
  renderDay();
});

document.getElementById("applyRecoveryBtn").addEventListener("click", () => applyRecovery(recoverySelect.value));
document.getElementById("resetDayBtn").addEventListener("click", resetDay);
document.getElementById("clearInputsBtn").addEventListener("click", clearInputs);
document.getElementById("saveWorkoutBtn").addEventListener("click", saveWorkout);
document.getElementById("exportBtn").addEventListener("click", exportHistory);
document.getElementById("importInput").addEventListener("change", e => { if (e.target.files[0]) importHistory(e.target.files[0]); });
document.getElementById("clearHistoryBtn").addEventListener("click", clearHistory);

recoverySelect.addEventListener("change", queueAutosave);
sessionDate.addEventListener("input", queueAutosave);
bodyweight.addEventListener("input", queueAutosave);
sessionNotes.addEventListener("input", queueAutosave);

window.addEventListener("online", updateAutosaveStatus);
window.addEventListener("offline", updateAutosaveStatus);
window.addEventListener("pagehide", flushAutosave);
window.addEventListener("beforeunload", flushAutosave);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") flushAutosave();
});

window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.hidden = false;
});

installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.hidden = true;
});

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
