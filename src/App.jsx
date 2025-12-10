import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Wir importieren hier deine zwei Seiten (Views)
import HomeView from './views/HomeView';
import WorkoutView from './views/WorkoutView';
import StatsView from './views/StatsView';
import ExerciseDetailView from './views/ExerciseDetailView';
import WorkoutSessionDetailView from './views/WorkoutSessionDetailView';

function App() {
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

      </div>
    </BrowserRouter>
  );
}

export default App;