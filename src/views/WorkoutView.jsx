import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workouts } from '../data/workouts';
import { ArrowLeft, CheckCircle, Play } from 'lucide-react';
import ExerciseCard from '../components/ExerciseCard';
import { WorkoutTimer } from '../components/WorkoutTimer';
import ConfirmModal from '../components/ConfirmModal'; // Hier importieren wir das Modal wieder
import BottomNav from '../components/BottomNav';

const WorkoutView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const workout = workouts[id];

  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [showExitModal, setShowExitModal] = useState(false);

  // --- NAVIGATION GUARD ---
  useEffect(() => {
    if (isWorkoutStarted) {
      window.history.pushState(null, "", window.location.href);

      const handlePopState = (event) => {
        window.history.pushState(null, "", window.location.href);
        setShowExitModal(true); 
      };

      const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = ''; 
      };

      window.addEventListener('popstate', handlePopState);
      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('popstate', handlePopState);
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [isWorkoutStarted]);


  if (!workout) return <div>Workout nicht gefunden</div>;

  const handleStart = () => {
    setIsWorkoutStarted(true);
    setStartTime(Date.now()); 
  };

  const handleFinish = () => {
    if (startTime) {
      const endTime = Date.now();
      const durationSeconds = Math.floor((endTime - startTime) / 1000);
      const existingHistory = JSON.parse(localStorage.getItem('workoutHistory') || '{}');

      existingHistory[id] = {
        lastDuration: durationSeconds,
        lastDate: new Date().toISOString(),
        completed: true
      };
      localStorage.setItem('workoutHistory', JSON.stringify(existingHistory));
    }
    setIsWorkoutStarted(false); 
    navigate('/'); 
  };

  const confirmExit = () => {
    setShowExitModal(false);
    setIsWorkoutStarted(false);
    navigate('/');
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-32 font-sans">
      
      {/* --- MODAL --- */}
      <ConfirmModal 
        isOpen={showExitModal}
        title="Workout abbrechen?"
        message="Dein aktueller Fortschritt geht verloren, wenn du das Workout jetzt beendest."
        onConfirm={confirmExit}
        onCancel={() => setShowExitModal(false)}
      />

      {/* --- HEADER --- */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-md z-20 px-6 py-4 flex items-center justify-between border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
               if (isWorkoutStarted) {
                 setShowExitModal(true); 
               } else {
                 navigate(-1);
               }
            }} 
            className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors -ml-2"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <div>
             <h1 className="text-xl font-bold text-gray-900 leading-tight">{workout.title}</h1>
             {!isWorkoutStarted && (
               <p className="text-xs text-gray-500">{workout.subtitle}</p>
             )}
          </div>
        </div>

        {isWorkoutStarted && startTime && (
          <WorkoutTimer startTime={startTime} />
        )}
      </div>

      {/* --- CONTENT --- */}
      <div className="p-6">
        {!isWorkoutStarted && (
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button 
              onClick={handleStart} 
              className="w-full bg-[#453ACF] hover:opacity-90 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Play size={22} fill="currentColor" />
              Workout Starten
            </button>
          </div>
        )}

        <div className={`transition-all duration-500 ${!isWorkoutStarted ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}>
          {workout.exercises && workout.exercises.length > 0 ? (
            workout.exercises.map(ex => (
              <ExerciseCard key={ex.id} exercise={ex} />
            ))
          ) : (
            <div className="text-center text-gray-400">Keine Übungen.</div>
          )}
        </div>
      </div>
      
      {/* --- FINISH BUTTON --- */}
      {isWorkoutStarted && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-[25rem] z-30 animate-in slide-in-from-bottom-10">
          <button 
            onClick={handleFinish} 
            className="w-full bg-[#453ACF] hover:opacity-90 text-white font-bold py-4 rounded-full shadow-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <CheckCircle size={20} />
            Workout beenden
          </button>
        </div>
      )}

      {/* --- BOTTOM NAV (nur wenn kein Workout läuft) --- */}
      {!isWorkoutStarted && <BottomNav />}

    </div>
  );
};

export default WorkoutView;