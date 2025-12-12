import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreHorizontal, Play, TrendingUp, Flame, Dumbbell, Trophy, ChevronRight } from 'lucide-react';
import { workouts } from '../data/workouts';
import BottomNav from '../components/BottomNav';
import useWorkoutStore from '../store/useWorkoutStore';
import WorkoutPreviewModal from '../components/WorkoutPreviewModal';

const WorkoutsView = () => {
  const navigate = useNavigate();
  const sessions = useWorkoutStore((state) => state.sessions);
  const workoutHistory = useWorkoutStore((state) => state.history);
  const [selectedCategory, setSelectedCategory] = useState('Upper');
  const [previewWorkoutId, setPreviewWorkoutId] = useState(null);

  // Kategorisiere Workouts
  const categorizedWorkouts = useMemo(() => {
    return {
      Upper: ['push', 'shoulders'],
      Lower: ['legs'],
      Core: ['core'],
      'Full Body': ['push', 'pull', 'legs'] // Könnte später erweitert werden
    };
  }, []);

  // Aktuelle Workouts basierend auf Kategorie
  const currentWorkouts = useMemo(() => {
    const workoutIds = categorizedWorkouts[selectedCategory] || [];
    return workoutIds.map(id => workouts[id]).filter(Boolean);
  }, [selectedCategory, categorizedWorkouts]);

  // Alle Übungen aus aktuellen Workouts für "Upper Exercises"
  const allExercises = useMemo(() => {
    const exercises = [];
    currentWorkouts.forEach(workout => {
      if (workout.exercises) {
        workout.exercises.forEach(ex => {
          exercises.push({
            ...ex,
            workoutId: workout.id,
            workoutTitle: workout.title
          });
        });
      }
    });
    return exercises.slice(0, 8); // Max 8 für die Anzeige
  }, [currentWorkouts]);

  // Workout Plans (könnte später dynamisch sein)
  const workoutPlans = [
    {
      id: 'upper-strength',
      title: 'Upper Strength',
      description: 'Focus on compound lifts',
      gradient: 'linear-gradient(90deg, #15335C 0%, #3D4DAB 33%, #8A73C8 66%, #E6A88C 100%)',
      icon: TrendingUp,
      workoutId: 'push'
    },
    {
      id: 'chest-shoulders',
      title: 'Chest + Shoulders',
      description: 'High intensity sculpt',
      gradient: 'linear-gradient(to bottom right, #f97316, #ef4444, #ec4899)',
      icon: Flame,
      workoutId: 'push'
    },
    {
      id: 'back-biceps',
      title: 'Back & Biceps',
      description: 'Pull day essentials',
      gradient: 'linear-gradient(to bottom right, #10b981, #14b8a6, #0891b2)',
      icon: Dumbbell,
      workoutId: 'pull'
    }
  ];

  // Recent Sessions (letzte 5)
  const recentSessions = useMemo(() => {
    const sortedSessions = [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date));
    return sortedSessions.slice(0, 5).map(session => {
      const workout = workouts[session.id];
      return {
        ...session,
        workout,
        title: session.title || workout?.title || session.id
      };
    });
  }, [sessions]);

  // Today's Goal - basierend auf empfohlenem Workout
  const todaysGoal = useMemo(() => {
    if (currentWorkouts.length > 0) {
      const recommended = currentWorkouts[0]; // Erste Workout der Kategorie
      return {
        title: 'Push Limits',
        duration: recommended.duration || '45 min',
        level: 'Intermediate',
        workoutId: recommended.id
      };
    }
    return {
      title: 'Push Limits',
      duration: '45 min',
      level: 'Intermediate',
      workoutId: 'push'
    };
  }, [currentWorkouts]);

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0 min';
    const min = Math.floor(seconds / 60);
    return `${min} min`;
  };

  // Berechne Max-Gewicht für Session
  const getSessionMaxWeight = (session) => {
    if (!session.workout || !session.date) return 0;
    
    const sessionDate = new Date(session.date).toISOString().split('T')[0];
    let maxWeight = 0;
    
    if (session.workout.exercises) {
      session.workout.exercises.forEach(exercise => {
        const exerciseHistory = workoutHistory[exercise.id] || {};
        const daySets = exerciseHistory[sessionDate] || [];
        
        daySets.forEach(set => {
          if (set && set.weight) {
            const weight = parseFloat(set.weight) || 0;
            if (weight > maxWeight) maxWeight = weight;
          }
        });
      });
    }
    
    return Math.round(maxWeight);
  };

  const categories = ['Upper', 'Lower', 'Core', 'Full Body'];

  // Titel basierend auf Kategorie
  const categoryTitle = useMemo(() => {
    const titles = {
      'Upper': 'Upper Body',
      'Lower': 'Lower Body',
      'Core': 'Core & Stability',
      'Full Body': 'Full Body'
    };
    return titles[selectedCategory] || 'Workouts';
  }, [selectedCategory]);

  return (
    <div className="bg-black min-h-screen pb-28 font-sans text-white">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 bg-black/95 backdrop-blur-xl z-20 border-b border-white/5">
        <div className="px-5 pt-12 flex justify-between items-end mb-4">
          <div>
            <div className="flex items-center space-x-1 mb-1 opacity-70">
              <ArrowLeft size={16} className="text-[#2bd96e]" />
              <span 
                className="text-sm font-medium text-[#2bd96e] cursor-pointer" 
                onClick={() => navigate('/')}
              >
                Workouts
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{categoryTitle}</h1>
          </div>
          <button className="bg-[#1c1c1e] p-2 rounded-full transition-colors active:scale-90">
            <MoreHorizontal size={20} className="text-gray-300" />
          </button>
        </div>
        
        {/* Body Part Selection */}
        <div className="px-5 pb-3">
          <nav className="flex space-x-3 overflow-x-auto hide-scrollbar items-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex-shrink-0 px-5 py-2 rounded-full font-medium text-sm transition-transform active:scale-95 ${
                  selectedCategory === category
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'bg-[#1c1c1e] border border-white/10 text-gray-300 hover:bg-[#2c2c2e]'
                }`}
              >
                {category}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="px-5 space-y-8 pt-6">
        
        {/* Today's Goal Card */}
        <section className="relative group">
          <div className="bg-[#1c1c1e] rounded-3xl p-6 shadow-sm relative overflow-hidden bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2bd96e]/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">Recommended for you</span>
                <h2 className="text-2xl font-bold mt-1">{todaysGoal.title}</h2>
                <p className="text-gray-500 text-sm mt-1">Chest + Shoulders + Triceps Focus</p>
                <p className="text-gray-500 text-sm mt-1">{todaysGoal.duration} • {todaysGoal.level}</p>
              </div>
              <div className="bg-[#2bd96e]/10 p-3 rounded-full relative z-10">
                <Dumbbell size={30} className="text-[#2bd96e]" />
              </div>
            </div>
            <div className="flex flex-col justify-center items-center relative z-10 space-y-3">
              <button 
                onClick={() => navigate(`/workout/${todaysGoal.workoutId}`)}
                className="w-full bg-white hover:bg-gray-100 text-black font-bold py-4 rounded-2xl flex items-center justify-center space-x-2 transition-all active:scale-[0.98] border border-[#a855f7]"
              >
                <Play size={20} fill="currentColor" />
                <span>Start {selectedCategory} Workout</span>
              </button>
              <button 
                onClick={() => setPreviewWorkoutId(todaysGoal.workoutId)}
                className="w-full bg-transparent hover:bg-white/5 text-white font-medium py-3 rounded-2xl flex items-center justify-center space-x-2 transition-all active:scale-[0.98] border border-white/20"
              >
                <span>Preview Workout</span>
              </button>
            </div>
          </div>
        </section>

        {/* Exercises Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">{selectedCategory} Exercises</h3>
            <span className="text-gray-400 text-xs font-medium">Swipe for more</span>
          </div>
          <div className="flex space-x-4 overflow-x-auto hide-scrollbar pb-2 -mx-5 px-5">
            {allExercises.map((exercise, index) => (
              <div 
                key={`${exercise.id}-${index}`}
                className="flex flex-col space-y-2 w-28 flex-shrink-0 group cursor-pointer"
                onClick={() => navigate(`/stats/exercise/${exercise.id}`)}
              >
                <div className="w-28 h-28 rounded-2xl bg-[#1c1c1e] overflow-hidden relative border border-transparent group-hover:border-[#2bd96e]/50 transition-colors">
                  {exercise.image ? (
                    <>
                      <img 
                        alt={exercise.name} 
                        className="w-full h-full object-cover opacity-90" 
                        src={exercise.image}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/10"></div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl bg-gray-800">💪</div>
                  )}
                </div>
                <span className="text-sm font-medium text-center leading-tight">{exercise.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Your Plans Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Your {selectedCategory} Plans</h3>
            <button className="text-[#2bd96e] text-sm font-medium">See All</button>
          </div>
          <div className="flex space-x-4 overflow-x-auto hide-scrollbar pb-2 -mx-5 px-5">
            {workoutPlans.map((plan) => {
              const Icon = plan.icon;
              return (
                <div
                  key={plan.id}
                  onClick={() => navigate(`/workout/${plan.workoutId}`)}
                  className="flex-shrink-0 w-64 h-40 rounded-3xl p-5 relative overflow-hidden flex flex-col justify-end shadow-lg cursor-pointer active:scale-[0.98] transition-transform"
                  style={{ background: plan.gradient }}
                >
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-1.5 rounded-lg border border-white/10">
                    <Icon size={16} className="text-white" />
                  </div>
                  <h4 className="text-white font-bold text-lg relative z-10">{plan.title}</h4>
                  <p className="text-white/80 text-sm relative z-10">{plan.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent Sessions Section */}
        <section>
          <h3 className="text-xl font-bold mb-4">Recent Sessions</h3>
          <div className="space-y-3">
            {recentSessions.length > 0 ? (
              recentSessions.map((session, index) => {
                const sessionDate = session.date ? new Date(session.date).toISOString().split('T')[0] : '';
                return (
                  <div 
                    key={index}
                    onClick={() => sessionDate && navigate(`/workout-session/${session.id}/${sessionDate}`)}
                    className="bg-[#1c1c1e] p-4 rounded-2xl flex items-center space-x-4 active:scale-[0.99] transition-transform cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-800 relative">
                      {session.workout?.exercises?.[0]?.image ? (
                        <img 
                          alt={session.title} 
                          className="w-full h-full object-cover opacity-80" 
                          src={session.workout.exercises[0].image}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">💪</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-base">{session.title}</h4>
                        {session.isRecord && (
                          <span className="bg-yellow-600/20 text-yellow-500 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide flex items-center gap-1">
                            <Trophy size={10} />
                            Record
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-3 mt-1.5">
                        <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded">
                          {formatDate(session.date)}
                        </span>
                        <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded">
                          {formatDuration(session.duration)}
                        </span>
                        {(() => {
                          const maxWeight = getSessionMaxWeight(session);
                          return maxWeight > 0 ? (
                            <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded">
                              Max {maxWeight}kg
                            </span>
                          ) : null;
                        })()}
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </div>
                );
              })
            ) : (
              <div className="bg-[#1c1c1e] rounded-2xl p-8 text-center">
                <p className="text-gray-400">No recent sessions yet. Start your first workout!</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* --- BOTTOM NAV --- */}
      <BottomNav />

      {/* --- WORKOUT PREVIEW MODAL --- */}
      <WorkoutPreviewModal
        isOpen={previewWorkoutId !== null}
        onClose={() => setPreviewWorkoutId(null)}
        workoutId={previewWorkoutId}
        onStartWorkout={() => {
          if (previewWorkoutId) {
            navigate(`/workout/${previewWorkoutId}`);
          }
        }}
      />
    </div>
  );
};

export default WorkoutsView;
