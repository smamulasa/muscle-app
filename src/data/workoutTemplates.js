// src/data/workoutTemplates.js

export const workoutTemplates = [
  // =========================
  // UPPER (3 TEMPLATES)
  // =========================

  {
    id: "upper_push_limits",
    category: "upper",
    name: "Push Limits",
    focus: "Brust, Schultern, Trizeps",
    description: "Schwerer Push-Fokus mit Bankdrücken, Schulterdrücken und Dips.",
    difficulty: "Intermediate",
    estimatedDurationMinutes: 60,
    exercises: [
      {
        id: "bench_press",
        name: "Flachbankdrücken",
        order: 1,
        sets: 4,
        reps: "5–8",
        rest: "2–3 min",
        primary: ["Brust"],
        secondary: ["Schulter", "Trizeps"],
        equipment: "Langhantel",
        view: "front",
        highlightedZones: ["chest", "front_delts", "triceps"],
        notes: "Wähle ein Gewicht, bei dem du bei 5–8 Wdh nur 1–2 Wiederholungen im Tank hast.",
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "incline_db_press",
        name: "Schrägbankdrücken mit Kurzhanteln",
        order: 2,
        sets: 3,
        reps: "8–10",
        rest: "2–3 min",
        primary: ["Obere Brust"],
        secondary: ["Schulter", "Trizeps"],
        equipment: "Kurzhanteln",
        view: "front",
        highlightedZones: ["upper_chest", "front_delts", "triceps"],
        image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "shoulder_press",
        name: "Schulterdrücken",
        order: 3,
        sets: 3,
        reps: "6–10",
        rest: "2–3 min",
        primary: ["Schultern"],
        secondary: ["Trizeps"],
        equipment: "Kurzhanteln oder Langhantel",
        view: "front",
        highlightedZones: ["front_delts", "side_delts", "triceps"],
        image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "lateral_raise",
        name: "Seitheben",
        order: 4,
        sets: 3,
        reps: "12–15",
        rest: "60–90 sec",
        primary: ["Seitliche Schulter"],
        secondary: [],
        equipment: "Kurzhanteln oder Kabelzug",
        view: "front",
        highlightedZones: ["side_delts"],
        image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "dips",
        name: "Dips",
        order: 5,
        sets: 3,
        reps: "8–12",
        rest: "2 min",
        primary: ["Brust", "Trizeps"],
        secondary: ["Schulter"],
        equipment: "Dip-Ständer",
        view: "front",
        highlightedZones: ["chest", "triceps"],
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "triceps_pushdown",
        name: "Trizeps Pushdown",
        order: 6,
        sets: 2,
        reps: "12–15",
        rest: "60–90 sec",
        primary: ["Trizeps"],
        secondary: [],
        equipment: "Kabelzug",
        view: "front",
        highlightedZones: ["triceps"],
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop&q=80"
      }
    ]
  },

  {
    id: "upper_pull_power",
    category: "upper",
    name: "Pull Power",
    focus: "Rücken, Bizeps",
    description: "Zug-fokussierte Einheit für breiten Rücken und starke Arme.",
    difficulty: "Intermediate",
    estimatedDurationMinutes: 55,
    exercises: [
      {
        id: "pullups_or_latpulldown",
        name: "Klimmzüge oder Latzug",
        order: 1,
        sets: 4,
        reps: "6–10",
        rest: "2–3 min",
        primary: ["Lats"],
        secondary: ["Oberer Rücken", "Bizeps"],
        equipment: "Klimmzugstange oder Kabelzug",
        view: "back",
        highlightedZones: ["lats", "upper_back", "biceps"],
        image: "https://images.unsplash.com/photo-1598971639058-211a73287138?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "barbell_row",
        name: "Langhantelrudern",
        order: 2,
        sets: 4,
        reps: "6–10",
        rest: "2–3 min",
        primary: ["Oberer Rücken"],
        secondary: ["Bizeps", "Hintere Schulter"],
        equipment: "Langhantel",
        view: "back",
        highlightedZones: ["upper_back", "rear_delts", "biceps"],
        image: "https://images.unsplash.com/photo-1598971457999-55169746e14d?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "seated_row",
        name: "Sitzendes Rudern",
        order: 3,
        sets: 3,
        reps: "10–12",
        rest: "90–120 sec",
        primary: ["Oberer Rücken"],
        secondary: ["Bizeps"],
        equipment: "Kabelzug oder Maschine",
        view: "back",
        highlightedZones: ["upper_back", "biceps"],
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "face_pull",
        name: "Face Pulls",
        order: 4,
        sets: 3,
        reps: "12–15",
        rest: "60–90 sec",
        primary: ["Hintere Schulter"],
        secondary: ["Oberer Rücken"],
        equipment: "Kabelzug",
        view: "back",
        highlightedZones: ["rear_delts", "upper_back"],
        image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "barbell_curl",
        name: "Langhantelcurls",
        order: 5,
        sets: 3,
        reps: "8–12",
        rest: "90 sec",
        primary: ["Bizeps"],
        secondary: [],
        equipment: "Langhantel",
        view: "front",
        highlightedZones: ["biceps"],
        image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "hammer_curl",
        name: "Hammercurls",
        order: 6,
        sets: 2,
        reps: "10–15",
        rest: "60–90 sec",
        primary: ["Bizeps", "Brachialis"],
        secondary: [],
        equipment: "Kurzhanteln",
        view: "front",
        highlightedZones: ["biceps"],
        image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop&q=80"
      }
    ]
  },

  {
    id: "upper_strength",
    category: "upper",
    name: "Upper Strength",
    focus: "Ausgewogene Oberkörperkraft",
    description: "Mix aus Push- und Pull-Übungen für ausgewogenen Oberkörperaufbau.",
    difficulty: "Intermediate",
    estimatedDurationMinutes: 60,
    exercises: [
      {
        id: "bench_press_upper_strength",
        name: "Flachbankdrücken",
        order: 1,
        sets: 3,
        reps: "5–8",
        rest: "2–3 min",
        primary: ["Brust"],
        secondary: ["Schulter", "Trizeps"],
        equipment: "Langhantel",
        view: "front",
        highlightedZones: ["chest", "front_delts", "triceps"],
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "overhead_press_upper_strength",
        name: "Schulterdrücken",
        order: 2,
        sets: 3,
        reps: "6–10",
        rest: "2–3 min",
        primary: ["Schultern"],
        secondary: ["Trizeps"],
        equipment: "Kurzhanteln oder Langhantel",
        view: "front",
        highlightedZones: ["front_delts", "side_delts", "triceps"],
        image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "lat_pulldown_upper_strength",
        name: "Latzug",
        order: 3,
        sets: 3,
        reps: "8–12",
        rest: "2 min",
        primary: ["Lats"],
        secondary: ["Bizeps"],
        equipment: "Kabelzug",
        view: "back",
        highlightedZones: ["lats", "biceps"],
        image: "https://images.unsplash.com/photo-1598971639058-211a73287138?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "row_upper_strength",
        name: "Rudern am Kabel",
        order: 4,
        sets: 3,
        reps: "8–12",
        rest: "2 min",
        primary: ["Oberer Rücken"],
        secondary: ["Bizeps"],
        equipment: "Kabelzug",
        view: "back",
        highlightedZones: ["upper_back", "biceps"],
        image: "https://images.unsplash.com/photo-1598971457999-55169746e14d?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "curl_upper_strength",
        name: "Kurzhantel Curls",
        order: 5,
        sets: 2,
        reps: "10–15",
        rest: "60–90 sec",
        primary: ["Bizeps"],
        secondary: [],
        equipment: "Kurzhanteln",
        view: "front",
        highlightedZones: ["biceps"],
        image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "triceps_rope_upper_strength",
        name: "Trizeps Rope Pushdown",
        order: 6,
        sets: 2,
        reps: "10–15",
        rest: "60–90 sec",
        primary: ["Trizeps"],
        secondary: [],
        equipment: "Kabelzug",
        view: "front",
        highlightedZones: ["triceps"],
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop&q=80"
      }
    ]
  },

  // =========================
  // LOWER (3 TEMPLATES)
  // =========================

  {
    id: "lower_leg_builder",
    category: "lower",
    name: "Leg Builder",
    focus: "Quadrizeps-Volumen",
    description: "Quadrizeps-fokussiertes Bein-Workout mit hohem Volumen.",
    difficulty: "Intermediate",
    estimatedDurationMinutes: 55,
    exercises: [
      {
        id: "squat_leg_builder",
        name: "Kniebeugen",
        order: 1,
        sets: 4,
        reps: "5–8",
        rest: "3 min",
        primary: ["Quadrizeps"],
        secondary: ["Glutes", "Core"],
        equipment: "Langhantel",
        view: "front",
        highlightedZones: ["quads", "glutes", "core"],
        image: "https://images.unsplash.com/photo-1574680096141-1cddd32e0340?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "leg_press_leg_builder",
        name: "Beinpresse",
        order: 2,
        sets: 3,
        reps: "10–15",
        rest: "2 min",
        primary: ["Quadrizeps"],
        secondary: ["Glutes"],
        equipment: "Maschine",
        view: "front",
        highlightedZones: ["quads"],
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "leg_extension_leg_builder",
        name: "Beinstrecker",
        order: 3,
        sets: 3,
        reps: "12–15",
        rest: "90 sec",
        primary: ["Quadrizeps"],
        secondary: [],
        equipment: "Maschine",
        view: "front",
        highlightedZones: ["quads"],
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "walking_lunges_leg_builder",
        name: "Ausfallschritte (laufend)",
        order: 4,
        sets: 3,
        reps: "10–12 pro Bein",
        rest: "2 min",
        primary: ["Quadrizeps", "Glutes"],
        secondary: ["Core"],
        equipment: "Kurzhanteln (optional)",
        view: "front",
        highlightedZones: ["quads", "glutes"],
        image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "calf_raise_leg_builder",
        name: "Wadenheben",
        order: 5,
        sets: 3,
        reps: "12–20",
        rest: "60–90 sec",
        primary: ["Waden"],
        secondary: [],
        equipment: "Maschine oder freies Gewicht",
        view: "front",
        highlightedZones: ["calves"],
        image: "https://images.unsplash.com/photo-1574680096141-1cddd32e0340?w=400&auto=format&fit=crop&q=80"
      }
    ]
  },

  {
    id: "lower_glute_ham_power",
    category: "lower",
    name: "Glute & Hamstring Power",
    focus: "Posterior Chain",
    description: "Schwerer Fokus auf Gesäß, Hamstrings und hintere Kette.",
    difficulty: "Intermediate",
    estimatedDurationMinutes: 55,
    exercises: [
      {
        id: "rdl_glute_ham",
        name: "Rumänisches Kreuzheben",
        order: 1,
        sets: 4,
        reps: "6–10",
        rest: "3 min",
        primary: ["Hamstrings"],
        secondary: ["Glutes", "Unterer Rücken"],
        equipment: "Langhantel",
        view: "back",
        highlightedZones: ["hamstrings", "glutes", "lower_back"],
        image: "https://images.unsplash.com/photo-1598971457999-55169746e14d?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "hip_thrust_glute_ham",
        name: "Hip Thrust",
        order: 2,
        sets: 4,
        reps: "8–12",
        rest: "2–3 min",
        primary: ["Glutes"],
        secondary: ["Hamstrings"],
        equipment: "Langhantel oder Kurzhantel",
        view: "back",
        highlightedZones: ["glutes", "hamstrings"],
        image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "leg_curl_glute_ham",
        name: "Beinbeuger (Leg Curl)",
        order: 3,
        sets: 3,
        reps: "10–15",
        rest: "90–120 sec",
        primary: ["Hamstrings"],
        secondary: [],
        equipment: "Maschine",
        view: "back",
        highlightedZones: ["hamstrings"],
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "back_extension_glute_ham",
        name: "Rückenstrecker (Back Extension)",
        order: 4,
        sets: 3,
        reps: "12–15",
        rest: "90 sec",
        primary: ["Unterer Rücken"],
        secondary: ["Glutes", "Hamstrings"],
        equipment: "Rückenstrecker-Bank",
        view: "back",
        highlightedZones: ["lower_back", "glutes", "hamstrings"],
        image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "calf_raise_glute_ham",
        name: "Wadenheben",
        order: 5,
        sets: 3,
        reps: "12–20",
        rest: "60–90 sec",
        primary: ["Waden"],
        secondary: [],
        equipment: "Maschine oder freies Gewicht",
        view: "front",
        highlightedZones: ["calves"],
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&auto=format&fit=crop&q=80"
      }
    ]
  },

  {
    id: "lower_strength",
    category: "lower",
    name: "Lower Strength",
    focus: "Ausgewogene Bein- und Hüftkraft",
    description: "Ganzheitliches Unterkörper-Workout mit Fokus auf Kraft.",
    difficulty: "Intermediate",
    estimatedDurationMinutes: 60,
    exercises: [
      {
        id: "squat_lower_strength",
        name: "Kniebeugen",
        order: 1,
        sets: 3,
        reps: "5–8",
        rest: "3 min",
        primary: ["Quadrizeps"],
        secondary: ["Glutes", "Core"],
        equipment: "Langhantel",
        view: "front",
        highlightedZones: ["quads", "glutes", "core"],
        image: "https://images.unsplash.com/photo-1574680096141-1cddd32e0340?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "rdl_lower_strength",
        name: "Rumänisches Kreuzheben",
        order: 2,
        sets: 3,
        reps: "6–10",
        rest: "3 min",
        primary: ["Hamstrings"],
        secondary: ["Glutes", "Unterer Rücken"],
        equipment: "Langhantel",
        view: "back",
        highlightedZones: ["hamstrings", "glutes", "lower_back"],
        image: "https://images.unsplash.com/photo-1598971457999-55169746e14d?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "split_squat_lower_strength",
        name: "Bulgarian Split Squat",
        order: 3,
        sets: 3,
        reps: "8–12 pro Bein",
        rest: "2 min",
        primary: ["Quadrizeps", "Glutes"],
        secondary: ["Core"],
        equipment: "Kurzhanteln (optional)",
        view: "front",
        highlightedZones: ["quads", "glutes"],
        image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "leg_curl_lower_strength",
        name: "Beinbeuger (Leg Curl)",
        order: 4,
        sets: 2,
        reps: "10–15",
        rest: "90 sec",
        primary: ["Hamstrings"],
        secondary: [],
        equipment: "Maschine",
        view: "back",
        highlightedZones: ["hamstrings"],
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "calf_raise_lower_strength",
        name: "Wadenheben",
        order: 5,
        sets: 3,
        reps: "12–20",
        rest: "60–90 sec",
        primary: ["Waden"],
        secondary: [],
        equipment: "Maschine oder freies Gewicht",
        view: "front",
        highlightedZones: ["calves"],
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop&q=80"
      }
    ]
  },

  // =========================
  // CORE (2 TEMPLATES)
  // =========================

  {
    id: "core_abs_burn",
    category: "core",
    name: "Abs Burn",
    focus: "High Intensity",
    description: "Intensives Bauch-Workout mit hohem Volumen und wenig Pause.",
    difficulty: "Intermediate",
    estimatedDurationMinutes: 25,
    exercises: [
      {
        id: "cable_crunch_abs_burn",
        name: "Kabel Crunch",
        order: 1,
        sets: 3,
        reps: "12–15",
        rest: "60–75 sec",
        primary: ["Gerade Bauchmuskeln"],
        secondary: [],
        equipment: "Kabelzug",
        view: "front",
        highlightedZones: ["abs"],
        image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "leg_raise_abs_burn",
        name: "Beinheben (hängend oder liegend)",
        order: 2,
        sets: 3,
        reps: "10–15",
        rest: "60–75 sec",
        primary: ["Unterbauch"],
        secondary: [],
        equipment: "Körpergewicht",
        view: "front",
        highlightedZones: ["lower_abs"],
        image: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "russian_twist_abs_burn",
        name: "Russian Twists",
        order: 3,
        sets: 3,
        reps: "20–30 gesamt",
        rest: "60 sec",
        primary: ["Obliques"],
        secondary: ["Core"],
        equipment: "Körpergewicht oder Gewicht",
        view: "front",
        highlightedZones: ["obliques"],
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "plank_abs_burn",
        name: "Plank",
        order: 4,
        sets: 3,
        reps: "45–60 sec",
        rest: "60 sec",
        primary: ["Core"],
        secondary: ["Schultern"],
        equipment: "Körpergewicht",
        view: "front",
        highlightedZones: ["core"],
        image: "https://images.unsplash.com/photo-1566241440091-ec10de8db2e1e?w=400&auto=format&fit=crop&q=80"
      }
    ]
  },

  {
    id: "core_stability",
    category: "core",
    name: "Core Stability",
    focus: "Funktionale Stabilität",
    description: "Stabilitätsorientiertes Core-Training mit Fokus auf Anti-Rotation und Rumpfkontrolle.",
    difficulty: "Beginner",
    estimatedDurationMinutes: 20,
    exercises: [
      {
        id: "plank_core_stability",
        name: "Front Plank",
        order: 1,
        sets: 3,
        reps: "30–45 sec",
        rest: "45–60 sec",
        primary: ["Core"],
        secondary: ["Schultern"],
        equipment: "Körpergewicht",
        view: "front",
        highlightedZones: ["core"],
        image: "https://images.unsplash.com/photo-1566241440091-ec10de8db2e1e?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "side_plank_core_stability",
        name: "Side Plank",
        order: 2,
        sets: 3,
        reps: "20–30 sec pro Seite",
        rest: "45–60 sec",
        primary: ["Obliques"],
        secondary: ["Core"],
        equipment: "Körpergewicht",
        view: "front",
        highlightedZones: ["obliques"],
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "dead_bug_core_stability",
        name: "Dead Bug",
        order: 3,
        sets: 3,
        reps: "8–12 pro Seite",
        rest: "45–60 sec",
        primary: ["Core"],
        secondary: ["Unterer Rücken"],
        equipment: "Körpergewicht",
        view: "front",
        highlightedZones: ["core"],
        image: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "bird_dog_core_stability",
        name: "Bird Dog",
        order: 4,
        sets: 3,
        reps: "8–12 pro Seite",
        rest: "45–60 sec",
        primary: ["Core"],
        secondary: ["Unterer Rücken", "Glutes"],
        equipment: "Körpergewicht",
        view: "back",
        highlightedZones: ["core", "lower_back", "glutes"],
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&auto=format&fit=crop&q=80"
      }
    ]
  },

  // =========================
  // FULL BODY (2 TEMPLATES)
  // =========================

  {
    id: "full_body_express",
    category: "full_body",
    name: "Full Body Express",
    focus: "30 Minuten Ganzkörper",
    description: "Schnelle Ganzkörpereinheit mit Fokus auf großen Grundübungen.",
    difficulty: "Beginner",
    estimatedDurationMinutes: 30,
    exercises: [
      {
        id: "goblet_squat_full_express",
        name: "Goblet Squat",
        order: 1,
        sets: 3,
        reps: "8–12",
        rest: "90–120 sec",
        primary: ["Quadrizeps"],
        secondary: ["Glutes", "Core"],
        equipment: "Kurzhantel oder Kettlebell",
        view: "front",
        highlightedZones: ["quads", "glutes", "core"],
        image: "https://images.unsplash.com/photo-1574680096141-1cddd32e0340?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "pushup_full_express",
        name: "Liegestütze",
        order: 2,
        sets: 3,
        reps: "8–15",
        rest: "90 sec",
        primary: ["Brust"],
        secondary: ["Schultern", "Trizeps"],
        equipment: "Körpergewicht",
        view: "front",
        highlightedZones: ["chest", "front_delts", "triceps"],
        image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "row_full_express",
        name: "Kurzhantelrudern einarmig",
        order: 3,
        sets: 3,
        reps: "10–12 pro Seite",
        rest: "90–120 sec",
        primary: ["Oberer Rücken"],
        secondary: ["Lats", "Bizeps"],
        equipment: "Kurzhanteln",
        view: "back",
        highlightedZones: ["upper_back", "biceps", "lats"],
        image: "https://images.unsplash.com/photo-1598971457999-55169746e14d?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "hip_hinge_full_express",
        name: "Hip Hinge (Romanian Deadlift light)",
        order: 4,
        sets: 2,
        reps: "10–12",
        rest: "90–120 sec",
        primary: ["Hamstrings"],
        secondary: ["Glutes"],
        equipment: "Kurzhanteln oder Langhantel",
        view: "back",
        highlightedZones: ["hamstrings", "glutes"],
        image: "https://images.unsplash.com/photo-1598971457999-55169746e14d?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "plank_full_express",
        name: "Plank",
        order: 5,
        sets: 2,
        reps: "30–45 sec",
        rest: "45–60 sec",
        primary: ["Core"],
        secondary: [],
        equipment: "Körpergewicht",
        view: "front",
        highlightedZones: ["core"],
        image: "https://images.unsplash.com/photo-1566241440091-ec10de8db2e1e?w=400&auto=format&fit=crop&q=80"
      }
    ]
  },

  {
    id: "full_body_strength",
    category: "full_body",
    name: "Full Body Strength",
    focus: "45 Minuten Ganzkörperkraft",
    description: "Stärkerer, kraftorientierter Ganzkörperplan mit Fokus auf Grundübungen.",
    difficulty: "Intermediate",
    estimatedDurationMinutes: 45,
    exercises: [
      {
        id: "squat_full_strength",
        name: "Kniebeugen",
        order: 1,
        sets: 3,
        reps: "5–8",
        rest: "2–3 min",
        primary: ["Quadrizeps"],
        secondary: ["Glutes", "Core"],
        equipment: "Langhantel",
        view: "front",
        highlightedZones: ["quads", "glutes", "core"],
        image: "https://images.unsplash.com/photo-1574680096141-1cddd32e0340?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "bench_press_full_strength",
        name: "Bankdrücken",
        order: 2,
        sets: 3,
        reps: "5–8",
        rest: "2–3 min",
        primary: ["Brust"],
        secondary: ["Trizeps", "Schulter"],
        equipment: "Langhantel",
        view: "front",
        highlightedZones: ["chest", "triceps", "front_delts"],
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "row_full_strength",
        name: "Langhantelrudern",
        order: 3,
        sets: 3,
        reps: "6–10",
        rest: "2–3 min",
        primary: ["Oberer Rücken"],
        secondary: ["Bizeps", "Lats"],
        equipment: "Langhantel",
        view: "back",
        highlightedZones: ["upper_back", "biceps", "lats"],
        image: "https://images.unsplash.com/photo-1598971457999-55169746e14d?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "rdl_full_strength",
        name: "Rumänisches Kreuzheben",
        order: 4,
        sets: 2,
        reps: "6–10",
        rest: "2–3 min",
        primary: ["Hamstrings"],
        secondary: ["Glutes", "Unterer Rücken"],
        equipment: "Langhantel",
        view: "back",
        highlightedZones: ["hamstrings", "glutes", "lower_back"],
        image: "https://images.unsplash.com/photo-1598971457999-55169746e14d?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "shoulder_press_full_strength",
        name: "Schulterdrücken",
        order: 5,
        sets: 2,
        reps: "8–12",
        rest: "90–120 sec",
        primary: ["Schultern"],
        secondary: ["Trizeps"],
        equipment: "Kurzhanteln",
        view: "front",
        highlightedZones: ["front_delts", "side_delts", "triceps"],
        image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "core_full_strength",
        name: "Plank oder Dead Bug",
        order: 6,
        sets: 2,
        reps: "30–45 sec / 8–12",
        rest: "45–60 sec",
        primary: ["Core"],
        secondary: [],
        equipment: "Körpergewicht",
        view: "front",
        highlightedZones: ["core"],
        image: "https://images.unsplash.com/photo-1566241440091-ec10de8db2e1e?w=400&auto=format&fit=crop&q=80"
      }
    ]
  }
];

/**
 * Helper-Funktionen für Template-Zugriff
 */
export const getTemplatesByCategory = (category) => {
  return workoutTemplates.filter(template => template.category === category);
};

export const getTemplateById = (id) => {
  return workoutTemplates.find(template => template.id === id);
};

export const getRecommendedTemplate = (category, sessions = []) => {
  const templates = getTemplatesByCategory(category);
  if (templates.length === 0) return null;
  
  // Einfache Recommendation-Logik: Erstes Template, oder basierend auf letztem Workout
  // TODO: Erweitern mit intelligenterer Logik (Muscle Balance, Level, etc.)
  if (sessions.length > 0) {
    const sortedSessions = [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date));
    const lastWorkout = sortedSessions[0];
    // Wenn letztes Workout aus anderer Kategorie, empfehle erstes Template
    // Sonst könnte man das nächste Template in der Liste empfehlen
  }
  
  return templates[0]; // Standard: Erstes Template der Kategorie
};
