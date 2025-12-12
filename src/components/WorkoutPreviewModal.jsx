import React, { useMemo, useState, useEffect } from 'react';
import { X, Play, Clock, BarChart3, Dumbbell, Sparkles } from 'lucide-react';
import { workouts } from '../data/workouts';
import useWorkoutStore from '../store/useWorkoutStore';

const WorkoutPreviewModal = ({ isOpen, onClose, workoutId, onStartWorkout }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle opening animation
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
      // Start with modal off-screen, then animate in
      setIsAnimating(false);
      // Trigger animation after render
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setShouldRender(false);
      setIsAnimating(false);
    }
  }, [isOpen]);

  // Handle closing animation
  const handleClose = (skipAnimation = false) => {
    if (skipAnimation) {
      // Close immediately without animation (for navigation)
      setShouldRender(false);
      setIsClosing(false);
      setIsAnimating(false);
      onClose();
    } else {
      // Close with animation
      setIsClosing(true);
      // Wait for animation to complete before unmounting
      setTimeout(() => {
        setShouldRender(false);
        onClose();
      }, 300); // Match animation duration
    }
  };

  // Alle Hooks müssen IMMER in der gleichen Reihenfolge aufgerufen werden
  const workout = workoutId ? workouts[workoutId] : null;
  const sessions = useWorkoutStore((state) => state.sessions);

  // Berechne Recommendation Text
  const recommendationText = useMemo(() => {
    if (!workoutId || sessions.length === 0) return null;
    
    const sortedSessions = [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date));
    const lastWorkout = sortedSessions[0];
    
    if (lastWorkout && lastWorkout.id !== workoutId) {
      const lastWorkoutName = workouts[lastWorkout.id]?.title || lastWorkout.id;
      return { text: `Recommended because you trained`, workoutName: lastWorkoutName, suffix: `yesterday.` };
    }
    return null;
  }, [sessions, workoutId]);

  // Berechne Equipment (vereinfacht - alle Übungen durchgehen)
  const equipment = useMemo(() => {
    if (!workout?.exercises) return 'Various';
    const equipmentSet = new Set();
    workout.exercises.forEach(ex => {
      const name = ex.name.toLowerCase();
      if (name.includes('barbell') || name.includes('langhantel')) equipmentSet.add('Barbell');
      if (name.includes('dumbbell') || name.includes('kurzhantel') || name.includes('kh')) equipmentSet.add('Dumbbell');
      if (name.includes('bench') || name.includes('bank')) equipmentSet.add('Bench');
      if (name.includes('cable') || name.includes('kabel')) equipmentSet.add('Cable');
      if (name.includes('machine') || name.includes('maschine')) equipmentSet.add('Machine');
    });
    return Array.from(equipmentSet).slice(0, 2).join(', ') || 'Various';
  }, [workout]);

  // Muscle Breakdown (vereinfacht basierend auf Workout-ID)
  const muscleBreakdown = useMemo(() => {
    if (workoutId === 'push') {
      return [
        { name: 'Chest', percentage: 40, color: '#F2B8B5' },
        { name: 'Shoulders', percentage: 35, color: '#F4D1A6' },
        { name: 'Triceps', percentage: 25, color: '#E3C7E8' }
      ];
    } else if (workoutId === 'pull') {
      return [
        { name: 'Back', percentage: 60, color: '#F2B8B5' },
        { name: 'Biceps', percentage: 40, color: '#F4D1A6' }
      ];
    } else if (workoutId === 'legs') {
      return [
        { name: 'Quads', percentage: 50, color: '#F2B8B5' },
        { name: 'Hamstrings', percentage: 30, color: '#F4D1A6' },
        { name: 'Calves', percentage: 20, color: '#E3C7E8' }
      ];
    } else if (workoutId === 'shoulders') {
      return [
        { name: 'Shoulders', percentage: 100, color: '#F4D1A6' }
      ];
    } else if (workoutId === 'core') {
      return [
        { name: 'Core', percentage: 100, color: '#E3C7E8' }
      ];
    }
    return [
      { name: 'Upper', percentage: 50, color: '#F2B8B5' },
      { name: 'Lower', percentage: 50, color: '#F4D1A6' }
    ];
  }, [workoutId]);

  // Early returns NACH allen Hooks
  if (!shouldRender) return null;
  if (!workout || !workoutId) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-end">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={() => handleClose(false)}
      ></div>

      {/* Bottom Sheet */}
      <div 
        className={`relative w-full max-w-md mx-auto h-[94vh] bg-[#121212] rounded-t-3xl shadow-2xl overflow-hidden flex flex-col ring-1 ring-white/10 transition-transform duration-300 ease-out ${
          isClosing || !isAnimating ? 'translate-y-full' : 'translate-y-0'
        }`}
      >
        
        {/* Header */}
        <div className="px-5 pt-3 pb-3 border-b border-white/10 shrink-0 bg-[#121212]/95 backdrop-blur-xl z-30 sticky top-0">
          <div className="w-10 h-1 bg-gray-600 rounded-full mx-auto mb-3 opacity-60"></div>
          <div className="flex items-center justify-between">
            <div className="w-8"></div>
            <h1 className="text-[17px] font-semibold tracking-tight text-white">Workout Preview</h1>
            <button 
              onClick={() => handleClose(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2c2c2e] text-gray-200 hover:bg-gray-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto hide-scrollbar pb-36">
          <div className="px-5 pt-6 pb-2">
            <h2 className="text-[32px] leading-tight font-bold text-white tracking-tight mb-1">{workout.title}</h2>
            <p className="text-gray-400 text-[15px] font-medium mb-5">{workout.subtitle || 'Chest + Shoulders + Triceps Focus'}</p>
            
            {/* Recommendation Badge */}
            {recommendationText && (
              <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-[#1c1c1e] border border-white/5 mb-4 w-full">
                <Sparkles size={16} className="text-[#2FD159] shrink-0" />
                <span className="text-[12px] font-medium text-gray-300 whitespace-nowrap flex-1 min-w-0">
                  {recommendationText.text}{' '}
                  <span className="text-white font-semibold">{recommendationText.workoutName}</span>{' '}
                  {recommendationText.suffix}
                </span>
              </div>
            )}
          </div>

          {/* Metrics Cards */}
          <div className="w-full px-5 mb-8">
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-start justify-between bg-[#2c2c2e] h-[92px] rounded-2xl p-2.5 border border-white/5 shadow-sm min-w-0">
                <Clock size={22} className="text-[#2FD159]" />
                <div className="w-full">
                  <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5 truncate">Duration</div>
                  <div className="text-[16px] font-bold text-white truncate">{workout.duration || '50 min'}</div>
                </div>
              </div>
              <div className="flex flex-col items-start justify-between bg-[#2c2c2e] h-[92px] rounded-2xl p-2.5 border border-white/5 shadow-sm min-w-0">
                <BarChart3 size={22} className="text-[#2FD159]" />
                <div className="w-full">
                  <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5 truncate">Level</div>
                  <div className="text-[15px] font-bold text-white truncate">Intermediate</div>
                </div>
              </div>
              <div className="flex flex-col items-start justify-between bg-[#2c2c2e] h-[92px] rounded-2xl p-2.5 border border-white/5 shadow-sm min-w-0">
                <Dumbbell size={22} className="text-[#2FD159]" />
                <div className="w-full">
                  <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5 truncate">Equipment</div>
                  <div className="text-[15px] font-bold text-white truncate">{equipment}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Muscle Breakdown */}
          <div className="px-5 mb-8">
            <h3 className="text-[19px] font-bold text-white mb-4">Muscle Breakdown</h3>
            <div className="w-full h-3 rounded-full flex overflow-hidden mb-3 bg-[#2c2c2e] border border-white/5">
              {muscleBreakdown.map((muscle, index) => (
                <div 
                  key={muscle.name}
                  className="h-full"
                  style={{ 
                    width: `${muscle.percentage}%`,
                    backgroundColor: muscle.color
                  }}
                ></div>
              ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-gray-400">
              {muscleBreakdown.map((muscle) => (
                <div key={muscle.name} className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ 
                      backgroundColor: muscle.color,
                      boxShadow: `0 0 8px ${muscle.color}40`
                    }}
                  ></div>
                  <span className="text-white">{muscle.name}</span> {muscle.percentage}%
                </div>
              ))}
            </div>
          </div>

          {/* Exercises List */}
          <div className="px-5 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[19px] font-bold text-white">Exercises ({workout.exercises?.length || 0})</h3>
              <button className="text-[#2FD159] font-semibold text-[15px]">See Details</button>
            </div>
            
            {workout.exercises && workout.exercises.map((exercise, index) => {
              // Bestimme Muskelgruppe für Badge
              const getMuscleGroup = (exerciseName) => {
                const name = exerciseName.toLowerCase();
                if (name.includes('chest') || name.includes('brust') || name.includes('bench') || name.includes('bank')) {
                  return { name: 'Chest', color: '#F2B8B5' };
                }
                if (name.includes('shoulder') || name.includes('schulter') || name.includes('press') && !name.includes('bench')) {
                  return { name: 'Shoulders', color: '#F4D1A6' };
                }
                if (name.includes('tricep') || name.includes('dip')) {
                  return { name: 'Triceps', color: '#E3C7E8' };
                }
                if (name.includes('bicep') || name.includes('curl')) {
                  return { name: 'Biceps', color: '#F4D1A6' };
                }
                if (name.includes('back') || name.includes('rücken') || name.includes('lat') || name.includes('row')) {
                  return { name: 'Back', color: '#F2B8B5' };
                }
                return { name: 'Upper', color: '#F2B8B5' };
              };

              const muscleGroup = getMuscleGroup(exercise.name);
              const reps = exercise.reps || '8-10';
              
              return (
                <div 
                  key={exercise.id || index}
                  className="group flex items-center gap-4 bg-[#1c1c1e] p-3 rounded-2xl border border-white/5 hover:bg-[#2c2c2e] transition-all"
                >
                  <div className="w-16 h-16 rounded-xl bg-[#2c2c2e] overflow-hidden shrink-0 relative">
                    {exercise.image ? (
                      <img 
                        alt={exercise.name} 
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" 
                        src={exercise.image}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl bg-gray-800">💪</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-[17px] font-semibold text-white truncate">{exercise.name}</h4>
                      <span 
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ml-2"
                        style={{
                          color: muscleGroup.color,
                          backgroundColor: `${muscleGroup.color}1A`
                        }}
                      >
                        {muscleGroup.name}
                      </span>
                    </div>
                    <div className="text-[14px] text-gray-400 flex items-center gap-2">
                      <span className="text-white font-medium">{exercise.sets || 3}</span> sets
                      <span className="text-gray-600">•</span>
                      <span className="text-white font-medium">{reps}</span> reps
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 w-full px-5 py-6 bg-[#121212]/95 backdrop-blur-xl border-t border-white/10 z-30">
          <button 
            onClick={() => {
              // Close modal immediately without animation, then navigate
              handleClose(true);
              // Small delay to ensure modal is closed before navigation
              setTimeout(() => {
                onStartWorkout();
              }, 50);
            }}
            className="w-full bg-white text-black font-bold text-[17px] py-4 rounded-2xl shadow-lg hover:bg-gray-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-[#a855f7]"
          >
            <Play size={24} fill="currentColor" />
            Start Workout
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPreviewModal;
