import { useState, useEffect, useCallback } from "react";

/* ─── CrispyPT Athletic Levels Data ─── */

const SKILL_DATA = {
  gymnastics: {
    label: "Gymnastics",
    skills: [
      {
        id: "squat",
        name: "Squat",
        benchmarks: {
          1: { m: "Air Squat: 40 in 2 min", w: "Air Squat: 40 in 2 min" },
          2: { m: "Air Squat: 60 in 2 min", w: "Air Squat: 60 in 2 min" },
          3: { m: "Air Squat: 80 in 2 min", w: "Air Squat: 80 in 2 min" },
          4: { m: "Pistol: 10 consecutive each leg", w: "Pistol: 10 consecutive each leg" },
          5: { m: "Pistol: 20 consecutive each leg", w: "Pistol: 20 consecutive each leg" },
          6: { m: "Pistol: 30 consecutive each leg", w: "Pistol: 30 consecutive each leg" },
        },
      },
      {
        id: "push-up",
        name: "Push Up",
        benchmarks: {
          1: { m: "Box Press Up: 10 reps (24/30\")", w: "Box Press Up: 10 reps (24/30\")" },
          2: { m: "10 reps", w: "3 reps" },
          3: { m: "20 reps", w: "8 reps" },
          4: { m: "30 reps", w: "20 reps" },
          5: { m: "60 reps", w: "40 reps" },
          6: { m: "90 reps", w: "60 reps" },
        },
      },
      {
        id: "strict-pullup",
        name: "Strict Pull Up",
        benchmarks: {
          1: { m: "Scapula Pull Up: 10 reps @ 2011", w: "Scapula Pull Up: 10 reps @ 2011" },
          2: { m: "1 rep (or 3s negative)", w: "3s negative" },
          3: { m: "5 reps", w: "3 reps" },
          4: { m: "10 reps", w: "6 reps" },
          5: { m: "20 reps", w: "12 reps" },
          6: { m: "30 reps", w: "20 reps" },
        },
      },
      {
        id: "dip",
        name: "Dip",
        benchmarks: {
          2: { m: "Strict Bar Dip: 3 reps (or 3x3s neg)", w: "Strict Bar Dip: 3x3s negative" },
          3: { m: "Strict Bar Dip: 10 reps", w: "Strict Bar Dip: 4 reps" },
          4: { m: "Strict Ring Dip: 10 reps", w: "Strict Ring Dip: 6 reps" },
          5: { m: "Strict Ring Dip: 20 reps", w: "Strict Ring Dip: 12 reps" },
          6: { m: "Strict Ring Dip: 30 reps", w: "Strict Ring Dip: 20 reps" },
        },
      },
      {
        id: "kipping-pullup",
        name: "Kipping Pull Up",
        benchmarks: {
          3: { m: "10 reps", w: "6 reps" },
          4: { m: "20 reps", w: "12 reps" },
          5: { m: "50 reps", w: "30 reps" },
          6: { m: "75 reps", w: "50 reps" },
        },
      },
      {
        id: "core",
        name: "Sit Up / Toes to Bar",
        benchmarks: {
          1: { m: "Sit Up: 30 in 2 min", w: "Sit Up: 30 in 2 min" },
          2: { m: "Sit Up: 45 in 2 min", w: "Sit Up: 45 in 2 min" },
          3: { m: "Sit Up: 65 in 2 min", w: "Sit Up: 65 in 2 min" },
          4: { m: "Toes to Bar: 10", w: "Toes to Bar: 10" },
          5: { m: "Toes to Bar: 30", w: "Toes to Bar: 30" },
          6: { m: "Toes to Bar: 50", w: "Toes to Bar: 50" },
        },
      },
      {
        id: "box-jump",
        name: "Box Jump",
        benchmarks: {
          1: { m: "15 in 1 min (16\")", w: "15 in 1 min (12\")" },
          2: { m: "20 in 1 min (20\")", w: "20 in 1 min (16\")" },
          3: { m: "20 in 1 min (24\")", w: "20 in 1 min (20\")" },
          4: { m: "20 in 1 min (30\")", w: "20 in 1 min (24\")" },
        },
      },
      {
        id: "plank",
        name: "Plank Hold",
        benchmarks: {
          1: { m: "1 minute", w: "1 minute" },
          2: { m: "2 minutes", w: "2 minutes" },
        },
      },
      {
        id: "side-plank",
        name: "Side Plank",
        benchmarks: {
          1: { m: "30s each side", w: "30s each side" },
          2: { m: "1 min each side", w: "1 min each side" },
        },
      },
      {
        id: "ring-hold",
        name: "Ring Hold",
        benchmarks: {
          3: { m: "Chair Sit: 60s", w: "Chair Sit: 60s" },
          4: { m: "L Sit: 15s", w: "L Sit: 10s" },
          5: { m: "L Sit: 30s", w: "L Sit: 20s" },
          6: { m: "L Sit: 60s", w: "L Sit: 45s" },
        },
      },
      {
        id: "handstand",
        name: "Handstand",
        benchmarks: {
          1: { m: "Wall Hold: 5s", w: "Wall Hold: 5s" },
          2: { m: "Wall Hold: 20s", w: "Wall Hold: 20s" },
          3: { m: "Wall Hold: 60s", w: "Wall Hold: 60s" },
          4: { m: "Walk: 12ft", w: "Walk: 12ft" },
          5: { m: "Walk: 30ft", w: "Walk: 30ft" },
          6: { m: "Walk: 120ft", w: "Walk: 120ft" },
        },
      },
      {
        id: "muscle-up-kipping",
        name: "Kipping Muscle Up",
        benchmarks: {
          4: { m: "3 reps", w: "1 rep" },
          5: { m: "15 reps", w: "7 reps" },
          6: { m: "25 reps", w: "15 reps" },
        },
      },
      {
        id: "muscle-up-strict",
        name: "Strict Muscle Up",
        benchmarks: {
          5: { m: "5 reps", w: "2 reps" },
          6: { m: "10 reps", w: "5 reps" },
        },
      },
      {
        id: "hspu",
        name: "Strict HSPU",
        benchmarks: {
          4: { m: "3 reps", w: "1 rep" },
          5: { m: "20 reps", w: "12 reps" },
          6: { m: "30 reps", w: "20 reps" },
        },
      },
    ],
  },
  weightlifting: {
    label: "Weightlifting",
    skills: [
      {
        id: "back-squat",
        name: "Back Squat",
        benchmarks: {
          1: { m: "40kg x10", w: "30kg x10" },
          2: { m: "70kg x5", w: "50kg x5" },
          3: { m: "100kg 1RM", w: "70kg 1RM" },
          4: { m: "130kg 1RM", w: "90kg 1RM" },
          5: { m: "170kg 1RM", w: "120kg 1RM" },
          6: { m: "215kg 1RM", w: "150kg 1RM" },
        },
      },
      {
        id: "front-squat",
        name: "Front Squat",
        benchmarks: {
          1: { m: "35kg x10", w: "25kg x10" },
          2: { m: "60kg x5", w: "40kg x5" },
          3: { m: "85kg 1RM", w: "60kg 1RM" },
          4: { m: "110kg 1RM", w: "75kg 1RM" },
          5: { m: "145kg 1RM", w: "100kg 1RM" },
          6: { m: "185kg 1RM", w: "130kg 1RM" },
        },
      },
      {
        id: "deadlift",
        name: "Deadlift",
        benchmarks: {
          1: { m: "50kg x10", w: "35kg x10" },
          2: { m: "90kg x5", w: "65kg x5" },
          3: { m: "125kg 1RM", w: "90kg 1RM" },
          4: { m: "155kg 1RM", w: "110kg 1RM" },
          5: { m: "215kg 1RM", w: "150kg 1RM" },
          6: { m: "260kg 1RM", w: "180kg 1RM" },
        },
      },
      {
        id: "shoulder-press",
        name: "Shoulder Press",
        benchmarks: {
          1: { m: "20kg x10", w: "12.5kg x10" },
          2: { m: "30kg x5", w: "20kg x5" },
          3: { m: "45kg 1RM", w: "30kg 1RM" },
          4: { m: "60kg 1RM", w: "40kg 1RM" },
          5: { m: "75kg 1RM", w: "50kg 1RM" },
          6: { m: "95kg 1RM", w: "65kg 1RM" },
        },
      },
      {
        id: "bench-press",
        name: "Bench Press",
        benchmarks: {
          1: { m: "30kg x10", w: "20kg x10" },
          2: { m: "45kg x5", w: "30kg x5" },
          3: { m: "70kg 1RM", w: "50kg 1RM" },
          4: { m: "90kg 1RM", w: "65kg 1RM" },
          5: { m: "120kg 1RM", w: "80kg 1RM" },
          6: { m: "150kg 1RM", w: "100kg 1RM" },
        },
      },
      {
        id: "overhead-squat",
        name: "Overhead Squat",
        benchmarks: {
          1: { m: "20kg x10", w: "15kg x10" },
          2: { m: "45kg x5", w: "30kg x5" },
          3: { m: "65kg 1RM", w: "45kg 1RM" },
          4: { m: "85kg 1RM", w: "60kg 1RM" },
          5: { m: "110kg 1RM", w: "75kg 1RM" },
          6: { m: "140kg 1RM", w: "100kg 1RM" },
        },
      },
      {
        id: "clean",
        name: "Clean",
        benchmarks: {
          1: { m: "Power Clean: 30kg x10", w: "Power Clean: 20kg x10" },
          2: { m: "Power Clean: 50kg x5", w: "Power Clean: 35kg x5" },
          3: { m: "Squat Clean: 70kg 1RM", w: "Squat Clean: 50kg 1RM" },
          4: { m: "Squat Clean: 100kg 1RM", w: "Squat Clean: 70kg 1RM" },
          5: { m: "Squat Clean: 125kg 1RM", w: "Squat Clean: 85kg 1RM" },
          6: { m: "Squat Clean: 160kg 1RM", w: "Squat Clean: 110kg 1RM" },
        },
      },
      {
        id: "jerk",
        name: "Jerk",
        benchmarks: {
          1: { m: "30kg x10", w: "20kg x10" },
          2: { m: "50kg x5", w: "35kg x5" },
          3: { m: "70kg 1RM", w: "50kg 1RM" },
          4: { m: "100kg 1RM", w: "70kg 1RM" },
          5: { m: "125kg 1RM", w: "85kg 1RM" },
          6: { m: "160kg 1RM", w: "110kg 1RM" },
        },
      },
      {
        id: "snatch",
        name: "Snatch",
        benchmarks: {
          1: { m: "Power Snatch: 20kg x10", w: "Power Snatch: 15kg x10" },
          2: { m: "Power Snatch: 35kg x5", w: "Power Snatch: 25kg x5" },
          3: { m: "Squat Snatch: 50kg 1RM", w: "Squat Snatch: 35kg 1RM" },
          4: { m: "Squat Snatch: 70kg 1RM", w: "Squat Snatch: 50kg 1RM" },
          5: { m: "Squat Snatch: 100kg 1RM", w: "Squat Snatch: 70kg 1RM" },
          6: { m: "Squat Snatch: 130kg 1RM", w: "Squat Snatch: 90kg 1RM" },
        },
      },
    ],
  },
  conditioning: {
    label: "Conditioning",
    skills: [
      {
        id: "assault-bike",
        name: "Assault Bike",
        benchmarks: {
          1: { m: "10 cals in 1 min", w: "7 cals in 1 min" },
          2: { m: "20 cals in 1 min", w: "14 cals in 1 min" },
          3: { m: "30 cals in 1 min", w: "20 cals in 1 min" },
        },
      },
      {
        id: "run-400m",
        name: "400m Run",
        benchmarks: {
          1: { m: "< 2:00", w: "< 2:20" },
          2: { m: "< 1:45", w: "< 2:05" },
          3: { m: "< 1:35", w: "< 1:50" },
          4: { m: "< 1:25", w: "< 1:40" },
          5: { m: "< 1:10", w: "< 1:20" },
          6: { m: "< 0:55", w: "< 1:05" },
        },
      },
      {
        id: "run-1k",
        name: "1km Run",
        benchmarks: {
          2: { m: "< 5:00", w: "< 5:40" },
          3: { m: "< 4:20", w: "< 5:00" },
          4: { m: "< 3:40", w: "< 4:20" },
          5: { m: "< 3:20", w: "< 3:50" },
          6: { m: "< 3:10", w: "< 3:35" },
        },
      },
      {
        id: "run-5k",
        name: "5km Run",
        benchmarks: {
          4: { m: "< 24:00", w: "< 27:00" },
          5: { m: "< 20:00", w: "< 23:00" },
          6: { m: "< 18:00", w: "< 21:00" },
        },
      },
      {
        id: "row-500m",
        name: "500m Row",
        benchmarks: {
          1: { m: "< 2:30", w: "< 3:00" },
          2: { m: "< 2:05", w: "< 2:30" },
          3: { m: "< 1:45", w: "< 2:00" },
          4: { m: "< 1:35", w: "< 1:50" },
          5: { m: "< 1:30", w: "< 1:45" },
          6: { m: "< 1:25", w: "< 1:40" },
        },
      },
      {
        id: "row-2k",
        name: "2000m Row",
        benchmarks: {
          3: { m: "< 8:10", w: "< 9:00" },
          4: { m: "< 7:30", w: "< 8:30" },
          5: { m: "< 6:50", w: "< 7:50" },
          6: { m: "< 6:30", w: "< 7:30" },
        },
      },
      {
        id: "skipping",
        name: "Single Unders",
        benchmarks: {
          1: { m: "50 (no miss)", w: "50 (no miss)" },
          2: { m: "100 (no miss)", w: "100 (no miss)" },
          3: { m: "100 (no miss)", w: "100 (no miss)" },
        },
      },
      {
        id: "double-under",
        name: "Double Unders",
        benchmarks: {
          2: { m: "1 rep", w: "1 rep" },
          3: { m: "10 unbroken", w: "10 unbroken" },
          4: { m: "30 unbroken", w: "30 unbroken" },
          5: { m: "100 unbroken", w: "100 unbroken" },
          6: { m: "200 unbroken", w: "200 unbroken" },
        },
      },
      {
        id: "burpee",
        name: "Burpee",
        benchmarks: {
          1: { m: "8 in 1 min", w: "8 in 1 min" },
          2: { m: "12 in 1 min", w: "12 in 1 min" },
          3: { m: "20 in 1 min", w: "20 in 1 min" },
          4: { m: "30 in 1 min", w: "30 in 1 min" },
          5: { m: "35 in 1 min", w: "35 in 1 min" },
          6: { m: "40 in 1 min", w: "40 in 1 min" },
        },
      },
      {
        id: "wod-helen",
        name: "Helen (RX)",
        benchmarks: {
          4: { m: "< 11:00", w: "< 13:00" },
        },
      },
      {
        id: "wod-fran",
        name: "Fran",
        benchmarks: {
          5: { m: "< 4:00", w: "< 5:00" },
        },
      },
      {
        id: "wod-grace",
        name: "Grace",
        benchmarks: {
          4: { m: "< 2:30", w: "< 2:30" },
          5: { m: "< 1:30", w: "< 1:30" },
        },
      },
      {
        id: "wod-elizabeth",
        name: "Elizabeth",
        benchmarks: {
          6: { m: "< 4:00", w: "< 5:00" },
        },
      },
      {
        id: "wod-cindy",
        name: "Cindy",
        benchmarks: {
          4: { m: "25 rounds", w: "20 rounds" },
        },
      },
      {
        id: "wod-mary",
        name: "Mary",
        benchmarks: {
          5: { m: "15 rounds", w: "10 rounds" },
        },
      },
    ],
  },
};

/* ─── Current PBs from PDF ─── */

const CURRENT_PBS = [
  { lift: "Back Squat (5RM)", value: "75 kg" },
  { lift: "Front Squat (3RM)", value: "65 kg" },
  { lift: "Overhead Squat", value: "60 kg" },
  { lift: "Push Press (5RM)", value: "40 kg" },
  { lift: "Snatch 1RM", value: "50 kg" },
  { lift: "Snatch (from hip)", value: "35 kg" },
  { lift: "Snatch (from knee)", value: "40 kg" },
  { lift: "C&J 1RM", value: "55 kg" },
  { lift: "C&J (from hip)", value: "45 kg" },
  { lift: "C&J (from knee)", value: "50 kg" },
  { lift: "Clean", value: "70 kg" },
  { lift: "Strict Press", value: "35 kg" },
  { lift: "Power Snatch", value: "45 kg" },
  { lift: "Power Clean", value: "65 kg" },
];

/* ─── Programme Blocks ─── */

const PROGRAMME_BLOCKS = [
  {
    name: "Oly Lifting Block",
    start: "8 May",
    weeks: 8,
    focus: "Increase Snatch and C&J strength building to new 1RM in both lifts",
    days: { Mon: "Volume build", Wed: "Volume build + position work", Fri: "Heavy singles focus" },
  },
  {
    name: "Conditioning Block",
    start: "26 Jun",
    weeks: 8,
    focus: "Primary: improve conditioning. Secondary: gymnastics volume. Strength: maintenance",
    days: { Mon: "Testing / WODs", Wed: "Benchmark WODs (FGB, Barbara, Double Helen, Kelly, Jackie)", Fri: "Testing / WODs (Annie, Fran, Eva)" },
  },
  {
    name: "Balanced Block",
    start: "21 Aug",
    weeks: 8,
    focus: "All aspects of CF. Metcon focus, benchmark Girls, and gymnastics volume",
    days: { Mon: "Testing / Gymnastics", Wed: "Isabel & Grace / WODs", Fri: "Helen / Gymnastics + BB cycling" },
  },
  {
    name: "Strength Block",
    start: "16 Oct",
    weeks: 8,
    focus: "Compound lifts (Bench, Squat, Deadlift), Snatch and C&J",
    days: { Mon: "Olympic lifts / Diane", Wed: "Baseline WOD", Fri: "Compound lift testing" },
  },
  {
    name: "Enduro Block",
    start: "11 Dec",
    weeks: 8,
    focus: "Endurance, strength maintenance, remaining weaknesses. BB cycling, big sets of gymnastics, conditioning",
    days: { Mon: "23.1 / Filthy Fifty repeats", Wed: "23.2, 23.3 / FGB / 20k Bike", Fri: "23.4 / JT WOD / 10k Row" },
  },
  {
    name: "Deload",
    start: "5 Feb",
    weeks: 1,
    focus: "Metcon classes, recovery focus. Squats are the only extras.",
    days: {},
  },
  {
    name: "THE OPEN",
    start: "16 Feb",
    weeks: 3,
    focus: "Send it.",
    days: {},
  },
];

/* ─── Level Config ─── */

const LEVEL_COLORS = {
  1: { bg: "#1a3a2a", border: "#2E7D32", text: "#6fcf7f", label: "Foundation" },
  2: { bg: "#1a2e3d", border: "#2E86AB", text: "#6fb8d9", label: "Developing" },
  3: { bg: "#2d1a2d", border: "#A23B72", text: "#d17aaf", label: "Intermediate" },
  4: { bg: "#2d1f0f", border: "#FF6B35", text: "#ffa070", label: "Advanced" },
  5: { bg: "#2a1a0a", border: "#E8C547", text: "#f0d96b", label: "Elite" },
  6: { bg: "#2a0a0a", border: "#E54545", text: "#f07070", label: "Master" },
};

const STORAGE_KEY = "crossfit-skill-tree-v2";

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Save failed:", e);
  }
}

/* ─── Helpers ─── */

function getSkillLevels(skill) {
  return Object.keys(skill.benchmarks).map(Number).sort((a, b) => a - b);
}

function getAchievedLevel(skill, progress) {
  return progress[skill.id] || 0;
}

function getMaxLevel(skill) {
  const levels = getSkillLevels(skill);
  return levels[levels.length - 1];
}

function getMinLevel(skill) {
  const levels = getSkillLevels(skill);
  return levels[0];
}

function getNextBenchmark(skill, progress, gender) {
  const achieved = getAchievedLevel(skill, progress);
  const levels = getSkillLevels(skill);
  const next = levels.find((l) => l > achieved);
  if (!next) return null;
  return { level: next, target: skill.benchmarks[next][gender] };
}

/* ─── Components ─── */

function SkillCard({ skill, progress, gender, onClick }) {
  const achieved = getAchievedLevel(skill, progress);
  const maxLvl = getMaxLevel(skill);
  const minLvl = getMinLevel(skill);
  const levels = getSkillLevels(skill);
  const next = getNextBenchmark(skill, progress, gender);
  const complete = achieved >= maxLvl;
  const lc = LEVEL_COLORS[complete ? maxLvl : (next ? next.level : minLvl)];
  const pct = levels.length > 0 ? (levels.filter((l) => l <= achieved).length / levels.length) * 100 : 0;

  return (
    <button
      onClick={onClick}
      style={{
        flex: "1 1 calc(50% - 6px)",
        minWidth: 0,
        padding: "14px",
        background: complete
          ? `linear-gradient(135deg, ${lc.bg}, ${lc.border}22)`
          : "#0f1012",
        border: `1.5px solid ${complete ? lc.border : achieved > 0 ? "#2a2b2f" : "#1a1b1f"}`,
        borderRadius: 12,
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.25s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Progress bar background */}
      {pct > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: 3,
            width: `${pct}%`,
            background: lc.border,
            opacity: 0.6,
            borderRadius: "0 2px 0 0",
            transition: "width 0.4s ease",
          }}
        />
      )}
      {complete && (
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 10,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: lc.border,
            boxShadow: `0 0 8px ${lc.border}66`,
          }}
        />
      )}
      <div
        style={{
          fontFamily: "'Barlow', sans-serif",
          fontWeight: 700,
          fontSize: 14,
          color: complete ? lc.text : achieved > 0 ? "#ccc" : "#888",
          lineHeight: 1.2,
          paddingRight: 16,
        }}
      >
        {skill.name}
      </div>
      <div
        style={{
          marginTop: 4,
          fontSize: 11,
          fontWeight: 600,
          color: complete ? lc.text : "#555",
          opacity: complete ? 0.7 : 1,
        }}
      >
        {complete ? `Level ${maxLvl} complete` : achieved > 0 ? `Level ${achieved} / ${maxLvl}` : `Start at Level ${minLvl}`}
      </div>
      {next && (
        <div
          style={{
            marginTop: 6,
            fontSize: 10,
            fontWeight: 500,
            color: "#555",
            lineHeight: 1.3,
          }}
        >
          Next: {next.target}
        </div>
      )}
    </button>
  );
}

function SkillDetail({ skill, progress, gender, onToggle, onClose }) {
  const achieved = getAchievedLevel(skill, progress);
  const levels = getSkillLevels(skill);
  const maxLvl = getMaxLevel(skill);
  const lc = LEVEL_COLORS[achieved > 0 ? Math.min(achieved, 6) : getMinLevel(skill)];

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          zIndex: 25,
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 480,
          maxHeight: "80vh",
          overflowY: "auto",
          background: "#111215",
          borderTop: `2px solid ${lc.border}`,
          borderRadius: "16px 16px 0 0",
          padding: "20px 16px calc(32px + env(safe-area-inset-bottom, 0px))",
          zIndex: 30,
          animation: "slideUp 0.3s ease forwards",
          boxShadow: "0 -20px 60px rgba(0,0,0,0.8)",
        }}
      >
        <div
          style={{
            width: 36,
            height: 4,
            borderRadius: 2,
            background: "#333",
            margin: "0 auto 16px",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <h2
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: 22,
                color: lc.text,
                textTransform: "uppercase",
                letterSpacing: "0.02em",
              }}
            >
              {skill.name}
            </h2>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              {achieved >= maxLvl ? "All levels complete" : achieved > 0 ? `Achieved Level ${achieved}` : "Not started"}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#555", fontSize: 22, cursor: "pointer", padding: "4px 8px", lineHeight: 1 }}
          >
            x
          </button>
        </div>

        {/* All level benchmarks */}
        <div style={{ marginBottom: 20 }}>
          {levels.map((level) => {
            const isAchieved = level <= achieved;
            const isNext = level === achieved + 1 || (achieved === 0 && level === levels[0]);
            const llc = LEVEL_COLORS[level];
            return (
              <button
                key={level}
                onClick={() => onToggle(skill.id, level)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  width: "100%",
                  padding: "12px 14px",
                  marginBottom: 6,
                  background: isAchieved
                    ? `linear-gradient(135deg, ${llc.bg}, ${llc.border}15)`
                    : isNext
                    ? "#151618"
                    : "#0d0e10",
                  border: `1.5px solid ${isAchieved ? llc.border : isNext ? "#2a2b2f" : "#1a1b1f"}`,
                  borderRadius: 10,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s",
                }}
              >
                {/* Check circle */}
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    border: `2px solid ${isAchieved ? llc.border : "#333"}`,
                    background: isAchieved ? llc.border : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.2s",
                  }}
                >
                  {isAchieved && (
                    <span style={{ color: "#fff", fontSize: 13, fontWeight: 700, lineHeight: 1 }}>&#10003;</span>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: isAchieved ? llc.text : "#666",
                      }}
                    >
                      Level {level}
                    </span>
                    <span style={{ fontSize: 9, color: isAchieved ? llc.text : "#444", opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      {llc.label}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: isAchieved ? "#ccc" : isNext ? "#aaa" : "#555",
                      lineHeight: 1.3,
                      marginTop: 2,
                    }}
                  >
                    {skill.benchmarks[level][gender]}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ fontSize: 10, color: "#444", textAlign: "center", fontWeight: 500 }}>
          Tap a level to toggle it
        </div>
      </div>
    </>
  );
}

function ProgrammeView() {
  const [expandedBlock, setExpandedBlock] = useState(null);
  const [showPBs, setShowPBs] = useState(false);

  return (
    <div style={{ padding: "16px" }}>
      {/* PBs toggle */}
      <button
        onClick={() => setShowPBs(!showPBs)}
        style={{
          width: "100%",
          padding: "14px",
          background: showPBs ? "#1a1b1f" : "#0f1012",
          border: `1.5px solid ${showPBs ? "#2a2b2f" : "#1a1b1f"}`,
          borderRadius: 12,
          cursor: "pointer",
          marginBottom: 12,
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 16, color: "#E8C547", textTransform: "uppercase", letterSpacing: "0.02em" }}>
            Current PBs
          </span>
          <span style={{ color: "#555", fontSize: 14, transform: showPBs ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>v</span>
        </div>
      </button>

      {showPBs && (
        <div style={{ marginBottom: 16, animation: "fadeIn 0.3s ease" }}>
          {CURRENT_PBS.map((pb, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 14px",
                background: i % 2 === 0 ? "#0d0e10" : "transparent",
                borderRadius: 6,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 500, color: "#999" }}>{pb.lift}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#E8C547", fontVariantNumeric: "tabular-nums" }}>{pb.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Programme blocks */}
      <div style={{ marginBottom: 8 }}>
        <span
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#666",
          }}
        >
          Annual Programme
        </span>
      </div>

      {PROGRAMME_BLOCKS.map((block, i) => {
        const expanded = expandedBlock === i;
        const isOpen = block.name === "THE OPEN";
        const accentColor = isOpen ? "#E54545" : ["#2E7D32", "#2E86AB", "#A23B72", "#FF6B35", "#E8C547", "#666", "#E54545"][i] || "#666";
        return (
          <button
            key={i}
            onClick={() => setExpandedBlock(expanded ? null : i)}
            style={{
              width: "100%",
              padding: "14px",
              background: expanded ? "#151618" : "#0f1012",
              border: `1.5px solid ${expanded ? accentColor + "44" : "#1a1b1f"}`,
              borderLeft: `3px solid ${accentColor}`,
              borderRadius: 10,
              cursor: "pointer",
              marginBottom: 8,
              textAlign: "left",
              transition: "all 0.2s",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: 14, color: expanded ? "#fff" : "#ccc" }}>
                  {block.name}
                </div>
                <div style={{ fontSize: 11, fontWeight: 500, color: "#555", marginTop: 2 }}>
                  {block.start} / {block.weeks}w
                </div>
              </div>
              <span style={{ color: "#444", fontSize: 12, transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>v</span>
            </div>
            {expanded && (
              <div style={{ marginTop: 12, animation: "fadeIn 0.2s ease" }}>
                <div style={{ fontSize: 12, color: "#999", lineHeight: 1.5, marginBottom: 10 }}>{block.focus}</div>
                {Object.entries(block.days).length > 0 && (
                  <div>
                    {Object.entries(block.days).map(([day, desc]) => (
                      <div key={day} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: accentColor, width: 32, flexShrink: 0 }}>{day}</span>
                        <span style={{ fontSize: 11, color: "#777", lineHeight: 1.4 }}>{desc}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Main App ─── */

export default function App() {
  const [activeTab, setActiveTab] = useState("gymnastics");
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [progress, setProgress] = useState(loadProgress);
  const [gender, setGender] = useState(() => {
    try { return localStorage.getItem("cst-gender") || "m"; } catch { return "m"; }
  });

  const toggleLevel = useCallback((skillId, level) => {
    setProgress((prev) => {
      const current = prev[skillId] || 0;
      const updated = { ...prev };
      if (current >= level) {
        // Un-toggle: set to level below
        const newLevel = level - 1;
        // Find the skill to check if newLevel is below its min level
        let minLevel = 0;
        for (const cat of Object.values(SKILL_DATA)) {
          const found = cat.skills.find((s) => s.id === skillId);
          if (found) {
            minLevel = getMinLevel(found);
            break;
          }
        }
        if (newLevel < minLevel) {
          delete updated[skillId];
        } else {
          updated[skillId] = newLevel;
        }
      } else {
        updated[skillId] = level;
      }
      saveProgress(updated);
      return updated;
    });
  }, []);

  const setGenderPref = (g) => {
    setGender(g);
    try { localStorage.setItem("cst-gender", g); } catch {}
  };

  const isProgramme = activeTab === "programme";
  const category = !isProgramme ? SKILL_DATA[activeTab] : null;

  // Stats
  const totalBenchmarks = Object.values(SKILL_DATA).flatMap((c) => c.skills).reduce((sum, s) => sum + getSkillLevels(s).length, 0);
  const achievedBenchmarks = Object.values(SKILL_DATA)
    .flatMap((c) => c.skills)
    .reduce((sum, s) => {
      const ach = progress[s.id] || 0;
      return sum + getSkillLevels(s).filter((l) => l <= ach).length;
    }, 0);

  return (
    <div
      style={{
        fontFamily: "'Barlow', 'Barlow Condensed', sans-serif",
        background: "#0a0b0d",
        color: "#e8e6e1",
        minHeight: "100dvh",
        maxWidth: 480,
        margin: "0 auto",
        paddingBottom: 100,
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        html, body { background: #0a0b0d; margin: 0; overscroll-behavior: none; }
        ::-webkit-scrollbar { display: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Header */}
      <div
        style={{
          padding: "max(env(safe-area-inset-top, 12px), 20px) 16px 12px",
          background: "linear-gradient(180deg, #111215 0%, #0a0b0d 100%)",
          position: "sticky",
          top: 0,
          zIndex: 20,
          borderBottom: "1px solid #1a1b1f",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: 26,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              color: "#fff",
            }}
          >
            Skill Tree
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Gender toggle */}
            <div style={{ display: "flex", background: "#1a1b1f", borderRadius: 6, overflow: "hidden" }}>
              {["m", "w"].map((g) => (
                <button
                  key={g}
                  onClick={() => setGenderPref(g)}
                  style={{
                    padding: "4px 10px",
                    background: gender === g ? "#2a2b2f" : "transparent",
                    border: "none",
                    color: gender === g ? "#fff" : "#555",
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                    fontSize: 11,
                    cursor: "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {g === "m" ? "M" : "W"}
                </button>
              ))}
            </div>
            <span
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: "#555",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              {achievedBenchmarks}/{totalBenchmarks}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 10, height: 3, background: "#1a1b1f", borderRadius: 2, overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${(achievedBenchmarks / totalBenchmarks) * 100}%`,
              background: "linear-gradient(90deg, #2E7D32, #2E86AB, #A23B72, #FF6B35, #E8C547, #E54545)",
              borderRadius: 2,
              transition: "width 0.5s ease",
            }}
          />
        </div>

        {/* Category tabs */}
        <div style={{ display: "flex", gap: 4, marginTop: 14, overflowX: "auto" }}>
          {[...Object.entries(SKILL_DATA).map(([key, cat]) => ({ key, label: cat.label })), { key: "programme", label: "Programme" }].map(
            ({ key, label }) => {
              const active = key === activeTab;
              let catCount = 0;
              let catTotal = 0;
              if (key !== "programme" && SKILL_DATA[key]) {
                SKILL_DATA[key].skills.forEach((s) => {
                  const levels = getSkillLevels(s);
                  catTotal += levels.length;
                  const ach = progress[s.id] || 0;
                  catCount += levels.filter((l) => l <= ach).length;
                });
              }
              return (
                <button
                  key={key}
                  onClick={() => {
                    setActiveTab(key);
                    setSelectedSkill(null);
                  }}
                  style={{
                    flex: 1,
                    padding: "8px 2px",
                    background: active ? "#1a1b1f" : "transparent",
                    border: active ? "1px solid #2a2b2f" : "1px solid transparent",
                    borderRadius: 8,
                    color: active ? "#fff" : "#555",
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 600,
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.03em",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    whiteSpace: "nowrap",
                  }}
                >
                  <span>{label}</span>
                  {key !== "programme" && (
                    <span style={{ fontSize: 9, color: active ? "#555" : "#333" }}>
                      {catCount}/{catTotal}
                    </span>
                  )}
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Content */}
      {isProgramme ? (
        <ProgrammeView />
      ) : (
        <div style={{ padding: "16px" }}>
          {/* Level legend */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {[1, 2, 3, 4, 5, 6].map((l) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: LEVEL_COLORS[l].border }} />
                <span style={{ fontSize: 9, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {l}. {LEVEL_COLORS[l].label}
                </span>
              </div>
            ))}
          </div>

          {/* Skill grid */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {category.skills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                progress={progress}
                gender={gender}
                onClick={() => setSelectedSkill(selectedSkill?.id === skill.id ? null : skill)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Skill detail panel */}
      {selectedSkill && (
        <SkillDetail
          skill={selectedSkill}
          progress={progress}
          gender={gender}
          onToggle={toggleLevel}
          onClose={() => setSelectedSkill(null)}
        />
      )}
    </div>
  );
}
