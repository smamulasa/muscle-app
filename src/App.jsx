import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import useWorkoutStore from './store/useWorkoutStore';
import SyncStatus from './components/SyncStatus';

// Wir importieren hier deine zwei Seiten (Views)
import HomeView from './views/HomeView';
import WorkoutView from './views/WorkoutView';
import StatsView from './views/StatsView';
import ExerciseDetailView from './views/ExerciseDetailView';
import WorkoutSessionDetailView from './views/WorkoutSessionDetailView';

function App() {
  const store = useWorkoutStore();
  const storageType = import.meta.env.VITE_STORAGE_TYPE || 'local';
  const init = store.init;
  const initialized = store.initialized;

  // Initialisiere Supabase Store beim App-Start (falls aktiv)
  useEffect(() => {
    if (storageType === 'supabase' && init && !initialized) {
      init().catch(error => {
        console.error('Fehler bei Supabase-Initialisierung:', error);
      });
    }
  }, [storageType, init, initialized]);

  return (
    <BrowserRouter>
      {/* Dieser div-Container simuliert ein Handy-Display auf großen Bildschirmen 
         (max-w-md = maximale Breite wie ein Handy).
      */}
      <div className="max-w-md mx-auto bg-gray-50 min-h-screen shadow-2xl overflow-hidden relative font-sans">
        
        <Routes>
          {/* Wenn der Pfad "/" ist -> Zeige HomeView */}
          <Route path="/" element={<HomeView />} />

          {/* Wenn der Pfad "/workout/push" ist -> Zeige WorkoutView */}
          <Route path="/workout/:id" element={<WorkoutView />} />

          <Route path="/stats" element={<StatsView />} />
          <Route path="/stats/exercise/:id" element={<ExerciseDetailView />} />
          <Route path="/workout-session/:workoutId/:date" element={<WorkoutSessionDetailView />} />
        </Routes>

        {/* Sync-Status Anzeige (nur bei Supabase) */}
        <SyncStatus />

      </div>
    </BrowserRouter>
  );
}

export default App;