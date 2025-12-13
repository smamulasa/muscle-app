import React, { useMemo, useState, useEffect } from 'react';
import { X, Play, Clock, BarChart3, Dumbbell, Sparkles } from 'lucide-react';
import { getTemplateById } from '../data/workoutTemplates';
import useWorkoutStore from '../store/useWorkoutStore';
import ExerciseDetailSheet from './ExerciseDetailSheet';

const WorkoutPreviewModal = ({ isOpen, onClose, templateId, onStartWorkout }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isExerciseDetailOpen, setIsExerciseDetailOpen] = useState(false);

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
  const template = templateId ? getTemplateById(templateId) : null;
  const sessions = useWorkoutStore((state) => state.sessions);

  // Berechne Recommendation Text
  const recommendationText = useMemo(() => {
    if (!templateId || sessions.length === 0) return null;
    
    const sortedSessions = [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date));
    const lastWorkout = sortedSessions[0];
    
    if (lastWorkout && lastWorkout.id !== templateId) {
      // Versuche Template-Name zu finden, sonst Fallback
      const lastTemplate = getTemplateById(lastWorkout.id);
      const lastWorkoutName = lastTemplate?.name || lastWorkout.title || lastWorkout.id;
      return { text: `Recommended because you trained`, workoutName: lastWorkoutName, suffix: `yesterday.` };
    }
    return null;
  }, [sessions, templateId]);

  // Berechne Equipment aus exercises[].equipment (jetzt ein String)
  const equipment = useMemo(() => {
    if (!template?.exercises) return 'Various';
    const equipmentSet = new Set();
    template.exercises.forEach(ex => {
      if (ex.equipment) {
        // Equipment ist jetzt ein String, kann aber mehrere Werte enthalten
        const eqString = typeof ex.equipment === 'string' ? ex.equipment : String(ex.equipment);
        // Teile bei " oder " oder ", " auf
        const parts = eqString.split(/\s+oder\s+|\s*,\s*/);
        parts.forEach(part => {
          const trimmed = part.trim();
          if (trimmed) equipmentSet.add(trimmed);
        });
      }
    });
    return Array.from(equipmentSet).slice(0, 2).join(', ') || 'Various';
  }, [template]);

  // Muscle Breakdown aus exercises[].highlightedZones
  const muscleBreakdown = useMemo(() => {
    if (!template?.exercises) return [];
    
    const zoneCounts = {};
    template.exercises.forEach(ex => {
      if (ex.highlightedZones && Array.isArray(ex.highlightedZones)) {
        ex.highlightedZones.forEach(zone => {
          zoneCounts[zone] = (zoneCounts[zone] || 0) + 1;
        });
      }
    });
    
    const total = Object.values(zoneCounts).reduce((sum, count) => sum + count, 0);
    if (total === 0) return [];
    
    // Mapping von zone-Namen zu Anzeigenamen und Farben
    const zoneMapping = {
      'chest': { name: 'Chest', color: '#F2B8B5' },
      'upper_chest': { name: 'Upper Chest', color: '#F2B8B5' },
      'front_delts': { name: 'Shoulders', color: '#F4D1A6' },
      'side_delts': { name: 'Shoulders', color: '#F4D1A6' },
      'rear_delts': { name: 'Shoulders', color: '#F4D1A6' },
      'triceps': { name: 'Triceps', color: '#E3C7E8' },
      'lats': { name: 'Back', color: '#F2B8B5' },
      'upper_back': { name: 'Back', color: '#F2B8B5' },
      'lower_back': { name: 'Lower Back', color: '#F2B8B5' },
      'biceps': { name: 'Biceps', color: '#F4D1A6' },
      'quads': { name: 'Quads', color: '#F2B8B5' },
      'hamstrings': { name: 'Hamstrings', color: '#F4D1A6' },
      'calves': { name: 'Calves', color: '#E3C7E8' },
      'core': { name: 'Core', color: '#E3C7E8' },
      'abs': { name: 'Abs', color: '#E3C7E8' },
      'lower_abs': { name: 'Lower Abs', color: '#E3C7E8' },
      'glutes': { name: 'Glutes', color: '#F4D1A6' },
      'obliques': { name: 'Obliques', color: '#E3C7E8' }
    };
    
    // Gruppiere ähnliche Zonen zusammen (z.B. alle Shoulder-Varianten)
    const groupedZones = {};
    Object.entries(zoneCounts).forEach(([zone, count]) => {
      const mapping = zoneMapping[zone] || { name: zone, color: '#F2B8B5' };
      const displayName = mapping.name;
      if (!groupedZones[displayName]) {
        groupedZones[displayName] = { count: 0, color: mapping.color };
      }
      groupedZones[displayName].count += count;
    });
    
    const totalGrouped = Object.values(groupedZones).reduce((sum, item) => sum + item.count, 0);
    if (totalGrouped === 0) return [];
    
    return Object.entries(groupedZones)
      .map(([name, data]) => ({
        name,
        percentage: Math.round((data.count / totalGrouped) * 100),
        color: data.color
      }))
      .sort((a, b) => b.percentage - a.percentage);
  }, [template]);

  // Early returns NACH allen Hooks
  if (!shouldRender) return null;
  if (!template || !templateId) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-end overflow-x-hidden">
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
        <div className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar pb-36">
          <div className="px-5 pt-6 pb-2 max-w-full">
            <h2 className="text-[32px] leading-tight font-bold text-white tracking-tight mb-1 break-words">{template.name}</h2>
            <p className="text-gray-400 text-[15px] font-medium mb-5 break-words">{template.focus}</p>
            
            {/* Recommendation Badge */}
            {recommendationText && (
              <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-[#1c1c1e] border border-white/5 mb-4 w-full max-w-full overflow-hidden">
                <Sparkles size={16} className="text-[#2FD159] shrink-0" />
                <span className="text-[12px] font-medium text-gray-300 flex-1 min-w-0 overflow-hidden">
                  <span className="inline-block truncate">
                    {recommendationText.text}{' '}
                    <span className="text-white font-semibold">{recommendationText.workoutName}</span>{' '}
                    {recommendationText.suffix}
                  </span>
                </span>
              </div>
            )}
          </div>

          {/* Metrics Cards */}
          <div className="w-full px-5 mb-8 max-w-full overflow-x-hidden">
            <div className="grid grid-cols-3 gap-2 max-w-full">
              <div className="flex flex-col items-start justify-between bg-[#2c2c2e] h-[92px] rounded-2xl p-2.5 border border-white/5 shadow-sm min-w-0">
                <Clock size={22} className="text-[#2FD159]" />
                <div className="w-full">
                  <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5 truncate">Duration</div>
                  <div className="text-[16px] font-bold text-white truncate">{template.estimatedDurationMinutes} min</div>
                </div>
              </div>
              <div className="flex flex-col items-start justify-between bg-[#2c2c2e] h-[92px] rounded-2xl p-2.5 border border-white/5 shadow-sm min-w-0">
                <BarChart3 size={22} className="text-[#2FD159]" />
                <div className="w-full">
                  <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5 truncate">Level</div>
                  <div className="text-[15px] font-bold text-white truncate">
                    {template.difficulty}
                  </div>
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
          <div className="px-5 mb-8 max-w-full overflow-x-hidden">
            <h3 className="text-[19px] font-bold text-white mb-4">Muscle Breakdown</h3>
            <div className="w-full h-3 rounded-full flex overflow-hidden mb-3 bg-[#2c2c2e] border border-white/5 max-w-full">
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
          <div className="px-5 space-y-4 max-w-full overflow-x-hidden">
            <div className="flex items-center justify-between mb-2 max-w-full">
              <h3 className="text-[19px] font-bold text-white">Exercises ({template.exercises?.length || 0})</h3>
            </div>
            
            {template.exercises && template.exercises
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((exercise, index) => {
              // Verwende primary Muskelgruppe aus Template (jetzt ein Array)
              const primaryMuscles = Array.isArray(exercise.primary) ? exercise.primary : [exercise.primary || 'Upper'];
              const primaryMuscle = primaryMuscles[0]; // Nimm die erste primäre Muskelgruppe
              
              const muscleColors = {
                'Brust': '#F2B8B5',
                'Obere Brust': '#F2B8B5',
                'Schultern': '#F4D1A6',
                'Schulter': '#F4D1A6',
                'Seitliche Schulter': '#F4D1A6',
                'Hintere Schulter': '#F4D1A6',
                'Trizeps': '#E3C7E8',
                'Lats': '#F2B8B5',
                'Oberer Rücken': '#F2B8B5',
                'Unterer Rücken': '#F2B8B5',
                'Bizeps': '#F4D1A6',
                'Quadrizeps': '#F2B8B5',
                'Hamstrings': '#F4D1A6',
                'Waden': '#E3C7E8',
                'Core': '#E3C7E8',
                'Gerade Bauchmuskeln': '#E3C7E8',
                'Unterbauch': '#E3C7E8',
                'Glutes': '#F4D1A6',
                'Obliques': '#E3C7E8',
                'Brachialis': '#F4D1A6'
              };
              const muscleGroup = {
                name: primaryMuscle,
                color: muscleColors[primaryMuscle] || '#F2B8B5'
              };
              const reps = exercise.reps || '8-10';
              
              return (
                <div 
                  key={exercise.id || index}
                  className="group flex items-center gap-4 bg-[#1c1c1e] p-3 rounded-2xl border border-white/5 hover:bg-[#2c2c2e] transition-all cursor-pointer"
                  onClick={() => {
                    setSelectedExercise(exercise);
                    setIsExerciseDetailOpen(true);
                  }}
                >
                  <div className="w-16 h-16 rounded-xl bg-[#2c2c2e] overflow-hidden shrink-0 relative">
                    {exercise.image ? (
                      <>
                        <img 
                          alt={exercise.name} 
                          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" 
                          src={exercise.image}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const fallback = e.target.nextElementSibling;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full flex items-center justify-center text-2xl bg-gray-800 absolute inset-0" style={{ display: 'none' }}>💪</div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl bg-gray-800">💪</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 max-w-full overflow-hidden">
                    <div className="flex justify-between items-center mb-1 gap-2 max-w-full">
                      <h4 className="text-[17px] font-semibold text-white truncate flex-1 min-w-0">{exercise.name}</h4>
                      <span 
                        className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shrink-0 whitespace-nowrap"
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
                      <span className="text-white font-medium">{exercise.reps || '8-10'}</span> reps
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 w-full px-5 py-6 bg-[#121212]/95 backdrop-blur-xl border-t border-white/10 z-30 max-w-full overflow-x-hidden">
          <button 
            onClick={() => {
              // Close modal immediately without animation, then navigate
              handleClose(true);
              // Small delay to ensure modal is closed before navigation
              setTimeout(() => {
                onStartWorkout();
              }, 50);
            }}
            className="w-full max-w-full bg-white text-black font-bold text-[17px] py-4 rounded-2xl shadow-lg hover:bg-gray-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-[#a855f7]"
          >
            <Play size={24} fill="currentColor" />
            Start Workout
          </button>
        </div>
      </div>

      {/* Exercise Detail Sheet */}
      <ExerciseDetailSheet
        isOpen={isExerciseDetailOpen}
        onClose={() => setIsExerciseDetailOpen(false)}
        exercise={selectedExercise}
      />
    </div>
  );
};

export default WorkoutPreviewModal;
