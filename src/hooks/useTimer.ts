import { useState, useEffect } from 'react';

export function useTimer(estimatedWaitTimeMs: number) {
  // Function to pad single-digit numbers with a leading zero
  const padZero = (value: number): string => {
    return value.toString().padStart(2, "0");
  };

  // Function to format milliseconds to MM:SS
  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${padZero(minutes)}:${padZero(seconds)}`;
  };

  const [timer, setTimer] = useState(() => formatTime(estimatedWaitTimeMs));

  useEffect(() => {
    let remainingTimeMs = estimatedWaitTimeMs;
    
    // Update timer every 100ms
    const interval = setInterval(() => {
      // If timer is done, clear interval
      if (remainingTimeMs <= 0) {
        clearInterval(interval);
        return;
      }
      
      // Decrease by 100ms
      remainingTimeMs = Math.max(0, remainingTimeMs - 100);
      
      // Update the display
      setTimer(formatTime(remainingTimeMs));
    }, 100);

    // Reset timer when estimatedWaitTimeMs changes
    setTimer(formatTime(estimatedWaitTimeMs));

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [estimatedWaitTimeMs]);

  return timer;
}