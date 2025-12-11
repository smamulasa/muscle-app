import { create } from 'zustand';
import { createClient } from '@supabase/supabase-js';
import useAuthStore from './useAuthStore';

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

// Queue-Speicher in LocalStorage
const QUEUE_STORAGE_KEY = 'muscle-app-sync-queue';
const getQueue = () => {
  try {
    const queue = localStorage.getItem(QUEUE_STORAGE_KEY);
    return queue ? JSON.parse(queue) : [];
  } catch {
    return [];
  }
};

const saveQueue = (queue) => {
  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('Fehler beim Speichern der Queue:', error);
  }
};

const addToQueue = (action, data) => {
  const queue = getQueue();
  
  // Prüfe auf Duplikate: Entferne alte Items mit gleicher Aktion und Daten
  // z.B. wenn logSet für gleiche exerciseId/setIndex mehrmals aufgerufen wird
  const filteredQueue = queue.filter(item => {
    if (item.action !== action) return true;
    
    // Für logSet: Entferne alte Einträge mit gleicher exerciseId, setIndex, date
    if (action === 'logSet') {
      const today = new Date().toISOString().split('T')[0];
      return !(
        item.data.exerciseId === data.exerciseId &&
        item.data.setIndex === data.setIndex
      );
    }
    
    // Für deleteSet: Entferne alte Einträge mit gleicher exerciseId, setIndex
    if (action === 'deleteSet') {
      return !(
        item.data.exerciseId === data.exerciseId &&
        item.data.setIndex === data.setIndex
      );
    }
    
    // Für finishWorkout: Entferne alte Einträge mit gleicher workoutId, date
    if (action === 'finishWorkout') {
      const dateStr = data.date || new Date().toISOString().split('T')[0];
      return !(
        item.data.workoutId === data.workoutId &&
        (item.data.date || new Date(item.timestamp).toISOString().split('T')[0]) === dateStr
      );
    }
    
    return true;
  });
  
  // Füge neues Item hinzu
  filteredQueue.push({
    id: Date.now() + Math.random(), // Eindeutige ID
    action,
    data,
    timestamp: new Date().toISOString(),
    retries: 0
  });
  
  saveQueue(filteredQueue);
};

const removeFromQueue = (id) => {
  const queue = getQueue();
  const filtered = queue.filter(item => item.id !== id);
  saveQueue(filtered);
  return filtered;
};

// Online/Offline Status prüfen
const isOnline = () => navigator.onLine;

const useWorkoutStoreSupabase = create((set, get) => ({
  // --- DATEN ---
  history: {}, // Struktur: { 'bench_press': { '2023-12-09': [{weight: 80, reps: 10}, ...] } }
  sessions: [], // Liste der beendeten Workouts
  isLoading: false,
  error: null,
  initialized: false,
  isOnline: isOnline(),
  syncStatus: 'idle', // 'idle' | 'syncing' | 'synced' | 'error'
  queueLength: 0,

  // --- INITIALISIERUNG ---
  init: async () => {
    if (get().initialized) return;
    
    set({ isLoading: true, error: null });
    
    // Online/Offline Event-Listener registrieren
    const updateOnlineStatus = () => {
      const online = isOnline();
      set({ isOnline: online });
      
      if (online) {
        // Automatisch synchronisieren wenn wieder online
        get().syncQueue();
      }
    };
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Queue-Länge aktualisieren und regelmäßig aktualisieren
    const updateQueueLength = () => {
      const queue = getQueue();
      set({ queueLength: queue.length });
    };
    
    updateQueueLength();
    
    // Aktualisiere Queue-Länge alle 2 Sekunden (für UI-Updates)
    const queueInterval = setInterval(updateQueueLength, 2000);
    
    // Cleanup beim Unmount (wird in useEffect gemacht)
    if (typeof window !== 'undefined') {
      window._queueInterval = queueInterval;
    }
    
    try {
      await get().loadHistory();
      await get().loadSessions();
      
      // Queue synchronisieren falls online
      if (isOnline()) {
        await get().syncQueue();
      }
      
      set({ initialized: true, isLoading: false });
    } catch (error) {
      console.error('Fehler beim Initialisieren des Supabase Stores:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  // --- OFFLINE-SYNC ---
  
  // Queue synchronisieren
  syncQueue: async () => {
    if (!isOnline()) {
      console.log('📴 Offline - Queue wird nicht synchronisiert');
      return;
    }
    
    const queue = getQueue();
    if (queue.length === 0) {
      set({ syncStatus: 'idle', queueLength: 0 });
      return;
    }
    
    set({ syncStatus: 'syncing', queueLength: queue.length });
    
    const failedItems = [];
    
    for (const item of queue) {
      try {
        // Führe die Aktion aus
        switch (item.action) {
          case 'logSet':
            await get()._logSetDirect(item.data.exerciseId, item.data.setIndex, item.data.weight, item.data.reps);
            break;
          case 'deleteSet':
            await get()._deleteSetDirect(item.data.exerciseId, item.data.setIndex);
            break;
          case 'finishWorkout':
            await get()._finishWorkoutDirect(item.data.workoutId, item.data.title, item.data.duration, item.data.date);
            break;
          default:
            console.warn('Unbekannte Queue-Aktion:', item.action);
        }
        
        // Entferne erfolgreich synchronisierte Items
        removeFromQueue(item.id);
      } catch (error) {
        console.error(`Fehler beim Synchronisieren von Queue-Item ${item.id}:`, error);
        
        // Retry-Logik: Maximal 3 Versuche
        item.retries = (item.retries || 0) + 1;
        if (item.retries < 3) {
          failedItems.push(item);
        } else {
          console.error(`Queue-Item ${item.id} nach 3 Versuchen fehlgeschlagen, entfernt`);
          removeFromQueue(item.id);
        }
      }
    }
    
    // Aktualisiere Queue-Länge
    const remainingQueue = getQueue();
    set({ 
      syncStatus: remainingQueue.length === 0 ? 'synced' : 'error',
      queueLength: remainingQueue.length 
    });
    
    if (remainingQueue.length === 0) {
      console.log('✅ Queue erfolgreich synchronisiert');
    } else {
      console.log(`⚠️ ${remainingQueue.length} Items konnten nicht synchronisiert werden`);
    }
  },

  // --- DATEN LADEN ---
  
  // History aus Supabase laden
  loadHistory: async () => {
    try {
      const supabase = getSupabaseClient();
      
      // Hole User-ID aus Auth Store
      const authState = useAuthStore.getState();
      const userId = authState.user?.id || null;
      
      // Query aufbauen
      let query = supabase
        .from('sets')
        .select('*')
        .order('date', { ascending: false })
        .order('set_index', { ascending: true });
      
      // Filter nach user_id wenn User eingeloggt
      if (userId) {
        query = query.eq('user_id', userId);
      } else {
        // Ohne Auth: Nur Sets ohne user_id (für anonyme Nutzung)
        query = query.is('user_id', null);
      }
      
      const { data, error } = await query;
      
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
      
      // Hole User-ID aus Auth Store
      const authState = useAuthStore.getState();
      const userId = authState.user?.id || null;
      
      // Query aufbauen
      let query = supabase
        .from('sessions')
        .select('*')
        .order('date', { ascending: false })
        .limit(100); // Letzte 100 Sessions
      
      // Filter nach user_id wenn User eingeloggt
      if (userId) {
        query = query.eq('user_id', userId);
      } else {
        // Ohne Auth: Nur Sessions ohne user_id (für anonyme Nutzung)
        query = query.is('user_id', null);
      }
      
      const { data, error } = await query;
      
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
    const today = new Date().toISOString().split('T')[0];
    
    // Aktualisiere lokalen State sofort (optimistic update)
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
    
    // Versuche zu synchronisieren
    if (isOnline()) {
      try {
        await get()._logSetDirect(exerciseId, setIndex, weight, reps);
      } catch (error) {
        console.warn('Fehler beim Speichern in Supabase, füge zu Queue hinzu:', error);
        addToQueue('logSet', { exerciseId, setIndex, weight, reps });
        set({ queueLength: getQueue().length });
      }
    } else {
      // Offline: Füge zu Queue hinzu
      console.log('📴 Offline - Set wird zur Queue hinzugefügt');
      addToQueue('logSet', { exerciseId, setIndex, weight, reps });
      set({ queueLength: getQueue().length });
    }
  },

  // Direkte Speicherung (ohne Queue)
  _logSetDirect: async (exerciseId, setIndex, weight, reps) => {
    const supabase = getSupabaseClient();
    const today = new Date().toISOString().split('T')[0];
    
    // Hole User-ID aus Auth Store
    const authState = useAuthStore.getState();
    const userId = authState.user?.id || null;
    
    const upsertData = {
      exercise_id: exerciseId,
      date: today,
      set_index: setIndex,
      weight: parseFloat(weight),
      reps: parseInt(reps),
      completed: true
    };
    
    // Füge user_id hinzu wenn User eingeloggt
    if (userId) {
      upsertData.user_id = userId;
    }
    
    // Bestimme onConflict basierend auf Auth
    const onConflict = userId 
      ? 'user_id,exercise_id,date,set_index'
      : 'exercise_id,date,set_index';
    
    const { error } = await supabase
      .from('sets')
      .upsert(upsertData, { onConflict })
      .select()
      .single();
    
    if (error) throw error;
  },

  // 2. Ein ganzes Workout abschließen
  finishWorkout: async (workoutId, title, duration, date) => {
    const dateStr = date || new Date().toISOString().split('T')[0];
    
    // Aktualisiere lokalen State sofort (optimistic update)
    const state = get();
    const newSessions = [...state.sessions];
    
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
    
    newSessions.sort((a, b) => new Date(b.date) - new Date(a.date));
    set({ sessions: newSessions });
    
    // Versuche zu synchronisieren
    if (isOnline()) {
      try {
        await get()._finishWorkoutDirect(workoutId, title, duration, date);
      } catch (error) {
        console.warn('Fehler beim Speichern in Supabase, füge zu Queue hinzu:', error);
        addToQueue('finishWorkout', { workoutId, title, duration, date });
        set({ queueLength: getQueue().length });
      }
    } else {
      // Offline: Füge zu Queue hinzu
      console.log('📴 Offline - Session wird zur Queue hinzugefügt');
      addToQueue('finishWorkout', { workoutId, title, duration, date });
      set({ queueLength: getQueue().length });
    }
  },

  // Direkte Speicherung (ohne Queue)
  _finishWorkoutDirect: async (workoutId, title, duration, date) => {
    const supabase = getSupabaseClient();
    const dateStr = date || new Date().toISOString().split('T')[0];
    
    // Hole User-ID aus Auth Store
    const authState = useAuthStore.getState();
    const userId = authState.user?.id || null;
    
    const upsertData = {
      workout_id: workoutId,
      title: title || workoutId,
      date: dateStr,
      duration: parseInt(duration)
    };
    
    // Füge user_id hinzu wenn User eingeloggt
    if (userId) {
      upsertData.user_id = userId;
    }
    
    // Bestimme onConflict basierend auf Auth
    const onConflict = userId 
      ? 'user_id,workout_id,date'
      : 'workout_id,date';
    
    const { error } = await supabase
      .from('sessions')
      .upsert(upsertData, { onConflict })
      .select()
      .single();
    
    if (error) throw error;
  },

  // 3. Einen Satz löschen
  deleteSet: async (exerciseId, setIndex) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Aktualisiere lokalen State sofort (optimistic update)
    const state = get();
    const newHistory = { ...state.history };
    
    if (newHistory[exerciseId] && newHistory[exerciseId][today]) {
      const daySets = [...newHistory[exerciseId][today]];
      daySets.splice(setIndex, 1);
      
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
    
    // Versuche zu synchronisieren
    if (isOnline()) {
      try {
        await get()._deleteSetDirect(exerciseId, setIndex);
      } catch (error) {
        console.warn('Fehler beim Löschen in Supabase, füge zu Queue hinzu:', error);
        addToQueue('deleteSet', { exerciseId, setIndex });
        set({ queueLength: getQueue().length });
      }
    } else {
      // Offline: Füge zu Queue hinzu
      console.log('📴 Offline - Löschung wird zur Queue hinzugefügt');
      addToQueue('deleteSet', { exerciseId, setIndex });
      set({ queueLength: getQueue().length });
    }
  },

  // Direktes Löschen (ohne Queue)
  _deleteSetDirect: async (exerciseId, setIndex) => {
    const supabase = getSupabaseClient();
    const today = new Date().toISOString().split('T')[0];
    
    // Hole User-ID aus Auth Store
    const authState = useAuthStore.getState();
    const userId = authState.user?.id || null;
    
    let deleteQuery = supabase
      .from('sets')
      .delete()
      .eq('exercise_id', exerciseId)
      .eq('date', today)
      .eq('set_index', setIndex);
    
    // Filter nach user_id wenn User eingeloggt
    if (userId) {
      deleteQuery = deleteQuery.eq('user_id', userId);
    } else {
      deleteQuery = deleteQuery.is('user_id', null);
    }
    
    const { error } = await deleteQuery;
    
    if (error) throw error;
  },
}));

export default useWorkoutStoreSupabase;
