import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Search, Dumbbell, ChevronRight, RefreshCw } from 'lucide-react';
import useWorkoutStore from '../store/useWorkoutStore';
import { workouts } from '../data/workouts';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

const StatsView = () => {
  const navigate = useNavigate();
  const history = useWorkoutStore((state) => state.history);
  const exerciseIds = Object.keys(history);
  const [searchTerm, setSearchTerm] = useState('');

  // --- FIX: WARTEN BIS DER BROWSER BEREIT IST (Verhindert Chart-Absturz) ---
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 500); 
    return () => clearTimeout(timer);
  }, []);

  // --- FUNKTION: DEMO DATEN GENERIEREN (NUR ZUM TESTEN) ---
  const generateDemoData = () => {
    if (!confirm("Achtung: Das überschreibt deine aktuelle Historie mit Testdaten. Fortfahren?")) return;

    const newHistory = {};
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;

    const targetIds = [];
    Object.values(workouts).forEach(w => {
      if(w.exercises) {
        w.exercises.slice(0, 2).forEach(ex => targetIds.push(ex.id));
      }
    });

    targetIds.forEach(id => {
      newHistory[id] = {};
      let currentWeight = 40 + Math.floor(Math.random() * 40); 
      
      for (let i = 15; i >= 0; i--) {
        const dateObj = new Date(now.getTime() - (i * 4 * oneDay));
        const date = dateObj.toISOString().split('T')[0];
        
        const rand = Math.random();
        if (rand > 0.6) currentWeight += 2.5; 
        if (rand < 0.1) currentWeight -= 2.5; 
        
        newHistory[id][date] = [
          { weight: currentWeight, reps: 10, completed: true },
          { weight: currentWeight, reps: 8, completed: true },
          { weight: currentWeight, reps: 8, completed: true } 
        ];
      }
    });
    
    useWorkoutStore.setState({ history: newHistory });
    window.location.reload();
  };


  // --- DATEN BERECHNEN ---
  const exercisesData = useMemo(() => {
    return exerciseIds.map(id => {
      let name = id;
      let muscleGroup = 'Workout'; 
      
      Object.values(workouts).forEach(workout => {
        const found = workout.exercises?.find(ex => ex.id === id);
        if (found) {
          name = found.name;
          muscleGroup = workout.title.split(' ')[0]; 
        }
      });

      const logs = history[id] || {}; 
      let maxWeight = 0;
      let bestSetString = "0 kg";
      const chartData = [];

      Object.entries(logs).forEach(([date, daySets]) => {
        if (!daySets || !Array.isArray(daySets)) return;
        
        let dayMax = 0;
        daySets.forEach(set => {
          if (!set) return; 
          const w = parseFloat(set.weight) || 0;
          if (w > dayMax) dayMax = w;
          
          if (w > maxWeight) {
            maxWeight = w;
            bestSetString = `${w} kg × ${set.reps}`;
          }
        });

        if (dayMax > 0) {
          chartData.push({ date, weight: dayMax });
        }
      });

      chartData.sort((a, b) => new Date(a.date) - new Date(b.date));

      return {
        id,
        name,
        muscleGroup,
        maxWeight,
        bestSetString,
        chartData
      };
    }).sort((a, b) => b.maxWeight - a.maxWeight);
  }, [history, exerciseIds]);

  const filteredExercises = exercisesData.filter(ex => 
    ex.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-32 font-sans">
      
      {/* HEADER */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-md z-20 px-6 py-4 border-b border-gray-100">
         <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate('/')} className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors -ml-2">
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Progress</h1>
        </div>

        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Übung suchen..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-100 text-gray-900 text-sm rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#453ACF] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* LISTE */}
      <div className="p-4 space-y-3">
        {filteredExercises.length > 0 ? (
          filteredExercises.map((ex) => (
            <div 
              key={ex.id}
              onClick={() => navigate(`/stats/exercise/${ex.id}`)} // <--- NAVIGATION HIER EINGEBAUT
              className="bg-white rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
              style={{ height: '144px' }} 
            >
              
              {/* CONTENT */}
              <div className="relative z-10 p-4 pointer-events-none h-full flex flex-col justify-between"> 
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight truncate pr-4">{ex.name}</h3>
                    <div className="flex gap-2 mt-1.5">
                      <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                        {ex.muscleGroup}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-300 shrink-0" />
                </div>

                <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-gray-100 w-fit shadow-sm mt-auto">
                  <div className="w-8 h-8 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center shrink-0">
                    <Trophy size={14} />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Best Set</p>
                    <p className="text-base font-bold text-gray-900">{ex.bestSetString}</p>
                  </div>
                </div>
              </div>

              {/* --- MINI CHART --- */}
              {isReady && ex.chartData.length > 0 && (
                <div 
                  style={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    left: 0, 
                    right: 0,
                    height: '100px', 
                    opacity: 0.2, 
                    pointerEvents: 'none'
                  }}
                >
                  <ResponsiveContainer width="99%" height="100%">
                    <AreaChart data={ex.chartData}>
                      <defs>
                        <linearGradient id={`grad-${ex.id.replace(/[^a-zA-Z0-9]/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#453ACF" stopOpacity={0.6}/>
                          <stop offset="100%" stopColor="#453ACF" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <YAxis domain={['dataMin', 'dataMax']} hide />
                      <Area 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="#453ACF" 
                        strokeWidth={3} 
                        fill={`url(#grad-${ex.id.replace(/[^a-zA-Z0-9]/g, '')})`}
                        dot={{ r: 4, fill: "#453ACF", strokeWidth: 0, fillOpacity: 1 }} 
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Dumbbell size={24} />
            </div>
            <p className="text-gray-500 font-medium">Keine Übungen gefunden.</p>
          </div>
        )}
        
        {/* --- DEMO BUTTON --- */}
        <div className="pt-10 pb-4 flex justify-center">
            <button 
                onClick={generateDemoData}
                className="text-xs text-gray-400 flex items-center gap-2 hover:text-[#453ACF] transition-colors border border-gray-200 px-4 py-2 rounded-full"
            >
                <RefreshCw size={12} />
                Demo-Daten generieren (Reset)
            </button>
        </div>

      </div>
    </div>
  );
};

export default StatsView;