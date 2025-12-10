import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Trophy, TrendingUp, Dumbbell } from 'lucide-react';
import useWorkoutStore from '../store/useWorkoutStore';
import { workouts } from '../data/workouts';
import BottomNav from '../components/BottomNav';

const WorkoutSessionDetailView = () => {
  const { workoutId, date } = useParams();
  const navigate = useNavigate();
  const history = useWorkoutStore((state) => state.history);
  
  // Workout-Daten aus workouts.js holen
  const workout = workouts[workoutId];
  
  // Session-Daten aus localStorage holen
  const sessionData = useMemo(() => {
    const storedHistory = JSON.parse(localStorage.getItem('workoutHistory') || '{}');
    return storedHistory[workoutId] || {};
  }, [workoutId]);

  // Berechne alle Details für diese Session
  const sessionDetails = useMemo(() => {
    if (!workout || !date) return null;

    const exercisesWithData = workout.exercises?.map(exercise => {
      const exerciseHistory = history[exercise.id] || {};
      const daySets = exerciseHistory[date] || [];
      
      let maxWeight = 0;
      let totalVolume = 0;
      const sets = [];

      daySets.forEach((set, index) => {
        if (set && set.weight && set.reps) {
          const weight = parseFloat(set.weight);
          const reps = parseFloat(set.reps);
          
          if (weight > maxWeight) maxWeight = weight;
          totalVolume += (weight * reps);
          
          sets.push({
            setNumber: index + 1,
            weight,
            reps,
            completed: set.completed || false
          });
        }
      });

      return {
        ...exercise,
        sets,
        maxWeight,
        totalVolume,
        hasData: sets.length > 0
      };
    }) || [];

    // Gesamt-Max-Gewicht berechnen
    const overallMaxWeight = Math.max(...exercisesWithData.map(ex => ex.maxWeight), 0);
    
    // Gesamt-Volumen berechnen
    const totalVolume = exercisesWithData.reduce((sum, ex) => sum + ex.totalVolume, 0);

    return {
      exercises: exercisesWithData,
      overallMaxWeight,
      totalVolume,
      date: new Date(date),
      duration: sessionData.lastDuration || 0
    };
  }, [workout, date, history, sessionData]);

  if (!workout || !sessionDetails) {
    return (
      <div className="bg-gray-50 min-h-screen pb-32 font-sans">
        <div className="p-6 text-center">
          <p className="text-gray-500">Workout nicht gefunden</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-[#453ACF]">Zurück</button>
        </div>
        <BottomNav />
      </div>
    );
  }

  const formatDate = (dateObj) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (dateObj.toDateString() === today.toDateString()) return "Heute";
    if (dateObj.toDateString() === yesterday.toDateString()) return "Gestern";
    
    return dateObj.toLocaleDateString('de-DE', { 
      weekday: 'long', 
      day: '2-digit', 
      month: 'long' 
    });
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0 min";
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    if (sec > 0) return `${min} min ${sec} s`;
    return `${min} min`;
  };

  const formatVolume = (volume) => {
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}t`;
    return `${Math.round(volume)} kg`;
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-32 font-sans">
      
      {/* HEADER */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-md z-20 px-6 py-4 flex items-center gap-4 border-b border-gray-100">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors -ml-2"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-gray-900 truncate">{workout.title}</h1>
          <p className="text-xs text-gray-500">{workout.subtitle}</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        
        {/* STATS CARDS */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Dauer</p>
                <p className="text-xl font-bold text-gray-900">{formatDuration(sessionDetails.duration)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center shrink-0">
                <Trophy size={18} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Max Gewicht</p>
                <p className="text-xl font-bold text-gray-900">
                  {sessionDetails.overallMaxWeight > 0 ? `${sessionDetails.overallMaxWeight} kg` : '-'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* VOLUME CARD */}
        {sessionDetails.totalVolume > 0 && (
          <div className="bg-gradient-to-br from-[#453ACF]/10 to-[#453ACF]/5 p-4 rounded-2xl border border-[#453ACF]/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#453ACF]/20 text-[#453ACF] flex items-center justify-center shrink-0">
                <TrendingUp size={18} />
              </div>
              <div>
                <p className="text-[10px] text-[#453ACF] font-bold uppercase">Gesamt-Volumen</p>
                <p className="text-xl font-bold text-[#453ACF]">{formatVolume(sessionDetails.totalVolume)}</p>
              </div>
            </div>
          </div>
        )}

        {/* DATE CARD */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center shrink-0">
              <Calendar size={18} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Datum</p>
              <p className="text-base font-bold text-gray-900">{formatDate(sessionDetails.date)}</p>
            </div>
          </div>
        </div>

        {/* ÜBUNGEN */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 px-1">Übungen</h3>
          <div className="space-y-4">
            {sessionDetails.exercises.map((exercise) => (
              <div key={exercise.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100">
                    {exercise.image ? (
                      <img 
                        src={exercise.image} 
                        alt={exercise.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="w-full h-full flex items-center justify-center text-2xl bg-gradient-to-br from-[#453ACF]/20 to-[#453ACF]/5" style={{ display: exercise.image ? 'none' : 'flex' }}>
                      💪
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg leading-tight mb-1">{exercise.name}</h4>
                    <div className="flex gap-2 flex-wrap">
                      <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-md">
                        {exercise.sets} Sets
                      </span>
                      <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-md">
                        {exercise.reps} Reps
                      </span>
                      {exercise.maxWeight > 0 && (
                        <span className="bg-yellow-50 text-yellow-700 text-xs font-bold px-2 py-1 rounded-md">
                          Max: {exercise.maxWeight} kg
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* SETS */}
                {exercise.hasData ? (
                  <div className="space-y-2 pt-3 border-t border-gray-50">
                    {exercise.sets.map((set) => (
                      <div 
                        key={set.setNumber}
                        className={`flex justify-between items-center p-2 rounded-lg ${
                          set.completed ? 'bg-[#453ACF]/5' : 'bg-gray-50'
                        }`}
                      >
                        <span className="text-gray-400 w-6 font-mono text-sm">Set {set.setNumber}</span>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-gray-900">{set.weight} kg</span>
                          <span className="text-gray-500">× {set.reps} reps</span>
                          {set.completed && (
                            <span className="text-[#453ACF] text-xs">✓</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="pt-3 border-t border-gray-50 text-center py-4">
                    <p className="text-sm text-gray-400">Keine Daten für diese Übung</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      <BottomNav />
    </div>
  );
};

export default WorkoutSessionDetailView;

