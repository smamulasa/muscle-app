export const workouts = {
  push: {
    id: 'push',
    title: "Push: Brust",
    subtitle: "Focus: Obere Brust & Pump",
    duration: "50 min",
    exercises: [
      { 
        id: 'p2', // ID beibehalten oder p1/p2 tauschen, hier als 1. Übung
        name: "Bankdrücken (Langhantel)", // Umbenannt
        sets: 3, 
        reps: "8-10", 
        rest: 120,
        startWeight: 60, // Angepasst für Bankdrücken
        startReps: 10,
        // Bild für Bankdrücken (aus deinem vorherigen Code)
        image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop&q=60"
      },
      { 
        id: 'p1', 
        name: "Schrägbankdrücken (KH o. LH)", 
        sets: 3, 
        reps: "6-10", 
        rest: 120,
        startWeight: 20,
        startReps: 8,
        // Bild passend zur Schrägbank
        image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&auto=format&fit=crop&q=60" 
      },
      { 
        id: 'p3', 
        name: "Butterfly (Maschine)", 
        sets: 3, 
        reps: "10-15", 
        rest: 60,
        startWeight: 30,
        startReps: 12,
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop&q=60"
      },
      { 
        id: 'p4', 
        name: "Cable Crossover (Low to High)", 
        sets: 3, 
        reps: "12-15", 
        rest: 60,
        startWeight: 10,
        startReps: 12,
        image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&auto=format&fit=crop&q=60"
      },
      { 
        id: 'p5', 
        name: "Svend Press", 
        sets: 2, 
        reps: "Failure", 
        rest: 45,
        startWeight: 5,
        startReps: 20,
        image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop&q=60" 
      }
    ]
  },

  pull: {
    id: 'pull',
    title: "Pull Strength",
    subtitle: "Rücken • Bizeps",
    duration: "50 min",
    exercises: [
      { 
        id: 'u1', 
        name: "Latziehen (oder Klimmzüge)", 
        sets: 3, 
        reps: "8-10", 
        rest: 120,
        startWeight: 50,
        startReps: 8,
        image: "https://images.unsplash.com/photo-1598971639058-211a73287138?w=400&auto=format&fit=crop&q=60"
      },
      { 
        id: 'u2', 
        name: "Rudern (Langhantel)", 
        sets: 3, 
        reps: "10-12", 
        rest: 90,
        startWeight: 60,
        startReps: 10,
        image: "https://images.unsplash.com/photo-1598971457999-55169746e14d?w=400&auto=format&fit=crop&q=60"
      },
      { 
        id: 'u3', 
        name: "Bizeps Curls (Kurzhantel)", 
        sets: 3, 
        reps: "10-12", 
        rest: 60,
        startWeight: 12,
        startReps: 10,
        image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&auto=format&fit=crop&q=60"
      }
    ]
  },

  shoulders: { 
    id: 'shoulders',
    title: "3D Shoulders",
    subtitle: "Heavy Press • Side Delts • Rear Delts",
    duration: "45 min", 
    exercises: [
      { 
        id: 's1', 
        name: "Military Press (LH oder KH)", 
        sets: 4, 
        reps: "6-10", 
        rest: 120,
        startWeight: 30,
        startReps: 8,
        image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&auto=format&fit=crop&q=60"
      },
      { 
        id: 's2', 
        name: "Seitheben (Kurzhantel)", 
        sets: 3, 
        reps: "10-15", 
        rest: 60,
        startWeight: 8,
        startReps: 12,
        image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&auto=format&fit=crop&q=60"
      },
      { 
        id: 's3', 
        name: "Face Pulls", 
        sets: 3, 
        reps: "15-20", 
        rest: 60,
        startWeight: 15,
        startReps: 15,
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop&q=60"
      },
      { 
        id: 's4', 
        name: "Cable Lateral Raise (Einarmig)", 
        sets: 3, 
        reps: "12-15", 
        rest: 45,
        startWeight: 5,
        startReps: 12,
        image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&auto=format&fit=crop&q=60"
      }
    ]
  },

  legs: { 
    id: 'legs',
    title: "Leg Day",
    subtitle: "Quads • Hams • Calves",
    duration: "60 min", 
    exercises: [
      { 
        id: 'l1', 
        name: "Kniebeugen (Squats)", 
        sets: 4, 
        reps: "8-10", 
        rest: 120,
        startWeight: 60,
        startReps: 8,
        image: "https://images.unsplash.com/photo-1574680096141-1cddd32e0340?w=400&auto=format&fit=crop&q=60"
      },
      { 
        id: 'l2', 
        name: "Beinpresse", 
        sets: 3, 
        reps: "10-12", 
        rest: 90,
        startWeight: 100,
        startReps: 10,
        image: "https://images.unsplash.com/photo-1574680096141-1cddd32e0340?w=400&auto=format&fit=crop&q=60"
      },
      { 
        id: 'l3', 
        name: "Beinbeuger (Maschine)", 
        sets: 3, 
        reps: "12-15", 
        rest: 60,
        startWeight: 40,
        startReps: 12,
        image: "https://images.unsplash.com/photo-1574680096141-1cddd32e0340?w=400&auto=format&fit=crop&q=60"
      }
    ]
  },

  core: { 
    id: 'core',
    title: "Core & Stability",
    subtitle: "Abs • Obliques • Lower Back",
    duration: "20 min",
    exercises: [
       { 
        id: 'c1', 
        name: "Plank (Unterarmstütz)", 
        sets: 3, 
        reps: "60", 
        rest: 60,
        startWeight: 0,
        startReps: 60,
        image: "https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=400&auto=format&fit=crop&q=60" 
      },
      { 
        id: 'c2', 
        name: "Beinheben (Liegend)", 
        sets: 3, 
        reps: "15-20", 
        rest: 45,
        startWeight: 0,
        startReps: 15,
        image: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=400&auto=format&fit=crop&q=60" 
      },
      { 
        id: 'c3', 
        name: "Russian Twists", 
        sets: 3, 
        reps: "20", 
        rest: 45,
        startWeight: 5,
        startReps: 20,
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&auto=format&fit=crop&q=60" 
      }
    ]
  }
};