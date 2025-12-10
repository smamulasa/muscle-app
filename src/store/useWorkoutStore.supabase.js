import { create } from 'zustand';
import { createClient } from '@supabase/supabase-js';

/**
 * SUPABASE VERSION
 * 
 * Diese Version speichert alle Daten in Supabase (PostgreSQL-Datenbank).
 * Unterstützt Multi-User, Real-time Updates und Cloud-Sync.
 * 
 * Um diese Version zu nutzen, setze in .env.local:
 * VITE_STORAGE_TYPE=supabase
 * VITE_SUPABASE_URL=your-project-url
 * VITE_SUPABASE_ANON_KEY=your-anon-key
 * 
 * WICHTIG: Führe zuerst das Schema aus supabase/schema.sql in deinem Supabase Dashboard aus!
 */

// Supabase Client einmalig initialisieren (Singleton)
let supabaseClient = null;

const getSupabaseClient = () => {
  if (supabaseClient) {
    return supabaseClient;
  }
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY müssen in .env.local gesetzt sein');
  }
  
  supabaseClient = createClient(supabaseUrl, supabaseKey);
  return supabaseClient;
};

const useWorkoutStoreSupabase = create((set, get) => ({
  // --- DATEN ---
  history: {}, // Struktur: { 'bench_press': { '2023-12-09': [{weight: 80, reps: 10}, ...] } }
  sessions: [], // Liste der beendeten Workouts
  isLoading: false,
  error: null,
  initialized: false,

  // --- INITIALISIERUNG ---
  init: async () => {
    if (get().initialized) return;
    
    set({ isLoading: true, error: null });
    
    try {
      await get().loadHistory();
      await get().loadSessions();
      set({ initialized: true, isLoading: false });
    } catch (error) {
      console.error('Fehler beim Initialisieren des Supabase Stores:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  // --- DATEN LADEN ---
  
  // History aus Supabase laden
  loadHistory: async () => {
    try {
      const supabase = getSupabaseClient();
      
      // Hole alle Sets (ohne user_id Filter, da schema-no-auth.sql verwendet wird)
      // Prüfe zuerst, ob user_id Spalte existiert
      const { data, error } = await supabase
        .from('sets')
        .select('*')
        .order('date', { ascending: false })
        .order('set_index', { ascending: true });
      
      if (error) throw error;
      
      // Transformiere Daten in die erwartete Struktur
      const history = {};
      
      data?.forEach(set => {
        const date = set.date.split('T')[0]; // Nur das Datum ohne Zeit
        
        if (!history[set.exercise_id]) {
          history[set.exercise_id] = {};
        }
        
        if (!history[set.exercise_id][date]) {
          history[set.exercise_id][date] = [];
        }
        
        // Stelle sicher, dass das Array groß genug ist
        while (history[set.exercise_id][date].length <= set.set_index) {
          history[set.exercise_id][date].push(null);
        }
        
        history[set.exercise_id][date][set.set_index] = {
          weight: parseFloat(set.weight),
          reps: parseInt(set.reps),
          completed: set.completed || true
        };
      });
      
      // Entferne null-Werte aus Arrays
      Object.keys(history).forEach(exerciseId => {
        Object.keys(history[exerciseId]).forEach(date => {
          history[exerciseId][date] = history[exerciseId][date].filter(set => set !== null);
        });
      });
      
      set({ history });
    } catch (error) {
      console.error('Fehler beim Laden der History:', error);
      set({ error: error.message });
      throw error;
    }
  },

  // Sessions aus Supabase laden
  loadSessions: async () => {
    try {
      const supabase = getSupabaseClient();
      
      // Hole alle Sessions (ohne user_id Filter, da schema-no-auth.sql verwendet wird)
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('date', { ascending: false })
        .limit(100); // Letzte 100 Sessions
      
      if (error) throw error;
      
      const sessions = data?.map(session => ({
        id: session.workout_id,
        title: session.title || session.workout_id,
        duration: session.duration,
        date: session.date
      })) || [];
      
      set({ sessions });
    } catch (error) {
      console.error('Fehler beim Laden der Sessions:', error);
      set({ error: error.message });
      throw error;
    }
  },

  // --- AKTIONEN ---
  
  // 1. Einen einzelnen Satz speichern (Upsert: Insert oder Update)
  logSet: async (exerciseId, setIndex, weight, reps) => {
    try {
      const supabase = getSupabaseClient();
      const today = new Date().toISOString().split('T')[0];
      
      // Upsert: Insert oder Update falls bereits vorhanden
      // Schema ohne Auth: keine user_id Spalte
      const upsertData = {
        exercise_id: exerciseId,
        date: today,
        set_index: setIndex,
        weight: parseFloat(weight),
        reps: parseInt(reps),
        completed: true
      };
      
      const { data, error } = await supabase
        .from('sets')
        .upsert(upsertData, { onConflict: 'exercise_id,date,set_index' })
        .select()
        .single();
      
      if (error) throw error;
      
      // Aktualisiere lokalen State
      const state = get();
      const newHistory = { ...state.history };
      
      if (!newHistory[exerciseId]) newHistory[exerciseId] = {};
      if (!newHistory[exerciseId][today]) newHistory[exerciseId][today] = [];
      
      // Stelle sicher, dass das Array groß genug ist
      while (newHistory[exerciseId][today].length <= setIndex) {
        newHistory[exerciseId][today].push(null);
      }
      
      newHistory[exerciseId][today][setIndex] = {
        weight: parseFloat(weight),
        reps: parseInt(reps),
        completed: true
      };
      
      // Entferne null-Werte
      newHistory[exerciseId][today] = newHistory[exerciseId][today].filter(set => set !== null);
      
      set({ history: newHistory });
    } catch (error) {
      console.error('Fehler beim Speichern des Sets:', error);
      set({ error: error.message });
      throw error;
    }
  },

  // 2. Ein ganzes Workout abschließen
  finishWorkout: async (workoutId, title, duration, date) => {
    try {
      const supabase = getSupabaseClient();
      const dateStr = date || new Date().toISOString().split('T')[0];
      
      // Upsert: Insert oder Update falls bereits vorhanden
      // Schema ohne Auth: keine user_id Spalte
      const upsertData = {
        workout_id: workoutId,
        title: title || workoutId,
        date: dateStr,
        duration: parseInt(duration)
      };
      
      const { data, error } = await supabase
        .from('sessions')
        .upsert(upsertData, { onConflict: 'workout_id,date' })
        .select()
        .single();
      
      if (error) throw error;
      
      // Aktualisiere lokalen State
      const state = get();
      const newSessions = [...state.sessions];
      
      // Entferne alte Session falls vorhanden
      const existingIndex = newSessions.findIndex(
        s => s.id === workoutId && s.date === dateStr
      );
      
      if (existingIndex >= 0) {
        newSessions[existingIndex] = {
          id: workoutId,
          title: title || workoutId,
          duration: parseInt(duration),
          date: dateStr
        };
      } else {
        newSessions.unshift({
          id: workoutId,
          title: title || workoutId,
          duration: parseInt(duration),
          date: dateStr
        });
      }
      
      // Sortiere nach Datum (neueste zuerst)
      newSessions.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      set({ sessions: newSessions });
    } catch (error) {
      console.error('Fehler beim Speichern der Session:', error);
      set({ error: error.message });
      throw error;
    }
  },

  // 3. Einen Satz löschen
  deleteSet: async (exerciseId, setIndex) => {
    try {
      const supabase = getSupabaseClient();
      const today = new Date().toISOString().split('T')[0];
      
      // Lösche den Satz aus der Datenbank
      // Schema ohne Auth: keine user_id Spalte
      const { error } = await supabase
        .from('sets')
        .delete()
        .eq('exercise_id', exerciseId)
        .eq('date', today)
        .eq('set_index', setIndex);
      
      if (error) throw error;
      
      // Aktualisiere lokalen State
      const state = get();
      const newHistory = { ...state.history };
      
      if (newHistory[exerciseId] && newHistory[exerciseId][today]) {
        const daySets = [...newHistory[exerciseId][today]];
        daySets.splice(setIndex, 1);
        
        // Entferne null/undefined Werte
        const cleanedSets = daySets.filter(set => set !== null && set !== undefined);
        
        if (cleanedSets.length === 0) {
          delete newHistory[exerciseId][today];
          if (Object.keys(newHistory[exerciseId]).length === 0) {
            delete newHistory[exerciseId];
          }
        } else {
          newHistory[exerciseId][today] = cleanedSets;
        }
      }
      
      set({ history: newHistory });
    } catch (error) {
      console.error('Fehler beim Löschen des Sets:', error);
      set({ error: error.message });
      throw error;
    }
  },
}));

export default useWorkoutStoreSupabase;
