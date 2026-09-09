const PROGRAM = {
  day1: {
    name: "Day 1 — Squat Strength + Legs",
    shortName: "Squat + Legs",
    focus: "Heavy squat strength, quads, hamstrings, and controlled posterior-chain volume.",
    exercises: [
      { slot: "Squat Strength", primary: "Back Squat", subA: "Pendulum Squat", subB: "Hack Squat / Belt Squat", rx: "Top 4–6 + 3×5", type: "mainSquat", increment: 5, sets: ["TOP","BO1","BO2","BO3"], low: 4, high: 6, rest: 180 },
      { slot: "Hip Hinge", primary: "Romanian Deadlift", subA: "DB Romanian Deadlift", subB: "45° Back Extension", rx: "3×6–8", type: "accessory", increment: 5, sets: ["1","2","3"], low: 6, high: 8, rest: 120 },
      { slot: "Quad Volume", primary: "Pendulum Squat", subA: "Hack Squat", subB: "Leg Press", rx: "3×8–12", type: "accessory", increment: 10, sets: ["1","2","3"], low: 8, high: 12, rest: 120 },
      { slot: "Hamstrings", primary: "Seated Leg Curl", subA: "Lying Leg Curl", subB: "Standing Single-Leg Curl", rx: "3×10–15", type: "accessory", increment: 5, sets: ["1","2","3"], low: 10, high: 15, rest: 90 }
    ]
  },
  day2: {
    name: "Day 2 — Chest + Back + Triceps",
    shortName: "Chest + Back",
    focus: "Shoulder-friendly pressing, back thickness/width, and triceps volume.",
    exercises: [
      { slot: "Chest Press", primary: "Converging / Plate-Loaded Chest Press", subA: "Neutral-Grip DB Press", subB: "Standing Cable Chest Press", rx: "4×6–10", type: "accessory", increment: 5, sets: ["1","2","3","4"], low: 6, high: 10, rest: 120 },
      { slot: "Heavy Row", primary: "Chest-Supported Row", subA: "Seated Cable Row", subB: "1-Arm Cable Row", rx: "4×6–10", type: "accessory", increment: 5, sets: ["1","2","3","4"], low: 6, high: 10, rest: 120 },
      { slot: "Vertical Pull", primary: "Neutral-Grip Lat Pulldown", subA: "Single-Arm Lat Pulldown", subB: "Assisted Neutral-Grip Pull-Up", rx: "3×8–12", type: "accessory", increment: 5, sets: ["1","2","3"], low: 8, high: 12, rest: 90 },
      { slot: "Triceps", primary: "Rope Pressdown", subA: "Single-Arm Cable Pressdown", subB: "Cross-Body Cable Extension", rx: "3×10–15", type: "accessory", increment: 5, sets: ["1","2","3"], low: 10, high: 15, rest: 75 }
    ]
  },
  day3: {
    name: "Day 3 — Deadlift Strength + Back + Biceps",
    shortName: "Deadlift + Back",
    focus: "Heavy deadlift strength with back thickness, lat width, and biceps/brachialis work.",
    exercises: [
      { slot: "Deadlift Strength", primary: "Conventional Deadlift", subA: "Block Pull", subB: "45° Back Extension / Hip Extension", rx: "Top 3–5 + 3×4", type: "mainDeadlift", increment: 5, sets: ["TOP","BO1","BO2","BO3"], low: 3, high: 5, rest: 210 },
      { slot: "Heavy Row", primary: "T-Bar Row", subA: "Plate-Loaded Machine Row", subB: "Seated Cable Row", rx: "4×6–10", type: "accessory", increment: 5, sets: ["1","2","3","4"], low: 6, high: 10, rest: 120 },
      { slot: "Lat Width", primary: "Single-Arm Lat Pulldown", subA: "Neutral-Grip Pulldown", subB: "Straight-Arm Cable Pulldown", rx: "3×8–12", type: "accessory", increment: 5, sets: ["1","2","3"], low: 8, high: 12, rest: 90 },
      { slot: "Biceps / Brachialis", primary: "DB Hammer Curl", subA: "Rope Hammer Curl", subB: "Incline DB Curl", rx: "3×8–12", type: "accessory", increment: 5, sets: ["1","2","3"], low: 8, high: 12, rest: 75 }
    ]
  },
  day4: {
    name: "Day 4 — Legs + Delts + Arms",
    shortName: "Legs + Arms",
    focus: "Lower-fatigue hypertrophy day for quads, side delts, biceps, and triceps.",
    exercises: [
      { slot: "Quad Volume", primary: "Leg Press", subA: "Pendulum Squat", subB: "Hack Squat", rx: "3×10–15", type: "accessory", increment: 10, sets: ["1","2","3"], low: 10, high: 15, rest: 120 },
      { slot: "Side Delts", primary: "Cable Lateral Raise", subA: "DB Lateral Raise", subB: "Lateral Raise Machine", rx: "4×12–20", type: "accessory", increment: 5, sets: ["1","2","3","4"], low: 12, high: 20, rest: 60 },
      { slot: "Biceps", primary: "Preacher Curl", subA: "EZ-Bar Curl", subB: "Cable Curl", rx: "3×8–12", type: "accessory", increment: 5, sets: ["1","2","3"], low: 8, high: 12, rest: 75 },
      { slot: "Triceps", primary: "Overhead Cable Extension", subA: "Rope Pressdown", subB: "Single-Arm Cross-Body Extension", rx: "3×10–15", type: "accessory", increment: 5, sets: ["1","2","3"], low: 10, high: 15, rest: 75 }
    ]
  }
};

const HISTORY_KEY = "evanPowerbuildingHistoryV1";
const STATE_KEY = "evanPowerbuildingStateV1";
const TIMER_KEY = "evanPowerbuildingTimerV1";
const SETTINGS_KEY = "evanPowerbuildingSettingsV1";

const DEFAULT_SETTINGS = {
  autoStartTimer: true,
  vibration: true
};

const setupView = document.getElementById("setupView");
const activeWorkoutView = document.getElementById("activeWorkoutView");
const activeDayName = document.getElementById("activeDayName");
const activeExerciseCard = document.getElementById("activeExerciseCard");
const exerciseProgressText = document.getElementById("exerciseProgressText");
const setProgressText = document.getElementById("setProgressText");
const workoutProgressBar = document.getElementById("workoutProgressBar");
const exerciseStepper = document.getElementById("exerciseStepper");
const sessionNotes = document.getElementById("sessionNotes");
const activeSessionDate = document.getElementById("activeSessionDate");
const activeBodyweight = document.getElementById("activeBodyweight");
const prevExerciseBtn = document.getElementById("prevExerciseBtn");
const nextExerciseBtn = document.getElementById("nextExerciseBtn");
const finishWorkoutBtn = document.getElementById("finishWorkoutBtn");
const historyList = document.getElementById("historyList");
const historyStats = document.getElementById("historyStats");
const connectionPill = document.getElementById("connectionPill");
const restTimerDock = document.getElementById("restTimerDock");
const timerLabel = document.getElementById("timerLabel");
const timerDisplay = document.getElementById("timerDisplay");
const timerStateText = document.getElementById("timerStateText");
const timerStartPauseBtn = document.getElementById("timerStartPauseBtn");
const autoTimerToggle = document.getElementById("autoTimerToggle");
const vibrationToggle = document.getElementById("vibrationToggle");
const storageStatus = document.getElementById("storageStatus");
const installBtn = document.getElementById("installBtn");
const sessionMenu = document.getElementById("sessionMenu");
const sessionMenuBtn = document.getElementById("sessionMenuBtn");
const toast = document.getElementById("toast");

let currentDay = "day1";
let deferredPrompt = null;
let timerInterval = null;
let audioContext = null;
let toastTimer = null;

function todayISO() {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 10);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[char]));
}

function loadJSON(key, fallback) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key));
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadHistory() {
  const data = loadJSON(HISTORY_KEY, []);
  return Array.isArray(data) ? data : [];
}

function saveHistory(history) {
  saveJSON(HISTORY_KEY, history);
}

function loadState() {
  const state = loadJSON(STATE_KEY, {});
  return state && typeof state === "object" ? state : {};
}

function saveState(state) {
  if (!state._meta || typeof state._meta !== "object") state._meta = {};
  state._meta.currentDay = currentDay;
  state._meta.lastAutosaveAt = new Date().toISOString();
  saveJSON(STATE_KEY, state);
  updateConnectionPill();
}

function getSettings() {
  return { ...DEFAULT_SETTINGS, ...loadJSON(SETTINGS_KEY, {}) };
}

function saveSettings(settings) {
  saveJSON(SETTINGS_KEY, settings);
}

function dayHasWork(dayState) {
  return Array.isArray(dayState?.inputs) && dayState.inputs.some(exSets =>
    Array.isArray(exSets) && exSets.some(set => set && (set.weight !== "" || set.reps !== ""))
  );
}

function ensureDayState(state, dayKey) {
  if (!state[dayKey] || typeof state[dayKey] !== "object") state[dayKey] = {};
  const dayState = state[dayKey];
  if (!Array.isArray(dayState.selections)) dayState.selections = [];
  if (!Array.isArray(dayState.inputs)) dayState.inputs = [];
  if (!Array.isArray(dayState.completed)) dayState.completed = [];
  if (!dayState.recovery) dayState.recovery = "primary";
  if (!dayState.sessionDate) dayState.sessionDate = todayISO();
  if (dayState.bodyweight === undefined || dayState.bodyweight === null) dayState.bodyweight = "";
  if (dayState.notes === undefined || dayState.notes === null) dayState.notes = "";
  if (!Number.isInteger(dayState.currentExercise)) dayState.currentExercise = 0;
  dayState.currentExercise = Math.min(Math.max(dayState.currentExercise, 0), PROGRAM[dayKey].exercises.length - 1);
  if (typeof dayState.sessionActive !== "boolean") dayState.sessionActive = dayHasWork(dayState);
  if (!dayState.startedAt) dayState.startedAt = null;
  return dayState;
}

function getDayState(dayKey = currentDay) {
  const state = loadState();
  if (!state._meta || typeof state._meta !== "object") state._meta = {};
  const dayState = ensureDayState(state, dayKey);
  return { state, dayState };
}

function resetDayStateObject() {
  return {
    selections: [],
    inputs: [],
    completed: [],
    recovery: "primary",
    sessionDate: todayISO(),
    bodyweight: "",
    notes: "",
    currentExercise: 0,
    sessionActive: false,
    startedAt: null
  };
}

function selectedExerciseName(ex, idx, dayState) {
  return dayState.selections[idx] || ex[dayState.recovery] || ex.primary;
}

function recoveryLabel(level) {
  if (level === "subA") return "Moderate";
  if (level === "subB") return "High fatigue";
  return "Fresh";
}

function formatRest(seconds) {
  if (seconds >= 120 && seconds % 60 === 0) return `${seconds / 60} min rest`;
  if (seconds > 60) return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2,"0")} rest`;
  return `${seconds} sec rest`;
}

function showToast(message, duration = 2200) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = setTimeout(() => { toast.hidden = true; }, duration);
}

function updateConnectionPill() {
  const state = loadState();
  const savedAt = state?._meta?.lastAutosaveAt;
  let time = "";
  if (savedAt) {
    const d = new Date(savedAt);
    if (!Number.isNaN(d.getTime())) time = ` · ${d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  }
  if (navigator.onLine) {
    connectionPill.textContent = `Saved locally${time}`;
    connectionPill.classList.remove("offline");
  } else {
    connectionPill.textContent = `Offline · saved locally${time}`;
    connectionPill.classList.add("offline");
  }
}

function persistActiveMeta() {
  const { state, dayState } = getDayState();
  if (dayState.sessionActive) {
    dayState.sessionDate = activeSessionDate.value || todayISO();
    dayState.bodyweight = activeBodyweight.value;
    dayState.notes = sessionNotes.value;
    state[currentDay] = dayState;
    saveState(state);
  }
}

function setRecovery(level, { render = true } = {}) {
  const day = PROGRAM[currentDay];
  const { state, dayState } = getDayState();
  dayState.recovery = level;
  dayState.selections = day.exercises.map(ex => ex[level]);
  state[currentDay] = dayState;
  saveState(state);
  if (render) renderWorkoutPanel();
}

function setCurrentDay(dayKey) {
  if (!PROGRAM[dayKey]) return;
  persistActiveMeta();
  currentDay = dayKey;
  const { state } = getDayState();
  state._meta.currentDay = currentDay;
  saveState(state);
  renderWorkoutPanel();
}

function renderSetup() {
  const day = PROGRAM[currentDay];
  const { dayState } = getDayState();
  const preview = day.exercises.map((ex, idx) => {
    const selected = selectedExerciseName(ex, idx, dayState);
    return `<div class="preview-row">
      <div class="preview-num">${idx + 1}</div>
      <div class="preview-name">${escapeHtml(selected)}</div>
      <div class="preview-rx">${escapeHtml(ex.rx)}</div>
    </div>`;
  }).join("");

  setupView.innerHTML = `
    <section class="setup-hero">
      <div class="setup-top">
        <div class="eyebrow">TODAY'S TRAINING</div>
        <h1 class="setup-title">${escapeHtml(day.shortName)}</h1>
        <p class="setup-focus">${escapeHtml(day.focus)}</p>
      </div>
      <div class="setup-body">
        <div class="field-grid">
          <div class="field full">
            <label for="setupDaySelect">Training day</label>
            <select id="setupDaySelect">
              ${Object.entries(PROGRAM).map(([key, d]) => `<option value="${key}" ${key === currentDay ? "selected" : ""}>${escapeHtml(d.name)}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label for="setupDate">Date</label>
            <input id="setupDate" type="date" value="${escapeHtml(dayState.sessionDate || todayISO())}" />
          </div>
          <div class="field">
            <label for="setupBodyweight">Bodyweight</label>
            <input id="setupBodyweight" type="number" inputmode="decimal" placeholder="lb" value="${escapeHtml(dayState.bodyweight || "")}" />
          </div>
        </div>

        <div class="recovery-group">
          <div class="recovery-label"><span>Recovery / fatigue</span><span>${escapeHtml(recoveryLabel(dayState.recovery))}</span></div>
          <div class="recovery-chips">
            <button class="recovery-chip ${dayState.recovery === "primary" ? "active" : ""}" data-recovery="primary">Fresh</button>
            <button class="recovery-chip ${dayState.recovery === "subA" ? "active" : ""}" data-recovery="subA">Moderate</button>
            <button class="recovery-chip ${dayState.recovery === "subB" ? "active" : ""}" data-recovery="subB">High fatigue</button>
          </div>
        </div>

        <div class="program-preview">${preview}</div>
        <button id="startWorkoutBtn" class="primary-btn start-btn">Start workout</button>
      </div>
    </section>`;

  document.getElementById("setupDaySelect").addEventListener("change", e => setCurrentDay(e.target.value));
  document.querySelectorAll(".recovery-chip").forEach(btn => btn.addEventListener("click", () => setRecovery(btn.dataset.recovery)));
  document.getElementById("setupDate").addEventListener("input", e => {
    const { state, dayState: ds } = getDayState();
    ds.sessionDate = e.target.value || todayISO();
    state[currentDay] = ds;
    saveState(state);
  });
  document.getElementById("setupBodyweight").addEventListener("input", e => {
    const { state, dayState: ds } = getDayState();
    ds.bodyweight = e.target.value;
    state[currentDay] = ds;
    saveState(state);
  });
  document.getElementById("startWorkoutBtn").addEventListener("click", startWorkout);
}

function startWorkout() {
  const { state, dayState } = getDayState();
  if (!dayState.selections.length) {
    dayState.selections = PROGRAM[currentDay].exercises.map(ex => ex[dayState.recovery] || ex.primary);
  }
  dayState.sessionActive = true;
  dayState.startedAt = dayState.startedAt || new Date().toISOString();
  dayState.currentExercise = Math.min(dayState.currentExercise || 0, PROGRAM[currentDay].exercises.length - 1);
  state[currentDay] = dayState;
  saveState(state);
  resetTimerToCurrentExercise();
  renderWorkoutPanel();
  showToast("Workout started. Every change autosaves.");
}

function completedSetCount(dayState) {
  return dayState.completed.reduce((total, exSets) => total + (Array.isArray(exSets) ? exSets.filter(Boolean).length : 0), 0);
}

function totalSetCount() {
  return PROGRAM[currentDay].exercises.reduce((total, ex) => total + ex.sets.length, 0);
}

function exerciseIsDone(dayState, idx) {
  const ex = PROGRAM[currentDay].exercises[idx];
  const completed = dayState.completed[idx] || [];
  return ex.sets.every((_, setIdx) => Boolean(completed[setIdx]));
}

function getRecommendation(ex, data) {
  if (ex.type === "mainSquat" || ex.type === "mainDeadlift") {
    const top = data[0] || {};
    const weight = Number(top.weight);
    const reps = Number(top.reps);
    if (!weight || !reps) return "Enter the top set to get next-session load guidance.";
    if (reps >= ex.high) return `Next top set: about ${weight + ex.increment} lb.`;
    if (reps >= ex.low) return `Next top set: repeat ${weight} lb.`;
    return `Next top set: consider about ${Math.max(0, weight - ex.increment)} lb.`;
  }

  const completed = data.filter(set => Number(set?.weight) > 0 && Number(set?.reps) > 0);
  if (completed.length < ex.sets.length) return "Complete all working sets to unlock progression guidance.";
  const allTop = completed.every(set => Number(set.reps) >= ex.high);
  const anyBelow = completed.some(set => Number(set.reps) < ex.low);
  const sameWeight = completed.every(set => Number(set.weight) === Number(completed[0].weight));
  const base = Number(completed[completed.length - 1].weight);
  if (allTop && sameWeight) return `Next time: increase to about ${base + ex.increment} lb.`;
  if (anyBelow) return "Next time: repeat or reduce slightly until every set clears the rep floor.";
  return `Next time: repeat ${base || "the current load"} and build toward ${ex.high} reps.`;
}

function renderActiveExercise() {
  const day = PROGRAM[currentDay];
  const { dayState } = getDayState();
  const idx = dayState.currentExercise;
  const ex = day.exercises[idx];
  const selected = selectedExerciseName(ex, idx, dayState);
  const data = dayState.inputs[idx] || [];
  const completed = dayState.completed[idx] || [];

  activeExerciseCard.innerHTML = `
    <div class="exercise-hero">
      <div class="exercise-hero-top">
        <div>
          <div class="exercise-slot">${escapeHtml(ex.slot)}</div>
          <div class="exercise-name">${escapeHtml(selected)}</div>
          <div class="rest-prescription">${escapeHtml(formatRest(ex.rest))} · auto-starts after a completed set</div>
        </div>
        <div class="exercise-rx">${escapeHtml(ex.rx)}</div>
      </div>
    </div>
    <div class="exercise-swap">
      <label for="exerciseSwapSelect">Swap movement</label>
      <select id="exerciseSwapSelect">
        <option value="${escapeHtml(ex.primary)}">Primary — ${escapeHtml(ex.primary)}</option>
        <option value="${escapeHtml(ex.subA)}">Sub A — ${escapeHtml(ex.subA)}</option>
        <option value="${escapeHtml(ex.subB)}">Sub B — ${escapeHtml(ex.subB)}</option>
      </select>
    </div>
    <div class="sets-list">
      <div class="set-head"><span>Set</span><span>Weight</span><span>Reps</span><span>Done</span></div>
      ${ex.sets.map((label, setIdx) => {
        const set = data[setIdx] || {};
        const isDone = Boolean(completed[setIdx]);
        return `<div class="set-row ${isDone ? "completed" : ""}" data-row="${setIdx}">
          <div class="set-badge">${escapeHtml(label)}</div>
          <input class="set-input" type="number" inputmode="decimal" placeholder="lb" data-kind="weight" data-set="${setIdx}" value="${escapeHtml(set.weight || "")}" />
          <input class="set-input" type="number" inputmode="numeric" placeholder="reps" data-kind="reps" data-set="${setIdx}" value="${escapeHtml(set.reps || "")}" />
          <button class="set-complete-btn" data-complete-set="${setIdx}" aria-label="Mark set ${escapeHtml(label)} complete">${isDone ? "✓" : "○"}</button>
        </div>`;
      }).join("")}
    </div>
    <div id="activeRecommendation" class="recommendation">${escapeHtml(getRecommendation(ex, data))}</div>`;

  const swap = document.getElementById("exerciseSwapSelect");
  swap.value = selected;
  swap.addEventListener("change", e => {
    const { state, dayState: ds } = getDayState();
    ds.selections[idx] = e.target.value;
    state[currentDay] = ds;
    saveState(state);
    renderActiveExercise();
  });

  activeExerciseCard.querySelectorAll(".set-input").forEach(input => input.addEventListener("input", e => {
    const setIdx = Number(e.target.dataset.set);
    const kind = e.target.dataset.kind;
    const { state, dayState: ds } = getDayState();
    ds.inputs[idx] ||= [];
    ds.inputs[idx][setIdx] ||= {};
    ds.inputs[idx][setIdx][kind] = e.target.value;
    state[currentDay] = ds;
    saveState(state);
    const rec = document.getElementById("activeRecommendation");
    if (rec) rec.textContent = getRecommendation(ex, ds.inputs[idx] || []);
  }));

  activeExerciseCard.querySelectorAll("[data-complete-set]").forEach(btn => btn.addEventListener("click", () => {
    toggleSetComplete(idx, Number(btn.dataset.completeSet));
  }));
}

function toggleSetComplete(exIdx, setIdx) {
  const ex = PROGRAM[currentDay].exercises[exIdx];
  const { state, dayState } = getDayState();
  dayState.completed[exIdx] ||= [];
  const wasComplete = Boolean(dayState.completed[exIdx][setIdx]);
  dayState.completed[exIdx][setIdx] = !wasComplete;
  state[currentDay] = dayState;
  saveState(state);

  if (!wasComplete) {
    const settings = getSettings();
    if (settings.autoStartTimer) startRestTimer(ex.rest, selectedExerciseName(ex, exIdx, dayState));
  }
  renderActiveWorkout();
}

function renderProgress() {
  const day = PROGRAM[currentDay];
  const { dayState } = getDayState();
  const current = dayState.currentExercise;
  const done = completedSetCount(dayState);
  const total = totalSetCount();
  exerciseProgressText.textContent = `Exercise ${current + 1} of ${day.exercises.length}`;
  setProgressText.textContent = `${done} of ${total} sets done`;
  workoutProgressBar.style.width = `${total ? (done / total) * 100 : 0}%`;
  exerciseStepper.innerHTML = day.exercises.map((_, idx) => {
    const classes = ["step-dot"];
    if (idx === current) classes.push("active");
    if (exerciseIsDone(dayState, idx)) classes.push("done");
    return `<button class="${classes.join(" ")}" data-step="${idx}">${idx + 1}</button>`;
  }).join("");
  exerciseStepper.querySelectorAll("[data-step]").forEach(btn => btn.addEventListener("click", () => goToExercise(Number(btn.dataset.step))));
}

function renderActiveWorkout() {
  const day = PROGRAM[currentDay];
  const { dayState } = getDayState();
  activeDayName.textContent = `${day.name} · ${recoveryLabel(dayState.recovery)}`;
  activeSessionDate.value = dayState.sessionDate || todayISO();
  activeBodyweight.value = dayState.bodyweight || "";
  sessionNotes.value = dayState.notes || "";
  renderProgress();
  renderActiveExercise();
  prevExerciseBtn.disabled = dayState.currentExercise === 0;
  nextExerciseBtn.textContent = dayState.currentExercise === day.exercises.length - 1 ? "Review workout →" : "Next exercise →";
  restTimerDock.hidden = false;
  renderTimer();
}

function renderWorkoutPanel() {
  const { dayState } = getDayState();
  if (dayState.sessionActive) {
    setupView.innerHTML = "";
    activeWorkoutView.hidden = false;
    renderActiveWorkout();
  } else {
    activeWorkoutView.hidden = true;
    restTimerDock.hidden = true;
    renderSetup();
  }
}

function goToExercise(idx) {
  const max = PROGRAM[currentDay].exercises.length - 1;
  const { state, dayState } = getDayState();
  dayState.currentExercise = Math.max(0, Math.min(max, idx));
  state[currentDay] = dayState;
  saveState(state);
  renderActiveWorkout();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function buildWorkoutRecord() {
  persistActiveMeta();
  const day = PROGRAM[currentDay];
  const { dayState } = getDayState();
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    savedAt: new Date().toISOString(),
    startedAt: dayState.startedAt,
    date: dayState.sessionDate || todayISO(),
    dayKey: currentDay,
    dayName: day.name,
    recovery: dayState.recovery,
    bodyweight: dayState.bodyweight || "",
    notes: (dayState.notes || "").trim(),
    completedSets: completedSetCount(dayState),
    totalSets: totalSetCount(),
    exercises: day.exercises.map((ex, idx) => ({
      slot: ex.slot,
      exercise: selectedExerciseName(ex, idx, dayState),
      rx: ex.rx,
      sets: ex.sets.map((label, setIdx) => ({
        label,
        weight: dayState.inputs?.[idx]?.[setIdx]?.weight || "",
        reps: dayState.inputs?.[idx]?.[setIdx]?.reps || "",
        completed: Boolean(dayState.completed?.[idx]?.[setIdx])
      }))
    }))
  };
}

function finishWorkout() {
  const { dayState } = getDayState();
  const done = completedSetCount(dayState);
  const total = totalSetCount();
  const hasAnyData = done > 0 || dayHasWork(dayState) || (dayState.notes || "").trim();
  if (!hasAnyData) {
    showToast("Add at least one set before saving.");
    return;
  }
  if (done < total && !confirm(`You have ${done} of ${total} sets marked complete. Save this workout anyway?`)) return;

  const record = buildWorkoutRecord();
  const history = loadHistory();
  history.unshift(record);
  saveHistory(history);

  const state = loadState();
  state[currentDay] = resetDayStateObject();
  saveState(state);
  stopTimer({ reset: true });
  renderWorkoutPanel();
  renderHistory();
  showToast("Workout saved to history.", 2600);
}

function discardSession() {
  if (!confirm("Discard this in-progress session? Autosaved set data for this day will be cleared.")) return;
  const state = loadState();
  state[currentDay] = resetDayStateObject();
  saveState(state);
  stopTimer({ reset: true });
  closeSessionMenu();
  renderWorkoutPanel();
  showToast("Session discarded.");
}

function renderHistory() {
  const history = loadHistory();
  const last7Cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const last7 = history.filter(item => {
    const d = new Date(item.savedAt || item.date);
    return !Number.isNaN(d.getTime()) && d.getTime() >= last7Cutoff;
  }).length;
  const totalCompletedSets = history.reduce((sum, item) => sum + Number(item.completedSets || 0), 0);
  const avgSets = history.length ? Math.round(totalCompletedSets / history.length) : 0;

  historyStats.innerHTML = `
    <div class="stat-card"><div class="stat-value">${history.length}</div><div class="stat-label">Sessions</div></div>
    <div class="stat-card"><div class="stat-value">${last7}</div><div class="stat-label">Last 7 days</div></div>
    <div class="stat-card"><div class="stat-value">${avgSets}</div><div class="stat-label">Avg sets</div></div>`;

  if (!history.length) {
    historyList.innerHTML = `<div class="empty-state">No saved workouts yet. Finish a session and it will show up here.</div>`;
    return;
  }

  historyList.innerHTML = history.slice(0, 50).map(item => {
    const details = (item.exercises || []).map(ex => {
      const sets = (ex.sets || []).filter(s => s.weight || s.reps).map(s => `${s.label}: ${s.weight || "—"} × ${s.reps || "—"}${s.completed ? " ✓" : ""}`).join(" | ");
      return `${ex.exercise}${sets ? ` — ${sets}` : ""}`;
    }).join("\n");
    const completion = item.totalSets ? `${item.completedSets || 0}/${item.totalSets} sets` : "Saved session";
    return `<details class="history-item">
      <summary class="history-summary">
        <div class="history-title"><span>${escapeHtml(item.dayName || item.dayKey || "Workout")}</span><span>${escapeHtml(item.date || "")}</span></div>
        <div class="history-sub">${escapeHtml(completion)} · ${escapeHtml(recoveryLabel(item.recovery || "primary"))}${item.bodyweight ? ` · ${escapeHtml(item.bodyweight)} lb` : ""}</div>
      </summary>
      <div class="history-body">${escapeHtml(details)}${item.notes ? `\n\nNotes: ${escapeHtml(item.notes)}` : ""}</div>
    </details>`;
  }).join("");
}

function renderSettings() {
  const settings = getSettings();
  autoTimerToggle.checked = settings.autoStartTimer;
  vibrationToggle.checked = settings.vibration;
  storageStatus.textContent = navigator.onLine
    ? "Current sessions autosave locally. The app caches itself for offline use after a successful load."
    : "You are offline. Current sessions and the rest timer are still saving locally on this device.";
}

function exportBackup() {
  persistActiveMeta();
  const payload = {
    exportedAt: new Date().toISOString(),
    programVersion: 3,
    history: loadHistory(),
    state: loadState(),
    timer: loadTimer(),
    settings: getSettings()
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `evan-powerbuilding-backup-${todayISO()}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function importBackup(file) {
  try {
    const payload = JSON.parse(await file.text());
    if (Array.isArray(payload.history)) saveHistory(payload.history);
    if (payload.state && typeof payload.state === "object") saveJSON(STATE_KEY, payload.state);
    if (payload.timer && typeof payload.timer === "object") saveJSON(TIMER_KEY, payload.timer);
    if (payload.settings && typeof payload.settings === "object") saveSettings({ ...DEFAULT_SETTINGS, ...payload.settings });
    const state = loadState();
    const savedDay = state?._meta?.currentDay;
    if (savedDay && PROGRAM[savedDay]) currentDay = savedDay;
    renderWorkoutPanel();
    renderHistory();
    renderSettings();
    restoreTimer();
    showToast("Backup imported.");
  } catch {
    showToast("Could not import that backup file.", 3000);
  }
}

function clearHistory() {
  if (!confirm("Delete all saved workout history from this browser? In-progress sessions will remain.")) return;
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
  showToast("History cleared.");
}

function resetCurrentDay() {
  const { dayState } = getDayState();
  const hasData = dayState.sessionActive || dayHasWork(dayState);
  if (hasData && !confirm("Reset the current training day and clear its in-progress session?")) return;
  const state = loadState();
  state[currentDay] = resetDayStateObject();
  saveState(state);
  stopTimer({ reset: true });
  renderWorkoutPanel();
  showToast("Current day reset.");
}

function switchPanel(target) {
  document.querySelectorAll(".app-panel").forEach(panel => {
    const active = panel.dataset.panel === target;
    panel.hidden = !active;
    panel.classList.toggle("active", active);
  });
  document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.target === target));
  if (target === "history") renderHistory();
  if (target === "settings") renderSettings();
  if (target !== "workout") restTimerDock.hidden = true;
  else {
    const { dayState } = getDayState();
    restTimerDock.hidden = !dayState.sessionActive;
    if (dayState.sessionActive) renderTimer();
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openSessionMenu() {
  sessionMenu.hidden = false;
}

function closeSessionMenu() {
  sessionMenu.hidden = true;
}

// ---------------- REST TIMER ----------------

function defaultTimer() {
  return { running: false, remaining: 90, duration: 90, endAt: null, label: "Rest", finished: false };
}

function loadTimer() {
  const timer = loadJSON(TIMER_KEY, defaultTimer());
  return { ...defaultTimer(), ...(timer && typeof timer === "object" ? timer : {}) };
}

function saveTimer(timer) {
  saveJSON(TIMER_KEY, timer);
}

function secondsRemaining(timer = loadTimer()) {
  if (timer.running && timer.endAt) return Math.max(0, Math.ceil((Number(timer.endAt) - Date.now()) / 1000));
  return Math.max(0, Number(timer.remaining) || 0);
}

function currentExerciseRest() {
  const { dayState } = getDayState();
  return PROGRAM[currentDay].exercises[dayState.currentExercise]?.rest || 90;
}

function currentExerciseLabel() {
  const { dayState } = getDayState();
  const ex = PROGRAM[currentDay].exercises[dayState.currentExercise];
  return ex ? selectedExerciseName(ex, dayState.currentExercise, dayState) : "Rest";
}

function timerClock(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;
}

function ensureAudioContext() {
  try {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === "suspended") audioContext.resume();
  } catch {
    audioContext = null;
  }
}

function playTimerBeep() {
  if (!audioContext) return;
  try {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.14, audioContext.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.38);
    osc.connect(gain).connect(audioContext.destination);
    osc.start();
    osc.stop(audioContext.currentTime + 0.4);
  } catch {
    // Audio is optional.
  }
}

function startRestTimer(seconds = currentExerciseRest(), label = currentExerciseLabel()) {
  ensureAudioContext();
  const safeSeconds = Math.max(1, Math.round(Number(seconds) || 90));
  const timer = {
    running: true,
    remaining: safeSeconds,
    duration: safeSeconds,
    endAt: Date.now() + safeSeconds * 1000,
    label,
    finished: false
  };
  saveTimer(timer);
  ensureTimerInterval();
  renderTimer();
}

function pauseTimer() {
  const timer = loadTimer();
  if (!timer.running) return;
  timer.remaining = secondsRemaining(timer);
  timer.running = false;
  timer.endAt = null;
  timer.finished = false;
  saveTimer(timer);
  renderTimer();
}

function resumeTimer() {
  ensureAudioContext();
  const timer = loadTimer();
  let remaining = secondsRemaining(timer);
  if (remaining <= 0) remaining = timer.duration || currentExerciseRest();
  timer.remaining = remaining;
  timer.duration = timer.duration || remaining;
  timer.endAt = Date.now() + remaining * 1000;
  timer.running = true;
  timer.finished = false;
  if (!timer.label) timer.label = currentExerciseLabel();
  saveTimer(timer);
  ensureTimerInterval();
  renderTimer();
}

function toggleTimer() {
  const timer = loadTimer();
  if (timer.running) pauseTimer();
  else resumeTimer();
}

function adjustTimer(delta) {
  let timer = loadTimer();
  if (timer.running && timer.endAt) {
    const remaining = Math.max(0, secondsRemaining(timer) + delta);
    timer.endAt = Date.now() + remaining * 1000;
    timer.remaining = remaining;
  } else {
    timer.remaining = Math.max(0, secondsRemaining(timer) + delta);
    timer.duration = Math.max(timer.duration || 0, timer.remaining);
    timer.finished = false;
  }
  saveTimer(timer);
  renderTimer();
}

function stopTimer({ reset = false } = {}) {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  if (reset) {
    const rest = currentExerciseRest();
    saveTimer({ running: false, remaining: rest, duration: rest, endAt: null, label: currentExerciseLabel(), finished: false });
  } else {
    const timer = loadTimer();
    timer.running = false;
    timer.endAt = null;
    saveTimer(timer);
  }
  renderTimer();
}

function resetTimerToCurrentExercise() {
  const rest = currentExerciseRest();
  stopTimer();
  saveTimer({ running: false, remaining: rest, duration: rest, endAt: null, label: currentExerciseLabel(), finished: false });
  renderTimer();
}

function completeTimer(timer = loadTimer(), { silent = false } = {}) {
  timer.running = false;
  timer.remaining = 0;
  timer.endAt = null;
  timer.finished = true;
  saveTimer(timer);
  if (!silent) {
    const settings = getSettings();
    if (settings.vibration && navigator.vibrate) navigator.vibrate([180, 90, 220]);
    playTimerBeep();
  }
  renderTimer();
}

function timerTick() {
  const timer = loadTimer();
  if (!timer.running) return;
  if (secondsRemaining(timer) <= 0) {
    completeTimer(timer);
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  } else {
    renderTimer();
  }
}

function ensureTimerInterval() {
  if (timerInterval) return;
  timerInterval = setInterval(timerTick, 250);
}

function restoreTimer() {
  const timer = loadTimer();
  if (timer.running) {
    if (secondsRemaining(timer) <= 0) completeTimer(timer, { silent: true });
    else ensureTimerInterval();
  }
  renderTimer();
}

function renderTimer() {
  const { dayState } = getDayState();
  if (!dayState.sessionActive) {
    restTimerDock.hidden = true;
    return;
  }
  const timer = loadTimer();
  const remaining = secondsRemaining(timer);
  timerLabel.textContent = `REST · ${timer.label || currentExerciseLabel()}`;
  timerDisplay.textContent = timerClock(remaining);
  restTimerDock.classList.toggle("finished", Boolean(timer.finished));
  if (timer.finished) {
    timerStateText.textContent = "GO";
    timerStartPauseBtn.textContent = "Restart";
  } else if (timer.running) {
    timerStateText.textContent = "Resting";
    timerStartPauseBtn.textContent = "Pause";
  } else {
    timerStateText.textContent = "Ready";
    timerStartPauseBtn.textContent = "Start";
  }
}

// ---------------- INIT / EVENTS ----------------

function restoreAppState() {
  const state = loadState();
  const savedDay = state?._meta?.currentDay;
  if (savedDay && PROGRAM[savedDay]) currentDay = savedDay;
  ensureDayState(state, currentDay);
  saveJSON(STATE_KEY, state);
}

async function requestPersistentStorage() {
  if (!navigator.storage?.persist) return;
  try { await navigator.storage.persist(); } catch { /* optional */ }
}

restoreAppState();
renderWorkoutPanel();
renderHistory();
renderSettings();
restoreTimer();
updateConnectionPill();
requestPersistentStorage();

prevExerciseBtn.addEventListener("click", () => {
  const { dayState } = getDayState();
  goToExercise(dayState.currentExercise - 1);
});
nextExerciseBtn.addEventListener("click", () => {
  const { dayState } = getDayState();
  if (dayState.currentExercise < PROGRAM[currentDay].exercises.length - 1) goToExercise(dayState.currentExercise + 1);
  else showToast("Review your sets, then tap Finish & save workout.", 2800);
});
finishWorkoutBtn.addEventListener("click", finishWorkout);

activeSessionDate.addEventListener("input", persistActiveMeta);
activeBodyweight.addEventListener("input", persistActiveMeta);
sessionNotes.addEventListener("input", persistActiveMeta);

sessionMenuBtn.addEventListener("click", openSessionMenu);
document.getElementById("closeSessionMenuBtn").addEventListener("click", closeSessionMenu);
document.getElementById("discardSessionBtn").addEventListener("click", discardSession);
document.getElementById("changeRecoveryBtn").addEventListener("click", () => {
  closeSessionMenu();
  const { dayState } = getDayState();
  const next = dayState.recovery === "primary" ? "subA" : dayState.recovery === "subA" ? "subB" : "primary";
  setRecovery(next);
  showToast(`Recovery set to ${recoveryLabel(next)}.`);
});
sessionMenu.addEventListener("click", e => { if (e.target === sessionMenu) closeSessionMenu(); });

for (const btn of document.querySelectorAll(".nav-btn")) btn.addEventListener("click", () => switchPanel(btn.dataset.target));

timerStartPauseBtn.addEventListener("click", toggleTimer);
document.getElementById("timerMinusBtn").addEventListener("click", () => adjustTimer(-30));
document.getElementById("timerPlusBtn").addEventListener("click", () => adjustTimer(30));
document.getElementById("timerResetBtn").addEventListener("click", resetTimerToCurrentExercise);

autoTimerToggle.addEventListener("change", () => {
  const settings = getSettings();
  settings.autoStartTimer = autoTimerToggle.checked;
  saveSettings(settings);
});
vibrationToggle.addEventListener("change", () => {
  const settings = getSettings();
  settings.vibration = vibrationToggle.checked;
  saveSettings(settings);
});

document.getElementById("exportBtn").addEventListener("click", exportBackup);
document.getElementById("importInput").addEventListener("change", e => { if (e.target.files?.[0]) importBackup(e.target.files[0]); });
document.getElementById("clearHistoryBtn").addEventListener("click", clearHistory);
document.getElementById("resetCurrentDayBtn").addEventListener("click", resetCurrentDay);

window.addEventListener("online", () => { updateConnectionPill(); renderSettings(); });
window.addEventListener("offline", () => { updateConnectionPill(); renderSettings(); });
window.addEventListener("pagehide", persistActiveMeta);
window.addEventListener("beforeunload", persistActiveMeta);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") persistActiveMeta();
  else {
    const timer = loadTimer();
    if (timer.running && secondsRemaining(timer) <= 0) completeTimer(timer);
    else renderTimer();
  }
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
