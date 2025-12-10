import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useWorkoutStore = create(
  persist(
    (set, get) => ({
      // --- DATEN ---
      history: {}, // Struktur: { 'bench_press': { '2023-12-09': [{weight: 80, reps: 10}, ...] } }
      sessions: [], // Liste der beendeten Workouts für die Startseite

      // --- AKTIONEN ---
      
      // 1. Einen einzelnen Satz speichern (passiert live beim Tippen auf den Haken)
      logSet: (exerciseId, setIndex, weight, reps) => {
        const today = new Date().toISOString().split('T')[0]; // "2023-12-09"
        
        set((state) => {
          const newHistory = { ...state.history };
          
          // Sicherstellen, dass die Struktur existiert
          if (!newHistory[exerciseId]) newHistory[exerciseId] = {};
          if (!newHistory[exerciseId][today]) newHistory[exerciseId][today] = [];
          
          // Den Satz speichern
          newHistory[exerciseId][today][setIndex] = {
            weight: parseFloat(weight),
            reps: parseFloat(reps),
            completed: true
          };

          return { history: newHistory };
        });
      },

      // 2. Ein ganzes Workout abschließen (für die Statistik auf der Startseite)
      finishWorkout: (workoutId, title, duration, date) => {
        set((state) => ({
          sessions: [
            ...state.sessions,
            { id: workoutId, title, duration, date }
          ]
        }));
      },

      // 3. Einen Satz löschen
      deleteSet: (exerciseId, setIndex) => {
        const today = new Date().toISOString().split('T')[0];
        
        set((state) => {
          const newHistory = { ...state.history };
          
          if (!newHistory[exerciseId] || !newHistory[exerciseId][today]) {
            return state;
          }
          
          // Array kopieren und Satz am Index entfernen
          const daySets = [...newHistory[exerciseId][today]];
          daySets.splice(setIndex, 1);
          
          // Neues Array aufbauen: Alle vorhandenen Sätze sequenziell neu indizieren
          // Das stellt sicher, dass nach dem Löschen keine Lücken entstehen
          const cleanedSets = [];
          daySets.forEach((set) => {
            if (set !== null && set !== undefined) {
              cleanedSets.push(set);
            }
          });
          
          newHistory[exerciseId][today] = cleanedSets;
          
          return { history: newHistory };
        });
      }
    }),
    {
      name: 'muscle-app-storage', // Name im LocalStorage
      storage: createJSONStorage(() => localStorage), // Explizit LocalStorage nutzen
    }
  )
);

export default useWorkoutStore;