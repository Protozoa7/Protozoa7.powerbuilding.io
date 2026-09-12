"use strict";

const PROGRAM = {
  day1: {
    name: "Day 1 — Quads + Delts",
    shortName: "Quads + Delts",
    focus: "Squat anchor, quad volume, unilateral legs, and side-delt work.",
    exercises: [
      { slot:"Squat Anchor", primary:"Back Squat", subs:["Pendulum Squat","Hack Squat"], sets:4, min:5, addAt:8, rest:180, incrementType:"default", barbell:true, technical:true, warmup:true },
      { slot:"Quad Mass", primary:"Hack Squat", subs:["Pendulum Squat","Leg Press"], sets:3, min:8, addAt:12, rest:120, incrementType:"machine" },
      { slot:"Unilateral Legs", primary:"Bulgarian Split Squat", subs:["DB Reverse Lunge","DB Step-Up"], sets:3, min:8, addAt:12, rest:105, incrementType:"default", unilateral:true },
      { slot:"Side Delts", primary:"Cable Lateral Raise", subs:["DB Lateral Raise","Lateral Raise Machine"], sets:4, min:12, addAt:20, rest:60, incrementType:"default" }
    ]
  },
  day2: {
    name: "Day 2 — Back + Biceps",
    shortName: "Back + Biceps",
    focus: "Back thickness, lat width, rear delts, and brachialis/biceps volume.",
    exercises: [
      { slot:"Back Thickness", primary:"Chest-Supported Row", subs:["T-Bar Row","Seated Cable Row"], sets:4, min:6, addAt:10, rest:120, incrementType:"default" },
      { slot:"Lat Width", primary:"Neutral-Grip Lat Pulldown", subs:["Single-Arm Lat Pulldown","Assisted Pull-Up"], sets:4, min:8, addAt:12, rest:105, incrementType:"default" },
      { slot:"Rear Delts", primary:"Reverse Pec Deck", subs:["Rear-Delt Cable Fly","Chest-Supported Rear-Delt Raise"], sets:3, min:12, addAt:20, rest:75, incrementType:"default" },
      { slot:"Biceps / Brachialis", primary:"Hammer Curl", subs:["Rope Hammer Curl","Incline DB Curl"], sets:3, min:10, addAt:15, rest:75, incrementType:"default" }
    ]
  },
  day3: {
    name: "Day 3 — Posterior Chain",
    shortName: "Posterior Chain",
    focus: "Deadlift anchor, glutes, hamstrings, and calves without turning the day into a max-out session.",
    exercises: [
      { slot:"Deadlift Anchor", primary:"Barbell Deadlift", subs:["Trap-Bar Deadlift","Rack Pull"], sets:3, min:4, addAt:6, rest:210, incrementType:"deadlift", barbell:true, technical:true, warmup:true },
      { slot:"Glutes", primary:"Hip Thrust / Glute Drive", subs:["Barbell Hip Thrust","45° Back Extension"], sets:3, min:8, addAt:12, rest:120, incrementType:"machine" },
      { slot:"Hamstrings", primary:"Seated Leg Curl", subs:["Lying Leg Curl","Standing Single-Leg Curl"], sets:4, min:10, addAt:15, rest:90, incrementType:"default" },
      { slot:"Calves", primary:"Standing Calf Raise", subs:["Seated Calf Raise","Leg-Press Calf Raise"], sets:4, min:8, addAt:15, rest:75, incrementType:"machine" }
    ]
  },
  day4: {
    name: "Day 4 — Chest + Delts + Triceps",
    shortName: "Chest + Delts",
    focus: "Shoulder-friendly chest work, side delts, and direct triceps volume.",
    exercises: [
      { slot:"Upper Chest", primary:"Incline DB Press", subs:["Incline Machine Press","Converging Chest Press"], sets:4, min:6, addAt:10, rest:120, incrementType:"default" },
      { slot:"Chest Isolation", primary:"Cable Fly / Pec Deck", subs:["Pec Deck","Low-to-High Cable Fly"], sets:3, min:10, addAt:15, rest:75, incrementType:"default" },
      { slot:"Side Delts", primary:"Cable / Machine Lateral Raise", subs:["Cable Lateral Raise","DB Lateral Raise"], sets:4, min:12, addAt:20, rest:60, incrementType:"default" },
      { slot:"Triceps", primary:"Cable Triceps Pressdown", subs:["Overhead Cable Extension","Single-Arm Cross-Body Extension"], sets:3, min:10, addAt:15, rest:75, incrementType:"default" }
    ]
  }
};

const OLD_HISTORY_KEY = "evanPowerbuildingHistoryV1";
const HISTORY_KEY = OLD_HISTORY_KEY; // keep old history visible
const STATE_KEY = "evanBodybuildingStateV4"; // new program = clean active-session state
const TIMER_KEY = "evanPowerbuildingTimerV1";
const SETTINGS_KEY = "evanPowerbuildingSettingsV1";
const VERSION = 4;

const DEFAULT_SETTINGS = {
  autoStartTimer: true,
  vibration: true,
  wakeLock: false,
  preferredUnit: "lb",
  defaultIncrement: 5,
  deadliftIncrement: 10,
  machineIncrement: 10,
  lbBarWeight: 45,
  kgBarWeight: 20,
  lbPlates: [45,35,25,10,5,2.5],
  kgPlates: [25,20,15,10,5,2.5,1.25]
};

const $ = id => document.getElementById(id);
const setupView = $("setupView");
const activeView = $("activeView");
const activeDayName = $("activeDayName");
const activeExercise = $("activeExercise");
const exerciseProgress = $("exerciseProgress");
const setProgress = $("setProgress");
const progressFill = $("progressFill");
const exerciseStepper = $("exerciseStepper");
const sessionDate = $("sessionDate");
const bodyweight = $("bodyweight");
const bodyweightUnit = $("bodyweightUnit");
const sessionNotes = $("sessionNotes");
const prevExerciseBtn = $("prevExerciseBtn");
const nextExerciseBtn = $("nextExerciseBtn");
const restTimer = $("restTimer");
const timerLabel = $("timerLabel");
const timerState = $("timerState");
const timerDisplay = $("timerDisplay");
const saveStatus = $("saveStatus");
const toast = $("toast");

let currentDay = "day1";
let timerInterval = null;
let toastHandle = null;
let deferredPrompt = null;
let wakeLockSentinel = null;

function todayISO() {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0,10);
}
function esc(v) { return String(v ?? "").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c])); }
function loadJSON(key,fallback){ try { const v=JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch { return fallback; } }
function saveJSON(key,value){ localStorage.setItem(key,JSON.stringify(value)); updateSaveStatus(); }
function loadHistory(){ const h=loadJSON(HISTORY_KEY,[]); return Array.isArray(h)?h:[]; }
function saveHistory(h){ saveJSON(HISTORY_KEY,h); }
function getSettings(){ const raw=loadJSON(SETTINGS_KEY,{}); return normalizeSettings({...DEFAULT_SETTINGS,...raw}); }
function saveSettings(s){ saveJSON(SETTINGS_KEY,normalizeSettings(s)); }
function normalizeSettings(s){
  const arr = (v,fallback) => Array.isArray(v) ? v.map(Number).filter(n=>n>0).sort((a,b)=>b-a) : fallback;
  return {...DEFAULT_SETTINGS,...s, lbPlates:arr(s.lbPlates,DEFAULT_SETTINGS.lbPlates), kgPlates:arr(s.kgPlates,DEFAULT_SETTINGS.kgPlates)};
}
function unit(){ return getSettings().preferredUnit; }
function fmtWeight(v,u=unit()){ const n=Number(v); if(!Number.isFinite(n)) return "—"; return `${Number.isInteger(n)?n:n.toFixed(1)} ${u}`; }
function roundTo(value,inc){ inc=Number(inc)||1; return Math.round(Number(value)/inc)*inc; }
function parsePlateInput(v,fallback){ const vals=String(v).split(",").map(x=>Number(x.trim())).filter(x=>x>0).sort((a,b)=>b-a); return vals.length?vals:fallback; }
function showToast(msg,ms=2200){ toast.textContent=msg; toast.classList.add("show"); clearTimeout(toastHandle); toastHandle=setTimeout(()=>toast.classList.remove("show"),ms); }
function updateSaveStatus(){
  if(navigator.onLine){ saveStatus.textContent="Saved locally"; saveStatus.classList.remove("offline"); }
  else { saveStatus.textContent="Offline · saved"; saveStatus.classList.add("offline"); }
}

function blankDayState(){ return { sessionActive:false, startedAt:null, date:todayISO(), bodyweight:"", notes:"", currentExercise:0, selections:[], inputs:[], completed:[], planned:[] }; }
function loadState(){ const s=loadJSON(STATE_KEY,{}); return s && typeof s==="object"?s:{}; }
function saveState(s){ s._meta ||= {}; s._meta.currentDay=currentDay; s._meta.lastSavedAt=new Date().toISOString(); saveJSON(STATE_KEY,s); }
function getDayState(dayKey=currentDay){
  const state=loadState();
  if(!state[dayKey] || typeof state[dayKey]!=="object") state[dayKey]=blankDayState();
  const d={...blankDayState(),...state[dayKey]};
  d.selections=Array.isArray(d.selections)?d.selections:[];
  d.inputs=Array.isArray(d.inputs)?d.inputs:[];
  d.completed=Array.isArray(d.completed)?d.completed:[];
  d.planned=Array.isArray(d.planned)?d.planned:[];
  state[dayKey]=d;
  return {state,dayState:d};
}
function selectedName(ex,idx,ds){ return ds.selections?.[idx] || ex.primary; }
function exIncrement(ex){ const s=getSettings(); return ex.incrementType==="deadlift"?s.deadliftIncrement:ex.incrementType==="machine"?s.machineIncrement:s.defaultIncrement; }
function isBarbellSelection(ex,name){ return ex.barbell || ["Barbell Hip Thrust","Trap-Bar Deadlift","Rack Pull"].includes(name); }
function isWarmupSelection(ex,name){ return ex.warmup && isBarbellSelection(ex,name); }
function completedCount(ds){ return ds.completed.reduce((n,a)=>n+(Array.isArray(a)?a.filter(Boolean).length:0),0); }
function totalSets(dayKey=currentDay){ return PROGRAM[dayKey].exercises.reduce((n,e)=>n+e.sets,0); }
function exerciseDone(ds,idx){ const ex=PROGRAM[currentDay].exercises[idx]; return Array.from({length:ex.sets},(_,i)=>Boolean(ds.completed?.[idx]?.[i])).every(Boolean); }
function hasSessionData(ds){ return completedCount(ds)>0 || ds.inputs.some(a=>Array.isArray(a)&&a.some(s=>s&&(s.weight!==""||s.reps!==""))) || ds.notes.trim(); }

function getLastExerciseRecord(name){
  for(const session of loadHistory()){
    const ex=(session.exercises||[]).find(e=>e.exercise===name || e.name===name);
    if(ex) return {session,ex};
  }
  return null;
}
function productiveSets(exRecord,min){
  return (exRecord?.sets||[]).filter(s=>s.completed!==false && Number(s.weight)>0 && Number(s.reps)>=min);
}
function suggestedStart(ex,name){
  const last=getLastExerciseRecord(name); if(!last) return null;
  const all=(last.ex.sets||[]).filter(s=>Number(s.weight)>0 && Number(s.reps)>0);
  if(!all.length) return null;
  const successful=all.filter(s=>Number(s.reps)>=ex.min);
  const pool=successful.length?successful:all;
  let best=pool.reduce((a,b)=>Number(b.weight)>Number(a.weight)?b:a,pool[0]);
  let w=Number(best.weight), reason=`Last productive set: ${best.weight} × ${best.reps}`;
  const completed=all.slice(0,ex.sets);
  if(completed.length>=ex.sets && completed.every(s=>Number(s.reps)>=ex.addAt)) { w += exIncrement(ex); reason=`All last-session sets reached ${ex.addAt}+ reps`; }
  else if(Number(best.reps)<ex.min) { w=Math.max(0,w-exIncrement(ex)); reason=`Last session fell below the ${ex.min}-rep floor`; }
  return {weight:roundTo(w, exIncrement(ex)), reason, date:last.session.date||""};
}
function lastTimeText(ex,name){
  const last=getLastExerciseRecord(name); if(!last) return "No previous session logged for this exercise.";
  const text=(last.ex.sets||[]).filter(s=>s.weight||s.reps).map(s=>`${s.weight||"—"}×${s.reps||"—"}`).join(" · ");
  return `${last.session.date||"Previous"}: ${text||"No working sets recorded"}`;
}

function nextRecommendation(ex,sets,completed){
  let last=-1;
  for(let i=0;i<ex.sets;i++) if(completed?.[i]) last=i;
  if(last<0) return null;
  if(last>=ex.sets-1) return {done:true};
  const s=sets?.[last]||{}; const w=Number(s.weight); const reps=Number(s.reps);
  if(!(w>0) || !(reps>=0)) return {text:"Enter weight and reps for the completed set to calculate the next load.", pending:true};
  const inc=exIncrement(ex); let next=w, action="HOLD";
  if(reps>=ex.addAt){ next=w+inc; action="ADD"; }
  else if(reps<ex.min){ next=Math.max(0,w-inc); action="REDUCE"; }
  const reason = reps>=ex.addAt ? `${reps} reps reached the ${ex.addAt}-rep progression threshold.` : reps<ex.min ? `${reps} reps fell below the ${ex.min}-rep minimum.` : `${reps} reps stayed inside the productive range.`;
  return {done:false,next:roundTo(next,inc),action,reason,lastWeight:w,nextIndex:last+1};
}

function nearestLoadable(target,system){
  const s=getSettings();
  const bar=system==="lb"?Number(s.lbBarWeight):Number(s.kgBarWeight);
  const plates=system==="lb"?s.lbPlates:s.kgPlates;
  const min=Math.min(...plates);
  if(!Number.isFinite(target) || target<=bar) return {total:bar,bar,plates:[],remainder:0};
  const step=2*min;
  const rounded=Math.max(bar,roundTo(target-bar,step)+bar);
  let side=(rounded-bar)/2;
  const stack=[];
  for(const p of plates){
    while(side+1e-7>=p){ stack.push(p); side-=p; }
  }
  const total=bar+2*stack.reduce((a,b)=>a+b,0);
  return {total:Math.round(total*100)/100,bar,plates:stack,remainder:side};
}
function convertWeight(v,from,to){ if(from===to) return Number(v); return from==="lb"?Number(v)/2.2046226218:Number(v)*2.2046226218; }
function plateStackText(info,system){ return info.plates.length ? info.plates.join(" + ") + ` ${system} / side` : `empty ${info.bar} ${system} bar`; }
function countMap(arr){ const m=new Map(); arr.forEach(x=>m.set(x,(m.get(x)||0)+1)); return m; }
function plateChangeText(prev,next,system){
  if(!prev) return "Start with this setup";
  const a=countMap(prev.plates), b=countMap(next.plates), adds=[], removes=[];
  const keys=[...new Set([...a.keys(),...b.keys()])].sort((x,y)=>y-x);
  for(const k of keys){ const d=(b.get(k)||0)-(a.get(k)||0); if(d>0) for(let i=0;i<d;i++) adds.push(k); if(d<0) for(let i=0;i<-d;i++) removes.push(k); }
  if(!adds.length&&!removes.length) return "No plate change";
  const bits=[]; if(removes.length) bits.push(`remove ${removes.join(" + ")}`); if(adds.length) bits.push(`add ${adds.join(" + ")}`);
  return `Each side: ${bits.join(", ")} ${system}`;
}
function dualPlateInfo(target,fromUnit,prevTarget=null){
  const systems=["lb","kg"];
  return systems.map(sys=>{
    const converted=convertWeight(target,fromUnit,sys);
    const info=nearestLoadable(converted,sys);
    const prev=prevTarget==null?null:nearestLoadable(convertWeight(prevTarget,fromUnit,sys),sys);
    return {sys,info,change:plateChangeText(prev,info,sys)};
  });
}
function plateHtml(target,fromUnit,prevTarget=null){
  return dualPlateInfo(target,fromUnit,prevTarget).map(x=>`<div class="plate-line"><strong>${fmtWeight(x.info.total,x.sys)}</strong> · ${esc(plateStackText(x.info,x.sys))}</div><div class="plate-line muted">${esc(x.change)}</div>`).join("");
}
function warmupPlan(target,ex){
  const u=unit(); const s=getSettings(); const bar=u==="lb"?Number(s.lbBarWeight):Number(s.kgBarWeight);
  target=Number(target); if(!(target>bar)) return [];
  const raw=[
    {pct:0,reps:10,label:"BAR"},
    {pct:.40,reps:8,label:"40%"},
    {pct:.55,reps:5,label:"55%"},
    {pct:.70,reps:3,label:"70%"},
    {pct:.85,reps:1,label:"85%"}
  ];
  const loads=[];
  raw.forEach((r,i)=>{
    let desired=i===0?bar:target*r.pct;
    const load=nearestLoadable(desired,u).total;
    if(load>=target) return;
    if(!loads.length || Math.abs(load-loads[loads.length-1].load)>.01) loads.push({...r,load});
  });
  return loads;
}

function recommendedDay(){
  const h=loadHistory();
  const last=h.find(x=>PROGRAM[x.dayKey]);
  if(!last) return "day1";
  const keys=Object.keys(PROGRAM); const i=keys.indexOf(last.dayKey); return keys[(i+1)%keys.length];
}
function renderSetup(){
  const rec=recommendedDay(); const hist=loadHistory();
  const recent=hist[0];
  const cards=Object.entries(PROGRAM).map(([key,d])=>`<article class="day-card ${key===rec?"recommended":""}">
    ${key===rec?'<span class="recommended-tag">NEXT UP</span>':''}<div class="eyebrow">${esc(d.name.split("—")[0])}</div><h2>${esc(d.shortName)}</h2><p>${esc(d.focus)}</p>
    <div class="day-meta">${d.exercises.length} movements · ${totalSets(key)} working sets</div><button class="${key===rec?"primary-btn":"secondary-btn"}" data-start-day="${key}">Start ${esc(d.shortName)}</button></article>`).join("");
  setupView.innerHTML=`<section class="hero"><div class="eyebrow">BODYBUILDING FIRST · STRENGTH STAYS</div><h1>Build the physique.<br>Keep the squat & pull.</h1><p class="hero-copy">Working sets go to failure; squat and deadlift stop at technical failure. Hit the rep floor, chase the progression threshold, and let the app handle the next load, warm-up ladder, and plate math.</p><div class="hero-actions"><button class="primary-btn" data-start-day="${rec}">Start recommended workout</button></div><div class="hero-statline"><span><strong>${hist.length}</strong> saved sessions</span><span><strong>${recent?esc(recent.date||"—"):"—"}</strong> last workout</span><span><strong>${unit().toUpperCase()}</strong> entry mode</span></div></section><div class="day-grid">${cards}</div>`;
  setupView.querySelectorAll("[data-start-day]").forEach(b=>b.addEventListener("click",()=>startWorkout(b.dataset.startDay)));
}
function startWorkout(dayKey){
  currentDay=dayKey; const {state,dayState}=getDayState(dayKey);
  if(dayState.sessionActive && hasSessionData(dayState)){ renderTrain(); return; }
  const fresh=blankDayState(); fresh.sessionActive=true; fresh.startedAt=new Date().toISOString(); fresh.date=todayISO();
  PROGRAM[dayKey].exercises.forEach((ex,i)=>{
    fresh.selections[i]=ex.primary; fresh.inputs[i]=Array.from({length:ex.sets},()=>({weight:"",reps:""})); fresh.completed[i]=Array(ex.sets).fill(false);
    const sug=suggestedStart(ex,ex.primary); if(sug) fresh.planned[i]=sug.weight;
  });
  state[dayKey]=fresh; state._meta={currentDay:dayKey,lastSavedAt:new Date().toISOString()}; saveState(state);
  requestWakeLock(); renderTrain(); window.scrollTo({top:0,behavior:"smooth"});
}
function switchDay(dayKey){ currentDay=dayKey; const s=loadState(); s._meta||={}; s._meta.currentDay=dayKey; saveState(s); renderTrain(); }
function currentContext(){ const {state,dayState}=getDayState(); return {state,dayState,day:PROGRAM[currentDay]}; }

function renderTrain(){
  const {dayState}=getDayState();
  if(dayState.sessionActive){ setupView.innerHTML=""; activeView.hidden=false; restTimer.hidden=false; renderActive(); }
  else { activeView.hidden=true; restTimer.hidden=true; renderSetup(); }
}
function renderActive(){
  const {dayState,day}=currentContext();
  activeDayName.textContent=day.name;
  sessionDate.value=dayState.date||todayISO(); bodyweight.value=dayState.bodyweight||""; bodyweightUnit.textContent=unit(); sessionNotes.value=dayState.notes||"";
  renderWorkoutProgress(); renderActiveExercise(); renderTimer();
  prevExerciseBtn.disabled=dayState.currentExercise<=0;
  nextExerciseBtn.textContent=dayState.currentExercise>=day.exercises.length-1?"Review workout →":"Next exercise →";
}
function renderWorkoutProgress(){
  const {dayState,day}=currentContext(); const done=completedCount(dayState), total=totalSets(); const idx=dayState.currentExercise;
  exerciseProgress.textContent=`Exercise ${idx+1} of ${day.exercises.length}`; setProgress.textContent=`${done} of ${total} sets done`; progressFill.style.width=`${total?done/total*100:0}%`;
  exerciseStepper.innerHTML=day.exercises.map((_,i)=>`<button class="step-dot ${i===idx?"active":""} ${exerciseDone(dayState,i)?"done":""}" data-step="${i}">${i+1}</button>`).join("");
  exerciseStepper.querySelectorAll("[data-step]").forEach(b=>b.addEventListener("click",()=>goExercise(Number(b.dataset.step))));
}
function renderWarmups(ex,idx,name,ds){
  if(!isWarmupSelection(ex,name)) return "";
  const suggested=suggestedStart(ex,name); const target=Number(ds.planned?.[idx] || ds.inputs?.[idx]?.[0]?.weight || suggested?.weight || 0);
  const plan=warmupPlan(target,ex);
  let prev=null;
  const rows=plan.map(w=>{ const plate=plateHtml(w.load,unit(),prev); const out=`<div class="warmup-row"><div><div class="warmup-load">${fmtWeight(w.load)}</div><div class="warmup-reps">× ${w.reps}</div></div><div>${plate}</div></div>`; prev=w.load; return out; }).join("");
  const workPlates=target>0?`<div class="barbell-box"><div class="eyebrow">WORKING WEIGHT BAR SETUP</div>${plateHtml(target,unit(),prev)}</div>`:"";
  return `<section class="warmup-card"><div class="warmup-header"><div><div class="eyebrow">AUTO WARM-UP</div><h3>No math. Just load the bar.</h3></div><div class="work-target"><label>Planned work weight</label><div class="input-suffix"><input id="plannedWeight" type="number" inputmode="decimal" step="0.5" value="${target||""}" placeholder="weight"><span>${unit()}</span></div></div></div>${target>0?`<div class="warmup-list">${rows}</div>${workPlates}`:`<div class="warmup-empty">Enter the planned working weight. The warm-up ladder and both LB/KG plate stacks will appear automatically.</div>`}</section>`;
}
function renderRecommendation(ex,idx,ds,name){
  const rec=nextRecommendation(ex,ds.inputs?.[idx]||[],ds.completed?.[idx]||[]);
  if(!rec) return `<div class="recommendation"><div class="rec-kicker">NEXT SET</div><div class="rec-main">Complete Set 1 to get a load suggestion.</div><div class="rec-reason">The rule is objective: below ${ex.min} = reduce, ${ex.min}–${ex.addAt-1} = hold, ${ex.addAt}+ = add weight.</div></div>`;
  if(rec.done) return `<div class="recommendation complete"><div class="rec-kicker">EXERCISE COMPLETE</div><div class="rec-main">No next-set suggestion.</div><div class="rec-reason">The last programmed working set is done. Save it and move on.</div></div>`;
  if(rec.pending) return `<div class="recommendation"><div class="rec-kicker">NEXT SET</div><div class="rec-main">Need the completed set data.</div><div class="rec-reason">${esc(rec.text)}</div></div>`;
  const barbell=isBarbellSelection(ex,name);
  return `<div class="recommendation"><div class="rec-kicker">NEXT SET · ${esc(rec.action)}</div><div class="rec-main">Set ${rec.nextIndex+1}: ${fmtWeight(rec.next)}</div><div class="rec-reason">${esc(rec.reason)}</div>${barbell?`<div class="barbell-box">${plateHtml(rec.next,unit(),rec.lastWeight)}</div>`:""}<div class="rec-actions"><button class="mini-btn" data-use-next="${rec.nextIndex}" data-weight="${rec.next}">Use ${fmtWeight(rec.next)}</button></div></div>`;
}
function renderActiveExercise(){
  const {dayState,day}=currentContext(); const idx=dayState.currentExercise; const ex=day.exercises[idx];
  dayState.inputs[idx] ||= Array.from({length:ex.sets},()=>({weight:"",reps:""})); dayState.completed[idx] ||= Array(ex.sets).fill(false);
  const name=selectedName(ex,idx,dayState); const suggested=suggestedStart(ex,name); const planned=Number(dayState.planned?.[idx]||0);
  const setRows=Array.from({length:ex.sets},(_,i)=>{
    const s=dayState.inputs[idx][i]||{}; const done=Boolean(dayState.completed[idx][i]);
    return `<div class="set-row ${done?"done":""}"><div class="set-label">SET ${i+1}</div><div class="set-field"><input class="set-input" type="number" inputmode="decimal" step="0.5" data-set="${i}" data-kind="weight" value="${esc(s.weight||"")}" placeholder="weight"><span>${unit()}</span></div><div class="set-field"><input class="set-input" type="number" inputmode="numeric" data-set="${i}" data-kind="reps" value="${esc(s.reps||"")}" placeholder="reps"><span>reps</span></div><button class="complete-btn" data-complete="${i}" aria-label="Complete set ${i+1}">${done?"✓":"○"}</button></div>`;
  }).join("");
  activeExercise.innerHTML=`<div class="exercise-title-row"><div><div class="eyebrow">${esc(ex.slot)}</div><h1>${esc(name)}</h1><div class="exercise-subline">${ex.sets} working sets · ${ex.rest}s rest${ex.unilateral?" · reps per leg":""}</div></div><div class="rx-badge">${ex.min}+ → ${ex.addAt}</div></div>
    <div class="failure-rule">${ex.technical?"Stop at technical failure: end the set when the next rep would require a meaningful breakdown in position or technique.":"Working sets are rep-to-failure: keep going until another clean rep is not there."}</div>
    <div class="threshold-grid"><div class="threshold"><strong>${ex.min}</strong><span>minimum reps</span></div><div class="threshold"><strong>${ex.addAt}</strong><span>add weight at</span></div><div class="threshold"><strong>${fmtWeight(exIncrement(ex))}</strong><span>load change</span></div></div>
    <div class="last-time"><strong>LAST TIME</strong><br>${esc(lastTimeText(ex,name))}${suggested?`<br><strong>Suggested start:</strong> ${fmtWeight(suggested.weight)} · ${esc(suggested.reason)}`:""}</div>
    <div class="swap-row"><label>Exercise / substitution</label><select id="exerciseSwap">${[ex.primary,...ex.subs].map(n=>`<option ${n===name?"selected":""}>${esc(n)}</option>`).join("")}</select></div>
    ${renderWarmups(ex,idx,name,dayState)}
    <div class="set-list">${setRows}</div>
    <div id="nextSetBox">${renderRecommendation(ex,idx,dayState,name)}</div>`;

  const swap=$("exerciseSwap"); swap.addEventListener("change",()=>{
    const {state,dayState:ds}=getDayState(); ds.selections[idx]=swap.value; ds.inputs[idx]=Array.from({length:ex.sets},()=>({weight:"",reps:""})); ds.completed[idx]=Array(ex.sets).fill(false); const sug=suggestedStart(ex,swap.value); ds.planned[idx]=sug?.weight||""; state[currentDay]=ds; saveState(state); renderActive();
  });
  const planInput=$("plannedWeight"); if(planInput) planInput.addEventListener("input",()=>{ const {state,dayState:ds}=getDayState(); ds.planned[idx]=planInput.value; if(!ds.inputs[idx][0].weight) ds.inputs[idx][0].weight=planInput.value; state[currentDay]=ds; saveState(state); renderActiveExercise(); });
  activeExercise.querySelectorAll(".set-input").forEach(inp=>inp.addEventListener("input",()=>{
    const {state,dayState:ds}=getDayState(); const si=Number(inp.dataset.set); ds.inputs[idx][si] ||= {}; ds.inputs[idx][si][inp.dataset.kind]=inp.value; if(si===0&&inp.dataset.kind==="weight"&&!ds.planned[idx]) ds.planned[idx]=inp.value; state[currentDay]=ds; saveState(state); refreshRecommendationOnly(ex,idx,ds,selectedName(ex,idx,ds));
  }));
  activeExercise.querySelectorAll("[data-complete]").forEach(btn=>btn.addEventListener("click",()=>toggleSet(idx,Number(btn.dataset.complete))));
  activeExercise.querySelectorAll("[data-use-next]").forEach(btn=>btn.addEventListener("click",()=>useNextWeight(idx,Number(btn.dataset.useNext),btn.dataset.weight)));
}
function refreshRecommendationOnly(ex,idx,ds,name){ const box=$("nextSetBox"); if(box){ box.innerHTML=renderRecommendation(ex,idx,ds,name); box.querySelectorAll("[data-use-next]").forEach(btn=>btn.addEventListener("click",()=>useNextWeight(idx,Number(btn.dataset.useNext),btn.dataset.weight))); } }
function useNextWeight(exIdx,setIdx,weight){ const {state,dayState}=getDayState(); dayState.inputs[exIdx] ||= []; dayState.inputs[exIdx][setIdx] ||= {}; dayState.inputs[exIdx][setIdx].weight=String(weight); state[currentDay]=dayState; saveState(state); renderActiveExercise(); showToast(`Set ${setIdx+1} loaded at ${fmtWeight(weight)}.`); }
function toggleSet(exIdx,setIdx){
  const {state,dayState,day}=currentContext(); const ex=day.exercises[exIdx]; dayState.completed[exIdx] ||= Array(ex.sets).fill(false); const was=Boolean(dayState.completed[exIdx][setIdx]);
  if(!was){ const set=dayState.inputs?.[exIdx]?.[setIdx]||{}; if(!(Number(set.weight)>0) || !(Number(set.reps)>=0) || set.reps===""){ showToast("Enter the weight and reps before completing the set."); return; } }
  dayState.completed[exIdx][setIdx]=!was; state[currentDay]=dayState; saveState(state);
  if(!was && getSettings().autoStartTimer) startTimer(ex.rest,selectedName(ex,exIdx,dayState));
  renderActive();
}
function goExercise(i){ const {state,dayState,day}=currentContext(); dayState.currentExercise=Math.max(0,Math.min(day.exercises.length-1,i)); state[currentDay]=dayState; saveState(state); renderActive(); window.scrollTo({top:0,behavior:"smooth"}); }
function persistMeta(){ const {state,dayState}=getDayState(); dayState.date=sessionDate.value||todayISO(); dayState.bodyweight=bodyweight.value||""; dayState.notes=sessionNotes.value||""; state[currentDay]=dayState; saveState(state); }
function workoutRecord(){
  persistMeta(); const {dayState,day}=currentContext(); return { id:crypto.randomUUID?crypto.randomUUID():String(Date.now()), savedAt:new Date().toISOString(), startedAt:dayState.startedAt, date:dayState.date, dayKey:currentDay, dayName:day.name, programVersion:VERSION, bodyweight:dayState.bodyweight||"", notes:(dayState.notes||"").trim(), completedSets:completedCount(dayState), totalSets:totalSets(), unit:unit(), exercises:day.exercises.map((ex,i)=>({slot:ex.slot,exercise:selectedName(ex,i,dayState),rx:`${ex.sets} sets · ${ex.min}+ / add @ ${ex.addAt}`,min:ex.min,addAt:ex.addAt,sets:Array.from({length:ex.sets},(_,j)=>({label:String(j+1),weight:dayState.inputs?.[i]?.[j]?.weight||"",reps:dayState.inputs?.[i]?.[j]?.reps||"",completed:Boolean(dayState.completed?.[i]?.[j])}))})) };
}
function finishWorkout(){ const {dayState}=getDayState(); const done=completedCount(dayState), total=totalSets(); if(!hasSessionData(dayState)){ showToast("Log at least one set before saving."); return; } if(done<total && !confirm(`You have ${done} of ${total} working sets complete. Save anyway?`)) return; const h=loadHistory(); h.unshift(workoutRecord()); saveHistory(h); const st=loadState(); st[currentDay]=blankDayState(); saveState(st); stopTimer(true); releaseWakeLock(); renderTrain(); renderHistory(); renderProgress(); showToast("Workout saved."); }
function discardSession(){ const {dayState}=getDayState(); if(hasSessionData(dayState)&&!confirm("Discard this in-progress session? The new-program active data for this day will be cleared.")) return; const s=loadState(); s[currentDay]=blankDayState(); saveState(s); stopTimer(true); releaseWakeLock(); $("sessionMenu").hidden=true; renderTrain(); showToast("Session discarded."); }

function renderHistory(){
  const h=loadHistory(); const last7=h.filter(x=>{const d=new Date(x.savedAt||x.date);return !Number.isNaN(d.getTime())&&Date.now()-d.getTime()<7*86400000;}).length; const sets=h.reduce((a,x)=>a+Number(x.completedSets||0),0);
  $("historyStats").innerHTML=`<div class="stat-card"><div class="stat-value">${h.length}</div><div class="stat-label">Sessions</div></div><div class="stat-card"><div class="stat-value">${last7}</div><div class="stat-label">Last 7 days</div></div><div class="stat-card"><div class="stat-value">${sets}</div><div class="stat-label">Sets logged</div></div>`;
  if(!h.length){ $("historyList").innerHTML='<div class="empty-state">No saved workouts yet.</div>'; return; }
  $("historyList").innerHTML=h.slice(0,60).map(item=>{ const details=(item.exercises||[]).map(ex=>{ const ss=(ex.sets||[]).filter(s=>s.weight||s.reps).map(s=>`${s.weight||"—"}×${s.reps||"—"}${s.completed===false?"":" ✓"}`).join(" · "); return `${ex.exercise||ex.name||"Exercise"}${ss?` — ${ss}`:""}`; }).join("\n"); return `<details class="history-item"><summary class="history-summary"><div class="history-title"><span>${esc(item.dayName||item.dayKey||"Workout")}</span><span>${esc(item.date||"")}</span></div><div class="history-sub">${Number(item.completedSets||0)} sets${item.bodyweight?` · ${esc(item.bodyweight)} ${esc(item.unit||"lb")}`:""}${item.programVersion===VERSION?" · Bodybuilding v4":" · Legacy log"}</div></summary><div class="history-body">${esc(details)}${item.notes?`\n\nNotes: ${esc(item.notes)}`:""}</div></details>`; }).join("");
}
function allExerciseNames(){ return [...new Set(Object.values(PROGRAM).flatMap(d=>d.exercises.map(e=>e.primary)))]; }
function exerciseMetrics(name){
  const rows=[]; loadHistory().forEach(session=>(session.exercises||[]).forEach(ex=>{ if(ex.exercise===name || ex.name===name) (ex.sets||[]).forEach(s=>{ const w=Number(s.weight),r=Number(s.reps); if(w>0&&r>0) rows.push({w,r,date:session.date||"",volume:w*r}); }); }));
  if(!rows.length) return null; const bestLoad=Math.max(...rows.map(x=>x.w)); const repPR=Math.max(...rows.map(x=>x.r)); const bestVolume=Math.max(...rows.map(x=>x.volume)); const recent=rows[0]; return {bestLoad,repPR,bestVolume,recent};
}
function renderProgress(){
  const h=loadHistory(); const totalVolume=h.reduce((sum,s)=>sum+(s.exercises||[]).reduce((a,e)=>a+(e.sets||[]).reduce((q,x)=>q+(Number(x.weight)||0)*(Number(x.reps)||0),0),0),0); const newSessions=h.filter(x=>x.programVersion===VERSION).length;
  $("progressStats").innerHTML=`<div class="stat-card"><div class="stat-value">${newSessions}</div><div class="stat-label">v4 sessions</div></div><div class="stat-card"><div class="stat-value">${Math.round(totalVolume/1000)}k</div><div class="stat-label">Logged load×reps</div></div><div class="stat-card"><div class="stat-value">${unit().toUpperCase()}</div><div class="stat-label">Current unit</div></div>`;
  const items=allExerciseNames().map(n=>[n,exerciseMetrics(n)]).filter(x=>x[1]);
  $("progressList").innerHTML=items.length?items.map(([n,m])=>`<article class="progress-item"><h3>${esc(n)}</h3><div class="progress-metrics"><div class="metric"><strong>${fmtWeight(m.bestLoad)}</strong><span>best logged load</span></div><div class="metric"><strong>${m.repPR}</strong><span>best reps</span></div><div class="metric"><strong>${Math.round(m.bestVolume)}</strong><span>best set volume</span></div></div></article>`).join(""):'<div class="empty-state">Complete workouts in the new split and your main movement progress will appear here.</div>';
}

function renderSettings(){ const s=getSettings(); $("autoTimerToggle").checked=s.autoStartTimer; $("vibrationToggle").checked=s.vibration; $("wakeLockToggle").checked=s.wakeLock; $("preferredUnit").value=s.preferredUnit; $("defaultIncrement").value=s.defaultIncrement; $("deadliftIncrement").value=s.deadliftIncrement; $("machineIncrement").value=s.machineIncrement; $("lbBarWeight").value=s.lbBarWeight; $("kgBarWeight").value=s.kgBarWeight; $("lbPlates").value=s.lbPlates.join(","); $("kgPlates").value=s.kgPlates.join(","); $("storageStatus").textContent=navigator.onLine?"Sessions autosave locally and the site caches itself for offline use.":"You are offline. Session data is still saving locally on this device."; }
function saveSettingsFromForm(){ const old=getSettings(); const s={...old,autoStartTimer:$("autoTimerToggle").checked,vibration:$("vibrationToggle").checked,wakeLock:$("wakeLockToggle").checked,preferredUnit:$("preferredUnit").value,defaultIncrement:Number($("defaultIncrement").value)||5,deadliftIncrement:Number($("deadliftIncrement").value)||10,machineIncrement:Number($("machineIncrement").value)||10,lbBarWeight:Number($("lbBarWeight").value)||45,kgBarWeight:Number($("kgBarWeight").value)||20,lbPlates:parsePlateInput($("lbPlates").value,DEFAULT_SETTINGS.lbPlates),kgPlates:parsePlateInput($("kgPlates").value,DEFAULT_SETTINGS.kgPlates)}; saveSettings(s); renderSettings(); renderTrain(); showToast("Settings saved."); }
function exportBackup(){ const payload={exportedAt:new Date().toISOString(),programVersion:VERSION,history:loadHistory(),state:loadState(),timer:loadTimer(),settings:getSettings()}; const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=`evan-hypertrophy-backup-${todayISO()}.json`; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000); }
async function importBackup(file){ try { const p=JSON.parse(await file.text()); if(Array.isArray(p.history)) saveHistory(p.history); if(p.state&&typeof p.state==="object") saveJSON(STATE_KEY,p.state); if(p.timer&&typeof p.timer==="object") saveJSON(TIMER_KEY,p.timer); if(p.settings&&typeof p.settings==="object") saveSettings({...DEFAULT_SETTINGS,...p.settings}); const s=loadState(); if(PROGRAM[s?._meta?.currentDay]) currentDay=s._meta.currentDay; renderTrain();renderHistory();renderProgress();renderSettings();restoreTimer();showToast("Backup imported."); } catch { showToast("Could not import that backup.",3000); } }

function defaultTimer(){ return {running:false,remaining:90,duration:90,endAt:null,label:"Rest",finished:false}; }
function loadTimer(){ return {...defaultTimer(),...loadJSON(TIMER_KEY,{})}; }
function saveTimer(t){ saveJSON(TIMER_KEY,t); }
function secondsLeft(t=loadTimer()){ return t.running&&t.endAt?Math.max(0,Math.ceil((Number(t.endAt)-Date.now())/1000)):Math.max(0,Number(t.remaining)||0); }
function timerClock(sec){ const m=Math.floor(sec/60),s=sec%60; return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`; }
function startTimer(sec,label="Rest"){ const t={running:true,remaining:sec,duration:sec,endAt:Date.now()+sec*1000,label,finished:false}; saveTimer(t); ensureTimerInterval(); renderTimer(); }
function renderTimer(){ const t=loadTimer(),left=secondsLeft(t); timerDisplay.textContent=timerClock(left); timerLabel.textContent=t.label||"Rest"; timerState.textContent=t.running?"Counting down":t.finished?"Rest complete":"Paused / ready"; $("timerToggle").textContent=t.running?"Pause":"Start"; }
function ensureTimerInterval(){ if(timerInterval) return; timerInterval=setInterval(()=>{ const t=loadTimer(); if(!t.running){renderTimer();return;} const left=secondsLeft(t); if(left<=0){ t.running=false;t.remaining=0;t.endAt=null;t.finished=true;saveTimer(t); if(getSettings().vibration&&navigator.vibrate) navigator.vibrate([180,80,180]); showToast("Rest complete."); } renderTimer(); },500); }
function toggleTimer(){ const t=loadTimer(); if(t.running){ t.remaining=secondsLeft(t);t.running=false;t.endAt=null; } else { let left=secondsLeft(t)||t.duration||90;t.running=true;t.remaining=left;t.endAt=Date.now()+left*1000;t.finished=false; } saveTimer(t);ensureTimerInterval();renderTimer(); }
function adjustTimer(delta){ const t=loadTimer(); const left=Math.max(0,secondsLeft(t)+delta); t.remaining=left; if(t.running)t.endAt=Date.now()+left*1000; saveTimer(t);renderTimer(); }
function stopTimer(reset=false){ const t=defaultTimer(); if(!reset)t.remaining=0; saveTimer(t);renderTimer(); }
function restoreTimer(){ ensureTimerInterval();renderTimer(); }

async function requestWakeLock(){ if(!getSettings().wakeLock || !('wakeLock' in navigator)) return; try { wakeLockSentinel=await navigator.wakeLock.request('screen'); } catch {} }
async function releaseWakeLock(){ try { await wakeLockSentinel?.release(); } catch {} wakeLockSentinel=null; }
function switchPanel(target){ document.querySelectorAll(".panel").forEach(p=>p.hidden=p.dataset.panel!==target); document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.target===target)); if(target==="history")renderHistory(); if(target==="progress")renderProgress(); if(target==="settings")renderSettings(); restTimer.hidden=target!=="train" || !getDayState().dayState.sessionActive; window.scrollTo({top:0,behavior:"smooth"}); }

function wireEvents(){
  document.querySelectorAll(".nav-btn").forEach(b=>b.addEventListener("click",()=>switchPanel(b.dataset.target)));
  document.querySelectorAll("[data-nav]").forEach(b=>b.addEventListener("click",()=>switchPanel(b.dataset.nav)));
  prevExerciseBtn.addEventListener("click",()=>goExercise(getDayState().dayState.currentExercise-1));
  nextExerciseBtn.addEventListener("click",()=>{ const {dayState}=getDayState(); if(dayState.currentExercise>=PROGRAM[currentDay].exercises.length-1){ window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"}); showToast("Review the session, then save it below."); } else goExercise(dayState.currentExercise+1); });
  $("finishWorkoutBtn").addEventListener("click",finishWorkout);
  [sessionDate,bodyweight,sessionNotes].forEach(el=>el.addEventListener("input",persistMeta));
  $("sessionMenuBtn").addEventListener("click",()=>$("sessionMenu").hidden=false);
  $("closeSessionMenuBtn").addEventListener("click",()=>$("sessionMenu").hidden=true);
  $("jumpSetupBtn").addEventListener("click",()=>{ $("sessionMenu").hidden=true; showToast("Finish or discard the active session before starting another day.",3200); });
  $("discardSessionBtn").addEventListener("click",discardSession);
  $("timerToggle").addEventListener("click",toggleTimer); $("timerMinus").addEventListener("click",()=>adjustTimer(-15)); $("timerPlus").addEventListener("click",()=>adjustTimer(15)); $("timerStop").addEventListener("click",()=>stopTimer(true));
  $("saveSettingsBtn").addEventListener("click",saveSettingsFromForm);
  $("exportBtn").addEventListener("click",exportBackup);
  $("importInput").addEventListener("change",e=>{ if(e.target.files?.[0]) importBackup(e.target.files[0]); e.target.value=""; });
  $("clearHistoryBtn").addEventListener("click",()=>{ if(confirm("Delete all workout history, including legacy powerbuilding logs, from this browser?")){ localStorage.removeItem(HISTORY_KEY); renderHistory();renderProgress();showToast("History cleared."); } });
  $("autoTimerToggle").addEventListener("change",saveSettingsFromForm); $("vibrationToggle").addEventListener("change",saveSettingsFromForm); $("wakeLockToggle").addEventListener("change",saveSettingsFromForm); $("preferredUnit").addEventListener("change",saveSettingsFromForm);
  window.addEventListener("online",updateSaveStatus); window.addEventListener("offline",updateSaveStatus);
  document.addEventListener("visibilitychange",()=>{ if(document.visibilityState==="visible"&&getDayState().dayState.sessionActive)requestWakeLock(); });
  window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;$("installBtn").hidden=false;});
  $("installBtn").addEventListener("click",async()=>{ if(!deferredPrompt)return; deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt=null; $("installBtn").hidden=true; });
}

function init(){ const st=loadState(); if(PROGRAM[st?._meta?.currentDay]) currentDay=st._meta.currentDay; wireEvents(); renderTrain(); renderHistory(); renderProgress(); renderSettings(); restoreTimer(); updateSaveStatus(); if(getDayState().dayState.sessionActive)requestWakeLock(); if("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{})); }
init();
