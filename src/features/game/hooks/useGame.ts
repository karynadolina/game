'use client';

import {
  useReducer,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import { saveGameState, loadGameState, clearGameState } from '@/shared/utils/localStorage';
import { gameReducer, createInitialState, validateConfig } from '@/features/game';
import type { GameConfig, GameState, GameActions } from '../domain/types';
import { useTimer } from './useTimer';

const REVEAL_DELAY_MS = 3000;

interface UseGameReturn {
  state: GameState;
  actions: GameActions;
  config: GameConfig | null;
  configError: string | null;
  currentQuestion: GameConfig['questions'][0] | null;
}

export const useGame = (rawConfig: unknown): UseGameReturn => {
  const [state, dispatch] = useReducer(gameReducer, createInitialState());
  const [isHydrated, setIsHydrated] = useState(false);

  const validationResult = useMemo(() => validateConfig(rawConfig), [rawConfig]);

  const config = validationResult.isValid ? (rawConfig as GameConfig) : null;
  const configError = validationResult.isValid
    ? null
    : validationResult.errors.map((e) => e.message).join('; ');

  useEffect(() => {
    const savedState = loadGameState();
    if (savedState && config) {
      if (
        savedState.status !== 'idle'
        && savedState.status !== 'gameOver'
        && savedState.status !== 'won'
        && savedState.currentQuestionIndex < config.questions.length
      ) {
        dispatch({ type: 'RESTORE_STATE', state: savedState });
      }
    }
    setIsHydrated(true);
  }, [config]);

  useEffect(() => {
    if (isHydrated && state.status !== 'idle') {
      saveGameState(state);
    }
  }, [state, isHydrated]);

  const isTimerRunning = state.status === 'playing';
  const revealTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTick = useCallback(() => {
    dispatch({ type: 'TICK' });
  }, []);

  const handleTimeout = useCallback(() => {
    if (config) {
      dispatch({ type: 'TIMEOUT', config });
    }
  }, [config]);

  useTimer({
    isRunning: isTimerRunning,
    onTick: handleTick,
    onTimeout: handleTimeout,
    timeRemaining: state.timeRemaining,
  });

  useEffect(() => {
    if (state.status === 'revealing' && config) {
      revealTimeoutRef.current = setTimeout(() => {
        dispatch({ type: 'REVEAL_ANSWER', config });
      }, REVEAL_DELAY_MS);
    }

    return () => {
      if (revealTimeoutRef.current) {
        clearTimeout(revealTimeoutRef.current);
        revealTimeoutRef.current = null;
      }
    };
  }, [state.status, config]);

  const startGame = useCallback(() => {
    if (config) {
      clearGameState();
      dispatch({ type: 'START_GAME', config });
    }
  }, [config]);

  const selectAnswer = useCallback((answerId: string) => {
    dispatch({ type: 'SELECT_ANSWER', answerId });
  }, []);

  const nextQuestion = useCallback(() => {
    if (config) {
      dispatch({ type: 'NEXT_QUESTION', config });
    }
  }, [config]);

  const endGame = useCallback(() => {
    dispatch({ type: 'END_GAME' });
    clearGameState();
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
    clearGameState();
  }, []);

  const tick = useCallback(() => {
    dispatch({ type: 'TICK' });
  }, []);

  const currentQuestion = config?.questions[state.currentQuestionIndex] ?? null;

  const actions: GameActions = useMemo(() => ({
    startGame,
    selectAnswer,
    nextQuestion,
    endGame,
    resetGame,
    tick,
  }), [startGame, selectAnswer, nextQuestion, endGame, resetGame, tick]);

  return {
    state,
    actions,
    config,
    configError,
    currentQuestion,
  };
};
