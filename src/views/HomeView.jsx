import React, { useEffect, useState, useMemo } from 'react';
import { Bell, Flame, TrendingUp, ArrowRight, Trophy, Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { workouts } from '../data/workouts';
import BottomNav from '../components/BottomNav';
import useWorkoutStore from '../store/useWorkoutStore';
import useAuthStore from '../store/useAuthStore';

const HomeView = () => {
  const navigate = useNavigate();
  const workoutHistory = useWorkoutStore((state) => state.history);
  const sessions = useWorkoutStore((state) => state.sessions);
  const storageType = import.meta.env.VITE_STORAGE_TYPE || 'local';
  const user = useAuthStore((state) => state.user);

  // --- STATE ---
  const [recentSessions, setRecentSessions] = useState([]);

  // --- HELPER FUNCTIONS ---
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'GOOD MORNING';
    if (hour < 18) return 'GOOD AFTERNOON';
    return 'GOOD EVENING';
  };

  const getUserName = () => {
    if (storageType === 'supabase' && user) {
      return user.user_metadata?.name || user.email?.split('@')[0] || 'User';
    }
    return 'Alex Morgan';
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0 min';
    const min = Math.floor(seconds / 60);
    return `${min} min`;
  };

  const formatVolume = (kg) => {
    if (!kg) return '0 KG';
    if (kg >= 1000) return `${(kg / 1000).toFixed(1)}k`;
    return `${kg.toFixed(1)}`;
  };

  // --- STATISTIKEN BERECHNEN ---
  const stats = useMemo(() => {
    // Streak berechnen
    let streak = 0;
    if (sessions.length > 0) {
      const sortedSessions = [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date));
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let checkDate = new Date(today);
      for (const session of sortedSessions) {
        const sessionDate = new Date(session.date);
        sessionDate.setHours(0, 0, 0, 0);
        
        if (sessionDate.getTime() === checkDate.getTime()) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else if (sessionDate < checkDate) {
          break;
        }
      }
    }

    // Last Workout
    const lastWorkout = sessions.length > 0 
      ? [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date))[0]
      : null;

    // Previous Sessions (letzte 7 Tage)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const lastWeekSessions = sessions.filter(s => new Date(s.date) >= sevenDaysAgo);
    const previousWeekSessions = sessions.filter(s => {
      const date = new Date(s.date);
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      return date >= twoWeeksAgo && date < sevenDaysAgo;
    });

    // Time in Training (letzte 7 Tage)
    const totalTimeSeconds = lastWeekSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const hours = Math.floor(totalTimeSeconds / 3600);
    const minutes = Math.floor((totalTimeSeconds % 3600) / 60);
    const timeInTraining = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

    // Time in Training - Bar Chart Daten (letzte 7 Tage, Tag für Tag)
    const dailyTrainingTimes = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 6; i >= 0; i--) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      checkDate.setHours(0, 0, 0, 0);
      
      const daySessions = sessions.filter(s => {
        const sessionDate = new Date(s.date);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === checkDate.getTime();
      });
      
      const dayTotalSeconds = daySessions.reduce((sum, s) => sum + (s.duration || 0), 0);
      dailyTrainingTimes.push(dayTotalSeconds);
    }
    
    // Max-Wert für Normalisierung (höchste Trainingszeit der letzten 7 Tage)
    const maxDailyTime = Math.max(...dailyTrainingTimes, 1); // Mindestens 1, um Division durch 0 zu vermeiden

    // Muscle Balance - Kategorisierung: Push, Pull, Core
    const muscleGroups = { push: 0, pull: 0, core: 0 };
    
    lastWeekSessions.forEach(session => {
      const workout = workouts[session.id];
      if (workout) {
        // Kategorisiere basierend auf Workout-ID
        if (session.id === 'push' || session.id === 'shoulders') {
          // Push: Brust, Schultern (Drücken)
          muscleGroups.push++;
        } else if (session.id === 'pull') {
          // Pull: Rücken, Bizeps (Ziehen)
          muscleGroups.pull++;
        } else if (session.id === 'core') {
          // Core: Bauch, Core-Übungen
          muscleGroups.core++;
        } else if (session.id === 'legs') {
          // Legs kann zu Push oder Pull gezählt werden, hier zu Push (Beinpresse ist Push-Bewegung)
          muscleGroups.push++;
        }
      }
    });
    
    const total = muscleGroups.push + muscleGroups.pull + muscleGroups.core;
    const muscleBalance = total > 0 ? {
      push: Math.round((muscleGroups.push / total) * 100),
      pull: Math.round((muscleGroups.pull / total) * 100),
      core: Math.round((muscleGroups.core / total) * 100)
    } : { push: 45, pull: 30, core: 25 };

    // Last Workout Details
    let lastWorkoutVolume = 0;
    let lastWorkoutMaxWeight = 0;
    if (lastWorkout) {
      const workout = workouts[lastWorkout.id];
      const sessionDate = new Date(lastWorkout.date).toISOString().split('T')[0];
      
      if (workout && workout.exercises) {
        workout.exercises.forEach(exercise => {
          const exerciseHistory = workoutHistory[exercise.id] || {};
          const daySets = exerciseHistory[sessionDate] || [];
          
          daySets.forEach(set => {
            if (set && set.weight) {
              const weight = parseFloat(set.weight) || 0;
              const reps = parseFloat(set.reps) || 0;
              if (weight > lastWorkoutMaxWeight) lastWorkoutMaxWeight = weight;
              lastWorkoutVolume += (weight * reps);
            }
          });
        });
      }
    }

    // Performance Change
    let performanceChange = null;
    if (lastWorkout && sessions.length > 1) {
      const previousWorkout = [...sessions]
        .filter(s => s.id === lastWorkout.id && s.date !== lastWorkout.date)
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
      
      if (previousWorkout) {
        let previousVolume = 0;
        const prevDate = new Date(previousWorkout.date).toISOString().split('T')[0];
        const workout = workouts[previousWorkout.id];
        
        if (workout && workout.exercises) {
          workout.exercises.forEach(exercise => {
            const exerciseHistory = workoutHistory[exercise.id] || {};
            const daySets = exerciseHistory[prevDate] || [];
            
            daySets.forEach(set => {
              if (set && set.weight) {
                const weight = parseFloat(set.weight) || 0;
                const reps = parseFloat(set.reps) || 0;
                previousVolume += (weight * reps);
              }
            });
          });
        }
        
        if (previousVolume > 0) {
          performanceChange = ((lastWorkoutVolume - previousVolume) / previousVolume) * 100;
        }
      }
    }

    // Discover Workout - Intelligente Empfehlung
    // Finde ein Workout, das noch nicht gemacht wurde oder am längsten nicht gemacht wurde
    const allWorkoutIds = Object.keys(workouts);
    let discoverWorkout = null;
    
    if (sessions.length === 0) {
      // Wenn keine Sessions: Empfehle das erste Workout
      discoverWorkout = workouts[allWorkoutIds[0]];
    } else {
      // Finde Workouts, die noch nie gemacht wurden
      const doneWorkoutIds = new Set(sessions.map(s => s.id));
      const notDoneWorkouts = allWorkoutIds.filter(id => !doneWorkoutIds.has(id));
      
      if (notDoneWorkouts.length > 0) {
        // Empfehle ein Workout, das noch nie gemacht wurde
        discoverWorkout = workouts[notDoneWorkouts[0]];
      } else {
        // Alle Workouts wurden schon gemacht - finde das am längsten nicht gemachte
        const workoutLastDates = {};
        sessions.forEach(session => {
          const workoutId = session.id;
          const sessionDate = new Date(session.date);
          if (!workoutLastDates[workoutId] || sessionDate > new Date(workoutLastDates[workoutId])) {
            workoutLastDates[workoutId] = sessionDate;
          }
        });
        
        // Finde das Workout mit dem ältesten Datum
        let oldestDate = new Date();
        let oldestWorkoutId = allWorkoutIds[0];
        
        allWorkoutIds.forEach(id => {
          const lastDate = workoutLastDates[id] || new Date(0);
          if (lastDate < oldestDate) {
            oldestDate = lastDate;
            oldestWorkoutId = id;
          }
        });
        
        discoverWorkout = workouts[oldestWorkoutId];
      }
    }

    return {
      streak,
      lastWorkout,
      lastWorkoutVolume,
      lastWorkoutMaxWeight,
      performanceChange,
      previousSessionsCount: lastWeekSessions.length,
      previousWeekCount: previousWeekSessions.length,
      timeInTraining,
      muscleBalance,
      dailyTrainingTimes,
      maxDailyTime,
      discoverWorkout
    };
  }, [sessions, workoutHistory]);

  // --- SESSIONS FÜR PREVIOUS WORKOUTS ---
  useEffect(() => {
    const historyArray = sessions.map(session => {
      const workout = workouts[session.id];
      const sessionDate = session.date ? new Date(session.date).toISOString().split('T')[0] : '';
      
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
      
      // Prüfe ob Rekord
      const isRecord = sessions.some(s => 
        s.id === session.id && 
        s.date !== session.date && 
        (s.maxWeight || 0) < maxWeight
      );
      
      return {
        id: session.id,
        title: session.title || (session.id.charAt(0).toUpperCase() + session.id.slice(1) + " Workout"),
        date: session.date,
        duration: session.duration,
        maxWeight,
        totalVolume,
        isRecord
      };
    });

    historyArray.sort((a, b) => new Date(b.date) - new Date(a.date));
    setRecentSessions(historyArray.slice(0, 5));
  }, [workoutHistory, sessions]);

  const lastWorkoutWorkout = stats.lastWorkout ? workouts[stats.lastWorkout.id] : null;
  
  // Prüfe ob Discover Workout "neu" ist (noch nie gemacht)
  const discoverWorkoutIsNew = stats.discoverWorkout && !sessions.some(s => s.id === stats.discoverWorkout.id);

  return (
    <div className="bg-black min-h-screen pb-28 font-sans text-white">
      
      {/* --- HEADER --- */}
      <div className="flex items-center p-6 justify-between sticky top-0 z-20 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3">
          {/* Profilbild */}
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm ring-2 ring-white/10 transition-transform group-hover:scale-105">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#30e87a] rounded-full border-2 border-black"></div>
          </div>
          
          <div>
            <p className="text-[11px] text-[#8e8e93] font-bold uppercase tracking-wider mb-0.5">{getGreeting()}</p>
            <h2 className="text-white text-lg font-bold leading-none">{getUserName()}</h2>
          </div>
        </div>
        
        {/* Notifications */}
        <button className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#1c1c1e] hover:bg-[#2c2c2e] text-white transition-colors border border-white/5">
          <Bell size={20} />
          <div className="absolute top-2.5 right-3 w-1.5 h-1.5 bg-[#ff9500] rounded-full ring-2 ring-[#1c1c1e]"></div>
        </button>
      </div>

      {/* --- SUMMARY SECTION --- */}
      <div className="px-6 pt-4 pb-6">
        <h1 className="text-white text-[34px] font-bold leading-tight tracking-tight">Summary</h1>
        {stats.streak > 0 && (
          <div className="flex items-center gap-2 mt-1">
            <Flame size={16} className="text-[#30e87a]" />
            <p className="text-[#8e8e93] text-sm font-medium">{stats.streak}-day streak. Keep it up!</p>
          </div>
        )}
      </div>

      {/* --- ZWEI GROSSE CARDS --- */}
      <div className="px-6 grid grid-cols-2 gap-3 mb-8">
        {/* Last Workout Card */}
        <div 
          onClick={() => stats.lastWorkout && navigate(`/workout-session/${stats.lastWorkout.id}/${new Date(stats.lastWorkout.date).toISOString().split('T')[0]}`)}
          className="relative overflow-hidden rounded-xl bg-[#1c1c1e] p-4 flex flex-col justify-between h-[220px] group active:scale-[0.98] transition-all duration-300 shadow-lg shadow-black/20 border border-white/5 cursor-pointer"
        >
          <div className="flex justify-between items-start z-10">
            <div className="flex flex-col">
              <h3 className="text-[12px] font-bold text-white leading-[1.2]">Last<br/>Workout</h3>
              <span className="text-[#8e8e93] text-[10px] font-medium mt-1">
                {stats.lastWorkout ? formatDate(stats.lastWorkout.date) : 'No workouts'}
              </span>
            </div>
            <ChevronRight size={20} className="text-gray-500 group-hover:text-white transition-colors" />
          </div>
          
          {lastWorkoutWorkout && (
            <div className="relative flex flex-col z-10 flex-grow justify-end gap-4 mt-1">
              <div className="flex items-end justify-between w-full">
                <h2 className="text-[22px] font-bold text-white leading-tight">{lastWorkoutWorkout.title}</h2>
                {stats.performanceChange && stats.performanceChange > 0 && (
                  <div className="flex items-center gap-1 mb-1">
                    <TrendingUp size={18} className="text-[#30e87a]" />
                    <span className="text-[14px] text-[#30e87a] font-bold">+{stats.performanceChange.toFixed(0)}%</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-8 mb-1">
                <div>
                  <p className="text-[10px] text-[#8e8e93] uppercase font-bold tracking-wide mb-0.5">Volume</p>
                  <p className="text-xl font-bold text-white leading-none">
                    {formatVolume(stats.lastWorkoutVolume)} <span className="text-[12px] font-medium text-[#8e8e93]">KG</span>
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-[#8e8e93] uppercase font-bold tracking-wide mb-0.5">Time</p>
                  <p className="text-xl font-bold text-white leading-none">
                    {formatDuration(stats.lastWorkout?.duration || 0).replace(' min', '')} <span className="text-[12px] font-medium text-[#8e8e93]">min</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Discover Card */}
        {stats.discoverWorkout && (
          <div className="relative overflow-hidden rounded-xl p-4 flex flex-col justify-between h-[220px] group active:scale-[0.98] transition-all duration-300 shadow-lg shadow-black/20 border border-white/5">
            {/* Gradient Background - dunkler wie in HTML */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#733F94] via-[#8B4A5C] to-[#7B4C2C]"></div>
            {/* Dunkles Overlay für zusätzliche Verdunkelung */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1c1c1e]/30 to-[#1c1c1e]/80"></div>
            
            <div className="relative z-10 flex justify-between items-start">
              <span className="bg-[#a855f7]/20 text-[#a855f7] text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-md border border-[#a855f7]/20 uppercase tracking-wide">
                Next
              </span>
            </div>
            
            <div className="relative z-10">
              <span className="text-[#ff9500] font-bold tracking-wide uppercase text-[10px] mb-1 block">Discover</span>
              <h3 className="text-lg font-bold text-white leading-tight mb-1">{stats.discoverWorkout.title}</h3>
              <p className="text-[11px] text-gray-300 mb-3">{stats.discoverWorkout.subtitle || 'Ready to start?'}</p>
              <button 
                onClick={() => navigate(`/workout/${stats.discoverWorkout.id}`)}
                className="w-full bg-white text-black text-xs font-bold py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
              >
                <span>Start</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- DREI KLEINERE CARDS --- */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-3 gap-3">
          {/* Previous Sessions */}
          <div className="bg-[#1c1c1e] border border-white/5 rounded-xl p-3 flex flex-col items-start relative overflow-hidden group h-[140px]">
            <div className="flex justify-between items-start w-full z-10 mb-1">
              <div className="flex flex-col">
                <span className="text-[12px] font-bold text-white leading-[1.2]">Previous<br/>Sessions</span>
                <span className="text-[#8e8e93] text-[10px] font-medium mt-1">Last 7 Days</span>
              </div>
              <div className="bg-white/10 rounded-full w-5 h-5 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <ChevronRight size={14} className="text-[#8e8e93] group-hover:text-white" />
              </div>
            </div>
            <div className="mt-auto w-full z-10">
              <p className="text-white text-[24px] font-bold leading-tight">
                {stats.previousSessionsCount} <span className="text-[13px] font-medium text-[#8e8e93]">Workouts</span>
              </p>
              {stats.previousSessionsCount > stats.previousWeekCount && (
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp size={14} className="text-[#30e87a]" />
                  <span className="text-[#30e87a] text-[8px] font-bold leading-tight whitespace-nowrap tracking-tight">
                    +{stats.previousSessionsCount - stats.previousWeekCount} vs. prev. week
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Muscle Balance */}
          <div className="bg-[#1c1c1e] border border-white/5 rounded-xl p-3 flex flex-col relative overflow-hidden group h-[140px]">
            <div className="absolute right-[-10px] top-[-10px] w-16 h-16 bg-[#a855f7]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#a855f7]/15 transition-colors"></div>
            <div className="flex justify-between items-start w-full z-10">
              <div className="flex flex-col">
                <span className="text-[12px] font-bold text-white leading-[1.2]">Muscle<br/>Balance</span>
                <span className="text-[#8e8e93] text-[10px] font-medium mt-1">Last 7 Days</span>
              </div>
            </div>
            <div className="flex flex-col justify-center w-full z-10 mt-auto mb-2">
              <div className="w-full h-2.5 bg-white/5 rounded-full flex overflow-hidden ring-1 ring-white/5 mb-1">
                <div 
                  className="h-full bg-[#30e87a] border-r border-[#1c1c1e]/40" 
                  style={{ width: `${stats.muscleBalance.push}%` }}
                ></div>
                <div 
                  className="h-full bg-[#ff9500] border-r border-[#1c1c1e]/40" 
                  style={{ width: `${stats.muscleBalance.pull}%` }}
                ></div>
                <div 
                  className="h-full bg-[#a855f7]"
                  style={{ width: `${stats.muscleBalance.core}%` }}
                ></div>
              </div>
              <div className="flex w-full text-[9px] font-bold px-0.5">
                <div className="w-[45%] text-left text-[#30e87a]">{stats.muscleBalance.push}%</div>
                <div className="w-[30%] text-center text-[#ff9500]">{stats.muscleBalance.pull}%</div>
                <div className="w-[25%] text-right text-[#a855f7]">{stats.muscleBalance.core}%</div>
              </div>
            </div>
            <div className="flex justify-between items-center w-full z-10">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#30e87a]"></span>
                <span className="text-[9px] text-[#8e8e93] leading-none">Push</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff9500]"></span>
                <span className="text-[9px] text-[#8e8e93] leading-none">Pull</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7]"></span>
                <span className="text-[9px] text-[#8e8e93] leading-none">Core</span>
              </div>
            </div>
          </div>

          {/* Time in Training */}
          <div className="bg-[#1c1c1e] border border-white/5 rounded-xl p-3 flex flex-col items-start relative overflow-hidden group h-[140px]">
            <div className="absolute right-[-10px] top-[-10px] w-12 h-12 bg-[#30e87a]/10 rounded-full blur-xl group-hover:bg-[#30e87a]/20 transition-colors"></div>
            <div className="flex justify-between items-start w-full z-10">
              <div className="flex flex-col">
                <span className="text-[12px] font-bold text-white leading-[1.2]">Time in<br/>Training</span>
                <span className="text-[#8e8e93] text-[10px] font-medium mt-1">Last 7 Days</span>
              </div>
              <div className="bg-white/10 rounded-full w-5 h-5 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <ChevronRight size={14} className="text-[#8e8e93] group-hover:text-white" />
              </div>
            </div>
            <div className="flex flex-col mt-auto w-full z-10">
              <div className="flex items-baseline gap-1 mb-2">
                <p className="text-[#30e87a] text-[20px] font-bold leading-none">{stats.timeInTraining}</p>
              </div>
              <div className="w-full h-[24px] flex items-end justify-between gap-[2px] opacity-70 mb-1">
                {stats.dailyTrainingTimes.map((timeSeconds, i) => {
                  // Berechne Höhe basierend auf tatsächlicher Trainingszeit
                  // Mindestens 20% Höhe für bessere Sichtbarkeit, max 100%
                  const heightPercent = stats.maxDailyTime > 0 
                    ? Math.max(20, (timeSeconds / stats.maxDailyTime) * 100)
                    : 20;
                  const hasTraining = timeSeconds > 0;
                  
                  return (
                    <div 
                      key={i}
                      className={`w-1.5 rounded-t-sm ${
                        hasTraining ? 'bg-[#30e87a]' : 'bg-white/20'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- PREVIOUS WORKOUTS --- */}
      <div className="flex items-center justify-between px-6 mb-4">
        <h3 className="text-white text-lg font-bold">Previous Workouts</h3>
        <button className="text-[#30e87a] text-sm font-medium hover:underline">Show All</button>
      </div>
      
      <div className="flex flex-col gap-3 px-6 mb-24">
        {recentSessions.length > 0 ? (
          recentSessions.map((session, index) => {
            const workout = workouts[session.id];
            const sessionDate = session.date ? new Date(session.date).toISOString().split('T')[0] : '';
            
            return (
              <div 
                key={index}
                onClick={() => sessionDate && navigate(`/workout-session/${session.id}/${sessionDate}`)}
                className="flex items-center gap-4 bg-[#1c1c1e] p-3 pr-4 rounded-xl border border-white/5 active:bg-[#2c2c2e] transition-colors cursor-pointer group"
              >
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-xl bg-cover bg-center shrink-0 opacity-80 group-hover:opacity-100 transition-opacity overflow-hidden">
                  {workout?.exercises?.[0]?.image ? (
                    <img 
                      src={workout.exercises[0].image} 
                      alt={session.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl bg-gray-800">💪</div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-semibold text-[15px]">{session.title}</h4>
                    {session.isRecord && (
                      <span className="flex items-center gap-1 bg-[#ff9500]/20 text-[#ff9500] text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#ff9500]/20 uppercase tracking-wide leading-none">
                        <Trophy size={10} />
                        Record
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] text-[#8e8e93] bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                      {formatDate(session.date)}
                    </span>
                    <span className="text-[10px] text-[#8e8e93] bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                      {formatDuration(session.duration)}
                    </span>
                    {session.maxWeight > 0 && (
                      <span className="text-[10px] text-[#8e8e93] bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                        Max {session.maxWeight}kg
                      </span>
                    )}
                  </div>
                </div>

                <ChevronRight size={20} className="text-[#8e8e93] group-hover:text-white transition-colors shrink-0" />
              </div>
            );
          })
        ) : (
          <div className="bg-[#1c1c1e] rounded-xl p-8 text-center border border-white/5">
            <p className="text-[#8e8e93]">No workouts yet. Start your first workout!</p>
          </div>
        )}
      </div>

      {/* --- BOTTOM NAV --- */}
      <BottomNav />
    </div>
  );
};

export default HomeView;
