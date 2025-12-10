import React, { useState, useEffect } from 'react';

export const WorkoutTimer = ({ startTime }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!startTime) return;

    // Diese Funktion berechnet die ECHTE verstrichene Zeit
    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.floor((now - startTime) / 1000);
      setSeconds(diff);
    };

    // Sofort einmal updaten
    updateTimer();

    // Intervall starten (aktualisiert die Anzeige)
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full border border-gray-200 animate-in fade-in">
      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
      <span className="font-mono text-sm font-bold text-gray-700">
        {formatTime(seconds)}
      </span>
    </div>
  );
};