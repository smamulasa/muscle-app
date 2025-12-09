import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useWorkoutStore = create(
  persist(
    (set, get) => ({
      history: {}, 
      sessions: [],

      logSet: (exerciseId, setIndex, weight, reps) => set((state) => {
        const today = new Date().toISOString().split('T')[0];
        const exerciseHistory = state.history[exerciseId] || {};
        const todaysLog = exerciseHistory[today] || [];
        
        const newLog = [...todaysLog];
        newLog[setIndex] = { weight, reps, completed: true };

        return {
          history: {
            ...state.history,
            [exerciseId]: { ...exerciseHistory, [today]: newLog }
          }
        };
      }),

      finishWorkout: (workoutId, title, duration) => set((state) => {
        const newSession = {
          workoutId, title, duration, date: new Date().toISOString(),
        };
        return { sessions: [newSession, ...state.sessions] };
      }),

      // Daten von HEUTE abrufen (mit Haken)
      getTodayLog: (exerciseId) => {
        const today = new Date().toISOString().split('T')[0];
        return get().history[exerciseId]?.[today] || [];
      },

      // NEU: Daten vom LETZTEN MAL abrufen (ohne Heute zu beachten)
      getPreviousLog: (exerciseId) => {
        const history = get().history[exerciseId];
        if (!history) return [];
        
        const today = new Date().toISOString().split('T')[0];
        
        // Alle Daten außer heute suchen und sortieren
        const previousDates = Object.keys(history)
          .filter(date => date !== today) // Heute ignorieren
          .sort();
        
        if (previousDates.length === 0) return [];
        
        // Das letzte Datum nehmen
        const lastDate = previousDates[previousDates.length - 1];
        return history[lastDate] || [];
      }
    }),
    {
      name: 'muscle-app-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useWorkoutStore;