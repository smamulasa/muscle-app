import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workouts } from '../data/workouts';
import { ArrowLeft, CheckCircle, Play } from 'lucide-react';
import ExerciseCard from '../components/ExerciseCard';
import { WorkoutTimer } from '../components/WorkoutTimer';

const WorkoutView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const workout = workouts[id];

  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);

  // Der spezifische Farbwert aus deinem Screenshot
  // rgb(69, 58, 207) -> Hex: #453ACF
  const BRAND_COLOR = "bg-[#453ACF]";
  const BRAND_COLOR_HOVER = "hover:bg-[#453ACF]/90";
  // Für Texte/Icons nutzen wir die gleiche Farbe
  const BRAND_TEXT = "text-[#453ACF]";

  if (!workout) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold mb-4">Workout "{id}" nicht gefunden</h2>
        <button 
          onClick={() => navigate('/')} 
          className={`${BRAND_COLOR} ${BRAND_COLOR_HOVER} text-white px-6 py-3 rounded-full font-bold shadow-lg transition-colors`}
        >
          Zurück nach Hause
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-32 font-sans">
      
      {/* --- Header --- */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-md z-20 px-6 py-4 flex items-center justify-between border-b border-gray-100 shadow-sm transition-all">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors -ml-2">
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <div>
             <h1 className="text-xl font-bold text-gray-900 leading-tight">{workout.title}</h1>
             {!isWorkoutStarted && (
               <p className="text-xs text-gray-500">{workout.subtitle}</p>
             )}
          </div>
        </div>

        {/* TIMER */}
        {isWorkoutStarted && (
          <div className="animate-in fade-in slide-in-from-right duration-300">
            <WorkoutTimer isRunning={true} />
          </div>
        )}
      </div>

      {/* --- Content --- */}
      <div className="p-6">

        {/* --- START SECTION (Preview) --- */}
        {!isWorkoutStarted && (
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Info Box - Farblich angepasst */}
            <div className="bg-[#453ACF]/5 border border-[#453ACF]/20 rounded-2xl p-4 mb-4">
              <p className={`${BRAND_TEXT} text-sm font-bold flex items-center gap-2`}>
                👋 Ready?
              </p>
              <p className={`${BRAND_TEXT} text-xs mt-1 leading-relaxed opacity-80`}>
                Schau dir den Plan an. Drücke Start, sobald du bereit bist.
              </p>
            </div>
            
            {/* Start Button - Deine Custom Color */}
            <button 
              onClick={() => setIsWorkoutStarted(true)}
              className={`w-full ${BRAND_COLOR} ${BRAND_COLOR_HOVER} text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-transform active:scale-95`}
            >
              <Play size={22} fill="currentColor" />
              Workout Starten
            </button>
          </div>
        )}

        {/* --- ÜBUNGSLISTE --- */}
        <div className={`transition-all duration-500 ${!isWorkoutStarted ? 'opacity-60 pointer-events-none grayscale-[0.5]' : 'opacity-100'}`}>
          {workout.exercises && workout.exercises.length > 0 ? (
            workout.exercises.map(ex => (
              <ExerciseCard key={ex.id} exercise={ex} />
            ))
          ) : (
            <div className="text-center text-gray-400 py-10">
              Keine Übungen in diesem Plan hinterlegt.
            </div>
          )}
        </div>
      </div>
      
      {/* --- Finish Button (Footer) --- */}
      {isWorkoutStarted && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-[25rem] z-30 animate-in slide-in-from-bottom-10 duration-300">
          <button 
            onClick={() => navigate('/')} 
            className={`w-full ${BRAND_COLOR} ${BRAND_COLOR_HOVER} text-white font-bold py-4 rounded-full shadow-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform`}
          >
            <CheckCircle size={20} />
            Workout beenden
          </button>
        </div>
      )}

    </div>
  );
};

export default WorkoutView;