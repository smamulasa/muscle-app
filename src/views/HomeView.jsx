import React, { useEffect, useState, useMemo } from 'react';
import { Play, Home, List, Activity, History, User, CheckCircle2, Clock, Trophy, TrendingUp, TrendingDown, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { workouts } from '../data/workouts'; // WICHTIG: Import für dynamische Daten
import BottomNav from '../components/BottomNav';
import useWorkoutStore from '../store/useWorkoutStore';
import useAuthStore from '../store/useAuthStore';

const HomeView = () => {
  const navigate = useNavigate();
  const workoutHistory = useWorkoutStore((state) => state.history);
  const storageType = import.meta.env.VITE_STORAGE_TYPE || 'local';
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  
  // --- STATE ---
  const [history, setHistory] = useState({});
  const [recentSessions, setRecentSessions] = useState([]);

  // --- 1. DATEN LADEN ---
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('workoutHistory') || '{}');
    setHistory(storedHistory);

    const historyArray = Object.entries(storedHistory).map(([key, data]) => {
      const workout = workouts[key];
      const sessionDate = data.lastDate ? new Date(data.lastDate).toISOString().split('T')[0] : '';
      
      // Berechne Max-Gewicht für diese Session
      let maxWeight = 0;
      let totalVolume = 0;
      
      if (workout && workout.exercises && sessionDate) {
        workout.exercises.forEach(exercise => {
          const exerciseHistory = workoutHistory[exercise.id] || {};
          const daySets = exerciseHistory[sessionDate] || [];
          
          daySets.forEach(set => {
            if (set && set.weight) {
              const weight = parseFloat(set.weight) || 0;
              const reps = parseFloat(set.reps) || 0;
              if (weight > maxWeight) maxWeight = weight;
              totalVolume += (weight * reps);
            }
          });
        });
      }
      
      return {
        id: key,
        title: key.charAt(0).toUpperCase() + key.slice(1) + " Workout", 
        date: data.lastDate,
        duration: data.lastDuration,
        maxWeight,
        totalVolume
      };
    });

    // Sortieren: Neuestes zuerst (für die Logik "Was war zuletzt?")
    historyArray.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Berechne Rekorde und Vergleiche
    const sessionsWithStats = historyArray.map((session, index) => {
      const workout = workouts[session.id];
      
      // Prüfe, ob es ein Rekord ist (vergleiche mit allen anderen Sessions dieses Workouts)
      let isRecord = false;
      let isMaxWeightRecord = false;
      let isVolumeRecord = false;
      
      if (session.maxWeight > 0 || session.totalVolume > 0) {
        // Alle anderen Sessions für dieses Workout finden
        const otherSessions = historyArray.filter(s => 
          s.id === session.id && s.date !== session.date
        );
        
        const allMaxWeights = otherSessions.map(s => s.maxWeight).filter(w => w > 0);
        const allVolumes = otherSessions.map(s => s.totalVolume).filter(v => v > 0);
        
        const highestMaxWeight = allMaxWeights.length > 0 ? Math.max(...allMaxWeights) : 0;
        const highestVolume = allVolumes.length > 0 ? Math.max(...allVolumes) : 0;
        
        isMaxWeightRecord = session.maxWeight > highestMaxWeight;
        isVolumeRecord = session.totalVolume > highestVolume;
        isRecord = isMaxWeightRecord || isVolumeRecord;
      }
      
      // Vergleich zum letzten Mal (vorherige Session desselben Workouts)
      let comparisonToLast = null;
      const previousSession = historyArray.find(s => 
        s.id === session.id && new Date(s.date) < new Date(session.date)
      );
      
      if (previousSession && session.maxWeight > 0 && previousSession.maxWeight > 0) {
        const diff = session.maxWeight - previousSession.maxWeight;
        const percentDiff = previousSession.maxWeight > 0 
          ? ((diff / previousSession.maxWeight) * 100) 
          : 0;
        comparisonToLast = {
          absolute: diff,
          percent: percentDiff,
          isPositive: diff > 0,
          isNegative: diff < 0
        };
      }
      
      return {
        ...session,
        isRecord,
        isMaxWeightRecord,
        isVolumeRecord,
        comparisonToLast
      };
    });
    
    setRecentSessions(sessionsWithStats);
  }, [workoutHistory]);

  // --- LOGIK: SMART RECOMMENDATION (NEXT UP) ---
  const nextWorkoutId = useMemo(() => {
    if (recentSessions.length === 0) return 'push'; // Default für Neulinge

    const lastWorkoutId = recentSessions[0].id;
    
    // Einfache Rotation: Push -> Pull -> Legs -> Shoulders -> Push
    const sequence = ['push', 'pull', 'legs', 'shoulders'];
    const currentIndex = sequence.indexOf(lastWorkoutId);
    
    if (currentIndex === -1) return 'push'; // Fallback
    
    // Nimm das nächste in der Liste (oder fang von vorne an)
    const nextIndex = (currentIndex + 1) % sequence.length;
    return sequence[nextIndex];
  }, [recentSessions]);

  // Daten für die Hero Card laden
  const recommendedWorkout = workouts[nextWorkoutId] || workouts['push'];


  // --- HELPER ---
  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return "Heute";
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "";
    const min = Math.floor(seconds / 60);
    return `${min} min`;
  };

  const isThisWeek = (isoDate) => {
    if (!isoDate) return false;
    const date = new Date(isoDate);
    const now = new Date();
    const dayOfWeek = (now.getDay() + 6) % 7; 
    const monday = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek);
    monday.setHours(0, 0, 0, 0);
    return date >= monday;
  };

  const weeklySessions = recentSessions.filter(s => isThisWeek(s.date));

  return (
    <div className="bg-gray-50 min-h-screen pb-32 font-sans">
      
      {/* --- HEADER --- */}
      <div className="sticky top-0 bg-gray-50/95 backdrop-blur-sm z-10 px-6 pt-8 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Today</h1>
          <p className="text-gray-500">
            {storageType === 'supabase' && user 
              ? `Willkommen, ${user.email?.split('@')[0] || 'User'}`
              : 'Welcome back, Beast'
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          {storageType === 'supabase' && user && (
            <button
              onClick={async () => {
                await signOut();
                navigate('/auth');
              }}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
              title="Abmelden"
            >
              <LogOut size={20} />
            </button>
          )}
          <div className="w-10 h-10 rounded-full bg-[#453ACF]/10 border-2 border-white shadow-sm flex items-center justify-center text-[#453ACF] font-bold">
            {storageType === 'supabase' && user 
              ? (user.email?.charAt(0).toUpperCase() || 'U')
              : 'A'
            }
          </div>
        </div>
      </div>

      {/* --- HERO CARD (SMART NEXT UP) --- */}
      <section className="px-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Next Up</h2>
        
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 group">
          
          {/* Bild Area */}
          <div 
            onClick={() => navigate(`/workout/${nextWorkoutId}`)}
            className="relative w-full h-48 bg-gray-800 rounded-2xl overflow-hidden mb-4 cursor-pointer"
          >
             {/* Dynamisches Bild aus den Workout-Daten */}
             {recommendedWorkout.exercises && recommendedWorkout.exercises[0]?.image ? (
                <img 
                  src={recommendedWorkout.exercises[0].image} // Nimmt Bild der ersten Übung als Cover
                  alt="Workout Cover" 
                  className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
             ) : null}
             {/* Fallback Platzhalter */}
             <div 
               className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-[#453ACF]/30 to-[#453ACF]/10"
               style={{ display: recommendedWorkout.exercises && recommendedWorkout.exercises[0]?.image ? 'none' : 'flex' }}
             >
               💪
             </div>
             
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

             <div className="absolute bottom-4 left-4 text-white">
                <span className="bg-[#453ACF] text-[10px] font-bold px-2 py-1 rounded text-white mb-2 inline-block shadow-sm">
                  RECOMMENDED
                </span>
             </div>

             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <div className="bg-white/20 backdrop-blur-md p-4 rounded-full">
                 <Play fill="white" size={24} />
               </div>
             </div>
          </div>

          {/* Infos */}
          <div>
            <div className="flex justify-between items-start mb-2">
              <div>
                {/* Dynamischer Titel */}
                <h3 className="text-lg font-bold text-gray-900">{recommendedWorkout.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{recommendedWorkout.subtitle}</p>
              </div>
              
              {/* Zeige 'Last Run' nur, wenn es für DIESES Workout schon Daten gibt */}
              {history[nextWorkoutId] && (
                <div className="text-right">
                  <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Last Run</span>
                  <p className="text-sm font-bold text-[#453ACF] flex items-center gap-1 justify-end">
                    <Clock size={12} />
                    {formatDuration(history[nextWorkoutId].lastDuration)}
                  </p>
                </div>
              )}
            </div>
            
            {/* CTA BUTTON */}
            <button 
              onClick={() => navigate(`/workout/${nextWorkoutId}`)} 
              className="w-full mt-4 bg-[#453ACF] hover:opacity-90 active:scale-95 transition-all text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg shadow-indigo-200"
            >
              <Play fill="currentColor" size={16} />
              Start {recommendedWorkout.title}
            </button>
          </div>

        </div>
      </section>

      {/* --- BROWSE SPLITS --- */}
      <section className="mb-8">
        <div className="px-6 flex justify-between items-end mb-3">
            <h3 className="text-lg font-bold text-gray-900">Browse Splits</h3>
        </div>
        
        <div className="flex gap-4 overflow-x-auto px-6 pb-4 snap-x hide-scrollbar">
          <SplitCard 
            title="Push" subtitle="Chest • Shoulders" color="brand" icon="💪" 
            lastDuration={history['push']?.lastDuration}
            onClick={() => navigate('/workout/push')} 
          />
          <SplitCard 
            title="Pull" subtitle="Back • Biceps" color="purple" icon="🦍" 
            lastDuration={history['pull']?.lastDuration}
            onClick={() => navigate('/workout/pull')} 
          />
          <SplitCard 
            title="Legs" subtitle="Quads • Hams" color="orange" icon="🦵" 
            lastDuration={history['legs']?.lastDuration}
            onClick={() => navigate('/workout/legs')} 
          />
          <SplitCard 
            title="Shoulder" subtitle="3D Delts" color="brand" icon="🥥" 
            lastDuration={history['shoulders']?.lastDuration}
            onClick={() => navigate('/workout/shoulders')}
          />
        </div>
      </section>

      {/* --- WEEKLY HISTORY --- */}
      <section className="px-6 mb-8">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-bold text-gray-900">This Week</h2>
          {weeklySessions.length > 0 && (
             <span className="text-xs font-bold text-[#453ACF] bg-[#453ACF]/10 px-3 py-1.5 rounded-full border border-[#453ACF]/20">
               {weeklySessions.length} Sessions
             </span>
          )}
        </div>
        
        {weeklySessions.length > 0 ? (
          <div className="space-y-4">
            {weeklySessions.map((session, index) => {
              // Datum für URL formatieren (YYYY-MM-DD)
              let sessionDate = '';
              if (session.date) {
                try {
                  const dateObj = new Date(session.date);
                  if (!isNaN(dateObj.getTime())) {
                    sessionDate = dateObj.toISOString().split('T')[0];
                  } else {
                    // Fallback: Heute verwenden
                    sessionDate = new Date().toISOString().split('T')[0];
                  }
                } catch (e) {
                  sessionDate = new Date().toISOString().split('T')[0];
                }
              } else {
                // Fallback: Heute verwenden wenn kein Datum vorhanden
                sessionDate = new Date().toISOString().split('T')[0];
              }
              
              const handleClick = () => {
                console.log('Navigating to:', `/workout-session/${session.id}/${sessionDate}`);
                navigate(`/workout-session/${session.id}/${sessionDate}`);
              };
              
              return (
                <div 
                  key={index} 
                  onClick={handleClick}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transition-all hover:shadow-md active:scale-[0.98] cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-900">{session.title}</h4>
                          {session.isRecord && (
                            <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                              <Trophy size={10} fill="currentColor" />
                              Rekord
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                          <span>{formatDate(session.date)}</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span className="flex items-center gap-1">
                            <Clock size={10} /> {formatDuration(session.duration)}
                          </span>
                          {session.maxWeight > 0 && (
                            <>
                              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                              <span className="font-medium text-gray-600">Max: {session.maxWeight} kg</span>
                            </>
                          )}
                        </div>
                        {/* Vergleich zum letzten Mal */}
                        {session.comparisonToLast && (
                          <div className="mt-2 flex items-center gap-2">
                            {session.comparisonToLast.isPositive ? (
                              <span className="text-[10px] font-bold text-green-600 flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded">
                                <TrendingUp size={10} />
                                +{session.comparisonToLast.absolute.toFixed(1)} kg (+{session.comparisonToLast.percent.toFixed(1)}%)
                              </span>
                            ) : session.comparisonToLast.isNegative ? (
                              <span className="text-[10px] font-bold text-red-600 flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded">
                                <TrendingDown size={10} />
                                {session.comparisonToLast.absolute.toFixed(1)} kg ({session.comparisonToLast.percent.toFixed(1)}%)
                              </span>
                            ) : null}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-sm border-dashed">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
              <History size={24} />
            </div>
            <h4 className="font-bold text-gray-900">Let's go!</h4>
            <p className="text-sm text-gray-400 mt-1 mb-4">Noch keine Workouts diese Woche.</p>
          </div>
        )}
      </section>

      {/* --- BOTTOM NAV --- */}
      <BottomNav />

    </div>
  );
};

const SplitCard = ({ title, subtitle, color, icon, lastDuration, onClick }) => {
  const colors = {
    brand: "bg-[#453ACF]/10 text-[#453ACF] border-[#453ACF]/20",
    purple: "bg-purple-50 text-purple-900 border-purple-100",
    orange: "bg-orange-50 text-orange-900 border-orange-100"
  };
  
  const theme = colors[color] || colors.brand;

  return (
    <div 
      onClick={onClick} 
      className={`min-w-[140px] snap-center p-4 rounded-2xl flex flex-col justify-between h-36 border active:scale-95 transition-transform cursor-pointer ${theme}`}
    >
      <div>
        <div className="flex justify-between items-start">
          <div className="w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center mb-2 shadow-sm text-sm">{icon}</div>
          
          {lastDuration && (
             <span className="text-[10px] font-bold bg-white/60 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
               <Clock size={8} /> {Math.floor(lastDuration / 60)}m
             </span>
          )}
        </div>
        <h4 className="font-bold">{title}</h4>
        <p className="text-[10px] opacity-70 font-medium leading-tight">{subtitle}</p>
      </div>
    </div>
  );
};

export default HomeView;