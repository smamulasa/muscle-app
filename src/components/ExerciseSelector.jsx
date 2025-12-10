import React, { useState } from 'react';
import { Search, X, Dumbbell } from 'lucide-react';
import { workouts } from '../data/workouts'; // Wir brauchen Zugriff auf die echten Namen

const ExerciseSelector = ({ isOpen, onClose, onSelect, availableIds }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  // --- HIER PASSIERT DIE MAGIE: Echte Namen finden ---
  // Wir bauen eine Liste aus den IDs (z.B. "P1") und suchen den echten Namen in den Workouts
  const exerciseList = availableIds.map(id => {
    let name = id; // Fallback
    let muscle = 'Unknown';
    
    // Wir suchen in allen Workouts nach dieser Übung
    Object.values(workouts).forEach(workout => {
      const found = workout.exercises?.find(ex => ex.id === id);
      if (found) {
        name = found.name;
        // Wir könnten hier auch Muskelgruppen speichern, falls vorhanden
      }
    });

    return { id, name, muscle };
  });

  // Filtern nach Suche
  const filteredList = exerciseList.filter(ex => 
    ex.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end animate-in fade-in duration-200">
      {/* Hintergrund abgedunkelt */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

      {/* Das "Blatt" das von unten kommt */}
      <div className="relative bg-white w-full max-h-[80vh] rounded-t-3xl shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300">
        
        {/* Header mit Suche */}
        <div className="p-4 border-b border-gray-100">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4"></div> {/* Der "Griff" zum Runterziehen */}
          
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-gray-900">Select Exercise</h3>
            <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500">
              <X size={20} />
            </button>
          </div>

          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search exercise..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 text-gray-900 text-sm rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#453ACF]"
              autoFocus
            />
          </div>
        </div>

        {/* Die Liste (Scrollbar) */}
        <div className="overflow-y-auto p-4 space-y-2 pb-10">
          {filteredList.length > 0 ? (
            filteredList.map((ex) => (
              <button
                key={ex.id}
                onClick={() => { onSelect(ex.id); onClose(); }}
                className="w-full text-left p-4 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center gap-3 border border-transparent hover:border-gray-200"
              >
                <div className="w-10 h-10 rounded-full bg-[#453ACF]/10 text-[#453ACF] flex items-center justify-center shrink-0">
                  <Dumbbell size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{ex.name}</h4>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">ID: {ex.id}</p>
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-10 text-gray-400">
              <p>Keine Übung gefunden.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ExerciseSelector;