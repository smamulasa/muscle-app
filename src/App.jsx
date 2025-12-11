import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useWorkoutStore from './store/useWorkoutStore';
import useAuthStore from './store/useAuthStore';
import SyncStatus from './components/SyncStatus';
import ProtectedRoute from './components/ProtectedRoute';

// Wir importieren hier deine zwei Seiten (Views)
import HomeView from './views/HomeView';
import WorkoutView from './views/WorkoutView';
import StatsView from './views/StatsView';
import ExerciseDetailView from './views/ExerciseDetailView';
import WorkoutSessionDetailView from './views/WorkoutSessionDetailView';
import AuthView from './views/AuthView';

function App() {
  const store = useWorkoutStore();
  const authStore = useAuthStore();
  const storageType = import.meta.env.VITE_STORAGE_TYPE || 'local';
  const init = store.init;
  const initialized = store.initialized;
  const authInit = authStore.init;
  const authInitialized = !authStore.isLoading;

  // Initialisiere Auth Store beim App-Start (nur bei Supabase)
  useEffect(() => {
    if (storageType === 'supabase' && authInit) {
      // Prüfe ob bereits initialisiert (isLoading wird zu false)
      if (authStore.isLoading) {
        authInit().catch(error => {
          console.error('Fehler bei Auth-Initialisierung:', error);
        });
      }
    }
  }, [storageType, authInit, authStore.isLoading]);

  // Initialisiere Supabase Store beim App-Start (falls aktiv und User eingeloggt)
  // WICHTIG: Store prüft selbst, ob User gewechselt hat und lädt Daten neu
  useEffect(() => {
    const user = authStore.user;
    
    if (storageType === 'supabase' && init && user && !authStore.isLoading) {
      // init() prüft selbst, ob User gewechselt hat
      init().catch(error => {
        console.error('Fehler bei Supabase-Initialisierung:', error);
      });
    } else if (storageType === 'supabase' && !user && initialized && !authStore.isLoading) {
      // User hat sich ausgeloggt - Store zurücksetzen
      console.log('🔄 User ausgeloggt - setze Store zurück');
      if (store.reset) {
        store.reset();
      }
    }
  }, [storageType, init, initialized, authStore.user, authStore.isLoading]);

  return (
    <BrowserRouter>
      {/* Dieser div-Container simuliert ein Handy-Display auf großen Bildschirmen 
         (max-w-md = maximale Breite wie ein Handy).
      */}
      <div className="max-w-md mx-auto bg-gray-50 min-h-screen shadow-2xl overflow-hidden relative font-sans">
        
        <Routes>
          {/* Auth-Seite (öffentlich) */}
          <Route path="/auth" element={<AuthView />} />
          
          {/* Geschützte Routen (nur wenn Supabase aktiv, sonst öffentlich) */}
          {storageType === 'supabase' ? (
            <>
              <Route path="/" element={<ProtectedRoute><HomeView /></ProtectedRoute>} />
              <Route path="/workout/:id" element={<ProtectedRoute><WorkoutView /></ProtectedRoute>} />
              <Route path="/stats" element={<ProtectedRoute><StatsView /></ProtectedRoute>} />
              <Route path="/stats/exercise/:id" element={<ProtectedRoute><ExerciseDetailView /></ProtectedRoute>} />
              <Route path="/workout-session/:workoutId/:date" element={<ProtectedRoute><WorkoutSessionDetailView /></ProtectedRoute>} />
              {/* Redirect von root zu auth wenn nicht eingeloggt */}
              <Route path="*" element={<Navigate to="/auth" replace />} />
            </>
          ) : (
            <>
              {/* LocalStorage-Modus: Alle Routen öffentlich */}
              <Route path="/" element={<HomeView />} />
              <Route path="/workout/:id" element={<WorkoutView />} />
              <Route path="/stats" element={<StatsView />} />
              <Route path="/stats/exercise/:id" element={<ExerciseDetailView />} />
              <Route path="/workout-session/:workoutId/:date" element={<WorkoutSessionDetailView />} />
            </>
          )}
        </Routes>

        {/* Sync-Status Anzeige (nur bei Supabase) */}
        <SyncStatus />

      </div>
    </BrowserRouter>
  );
}

export default App;