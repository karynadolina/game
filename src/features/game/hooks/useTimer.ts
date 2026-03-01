'use client';

import { useEffect, useRef, useCallback } from 'react';

interface UseTimerProps {
  isRunning: boolean;
  onTick: () => void;
  onTimeout: () => void;
  timeRemaining: number;
}

export const useTimer = ({
  isRunning,
  onTick,
  onTimeout,
  timeRemaining,
}: UseTimerProps): void => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isRunning) {
      clearTimer();
      return undefined;
    }

    intervalRef.current = setInterval(() => {
      onTick();
    }, 1000);

    return clearTimer;
  }, [isRunning, onTick, clearTimer]);

  useEffect(() => {
    if (isRunning && timeRemaining <= 0) {
      clearTimer();
      onTimeout();
    }
  }, [timeRemaining, isRunning, onTimeout, clearTimer]);
};
