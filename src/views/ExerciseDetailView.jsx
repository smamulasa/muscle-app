import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Trophy, TrendingUp } from 'lucide-react';
import useWorkoutStore from '../store/useWorkoutStore';
import { workouts } from '../data/workouts';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ExerciseDetailView = () => {
  const { id } = useParams(); // Wir holen die ID aus der URL (z.B. "push_bench")
  const navigate = useNavigate();
  const history = useWorkoutStore((state) => state.history);

  // --- 1. DATEN HOLEN & NAMEN FINDEN ---
  const exerciseData = useMemo(() => {
    let name = id;
    
    // Echten Namen suchen
    Object.values(workouts).forEach(workout => {
      const found = workout.exercises?.find(ex => ex.id === id);
      if (found) name = found.name;
    });

    const logs = history[id] || {};
    
    // Daten für Chart & Liste aufbereiten
    const sessionList = [];
    const chartData = [];
    let pr = 0;

    Object.entries(logs).forEach(([date, daySets]) => {
      if (!daySets || !Array.isArray(daySets)) return;

      let dayMax = 0;
      let dayVol = 0;

      // Clean Sets (nur validierte Sätze)
      const validSets = daySets.filter(s => s && s.weight);

      validSets.forEach(set => {
        const w = parseFloat(set.weight);
        const r = parseFloat(set.reps);
        if (w > dayMax) dayMax = w;
        if (w > pr) pr = w;
        dayVol += (w * r);
      });

      if (dayMax > 0) {
        const dateObj = new Date(date);
        const dateStr = dateObj.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
        
        // Für den Chart
        chartData.push({ 
          date: dateStr, 
          rawDate: dateObj, 
          weight: dayMax 
        });

        // Für die Liste unten
        sessionList.push({
          date: dateStr,
          rawDate: dateObj,
          sets: validSets,
          max: dayMax,
          vol: dayVol
        });
      }
    });

    // Sortieren
    chartData.sort((a, b) => a.rawDate - b.rawDate);
    sessionList.sort((a, b) => b.rawDate - a.rawDate); // Neueste oben

    return { name, chartData, sessionList, pr };
  }, [id, history]);

  return (
    <div className="bg-gray-50 min-h-screen pb-10 font-sans">
      
      {/* HEADER */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-md z-20 px-6 py-4 flex items-center gap-4 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors -ml-2">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 truncate pr-4">{exerciseData.name}</h1>
      </div>

      <div className="p-6 space-y-6">

        {/* --- BIG CHART --- */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 h-80">
           <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Performance (1RM Est.)</h3>
           <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={exerciseData.chartData}>
                 <defs>
                   <linearGradient id="colorBig" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#453ACF" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#453ACF" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                 <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} dy={10} minTickGap={30} />
                 <YAxis domain={['dataMin - 2.5', 'dataMax + 2.5']} axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} width={30} />
                 <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    cursor={{stroke: '#453ACF', strokeWidth: 1, strokeDasharray: '5 5'}}
                 />
                 <Area 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#453ACF" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorBig)" 
                    activeDot={{r: 6, strokeWidth: 0, fill: '#453ACF'}}
                 />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* --- STATS ROW --- */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center shrink-0">
               <Trophy size={18} />
             </div>
             <div>
               <p className="text-[10px] text-gray-400 font-bold uppercase">Personal Best</p>
               <p className="text-xl font-bold text-gray-900">{exerciseData.pr} <span className="text-xs text-gray-400">kg</span></p>
             </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
               <TrendingUp size={18} />
             </div>
             <div>
               <p className="text-[10px] text-gray-400 font-bold uppercase">Sessions</p>
               <p className="text-xl font-bold text-gray-900">{exerciseData.sessionList.length}</p>
             </div>
          </div>
        </div>

        {/* --- HISTORY LIST --- */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 px-1">History</h3>
          <div className="space-y-4">
            {exerciseData.sessionList.map((session, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-3 border-b border-gray-50 pb-3">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar size={14} />
                    <span className="text-sm font-medium">{session.date}</span>
                  </div>
                  <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    Max: {session.max} kg
                  </span>
                </div>
                
                <div className="space-y-1">
                  {session.sets.map((set, k) => (
                    <div key={k} className="flex justify-between text-sm">
                      <span className="text-gray-400 w-6 font-mono">{k+1}</span>
                      <span className="font-bold text-gray-900">{set.weight} kg</span>
                      <span className="text-gray-500">× {set.reps} reps</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ExerciseDetailView;