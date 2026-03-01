import type { GameState } from '@/features/game/domain/types';

const STORAGE_KEY = 'millionaire_game_state';

export const saveGameState = (state: GameState): void => {
  if (typeof window === 'undefined') return;

  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
};

export const loadGameState = (): GameState | null => {
  if (typeof window === 'undefined') return null;

  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (!serializedState) return null;

    const state = JSON.parse(serializedState) as GameState;

    if (
      typeof state.status !== 'string'
      || typeof state.currentQuestionIndex !== 'number'
      || typeof state.score !== 'number'
      || typeof state.timeRemaining !== 'number'
    ) {
      return null;
    }

    return state;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
};

export const clearGameState = (): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear game state:', error);
  }
};
