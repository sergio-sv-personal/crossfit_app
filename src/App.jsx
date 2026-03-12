import { useState, useEffect, useCallback, useRef } from "react";
import { BENCHMARK_WODS, COMPETITION_WODS_PRELOADED, WOD_CATEGORIES } from "./wodData.js";

const SKILL_DATA = {
  skipping: {
    label: "Jump Rope",
    icon: "~",
    skills: [
      {
        id: "single-under",
        name: "Single Unders",
        level: 1,
        prereqs: [],
        milestone: "50 unbroken single unders with consistent rhythm",
        drills: [
          "Rope-less jump: practise bounce rhythm without rope",
          "Wrist flick drill: spin rope with wrists only, not arms",
          "2-minute continuous practice sets with reset on trip"
        ],
        cues: ["Light bounce on balls of feet", "Elbows tucked, wrists drive the rope", "Eyes forward, not down"]
      },
      {
        id: "single-under-speed",
        name: "Speed Singles",
        level: 2,
        prereqs: ["single-under"],
        milestone: "100 unbroken singles in under 60 seconds",
        drills: [
          "Tabata singles: 20s max effort / 10s rest x 8",
          "Descending rest intervals: 50 on / 10 off, 50 on / 8 off, etc.",
          "Metronome drill: match rope speed to increasing BPM"
        ],
        cues: ["Minimal jump height", "Quick wrist turnover", "Relaxed shoulders, tight core"]
      },
      {
        id: "single-leg-singles",
        name: "Single Leg Singles",
        level: 2,
        prereqs: ["single-under"],
        milestone: "20 unbroken each leg",
        drills: [
          "Alternate legs every 5 reps",
          "Single leg bounce without rope first",
          "30s single leg holds for balance"
        ],
        cues: ["Stay on ball of foot", "Keep hip level", "Light quick hops"]
      },
      {
        id: "double-under",
        name: "Double Unders",
        level: 3,
        prereqs: ["single-under-speed"],
        milestone: "30 unbroken double unders",
        drills: [
          "Power jump drill: single-single-POWER jump (no rope)",
          "Single-single-double: 2 singles then 1 DU, repeat",
          "Penguin taps: jump and slap thighs twice per jump (no rope)"
        ],
        cues: ["Jump higher not faster", "Wrists spin tighter circles", "Hollow body position in air", "Patience at the top of the jump"]
      },
      {
        id: "du-unbroken-50",
        name: "50 Unbroken DUs",
        level: 4,
        prereqs: ["double-under"],
        milestone: "50 unbroken double unders consistently",
        drills: [
          "Build sets: 10, 15, 20, 25... add 5 each session",
          "3-minute sustained DU practice (reset and continue)",
          "DU breathing drill: exhale on every 5th rep"
        ],
        cues: ["Find your breathing rhythm", "Relax the grip", "Consistent jump height"]
      },
      {
        id: "crossover-single",
        name: "Crossover Singles",
        level: 3,
        prereqs: ["single-under-speed"],
        milestone: "20 unbroken crossover singles",
        drills: [
          "Arms-only crossover practice without jumping",
          "Single-single-cross pattern: 2 regular then 1 cross",
          "Slow-motion cross drill focusing on hand position"
        ],
        cues: ["Cross at wrist level, not elbows", "Hands cross to opposite hip", "Maintain upright posture"]
      },
      {
        id: "cross-double-under",
        name: "Cross Double Unders",
        level: 5,
        prereqs: ["du-unbroken-50", "crossover-single"],
        milestone: "10 unbroken cross double unders",
        drills: [
          "DU-DU-cross DU pattern drill",
          "Slow cross DU singles to build the motor pattern",
          "High box jump + cross arm practice (no rope)"
        ],
        cues: ["Cross happens on the way UP", "Uncross quickly for next revolution", "Higher jump than regular DUs"]
      },
      {
        id: "triple-under",
        name: "Triple Unders",
        level: 5,
        prereqs: ["du-unbroken-50"],
        milestone: "5 unbroken triple unders",
        drills: [
          "Max height tuck jumps with penguin taps x 3",
          "Single DU into triple attempt",
          "Speed rope wrist conditioning drills"
        ],
        cues: ["Tuck knees slightly at peak", "Whip wrists aggressively", "Full hip extension before tuck"]
      }
    ]
  },
  gymnastics: {
    label: "Gymnastics",
    icon: "O",
    skills: [
      {
        id: "strict-pullup",
        name: "Strict Pull-up",
        level: 1,
        prereqs: [],
        milestone: "5 strict pull-ups with full ROM",
        drills: [
          "Dead hangs: 3 x 30s",
          "Ring rows: 3 x 10 at challenging angle",
          "Banded pull-ups: 3 x 5 with lightest band possible",
          "Negative pull-ups: 3 x 5 with 5s lowering"
        ],
        cues: ["Start from dead hang", "Pull elbows to pockets", "Chin clears the bar"]
      },
      {
        id: "kipping-pullup",
        name: "Kipping Pull-up",
        level: 2,
        prereqs: ["strict-pullup"],
        milestone: "10 unbroken kipping pull-ups",
        drills: [
          "Kip swing drill: 3 x 10 (arch to hollow on bar)",
          "Kip swing + pull attempt: controlled progression",
          "Box-assisted kip to feel the timing"
        ],
        cues: ["Arch then hollow drives the kip", "Push away from bar at top", "Aggressive hip snap"]
      },
      {
        id: "butterfly-pullup",
        name: "Butterfly Pull-up",
        level: 3,
        prereqs: ["kipping-pullup"],
        milestone: "15 unbroken butterfly pull-ups",
        drills: [
          "Small butterfly circles on bar (no pull)",
          "Kip-kip-butterfly transition drill",
          "Banded butterfly practice for timing"
        ],
        cues: ["Continuous circular motion", "Head pushes through at bottom", "Keep it small and tight"]
      },
      {
        id: "chest-to-bar",
        name: "Chest-to-Bar Pull-up",
        level: 3,
        prereqs: ["kipping-pullup"],
        milestone: "10 unbroken C2B pull-ups",
        drills: [
          "Exaggerated kip swing for height",
          "Strict C2B with band assist",
          "Kipping pull-up + extra pull drill"
        ],
        cues: ["Bigger kip than regular pull-up", "Pull to sternum not chin", "Lean back slightly at top"]
      },
      {
        id: "bar-muscle-up",
        name: "Bar Muscle-up",
        level: 4,
        prereqs: ["chest-to-bar"],
        milestone: "3 unbroken bar muscle-ups",
        drills: [
          "Jumping bar MU transitions from box",
          "Glide kip drill on low bar",
          "Hip-to-bar kip swings",
          "Banded bar muscle-up practice"
        ],
        cues: ["Big kip, pull to hip crease", "Fast turnover at the top", "Lean over the bar aggressively"]
      },
      {
        id: "ring-muscle-up",
        name: "Ring Muscle-up",
        level: 5,
        prereqs: ["bar-muscle-up"],
        milestone: "3 unbroken ring muscle-ups",
        drills: [
          "Low ring transitions from feet on ground",
          "False grip hangs: 3 x 15s",
          "Strict ring dip + strict ring pull-up supersets",
          "Banded ring MU with false grip"
        ],
        cues: ["False grip is non-negotiable early on", "Pull rings to armpits", "Fast sit-up transition", "Press out to full lockout"]
      },
      {
        id: "hspu-kipping",
        name: "Kipping HSPU",
        level: 3,
        prereqs: ["strict-pullup"],
        milestone: "10 unbroken kipping HSPU (to AbMat or wall)",
        drills: [
          "Wall walk practice: 3 x 3",
          "Pike push-ups on box: 3 x 8",
          "Wall-facing handstand hold: 3 x 20s",
          "Kick-up to wall + lower to AbMat"
        ],
        cues: ["Tripod position: head and hands form triangle", "Knees drive up explosively", "Lock out arms fully at top"]
      },
      {
        id: "strict-hspu",
        name: "Strict HSPU",
        level: 4,
        prereqs: ["hspu-kipping"],
        milestone: "5 strict HSPU with no kip",
        drills: [
          "Deficit pike push-ups: 3 x 5",
          "Eccentric wall HSPU: 5s negative x 5 reps",
          "Seated DB press at increasing loads",
          "Nose-to-wall holds for endurance"
        ],
        cues: ["Control the descent", "Elbows track at 45 degrees", "Squeeze glutes for stability"]
      },
      {
        id: "rope-climb",
        name: "Rope Climb",
        level: 2,
        prereqs: ["strict-pullup"],
        milestone: "1 legless ascent OR 3 consecutive rope climbs with wrap",
        drills: [
          "Foot lock drill on ground: J-hook or S-wrap",
          "Pull to stand from seated on floor",
          "Climb to half height and lower controlled"
        ],
        cues: ["Secure foot lock before pulling", "Arms pull, then re-lock feet higher", "Control the descent with wrap"]
      },
      {
        id: "legless-rope-climb",
        name: "Legless Rope Climb",
        level: 4,
        prereqs: ["rope-climb", "chest-to-bar"],
        milestone: "1 legless rope climb (15ft) under 30 seconds",
        drills: [
          "Strict pull-up volume: 5 x 5",
          "Towel pull-ups for grip: 3 x 5",
          "Rope hang + pull without feet: half height",
          "L-sit rope hang: 3 x 10s"
        ],
        cues: ["Hollow body throughout", "Hand over hand with locked arms", "Pike or L-sit legs to reduce swing"]
      },
      {
        id: "toes-to-bar",
        name: "Toes-to-Bar",
        level: 2,
        prereqs: ["strict-pullup"],
        milestone: "10 unbroken toes-to-bar (kipping)",
        drills: [
          "Kip swing drill: 3 x 10 (arch to hollow on bar)",
          "Knees-to-chest progression: 3 x 8",
          "Strict leg raise from hang: 3 x 5"
        ],
        cues: ["Initiate with kip not abs", "Snap toes to bar then push away", "Keep arms straight throughout"]
      },
      {
        id: "wall-walk",
        name: "Wall Walk",
        level: 2,
        prereqs: [],
        milestone: "5 strict wall walks with controlled descent",
        drills: [
          "Plank to wall walk-up: 3 x 3 slow and controlled",
          "Nose-to-wall hold: 3 x 20s",
          "Eccentric wall walk descent: 5 reps with 5s lowering"
        ],
        cues: ["Hands walk in close to the wall", "Tight midline the entire time", "Control the walk down — don't collapse"]
      },
      {
        id: "pistol-squat",
        name: "Pistol Squat",
        level: 3,
        prereqs: [],
        milestone: "5 each leg unassisted with full depth",
        drills: [
          "Box pistol squat: lower to box and stand, 3 x 5 each leg",
          "Banded pistol: band around rig for assistance, 3 x 5",
          "Single leg wall sit holds: 3 x 20s each leg"
        ],
        cues: ["Heel stays planted", "Extend opposite leg forward", "Chest up, counterbalance with arms"]
      }
    ]
  },
  weightlifting: {
    label: "Weightlifting",
    icon: "#",
    skills: [
      {
        id: "front-squat",
        name: "Front Squat",
        level: 1,
        prereqs: [],
        milestone: "Bodyweight front squat with full depth and upright torso",
        drills: [
          "Goblet squats: 3 x 10 for patterning",
          "Front rack mobility: wrist and lat stretches",
          "Pause front squats: 3s in the hole x 5 reps"
        ],
        cues: ["Elbows high, upper arm parallel to floor", "Sit between hips, not back", "Drive knees out over toes"]
      },
      {
        id: "overhead-squat",
        name: "Overhead Squat",
        level: 2,
        prereqs: ["front-squat"],
        milestone: "Bodyweight overhead squat with PVC or barbell",
        drills: [
          "Overhead hold + walk: 3 x 20m with PVC",
          "Sotts press: 3 x 5 with empty bar",
          "Wall-facing OHS with toes 6 inches from wall"
        ],
        cues: ["Active shoulders: push up into the bar", "Bar over mid-foot at all times", "Slow descent, drive up fast"]
      },
      {
        id: "power-clean",
        name: "Power Clean",
        level: 2,
        prereqs: ["front-squat"],
        milestone: "Bodyweight power clean with solid receiving position",
        drills: [
          "Clean pull from floor: 3 x 5 (focus on positions)",
          "Hang power clean: 3 x 3 from above knee",
          "Muscle clean: 3 x 5 for turnover speed"
        ],
        cues: ["Bar stays close to body", "Triple extension: hips, knees, ankles", "Fast elbows in the catch"]
      },
      {
        id: "squat-clean",
        name: "Squat Clean",
        level: 3,
        prereqs: ["power-clean"],
        milestone: "1.0x bodyweight squat clean",
        drills: [
          "Tall clean drill: 3 x 3 (pull under with no jump)",
          "Hang squat clean: 3 x 2 from mid-thigh",
          "Front squat + squat clean complex: 1+1 x 5 sets"
        ],
        cues: ["Pull yourself under the bar", "Receive in full depth front squat", "Meet the bar, don't crash into it"]
      },
      {
        id: "push-press",
        name: "Push Press",
        level: 1,
        prereqs: [],
        milestone: "0.75x bodyweight push press for 5 reps",
        drills: [
          "Dip drill: 3 x 10 (dip and hold, no drive)",
          "Push press from rack: 5 x 3",
          "Behind-the-neck push press for bar path awareness"
        ],
        cues: ["Vertical dip: torso stays upright", "Aggressive hip drive", "Press and reach at lockout"]
      },
      {
        id: "push-jerk",
        name: "Push Jerk",
        level: 2,
        prereqs: ["push-press"],
        milestone: "Bodyweight push jerk for a single",
        drills: [
          "Jerk dip + drive drill: no catch, just feel the drive",
          "Push jerk from behind neck: 3 x 3",
          "Jerk recovery holds: 3 x 10s in receiving position"
        ],
        cues: ["Dip and drive straight up", "Push yourself UNDER the bar", "Land with locked arms and bent knees"]
      },
      {
        id: "split-jerk",
        name: "Split Jerk",
        level: 3,
        prereqs: ["push-jerk"],
        milestone: "1.0x bodyweight split jerk",
        drills: [
          "Split stance press: 3 x 5 each leg forward",
          "Drop to split from tall position (no bar)",
          "Jerk balance: 3 x 3 (start in split, stand, dip, drive, re-split)"
        ],
        cues: ["Front shin vertical in split", "Back knee slightly bent", "Recover front foot first then back"]
      },
      {
        id: "power-snatch",
        name: "Power Snatch",
        level: 3,
        prereqs: ["overhead-squat", "power-clean"],
        milestone: "0.6x bodyweight power snatch",
        drills: [
          "Snatch grip deadlift: 3 x 5 for positions",
          "Hang power snatch: 3 x 3 from above knee",
          "Muscle snatch: 3 x 5 for bar path and turnover",
          "Snatch high pull: 3 x 3"
        ],
        cues: ["Wide grip, hook grip", "Bar traces the body the whole way", "Punch up into the catch", "Patience off the floor"]
      },
      {
        id: "squat-snatch",
        name: "Squat Snatch",
        level: 4,
        prereqs: ["power-snatch"],
        milestone: "0.75x bodyweight squat snatch",
        drills: [
          "Snatch balance: 3 x 3 (fast drop under)",
          "Hang squat snatch: 3 x 2",
          "Overhead squat + squat snatch complex: 1+1 x 5 sets",
          "Block snatches at varying heights"
        ],
        cues: ["Speed under the bar is everything", "Receive in full overhead squat", "Aggressive lockout at the bottom"]
      },
      {
        id: "clean-and-jerk",
        name: "Clean and Jerk",
        level: 5,
        prereqs: ["squat-clean", "split-jerk"],
        milestone: "1.25x bodyweight clean and jerk",
        drills: [
          "Clean + front squat + jerk complex",
          "Hang clean + jerk: 3 x (1+1)",
          "Jerk from blocks for heavy practice"
        ],
        cues: ["Treat it as two separate lifts", "Reset breath between clean and jerk", "Commit to the jerk drive"]
      },
      {
        id: "thruster",
        name: "Thruster",
        level: 2,
        prereqs: ["front-squat", "push-press"],
        milestone: "Bodyweight thruster for a single, 21 reps unbroken at 50% BW",
        drills: [
          "Front squat to press complex: 3 x 5 (pause at top of squat before pressing)",
          "Wall ball shots: 3 x 15 for patterning",
          "Thruster EMOM: 5 reps every 90s x 6 rounds"
        ],
        cues: ["Drive out of the squat into the press — one fluid motion", "Elbows stay high in the front rack", "Full hip extension before the bar leaves the shoulders"]
      },
      {
        id: "deadlift",
        name: "Deadlift",
        level: 1,
        prereqs: [],
        milestone: "1.5x bodyweight deadlift with solid form",
        drills: [
          "Romanian deadlift: 3 x 8 for hamstring patterning",
          "Pause deadlift: 3s at knee height x 5 reps",
          "Banded good mornings: 3 x 12 for hip hinge"
        ],
        cues: ["Push the floor away", "Bar drags up the shins and thighs", "Shoulders over or slightly ahead of the bar off the floor"]
      },
      {
        id: "hang-clean-overhead",
        name: "Hang Clean-to-Overhead",
        level: 3,
        prereqs: ["power-clean", "push-press"],
        milestone: "15 unbroken hang clean-to-overheads at 50/35 lb dumbbell",
        drills: [
          "DB hang power clean: 3 x 8 each arm",
          "DB push press: 3 x 8 each arm",
          "Hang clean-to-overhead EMOM: 8 reps every minute x 5"
        ],
        cues: ["Use the hip to drive the clean", "Catch and press in one rhythm", "Don't muscle it — stay efficient for high reps"]
      }
    ]
  }
};

const LEVEL_COLORS = {
  1: { bg: "#1a3a2a", border: "#2E7D32", text: "#6fcf7f", label: "Foundation" },
  2: { bg: "#1a2e3d", border: "#2E86AB", text: "#6fb8d9", label: "Developing" },
  3: { bg: "#2d1a2d", border: "#A23B72", text: "#d17aaf", label: "Intermediate" },
  4: { bg: "#2d1f0f", border: "#FF6B35", text: "#ffa070", label: "Advanced" },
  5: { bg: "#2a1a0a", border: "#E8C547", text: "#f0d96b", label: "Elite" },
};

const STORAGE_KEY = "crossfit-skill-tree-progress";
const WOD_SCORES_KEY = "crossfit-wod-scores";
const CUSTOM_WODS_KEY = "crossfit-custom-wods";
const USER_SETTINGS_KEY = "crossfit-user-settings";

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch { return {}; }
}

function saveProgressToStorage(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
  catch (e) { console.error("Failed to save progress:", e); }
}

function loadWodScores() {
  try {
    const saved = localStorage.getItem(WOD_SCORES_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch { return {}; }
}

function saveWodScores(data) {
  try { localStorage.setItem(WOD_SCORES_KEY, JSON.stringify(data)); }
  catch (e) { console.error("Failed to save WOD scores:", e); }
}

function loadCustomWods() {
  try {
    const saved = localStorage.getItem(CUSTOM_WODS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
}

function saveCustomWods(data) {
  try { localStorage.setItem(CUSTOM_WODS_KEY, JSON.stringify(data)); }
  catch (e) { console.error("Failed to save custom WODs:", e); }
}

function loadUserSettings() {
  try {
    const saved = localStorage.getItem(USER_SETTINGS_KEY);
    return saved ? JSON.parse(saved) : { name: "", weight: "", sex: "", age: "" };
  } catch { return { name: "", weight: "", sex: "", age: "" }; }
}

function saveUserSettings(data) {
  try { localStorage.setItem(USER_SETTINGS_KEY, JSON.stringify(data)); }
  catch (e) { console.error("Failed to save user settings:", e); }
}

function parseScoreForComparison(scoreStr, scoreType) {
  if (!scoreStr) return 0;
  switch (scoreType) {
    case "time": {
      const parts = scoreStr.split(":");
      return parseInt(parts[0] || 0) * 60 + parseInt(parts[1] || 0);
    }
    case "rounds_reps": {
      const parts = scoreStr.split("+");
      return parseInt(parts[0] || 0) * 1000 + parseInt(parts[1] || 0);
    }
    case "reps":
    case "load":
      return parseInt(scoreStr) || 0;
    default:
      return 0;
  }
}

function findPersonalBest(scores, scoreType) {
  if (!scores || scores.length === 0) return -1;
  return scores.reduce((bestIdx, score, idx, arr) => {
    const current = parseScoreForComparison(score.score, scoreType);
    const best = parseScoreForComparison(arr[bestIdx].score, scoreType);
    if (scoreType === "time") {
      return current < best ? idx : bestIdx;
    }
    return current > best ? idx : bestIdx;
  }, 0);
}

function formatScore(scoreStr, scoreType) {
  if (!scoreStr) return "";
  switch (scoreType) {
    case "time": return scoreStr;
    case "rounds_reps": {
      const [r, rp] = scoreStr.split("+");
      return `${r} rds + ${rp} reps`;
    }
    case "reps": return `${scoreStr} reps`;
    case "load": return `${scoreStr} kg`;
    default: return scoreStr;
  }
}

function formatTimerDisplay(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function todayStr() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

const SCORE_TYPE_LABELS = {
  time: "For Time",
  rounds_reps: "AMRAP",
  reps: "Total Reps",
  load: "Max Load",
};

// Shared panel style
const panelStyle = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  margin: "0 auto",
  width: "100%",
  maxWidth: 480,
  maxHeight: "calc(85dvh - env(safe-area-inset-top, 0px))",
  overflowY: "auto",
  WebkitOverflowScrolling: "touch",
  background: "#111215",
  borderRadius: "16px 16px 0 0",
  padding: "20px 16px calc(24px + env(safe-area-inset-bottom, 0px))",
  zIndex: 30,
  animation: "slideUp 0.3s ease forwards",
  boxShadow: "0 -20px 60px rgba(0,0,0,0.8)",
};

const sectionLabel = {
  fontSize: 10,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "#666",
  marginBottom: 8,
};

const inputStyle = {
  background: "#0d0e10",
  border: "1px solid #222",
  borderRadius: 8,
  padding: "10px 12px",
  color: "#e8e6e1",
  fontSize: 14,
  fontFamily: "'Barlow', sans-serif",
  fontWeight: 500,
  outline: "none",
  width: "100%",
};

export default function App() {
  // === Skill Tree State ===
  const [activeCategory, setActiveCategory] = useState("skipping");
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [unlockedSkills, setUnlockedSkills] = useState(loadProgress);

  // === Navigation State ===
  const [activeSection, setActiveSection] = useState("skills");

  // === WOD State ===
  const [wodSubTab, setWodSubTab] = useState("benchmark");
  const [selectedWod, setSelectedWod] = useState(null);
  const [wodScores, setWodScores] = useState(loadWodScores);
  const [customWods, setCustomWods] = useState(loadCustomWods);

  // === Timer State ===
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerElapsed, setTimerElapsed] = useState(0);
  const timerStartRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // === Score Form State ===
  const [scoreMinutes, setScoreMinutes] = useState("");
  const [scoreSeconds, setScoreSeconds] = useState("");
  const [scoreRounds, setScoreRounds] = useState("");
  const [scoreReps, setScoreReps] = useState("");
  const [scoreValue, setScoreValue] = useState("");
  const [scoreDate, setScoreDate] = useState(todayStr);
  const [scoreRxd, setScoreRxd] = useState(true);
  const [scoreNotes, setScoreNotes] = useState("");

  // === Create WOD State ===
  const [showCreateWod, setShowCreateWod] = useState(false);
  const [newWodName, setNewWodName] = useState("");
  const [newWodDescription, setNewWodDescription] = useState("");
  const [newWodScoreType, setNewWodScoreType] = useState("time");
  const [newWodTimeCap, setNewWodTimeCap] = useState("");

  // === Delete Confirmation ===
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // === User Settings State ===
  const [userSettings, setUserSettings] = useState(loadUserSettings);
  const [confirmReset, setConfirmReset] = useState(null);
  const [confirmDeleteScoreIdx, setConfirmDeleteScoreIdx] = useState(null);

  // === Skill Tree Logic ===
  const toggleSkill = useCallback((skillId) => {
    setUnlockedSkills((prev) => {
      const updated = { ...prev };
      if (updated[skillId]) { delete updated[skillId]; }
      else { updated[skillId] = Date.now(); }
      saveProgressToStorage(updated);
      return updated;
    });
  }, []);

  const category = SKILL_DATA[activeCategory];
  const skills = category.skills;
  const isUnlocked = (id) => !!unlockedSkills[id];
  const prereqsMet = (skill) =>
    skill.prereqs.length === 0 || skill.prereqs.every((p) => isUnlocked(p));
  const totalSkills = Object.values(SKILL_DATA).flatMap((c) => c.skills).length;
  const totalUnlocked = Object.keys(unlockedSkills).length;
  const levels = [1, 2, 3, 4, 5];

  // === Timer Logic ===
  const startTimer = useCallback(() => {
    const startTs = Date.now() - timerElapsed * 1000;
    timerStartRef.current = startTs;
    setTimerRunning(true);
    timerIntervalRef.current = setInterval(() => {
      setTimerElapsed(Math.floor((Date.now() - timerStartRef.current) / 1000));
    }, 100);
  }, [timerElapsed]);

  const stopTimer = useCallback(() => {
    clearInterval(timerIntervalRef.current);
    setTimerRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    clearInterval(timerIntervalRef.current);
    setTimerRunning(false);
    setTimerElapsed(0);
    timerStartRef.current = null;
  }, []);

  useEffect(() => {
    return () => clearInterval(timerIntervalRef.current);
  }, []);

  const logTimerAsScore = useCallback(() => {
    const mins = Math.floor(timerElapsed / 60);
    const secs = timerElapsed % 60;
    setScoreMinutes(String(mins));
    setScoreSeconds(String(secs).padStart(2, "0"));
  }, [timerElapsed]);

  // === Score Logic ===
  const resetScoreForm = useCallback(() => {
    setScoreMinutes("");
    setScoreSeconds("");
    setScoreRounds("");
    setScoreReps("");
    setScoreValue("");
    setScoreDate(todayStr());
    setScoreRxd(true);
    setScoreNotes("");
  }, []);

  const buildScoreString = useCallback((scoreType) => {
    switch (scoreType) {
      case "time": {
        const m = parseInt(scoreMinutes) || 0;
        const s = parseInt(scoreSeconds) || 0;
        if (m === 0 && s === 0) return null;
        return `${m}:${String(s).padStart(2, "0")}`;
      }
      case "rounds_reps": {
        const r = parseInt(scoreRounds) || 0;
        const rp = parseInt(scoreReps) || 0;
        if (r === 0 && rp === 0) return null;
        return `${r}+${rp}`;
      }
      case "reps":
      case "load": {
        const v = parseInt(scoreValue) || 0;
        if (v === 0) return null;
        return String(v);
      }
      default: return null;
    }
  }, [scoreMinutes, scoreSeconds, scoreRounds, scoreReps, scoreValue]);

  const logScore = useCallback((wodId, scoreType) => {
    const scoreStr = buildScoreString(scoreType);
    if (!scoreStr) return;
    const entry = {
      date: scoreDate || todayStr(),
      score: scoreStr,
      rxd: scoreRxd,
      notes: scoreNotes.trim(),
    };
    setWodScores((prev) => {
      const updated = { ...prev, [wodId]: [entry, ...(prev[wodId] || [])] };
      saveWodScores(updated);
      return updated;
    });
    resetScoreForm();
    resetTimer();
  }, [buildScoreString, scoreDate, scoreRxd, scoreNotes, resetScoreForm, resetTimer]);

  // === Custom WOD Logic ===
  const createCustomWod = useCallback(() => {
    if (!newWodName.trim()) return;
    const slug = newWodName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const id = `custom-${slug}-${Date.now()}`;
    const wod = {
      id,
      name: newWodName.trim(),
      category: "competition",
      scoreType: newWodScoreType,
      timeCap: newWodTimeCap ? parseInt(newWodTimeCap) : null,
      description: newWodDescription.trim(),
      isCustom: true,
    };
    setCustomWods((prev) => {
      const updated = [...prev, wod];
      saveCustomWods(updated);
      return updated;
    });
    setNewWodName("");
    setNewWodDescription("");
    setNewWodScoreType("time");
    setNewWodTimeCap("");
    setShowCreateWod(false);
  }, [newWodName, newWodDescription, newWodScoreType, newWodTimeCap]);

  const deleteCustomWod = useCallback((wodId) => {
    setCustomWods((prev) => {
      const updated = prev.filter((w) => w.id !== wodId);
      saveCustomWods(updated);
      return updated;
    });
    setWodScores((prev) => {
      const updated = { ...prev };
      delete updated[wodId];
      saveWodScores(updated);
      return updated;
    });
    setConfirmDeleteId(null);
    if (selectedWod?.id === wodId) setSelectedWod(null);
  }, [selectedWod]);

  // === User Settings Logic ===
  const updateSetting = useCallback((key, value) => {
    setUserSettings((prev) => {
      const updated = { ...prev, [key]: value };
      saveUserSettings(updated);
      return updated;
    });
  }, []);

  const deleteScoreEntry = useCallback((wodId, index) => {
    setWodScores((prev) => {
      const scores = [...(prev[wodId] || [])];
      scores.splice(index, 1);
      const updated = { ...prev };
      if (scores.length === 0) { delete updated[wodId]; }
      else { updated[wodId] = scores; }
      saveWodScores(updated);
      return updated;
    });
    setConfirmDeleteScoreIdx(null);
  }, []);

  const resetSkills = useCallback(() => {
    setUnlockedSkills({});
    saveProgressToStorage({});
    setConfirmReset(null);
  }, []);

  const resetWodScores = useCallback(() => {
    setWodScores({});
    saveWodScores({});
    setConfirmReset(null);
  }, []);

  const resetCustomWods = useCallback(() => {
    setCustomWods([]);
    saveCustomWods([]);
    setConfirmReset(null);
  }, []);

  const resetAll = useCallback(() => {
    setUnlockedSkills({});
    saveProgressToStorage({});
    setWodScores({});
    saveWodScores({});
    setCustomWods([]);
    saveCustomWods([]);
    setUserSettings({ name: "", weight: "", sex: "", age: "" });
    saveUserSettings({ name: "", weight: "", sex: "", age: "" });
    setConfirmReset(null);
  }, []);

  // Reset form when selecting a new WOD
  useEffect(() => {
    resetScoreForm();
    resetTimer();
    setConfirmDeleteScoreIdx(null);
  }, [selectedWod?.id]);

  // Total scores logged
  const totalScores = Object.values(wodScores).reduce((sum, arr) => sum + arr.length, 0);

  // WOD lists
  const benchmarkByCategory = {
    girls: BENCHMARK_WODS.filter((w) => w.category === "girls"),
    hero: BENCHMARK_WODS.filter((w) => w.category === "hero"),
    strength: BENCHMARK_WODS.filter((w) => w.category === "strength"),
  };
  const competitionWods = [...COMPETITION_WODS_PRELOADED, ...customWods];

  // Check if any panel is open
  const anyPanelOpen = selectedSkill || selectedWod || showCreateWod || confirmReset;

  return (
    <div style={{
      fontFamily: "'Barlow', 'Barlow Condensed', sans-serif",
      background: "#0a0b0d",
      color: "#e8e6e1",
      minHeight: "100vh",
      minHeight: "100dvh",
      maxWidth: 480,
      margin: "0 auto",
      paddingBottom: 80,
      WebkitUserSelect: "none",
      userSelect: "none",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        html, body { background: #0a0b0d; margin: 0; overscroll-behavior: none; }
        ::-webkit-scrollbar { display: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); }
      `}</style>

      {/* ============================================================ */}
      {/* SKILLS SECTION */}
      {/* ============================================================ */}
      {activeSection === "skills" && (
        <>
          {/* Header */}
          <div style={{
            padding: "max(env(safe-area-inset-top, 12px), 20px) 16px 12px",
            background: "linear-gradient(180deg, #111215 0%, #0a0b0d 100%)",
            position: "sticky",
            top: 0,
            zIndex: 20,
            borderBottom: "1px solid #1a1b1f",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h1 style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: 26,
                letterSpacing: "0.02em",
                textTransform: "uppercase",
                color: "#fff",
              }}>Skill Tree</h1>
              <span style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: "#666",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}>{totalUnlocked}/{totalSkills} unlocked</span>
            </div>

            <div style={{
              marginTop: 10,
              height: 3,
              background: "#1a1b1f",
              borderRadius: 2,
              overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                width: `${(totalUnlocked / totalSkills) * 100}%`,
                background: "linear-gradient(90deg, #2E7D32, #2E86AB, #A23B72, #FF6B35, #E8C547)",
                borderRadius: 2,
                transition: "width 0.5s ease",
              }} />
            </div>

            <div style={{
              display: "flex",
              gap: 6,
              marginTop: 14,
              overflowX: "auto",
            }}>
              {Object.entries(SKILL_DATA).map(([key, cat]) => {
                const active = key === activeCategory;
                const catCount = cat.skills.filter((s) => isUnlocked(s.id)).length;
                return (
                  <button
                    key={key}
                    onClick={() => { setActiveCategory(key); setSelectedSkill(null); }}
                    style={{
                      flex: 1,
                      padding: "8px 0",
                      background: active ? "#1a1b1f" : "transparent",
                      border: active ? "1px solid #2a2b2f" : "1px solid transparent",
                      borderRadius: 8,
                      color: active ? "#fff" : "#555",
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 600,
                      fontSize: 13,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <span>{cat.label}</span>
                    <span style={{ fontSize: 10, color: active ? "#666" : "#333" }}>{catCount}/{cat.skills.length}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Skill Tree Grid */}
          <div style={{ padding: "16px" }}>
            {levels.map((level) => {
              const levelSkills = skills.filter((s) => s.level === level);
              if (levelSkills.length === 0) return null;
              const lc = LEVEL_COLORS[level];
              return (
                <div key={level} style={{
                  marginBottom: 20,
                  animation: "fadeIn 0.4s ease forwards",
                  animationDelay: `${level * 0.05}s`,
                  opacity: 0,
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 10,
                  }}>
                    <span style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: lc.text,
                      opacity: 0.7,
                    }}>Level {level}</span>
                    <span style={{
                      fontSize: 9,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: lc.text,
                      opacity: 0.35,
                    }}>{lc.label}</span>
                    <div style={{ flex: 1, height: 1, background: lc.border, opacity: 0.15 }} />
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {levelSkills.map((skill) => {
                      const unlocked = isUnlocked(skill.id);
                      const ready = prereqsMet(skill);
                      const selected = selectedSkill?.id === skill.id;
                      return (
                        <button
                          key={skill.id}
                          onClick={() => setSelectedSkill(selected ? null : skill)}
                          style={{
                            flex: levelSkills.length === 1 ? "1 1 100%" : "1 1 calc(50% - 4px)",
                            minWidth: 0,
                            padding: "12px 14px",
                            background: unlocked
                              ? `linear-gradient(135deg, ${lc.bg}, ${lc.border}22)`
                              : selected ? "#151618" : "#0f1012",
                            border: `1.5px solid ${unlocked ? lc.border : selected ? "#333" : ready ? "#222" : "#161618"}`,
                            borderRadius: 10,
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "all 0.25s ease",
                            opacity: ready || unlocked ? 1 : 0.4,
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          {unlocked && (
                            <div style={{
                              position: "absolute",
                              top: 6,
                              right: 8,
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: lc.border,
                              boxShadow: `0 0 8px ${lc.border}66`,
                            }} />
                          )}
                          <div style={{
                            fontFamily: "'Barlow', sans-serif",
                            fontWeight: 700,
                            fontSize: 14,
                            color: unlocked ? lc.text : ready ? "#bbb" : "#555",
                            lineHeight: 1.2,
                            paddingRight: 16,
                          }}>{skill.name}</div>
                          {skill.prereqs.length > 0 && (
                            <div style={{
                              marginTop: 4,
                              fontSize: 10,
                              color: "#444",
                              fontWeight: 500,
                            }}>
                              Needs: {skill.prereqs.map((p) => {
                                const prereqSkill = Object.values(SKILL_DATA)
                                  .flatMap((c) => c.skills)
                                  .find((s) => s.id === p);
                                return prereqSkill?.name || p;
                              }).join(", ")}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Skill Detail Panel */}
          {selectedSkill && (
            <div
              onClick={() => setSelectedSkill(null)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                zIndex: 25,
              }}
            />
          )}
          {selectedSkill && (
            <div style={{
              ...panelStyle,
              borderTop: `2px solid ${LEVEL_COLORS[selectedSkill.level].border}`,
            }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: "#333", margin: "0 auto 16px" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <h2 style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                    fontSize: 22,
                    color: LEVEL_COLORS[selectedSkill.level].text,
                    textTransform: "uppercase",
                    letterSpacing: "0.02em",
                  }}>{selectedSkill.name}</h2>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#555",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}>Level {selectedSkill.level} / {LEVEL_COLORS[selectedSkill.level].label}</span>
                </div>
                <button
                  onClick={() => setSelectedSkill(null)}
                  style={{ background: "none", border: "none", color: "#555", fontSize: 22, cursor: "pointer", padding: "4px 8px", lineHeight: 1 }}
                >x</button>
              </div>

              <div style={{
                background: `${LEVEL_COLORS[selectedSkill.level].border}11`,
                border: `1px solid ${LEVEL_COLORS[selectedSkill.level].border}33`,
                borderRadius: 10,
                padding: "12px 14px",
                marginBottom: 16,
              }}>
                <div style={{ ...sectionLabel, color: LEVEL_COLORS[selectedSkill.level].text, opacity: 0.7 }}>Milestone to unlock</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#ccc", lineHeight: 1.4 }}>{selectedSkill.milestone}</div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={sectionLabel}>Recommended drills</div>
                {selectedSkill.drills.map((drill, i) => (
                  <div key={i} style={{
                    padding: "10px 12px",
                    background: "#0d0e10",
                    borderRadius: 8,
                    marginBottom: 4,
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#aaa",
                    lineHeight: 1.4,
                    borderLeft: `2px solid ${LEVEL_COLORS[selectedSkill.level].border}33`,
                  }}>{drill}</div>
                ))}
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={sectionLabel}>Coaching cues</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {selectedSkill.cues.map((cue, i) => (
                    <span key={i} style={{
                      padding: "6px 10px",
                      background: "#0d0e10",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      color: LEVEL_COLORS[selectedSkill.level].text,
                      opacity: 0.8,
                    }}>{cue}</span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => toggleSkill(selectedSkill.id)}
                disabled={!prereqsMet(selectedSkill) && !isUnlocked(selectedSkill.id)}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: 10,
                  border: "none",
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: 15,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  cursor: prereqsMet(selectedSkill) || isUnlocked(selectedSkill.id) ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                  ...(isUnlocked(selectedSkill.id)
                    ? { background: "transparent", color: "#666", border: "1px solid #333" }
                    : prereqsMet(selectedSkill)
                    ? { background: `linear-gradient(135deg, ${LEVEL_COLORS[selectedSkill.level].border}, ${LEVEL_COLORS[selectedSkill.level].border}aa)`, color: "#fff" }
                    : { background: "#1a1b1f", color: "#333" }),
                }}
              >
                {isUnlocked(selectedSkill.id)
                  ? "Mark as locked"
                  : prereqsMet(selectedSkill)
                  ? "Mark as unlocked"
                  : "Complete prerequisites first"}
              </button>
            </div>
          )}
        </>
      )}

      {/* ============================================================ */}
      {/* WODS SECTION */}
      {/* ============================================================ */}
      {activeSection === "wods" && (
        <>
          {/* WOD Header */}
          <div style={{
            padding: "max(env(safe-area-inset-top, 12px), 20px) 16px 12px",
            background: "linear-gradient(180deg, #111215 0%, #0a0b0d 100%)",
            position: "sticky",
            top: 0,
            zIndex: 20,
            borderBottom: "1px solid #1a1b1f",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h1 style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: 26,
                letterSpacing: "0.02em",
                textTransform: "uppercase",
                color: "#fff",
              }}>WOD Tracker</h1>
              <span style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: "#666",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}>{totalScores} scores logged</span>
            </div>

            {/* Sub-tabs */}
            <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
              {[
                { key: "benchmark", label: "Benchmark" },
                { key: "competition", label: "Competition" },
              ].map(({ key, label }) => {
                const active = key === wodSubTab;
                return (
                  <button
                    key={key}
                    onClick={() => { setWodSubTab(key); setSelectedWod(null); }}
                    style={{
                      flex: 1,
                      padding: "8px 0",
                      background: active ? "#1a1b1f" : "transparent",
                      border: active ? "1px solid #2a2b2f" : "1px solid transparent",
                      borderRadius: 8,
                      color: active ? "#fff" : "#555",
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 600,
                      fontSize: 14,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >{label}</button>
                );
              })}
            </div>
          </div>

          {/* WOD Lists */}
          <div style={{ padding: "16px" }}>

            {/* Benchmark WODs */}
            {wodSubTab === "benchmark" && Object.entries(benchmarkByCategory).map(([catKey, wods], catIdx) => {
              const cat = WOD_CATEGORIES[catKey];
              return (
                <div key={catKey} style={{
                  marginBottom: 20,
                  animation: "fadeIn 0.4s ease forwards",
                  animationDelay: `${catIdx * 0.05}s`,
                  opacity: 0,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: cat.text,
                      opacity: 0.7,
                    }}>{cat.label}</span>
                    <div style={{ flex: 1, height: 1, background: cat.accent, opacity: 0.15 }} />
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {wods.map((wod) => {
                      const hasScores = (wodScores[wod.id] || []).length > 0;
                      const scoreCount = (wodScores[wod.id] || []).length;
                      return (
                        <button
                          key={wod.id}
                          onClick={() => setSelectedWod(wod)}
                          style={{
                            flex: "1 1 calc(50% - 4px)",
                            minWidth: 0,
                            padding: "12px 14px",
                            background: hasScores
                              ? `linear-gradient(135deg, ${cat.bg}, ${cat.accent}22)`
                              : "#0f1012",
                            border: `1.5px solid ${hasScores ? cat.accent : "#222"}`,
                            borderRadius: 10,
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "all 0.25s ease",
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          {hasScores && (
                            <div style={{
                              position: "absolute",
                              top: 6,
                              right: 8,
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: "#E8C547",
                              boxShadow: "0 0 8px #E8C54766",
                            }} />
                          )}
                          <div style={{
                            fontFamily: "'Barlow', sans-serif",
                            fontWeight: 700,
                            fontSize: 14,
                            color: hasScores ? cat.text : "#bbb",
                            lineHeight: 1.2,
                            paddingRight: 16,
                          }}>{wod.name}</div>
                          <div style={{
                            marginTop: 4,
                            fontSize: 10,
                            color: "#444",
                            fontWeight: 500,
                          }}>{hasScores ? `${scoreCount} score${scoreCount !== 1 ? "s" : ""}` : SCORE_TYPE_LABELS[wod.scoreType]}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Competition WODs */}
            {wodSubTab === "competition" && (
              <div style={{ animation: "fadeIn 0.4s ease forwards" }}>
                {/* Add WOD button */}
                <button
                  onClick={() => setShowCreateWod(true)}
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: "transparent",
                    border: "1.5px dashed #333",
                    borderRadius: 10,
                    color: "#666",
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 600,
                    fontSize: 14,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    cursor: "pointer",
                    marginBottom: 16,
                    transition: "all 0.2s",
                  }}
                >+ Add Custom WOD</button>

                {/* Competition WOD list */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {competitionWods.map((wod) => {
                    const hasScores = (wodScores[wod.id] || []).length > 0;
                    const scoreCount = (wodScores[wod.id] || []).length;
                    const cat = WOD_CATEGORIES.competition;
                    const isCustom = wod.isCustom;
                    return (
                      <div key={wod.id} style={{
                        flex: "1 1 calc(50% - 4px)",
                        minWidth: 0,
                        position: "relative",
                      }}>
                        <button
                          onClick={() => setSelectedWod(wod)}
                          style={{
                            width: "100%",
                            padding: "12px 14px",
                            background: hasScores
                              ? `linear-gradient(135deg, ${cat.bg}, ${cat.accent}22)`
                              : "#0f1012",
                            border: `1.5px solid ${hasScores ? cat.accent : "#222"}`,
                            borderRadius: 10,
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "all 0.25s ease",
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          {hasScores && (
                            <div style={{
                              position: "absolute",
                              top: 6,
                              right: 8,
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: "#E8C547",
                              boxShadow: "0 0 8px #E8C54766",
                            }} />
                          )}
                          <div style={{
                            fontFamily: "'Barlow', sans-serif",
                            fontWeight: 700,
                            fontSize: 14,
                            color: hasScores ? cat.text : "#bbb",
                            lineHeight: 1.2,
                            paddingRight: 16,
                          }}>{wod.name}</div>
                          <div style={{ display: "flex", gap: 6, marginTop: 4, alignItems: "center" }}>
                            {isCustom && (
                              <span style={{
                                fontSize: 9,
                                fontWeight: 700,
                                color: "#E8C547",
                                textTransform: "uppercase",
                                letterSpacing: "0.04em",
                              }}>Custom</span>
                            )}
                            <span style={{ fontSize: 10, color: "#444", fontWeight: 500 }}>
                              {hasScores ? `${scoreCount} score${scoreCount !== 1 ? "s" : ""}` : SCORE_TYPE_LABELS[wod.scoreType]}
                            </span>
                          </div>
                        </button>

                        {/* Delete button for custom WODs */}
                        {isCustom && (
                          <>
                            {confirmDeleteId === wod.id ? (
                              <div style={{
                                position: "absolute",
                                inset: 0,
                                background: "rgba(17,18,21,0.95)",
                                borderRadius: 10,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                                padding: 8,
                              }}>
                                <span style={{ fontSize: 11, color: "#aaa", fontWeight: 600 }}>Delete?</span>
                                <div style={{ display: "flex", gap: 6 }}>
                                  <button
                                    onClick={() => deleteCustomWod(wod.id)}
                                    style={{
                                      padding: "4px 12px",
                                      background: "#FF6B35",
                                      border: "none",
                                      borderRadius: 6,
                                      color: "#fff",
                                      fontSize: 11,
                                      fontWeight: 700,
                                      cursor: "pointer",
                                    }}
                                  >Yes</button>
                                  <button
                                    onClick={() => setConfirmDeleteId(null)}
                                    style={{
                                      padding: "4px 12px",
                                      background: "#1a1b1f",
                                      border: "1px solid #333",
                                      borderRadius: 6,
                                      color: "#888",
                                      fontSize: 11,
                                      fontWeight: 700,
                                      cursor: "pointer",
                                    }}
                                  >No</button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(wod.id); }}
                                style={{
                                  position: "absolute",
                                  top: 4,
                                  right: 4,
                                  width: 20,
                                  height: 20,
                                  background: "none",
                                  border: "none",
                                  color: "#444",
                                  fontSize: 12,
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  lineHeight: 1,
                                }}
                              >x</button>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* WOD Detail Panel Backdrop */}
          {(selectedWod || showCreateWod) && (
            <div
              onClick={() => { setSelectedWod(null); setShowCreateWod(false); }}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                zIndex: 25,
              }}
            />
          )}

          {/* WOD Detail Panel */}
          {selectedWod && (
            <div style={{
              ...panelStyle,
              borderTop: `2px solid ${WOD_CATEGORIES[selectedWod.category]?.accent || "#A23B72"}`,
            }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: "#333", margin: "0 auto 16px" }} />

              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <h2 style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                    fontSize: 22,
                    color: "#fff",
                    textTransform: "uppercase",
                    letterSpacing: "0.02em",
                  }}>{selectedWod.name}</h2>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 2 }}>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: WOD_CATEGORIES[selectedWod.category]?.text || "#d17aaf",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}>{WOD_CATEGORIES[selectedWod.category]?.label || "Competition"}</span>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: "#555",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}>{SCORE_TYPE_LABELS[selectedWod.scoreType]}{selectedWod.timeCap ? ` / ${selectedWod.timeCap} min cap` : ""}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedWod(null)}
                  style={{ background: "none", border: "none", color: "#555", fontSize: 22, cursor: "pointer", padding: "4px 8px", lineHeight: 1 }}
                >x</button>
              </div>

              {/* Description */}
              <div style={{
                background: `${WOD_CATEGORIES[selectedWod.category]?.accent || "#A23B72"}11`,
                border: `1px solid ${WOD_CATEGORIES[selectedWod.category]?.accent || "#A23B72"}33`,
                borderRadius: 10,
                padding: "12px 14px",
                marginBottom: 16,
              }}>
                <div style={{ ...sectionLabel, color: WOD_CATEGORIES[selectedWod.category]?.text || "#d17aaf", opacity: 0.7 }}>Workout</div>
                <div style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#ccc",
                  lineHeight: 1.5,
                  whiteSpace: "pre-line",
                }}>{selectedWod.description}</div>
              </div>

              {/* Timer (for time-based WODs) */}
              {selectedWod.scoreType === "time" && (
                <div style={{ marginBottom: 16, textAlign: "center" }}>
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 48,
                    fontWeight: 700,
                    color: timerRunning ? "#E8C547" : "#e8e6e1",
                    letterSpacing: "0.02em",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: 1,
                    marginBottom: 12,
                  }}>{formatTimerDisplay(timerElapsed)}</div>
                  <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                    <button
                      onClick={timerRunning ? stopTimer : startTimer}
                      style={{
                        padding: "8px 24px",
                        background: timerRunning ? "#FF6B35" : "#2E7D32",
                        border: "none",
                        borderRadius: 8,
                        color: "#fff",
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 700,
                        fontSize: 14,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        cursor: "pointer",
                      }}
                    >{timerRunning ? "Stop" : "Start"}</button>
                    <button
                      onClick={resetTimer}
                      style={{
                        padding: "8px 16px",
                        background: "#1a1b1f",
                        border: "1px solid #333",
                        borderRadius: 8,
                        color: "#888",
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 700,
                        fontSize: 14,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        cursor: "pointer",
                      }}
                    >Reset</button>
                  </div>
                  {!timerRunning && timerElapsed > 0 && (
                    <button
                      onClick={logTimerAsScore}
                      style={{
                        marginTop: 8,
                        padding: "6px 16px",
                        background: "transparent",
                        border: "1px solid #E8C547",
                        borderRadius: 8,
                        color: "#E8C547",
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 600,
                        fontSize: 12,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        cursor: "pointer",
                      }}
                    >Log this time</button>
                  )}
                </div>
              )}

              {/* Score Input Form */}
              <div style={{ marginBottom: 16 }}>
                <div style={sectionLabel}>Log Score</div>

                {/* Score inputs by type */}
                {selectedWod.scoreType === "time" && (
                  <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <div style={{ flex: 1 }}>
                      <input
                        type="number"
                        inputMode="numeric"
                        placeholder="Min"
                        value={scoreMinutes}
                        onChange={(e) => setScoreMinutes(e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", color: "#555", fontWeight: 700, fontSize: 18 }}>:</div>
                    <div style={{ flex: 1 }}>
                      <input
                        type="number"
                        inputMode="numeric"
                        placeholder="Sec"
                        value={scoreSeconds}
                        onChange={(e) => setScoreSeconds(e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                )}
                {selectedWod.scoreType === "rounds_reps" && (
                  <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                      <input
                        type="number"
                        inputMode="numeric"
                        placeholder="Rounds"
                        value={scoreRounds}
                        onChange={(e) => setScoreRounds(e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                    <span style={{ color: "#555", fontWeight: 700, fontSize: 14 }}>+</span>
                    <div style={{ flex: 1 }}>
                      <input
                        type="number"
                        inputMode="numeric"
                        placeholder="Reps"
                        value={scoreReps}
                        onChange={(e) => setScoreReps(e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                )}
                {(selectedWod.scoreType === "reps" || selectedWod.scoreType === "load") && (
                  <div style={{ marginBottom: 8 }}>
                    <input
                      type="number"
                      inputMode="numeric"
                      placeholder={selectedWod.scoreType === "reps" ? "Total reps" : "Total kg"}
                      value={scoreValue}
                      onChange={(e) => setScoreValue(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                )}

                {/* Date */}
                <div style={{ marginBottom: 8 }}>
                  <input
                    type="date"
                    value={scoreDate}
                    onChange={(e) => setScoreDate(e.target.value)}
                    style={{ ...inputStyle, colorScheme: "dark" }}
                  />
                </div>

                {/* Rx / Scaled toggle */}
                <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                  <button
                    onClick={() => setScoreRxd(true)}
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: 8,
                      border: "none",
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700,
                      fontSize: 13,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      cursor: "pointer",
                      background: scoreRxd ? "#E8C547" : "#1a1b1f",
                      color: scoreRxd ? "#000" : "#555",
                      transition: "all 0.2s",
                    }}
                  >Rx'd</button>
                  <button
                    onClick={() => setScoreRxd(false)}
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: 8,
                      border: "none",
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700,
                      fontSize: 13,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      cursor: "pointer",
                      background: !scoreRxd ? "#666" : "#1a1b1f",
                      color: !scoreRxd ? "#fff" : "#555",
                      transition: "all 0.2s",
                    }}
                  >Scaled</button>
                </div>

                {/* Notes */}
                <div style={{ marginBottom: 8 }}>
                  <input
                    type="text"
                    placeholder="Notes (optional)"
                    value={scoreNotes}
                    onChange={(e) => setScoreNotes(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                {/* Submit */}
                <button
                  onClick={() => logScore(selectedWod.id, selectedWod.scoreType)}
                  disabled={!buildScoreString(selectedWod.scoreType)}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: 10,
                    border: "none",
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                    fontSize: 15,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    cursor: buildScoreString(selectedWod.scoreType) ? "pointer" : "not-allowed",
                    background: buildScoreString(selectedWod.scoreType)
                      ? "linear-gradient(135deg, #E8C547, #E8C547aa)"
                      : "#1a1b1f",
                    color: buildScoreString(selectedWod.scoreType) ? "#000" : "#333",
                    transition: "all 0.2s",
                  }}
                >Log Score</button>
              </div>

              {/* Score History */}
              {(wodScores[selectedWod.id] || []).length > 0 && (
                <div>
                  <div style={sectionLabel}>History ({(wodScores[selectedWod.id] || []).length})</div>
                  {(() => {
                    const scores = wodScores[selectedWod.id] || [];
                    const pbIdx = findPersonalBest(scores, selectedWod.scoreType);
                    return scores.map((entry, i) => {
                      const isPB = i === pbIdx;
                      const isConfirmingDelete = confirmDeleteScoreIdx === i;
                      return (
                        <div key={i} style={{
                          padding: "10px 12px",
                          background: isConfirmingDelete ? "#1a0a0a" : isPB ? "#2a1a0a" : "#0d0e10",
                          borderRadius: 8,
                          marginBottom: 4,
                          borderLeft: isConfirmingDelete ? "3px solid #e74c3c" : isPB ? "3px solid #E8C547" : "3px solid transparent",
                          transition: "all 0.2s",
                        }}>
                          {isConfirmingDelete ? (
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontSize: 12, color: "#e74c3c", fontWeight: 600 }}>Delete this entry?</span>
                              <div style={{ display: "flex", gap: 6 }}>
                                <button
                                  onClick={() => deleteScoreEntry(selectedWod.id, i)}
                                  style={{
                                    padding: "4px 12px",
                                    borderRadius: 6,
                                    border: "none",
                                    background: "#e74c3c",
                                    color: "#fff",
                                    fontSize: 11,
                                    fontWeight: 700,
                                    fontFamily: "'Barlow Condensed', sans-serif",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.04em",
                                    cursor: "pointer",
                                  }}
                                >Delete</button>
                                <button
                                  onClick={() => setConfirmDeleteScoreIdx(null)}
                                  style={{
                                    padding: "4px 12px",
                                    borderRadius: 6,
                                    border: "1px solid #333",
                                    background: "transparent",
                                    color: "#666",
                                    fontSize: 11,
                                    fontWeight: 700,
                                    fontFamily: "'Barlow Condensed', sans-serif",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.04em",
                                    cursor: "pointer",
                                  }}
                                >Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <span style={{
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: isPB ? "#E8C547" : "#ccc",
                                    fontVariantNumeric: "tabular-nums",
                                  }}>{formatScore(entry.score, selectedWod.scoreType)}</span>
                                  {isPB && (
                                    <span style={{
                                      fontSize: 9,
                                      fontWeight: 700,
                                      color: "#E8C547",
                                      textTransform: "uppercase",
                                      letterSpacing: "0.04em",
                                    }}>PB</span>
                                  )}
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                  <span style={{
                                    padding: "2px 6px",
                                    borderRadius: 4,
                                    fontSize: 9,
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.04em",
                                    background: entry.rxd ? "#E8C54733" : "#33333366",
                                    color: entry.rxd ? "#E8C547" : "#888",
                                  }}>{entry.rxd ? "Rx" : "SC"}</span>
                                  <span style={{ fontSize: 11, color: "#555", fontWeight: 500 }}>{formatDate(entry.date)}</span>
                                  <button
                                    onClick={() => setConfirmDeleteScoreIdx(i)}
                                    style={{
                                      background: "none",
                                      border: "none",
                                      color: "#333",
                                      fontSize: 14,
                                      cursor: "pointer",
                                      padding: "2px 4px",
                                      lineHeight: 1,
                                    }}
                                    title="Delete entry"
                                  >&times;</button>
                                </div>
                              </div>
                              {entry.notes && (
                                <div style={{
                                  marginTop: 4,
                                  fontSize: 11,
                                  color: "#555",
                                  fontStyle: "italic",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}>{entry.notes}</div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              )}
            </div>
          )}

          {/* Create Custom WOD Panel */}
          {showCreateWod && (
            <div style={{
              ...panelStyle,
              borderTop: "2px solid #E8C547",
            }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: "#333", margin: "0 auto 16px" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <h2 style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: 22,
                  color: "#E8C547",
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                }}>New WOD</h2>
                <button
                  onClick={() => setShowCreateWod(false)}
                  style={{ background: "none", border: "none", color: "#555", fontSize: 22, cursor: "pointer", padding: "4px 8px", lineHeight: 1 }}
                >x</button>
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={sectionLabel}>Name</div>
                <input
                  type="text"
                  placeholder='e.g. "Open 25.1"'
                  value={newWodName}
                  onChange={(e) => setNewWodName(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={sectionLabel}>Description</div>
                <textarea
                  placeholder="Workout details..."
                  value={newWodDescription}
                  onChange={(e) => setNewWodDescription(e.target.value)}
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical", lineHeight: 1.4 }}
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={sectionLabel}>Score Type</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {Object.entries(SCORE_TYPE_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setNewWodScoreType(key)}
                      style={{
                        flex: "1 1 calc(50% - 3px)",
                        padding: "8px",
                        borderRadius: 8,
                        border: "none",
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 600,
                        fontSize: 12,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        cursor: "pointer",
                        background: key === newWodScoreType ? "#E8C547" : "#1a1b1f",
                        color: key === newWodScoreType ? "#000" : "#555",
                        transition: "all 0.2s",
                      }}
                    >{label}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={sectionLabel}>Time Cap (optional)</div>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="Minutes"
                  value={newWodTimeCap}
                  onChange={(e) => setNewWodTimeCap(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={createCustomWod}
                  disabled={!newWodName.trim()}
                  style={{
                    flex: 1,
                    padding: "14px",
                    borderRadius: 10,
                    border: "none",
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                    fontSize: 15,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    cursor: newWodName.trim() ? "pointer" : "not-allowed",
                    background: newWodName.trim() ? "linear-gradient(135deg, #E8C547, #E8C547aa)" : "#1a1b1f",
                    color: newWodName.trim() ? "#000" : "#333",
                    transition: "all 0.2s",
                  }}
                >Create WOD</button>
                <button
                  onClick={() => setShowCreateWod(false)}
                  style={{
                    padding: "14px 20px",
                    borderRadius: 10,
                    border: "1px solid #333",
                    background: "transparent",
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                    fontSize: 15,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "#666",
                    cursor: "pointer",
                  }}
                >Cancel</button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ============================================================ */}
      {/* SETTINGS SECTION */}
      {/* ============================================================ */}
      {activeSection === "settings" && (
        <>
          {/* Header */}
          <div style={{ padding: "16px 16px 8px" }}>
            <h1 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800,
              fontSize: 28,
              textTransform: "uppercase",
              letterSpacing: "0.02em",
              color: "#E8C547",
            }}>Settings</h1>
          </div>

          <div style={{ padding: "0 16px 16px" }}>
            {/* Profile Section */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ ...sectionLabel, marginBottom: 12 }}>Profile</div>

              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#777", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>Name</div>
                <input
                  type="text"
                  placeholder="Your name"
                  value={userSettings.name}
                  onChange={(e) => updateSetting("name", e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#777", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>Weight (kg)</div>
                  <input
                    type="number"
                    inputMode="decimal"
                    placeholder="kg"
                    value={userSettings.weight}
                    onChange={(e) => updateSetting("weight", e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#777", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>Age</div>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="Years"
                    value={userSettings.age}
                    onChange={(e) => updateSetting("age", e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#777", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>Sex</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {["Male", "Female"].map((option) => (
                    <button
                      key={option}
                      onClick={() => updateSetting("sex", option.toLowerCase())}
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: 8,
                        border: "none",
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 600,
                        fontSize: 13,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        cursor: "pointer",
                        background: userSettings.sex === option.toLowerCase() ? "#E8C547" : "#1a1b1f",
                        color: userSettings.sex === option.toLowerCase() ? "#000" : "#555",
                        transition: "all 0.2s",
                      }}
                    >{option}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Data Management Section */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ ...sectionLabel, marginBottom: 12 }}>Data Management</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { key: "skills", label: "Reset Skills Progress", desc: `${totalUnlocked} skills unlocked`, action: resetSkills, color: "#E8C547" },
                  { key: "scores", label: "Reset WOD Scores", desc: `${totalScores} scores logged`, action: resetWodScores, color: "#E8C547" },
                  { key: "custom", label: "Reset Custom WODs", desc: `${customWods.length} custom WODs`, action: resetCustomWods, color: "#E8C547" },
                  { key: "all", label: "Reset Everything", desc: "All data will be erased", action: resetAll, color: "#e74c3c" },
                ].map(({ key, label, desc, color }) => (
                  <button
                    key={key}
                    onClick={() => setConfirmReset(key)}
                    style={{
                      padding: "12px 14px",
                      borderRadius: 8,
                      border: key === "all" ? "1px solid #e74c3c44" : "1px solid #222",
                      background: key === "all" ? "#1a0a0a" : "#0d0e10",
                      cursor: "pointer",
                      textAlign: "left",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 600,
                        fontSize: 14,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        color: color,
                      }}>{label}</div>
                      <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{desc}</div>
                    </div>
                    <span style={{ color: "#333", fontSize: 16 }}>&rsaquo;</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reset Confirmation Panel */}
          {confirmReset && (
            <>
              <div
                onClick={() => setConfirmReset(null)}
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.7)",
                  zIndex: 25,
                  animation: "fadeIn 0.2s ease",
                }}
              />
              <div style={{
                ...panelStyle,
                borderTop: confirmReset === "all" ? "2px solid #e74c3c" : "2px solid #E8C547",
                maxHeight: "40dvh",
              }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: "#333", margin: "0 auto 16px" }} />
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                  <h3 style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                    fontSize: 20,
                    color: confirmReset === "all" ? "#e74c3c" : "#E8C547",
                    textTransform: "uppercase",
                    letterSpacing: "0.02em",
                    marginBottom: 8,
                  }}>
                    {{ skills: "Reset Skills?", scores: "Reset Scores?", custom: "Reset Custom WODs?", all: "Reset Everything?" }[confirmReset]}
                  </h3>
                  <p style={{ fontSize: 13, color: "#888", lineHeight: 1.4 }}>
                    {{ skills: "All skill progress will be cleared. This cannot be undone.", scores: "All logged WOD scores will be deleted. This cannot be undone.", custom: "All custom WODs and their scores will be removed. This cannot be undone.", all: "All skills, scores, custom WODs, and profile data will be erased. This cannot be undone." }[confirmReset]}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => {
                      ({ skills: resetSkills, scores: resetWodScores, custom: resetCustomWods, all: resetAll })[confirmReset]();
                    }}
                    style={{
                      flex: 1,
                      padding: "14px",
                      borderRadius: 10,
                      border: "none",
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700,
                      fontSize: 15,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      cursor: "pointer",
                      background: confirmReset === "all" ? "#e74c3c" : "linear-gradient(135deg, #E8C547, #E8C547aa)",
                      color: confirmReset === "all" ? "#fff" : "#000",
                    }}
                  >Confirm</button>
                  <button
                    onClick={() => setConfirmReset(null)}
                    style={{
                      padding: "14px 20px",
                      borderRadius: 10,
                      border: "1px solid #333",
                      background: "transparent",
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700,
                      fontSize: 15,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: "#666",
                      cursor: "pointer",
                    }}
                  >Cancel</button>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* ============================================================ */}
      {/* BOTTOM NAVIGATION */}
      {/* ============================================================ */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        margin: "0 auto",
        width: "100%",
        maxWidth: 480,
        background: "#111215",
        borderTop: "1px solid #1a1b1f",
        display: "flex",
        zIndex: anyPanelOpen ? 10 : 20,
        padding: `8px 0 calc(8px + env(safe-area-inset-bottom, 0px))`,
      }}>
        {[
          { key: "skills", label: "Skills", icon: "\u25B3" },
          { key: "wods", label: "WODs", icon: "\u23F1" },
          { key: "settings", label: "Settings", icon: "\u2699" },
        ].map(({ key, label, icon }) => {
          const active = key === activeSection;
          return (
            <button
              key={key}
              onClick={() => {
                setActiveSection(key);
                setSelectedSkill(null);
                setSelectedWod(null);
                setShowCreateWod(false);
                setConfirmReset(null);
              }}
              style={{
                flex: 1,
                padding: "6px 0",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <span style={{
                fontSize: 18,
                color: active ? "#E8C547" : "#444",
                transition: "color 0.2s",
              }}>{icon}</span>
              <span style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: active ? "#E8C547" : "#444",
                transition: "color 0.2s",
              }}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
