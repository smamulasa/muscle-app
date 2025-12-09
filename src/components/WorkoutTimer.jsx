import React, { useState, useEffect } from 'react';

export const WorkoutTimer = ({ isRunning }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full border border-gray-200">
      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
      <span className="font-mono text-sm font-bold text-gray-700">
        {formatTime(seconds)}
      </span>
    </div>
  );
};