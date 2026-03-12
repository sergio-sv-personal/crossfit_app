import { useState, useEffect, useCallback } from "react";

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

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function saveProgressToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save progress:", e);
  }
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState("skipping");
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [unlockedSkills, setUnlockedSkills] = useState(loadProgress);

  const toggleSkill = useCallback((skillId) => {
    setUnlockedSkills((prev) => {
      const updated = { ...prev };
      if (updated[skillId]) {
        delete updated[skillId];
      } else {
        updated[skillId] = Date.now();
      }
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

  return (
    <div style={{
      fontFamily: "'Barlow', 'Barlow Condensed', sans-serif",
      background: "#0a0b0d",
      color: "#e8e6e1",
      minHeight: "100vh",
      minHeight: "100dvh",
      maxWidth: 480,
      margin: "0 auto",
      paddingBottom: 100,
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
      `}</style>

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

        {/* Progress bar */}
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

        {/* Category tabs */}
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

      {/* Skill Tree */}
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

              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
              }}>
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

      {/* Backdrop */}
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

      {/* Skill Detail Panel */}
      {selectedSkill && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: 480,
            maxHeight: "75vh",
            overflowY: "auto",
            background: "#111215",
            borderTop: `2px solid ${LEVEL_COLORS[selectedSkill.level].border}`,
            borderRadius: "16px 16px 0 0",
            padding: "20px 16px calc(32px + env(safe-area-inset-bottom, 0px))",
            zIndex: 30,
            animation: "slideUp 0.3s ease forwards",
            boxShadow: "0 -20px 60px rgba(0,0,0,0.8)",
          }}
        >
          {/* Handle */}
          <div style={{
            width: 36,
            height: 4,
            borderRadius: 2,
            background: "#333",
            margin: "0 auto 16px",
          }} />

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
              style={{
                background: "none",
                border: "none",
                color: "#555",
                fontSize: 22,
                cursor: "pointer",
                padding: "4px 8px",
                lineHeight: 1,
              }}
            >x</button>
          </div>

          {/* Milestone */}
          <div style={{
            background: `${LEVEL_COLORS[selectedSkill.level].border}11`,
            border: `1px solid ${LEVEL_COLORS[selectedSkill.level].border}33`,
            borderRadius: 10,
            padding: "12px 14px",
            marginBottom: 16,
          }}>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: LEVEL_COLORS[selectedSkill.level].text,
              marginBottom: 6,
              opacity: 0.7,
            }}>Milestone to unlock</div>
            <div style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#ccc",
              lineHeight: 1.4,
            }}>{selectedSkill.milestone}</div>
          </div>

          {/* Drills */}
          <div style={{ marginBottom: 16 }}>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "#666",
              marginBottom: 8,
            }}>Recommended drills</div>
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

          {/* Cues */}
          <div style={{ marginBottom: 20 }}>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "#666",
              marginBottom: 8,
            }}>Coaching cues</div>
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

          {/* Toggle button */}
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
                ? {
                    background: "transparent",
                    color: "#666",
                    border: "1px solid #333",
                  }
                : prereqsMet(selectedSkill)
                ? {
                    background: `linear-gradient(135deg, ${LEVEL_COLORS[selectedSkill.level].border}, ${LEVEL_COLORS[selectedSkill.level].border}aa)`,
                    color: "#fff",
                  }
                : {
                    background: "#1a1b1f",
                    color: "#333",
                  }),
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
    </div>
  );
}
