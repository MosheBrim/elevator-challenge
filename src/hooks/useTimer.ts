import { useState, useEffect } from 'react';

export function useTimer(estimatedWaitTimeMs: number) {
  const padZero = (value: number): string => {
    return value.toString().padStart(2, "0");
  };

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${padZero(minutes)}:${padZero(seconds)}`;
  };

  const [timer, setTimer] = useState(() => formatTime(estimatedWaitTimeMs));

  useEffect(() => {
    let remainingTimeMs = estimatedWaitTimeMs;
    
    const interval = setInterval(() => {
      if (remainingTimeMs <= 0) {
        clearInterval(interval);
        return;
      }
      
      remainingTimeMs = Math.max(0, remainingTimeMs - 100);
      
      setTimer(formatTime(remainingTimeMs));
    }, 100);

    setTimer(formatTime(estimatedWaitTimeMs));

    return () => clearInterval(interval);
  }, [estimatedWaitTimeMs]);

  return timer;
}