import React, { useState, useEffect, useMemo } from 'react';
import { Check, Save } from 'lucide-react';
import useWorkoutStore from '../store/useWorkoutStore';

const ExerciseCard = ({ exercise }) => {
  if (!exercise) return null;

  const history = useWorkoutStore((state) => state.history);
  const logSet = useWorkoutStore((state) => state.logSet);

  // BRANDING FARBEN
  const BRAND_COLOR = "#453ACF";

  const { todayLog, previousLog } = useMemo(() => {
    if (!history || !exercise.id || !history[exercise.id]) {
      return { todayLog: [], previousLog: [] };
    }
    const exerciseHistory = history[exercise.id];
    const today = new Date().toISOString().split('T')[0];
    
    const tLog = exerciseHistory[today] || [];
    
    // Letztes Training finden (nicht heute)
    const sortedDates = Object.keys(exerciseHistory)
      .filter(date => date !== today)
      .sort();
    
    const lastDate = sortedDates[sortedDates.length - 1];
    const pLog = lastDate ? exerciseHistory[lastDate] : [];

    return { todayLog: tLog, previousLog: pLog };
  }, [history, exercise.id]);
  
  const setsCount = exercise.sets || 3;
  const setsArray = Array.from({ length: setsCount }, (_, i) => i);

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-6">
      
      {/* Header */}
      <div className="flex gap-4 mb-6 items-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100">
           {exercise.image ? (
             <img src={exercise.image} alt={exercise.name} className="w-full h-full object-cover" />
           ) : (
             <div className="w-full h-full flex items-center justify-center text-2xl">💪</div>
           )}
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-900 leading-tight">{exercise.name}</h3>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-md">{exercise.sets} Sets</span>
            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-md">{exercise.reps} Reps</span>
          </div>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-2">
        {setsArray.map((i) => (
          <SetRow 
            key={i} 
            index={i} 
            exerciseId={exercise.id}
            todayData={todayLog[i]}       
            prevData={previousLog[i]}     
            onSave={logSet}
            defaultWeight={exercise.startWeight}
            defaultReps={exercise.startReps}
            brandColor={BRAND_COLOR} // Farbe durchreichen
          />
        ))}
      </div>
    </div>
  );
};

// --- Die intelligente Zeile ---
const SetRow = ({ index, exerciseId, todayData, prevData, onSave, defaultWeight, defaultReps, brandColor }) => {
  const initialWeight = todayData?.weight || prevData?.weight || defaultWeight || '';
  const initialReps = todayData?.reps || prevData?.reps || defaultReps || '';
  const initialDone = todayData?.completed || false;

  const [weight, setWeight] = useState(initialWeight);
  const [reps, setReps] = useState(initialReps);
  const [done, setDone] = useState(initialDone);

  // Wenn alte Daten vorhanden sind, zeige sie als Platzhalter oder Wert
  const isPreviousData = !todayData && prevData; 

  useEffect(() => {
    if (todayData) { 
      setWeight(todayData.weight); 
      setReps(todayData.reps); 
      setDone(todayData.completed); 
    } else if (prevData) {
      // Wir setzen die Werte vor, aber markieren es NICHT als erledigt
      setWeight(prevData.weight);
      setReps(prevData.reps);
      setDone(false);
    }
  }, [todayData, prevData]); 

  const save = () => {
    if(!weight || !reps) return;
    onSave(exerciseId, index, weight, reps);
    setDone(true);
  };

  return (
    <div className={`flex items-center gap-3 p-2 rounded-xl transition-all ${done ? 'bg-[#453ACF]/10 ring-1 ring-[#453ACF]/20' : 'bg-gray-50'}`}>
      <span className="w-8 text-center font-bold text-gray-400 text-sm">{index + 1}</span>
      
      <div className="relative flex-1">
          <input 
            type="number" placeholder="kg" value={weight} 
            onChange={(e) => { setWeight(e.target.value); setDone(false); }} 
            className={`w-full bg-white border-none rounded-lg py-2.5 text-center font-bold text-gray-900 shadow-sm outline-none focus:ring-2 focus:ring-[${brandColor}]`} 
            style={{ color: isPreviousData ? '#9CA3AF' : '#111827' }} // Grau wenn alt, Schwarz wenn neu
            onFocus={(e) => e.target.style.color = '#111827'} // Schwarz beim Tippen
          />
          {/* Kleiner Hinweis, wenn es alte Daten sind */}
          {isPreviousData && !done && (
             <span className="absolute -top-2 right-1 text-[8px] bg-gray-200 text-gray-500 px-1 rounded">Last</span>
          )}
      </div>
      
      <input 
        type="number" placeholder="Rep" value={reps} 
        onChange={(e) => { setReps(e.target.value); setDone(false); }} 
        className={`flex-1 w-full bg-white border-none rounded-lg py-2.5 text-center font-bold text-gray-900 shadow-sm outline-none focus:ring-2 focus:ring-[${brandColor}]`} 
      />
      
      {/* Save Button mit Branding */}
      <button 
        onClick={save} 
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 ${done ? 'bg-[#453ACF] text-white shadow-lg shadow-indigo-200' : 'bg-gray-200 text-gray-400'}`}
      >
        {done ? <Check size={18} strokeWidth={3} /> : <Save size={18} />}
      </button>
    </div>
  );
};

export default ExerciseCard;