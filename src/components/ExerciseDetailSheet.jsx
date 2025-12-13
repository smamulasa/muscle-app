import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Repeat, Dumbbell, Info } from 'lucide-react';

const ExerciseDetailSheet = ({ isOpen, onClose, exercise }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sheetRef = useRef(null);

  // Handle opening animation
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
      setIsAnimating(false);
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
      setShouldRender(false);
      setIsClosing(false);
      setIsAnimating(false);
      onClose();
    } else {
      setIsClosing(true);
      setTimeout(() => {
        setShouldRender(false);
        onClose();
      }, 300);
    }
  };

  // Swipe down to close
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setStartY(e.touches[0].clientY);
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const deltaY = touch.clientY - startY;
    
    if (deltaY > 0) {
      setCurrentY(deltaY);
      if (sheetRef.current) {
        sheetRef.current.style.transform = `translateY(${deltaY}px)`;
      }
    }
  };

  const handleTouchEnd = () => {
    if (currentY > 100) {
      handleClose(false);
    } else {
      // Snap back
      if (sheetRef.current) {
        sheetRef.current.style.transform = 'translateY(0)';
      }
    }
    setCurrentY(0);
    setIsDragging(false);
  };

  // Parse technique notes into bullet points
  const techniquePoints = exercise?.notes 
    ? exercise.notes.split(/\.\s+/).filter(point => point.trim().length > 0).map(point => point.trim() + '.')
    : [
        'Position yourself correctly on the bench.',
        'Maintain proper form throughout the movement.',
        'Control the weight during both the eccentric and concentric phases.'
      ];

  // Get primary muscle group
  const primaryMuscles = Array.isArray(exercise?.primary) ? exercise.primary : [exercise?.primary || 'Upper'];
  const primaryMuscle = primaryMuscles[0];
  
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

  const muscleColor = muscleColors[primaryMuscle] || '#F2B8B5';

  // Parse equipment
  const equipmentList = exercise?.equipment 
    ? exercise.equipment.split(/\s+oder\s+|\s*,\s*/).filter(eq => eq.trim().length > 0)
    : ['Various'];

  if (!shouldRender || !exercise) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-end overflow-x-hidden">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={() => handleClose(false)}
      ></div>

      {/* Bottom Sheet */}
      <div 
        ref={sheetRef}
        className={`relative w-full max-w-md mx-auto h-[88%] bg-[#121212] rounded-t-[32px] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col ring-1 ring-white/10 transition-transform duration-300 ease-out ${
          isClosing || !isAnimating ? 'translate-y-full' : 'translate-y-0'
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle Bar */}
        <div className="w-full flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing shrink-0">
          <div className="w-10 h-1.5 rounded-full bg-gray-600 opacity-60"></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-2 shrink-0">
          <div className="w-8"></div>
          <h2 className="text-lg font-semibold text-white tracking-tight">{exercise.name}</h2>
          <button 
            onClick={() => handleClose(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2c2c2e] text-gray-200 hover:bg-gray-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar px-6 pb-24 pt-2">
          {/* Media Section */}
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-6 shadow-lg bg-gray-900 group">
            {exercise.image ? (
              <>
                <img 
                  alt={exercise.name} 
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" 
                  src={exercise.image}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const fallback = e.target.nextElementSibling;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full flex items-center justify-center text-4xl bg-gray-800 absolute inset-0" style={{ display: 'none' }}>💪</div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl bg-gray-800">💪</div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                <Play size={32} className="text-white ml-1 fill-white" />
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-2xl font-bold text-white flex-1 min-w-0">{exercise.name}</h3>
              <span 
                className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide border whitespace-nowrap shrink-0"
                style={{
                  color: muscleColor,
                  backgroundColor: `${muscleColor}1A`,
                  borderColor: `${muscleColor}33`
                }}
              >
                {primaryMuscle}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="px-4 py-2 rounded-full bg-[#2c2c2e] flex items-center gap-2">
                <Repeat size={16} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-200">
                  {exercise.sets || 3} Sets · {exercise.reps || '8-10'} Reps
                </span>
              </div>
              {equipmentList.map((eq, index) => (
                <div key={index} className="px-4 py-2 rounded-full bg-[#2c2c2e] flex items-center gap-2">
                  {index === 0 && <Dumbbell size={16} className="text-gray-400" />}
                  <span className="text-sm font-medium text-gray-200">{eq.trim()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technique Section */}
          <div className="bg-[#1c1c1e] rounded-2xl p-5 border border-white/5 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Info size={20} className="text-[#2FD159]" />
              <h4 className="text-base font-semibold text-white">Form & Technique</h4>
            </div>
            <ul className="space-y-4">
              {techniquePoints.slice(0, 5).map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0"></div>
                  <p className="text-sm text-gray-300 leading-relaxed">{point}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#121212] to-transparent pointer-events-none z-10"></div>
      </div>
    </div>
  );
};

export default ExerciseDetailSheet;
