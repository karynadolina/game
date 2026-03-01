import type { GameState, GameStatus, GameConfig } from './types';

export interface StateTransition {
  from: GameStatus | GameStatus[];
  to: GameStatus;
  action: string;
}

const VALID_TRANSITIONS: StateTransition[] = [
  { from: 'idle', to: 'playing', action: 'START_GAME' },
  { from: 'playing', to: 'revealing', action: 'SELECT_ANSWER' },
  { from: 'revealing', to: 'correct', action: 'REVEAL_CORRECT' },
  { from: 'revealing', to: 'incorrect', action: 'REVEAL_INCORRECT' },
  { from: 'playing', to: 'timeout', action: 'TIMEOUT' },
  { from: 'correct', to: 'playing', action: 'NEXT_QUESTION' },
  { from: 'correct', to: 'won', action: 'WIN_GAME' },
  { from: ['incorrect', 'timeout'], to: 'gameOver', action: 'END_GAME' },
  { from: ['gameOver', 'won'], to: 'idle', action: 'RESET_GAME' },
];

export const canTransition = (from: GameStatus, to: GameStatus, action: string): boolean => {
  const transition = VALID_TRANSITIONS.find((t) => t.action === action && t.to === to);
  if (!transition) return false;

  if (Array.isArray(transition.from)) {
    return transition.from.includes(from);
  }
  return transition.from === from;
};

export const createInitialState = (): GameState => ({
  status: 'idle',
  currentQuestionIndex: 0,
  selectedAnswerId: null,
  score: 0,
  timeRemaining: 0,
});

export const getScoreForQuestion = (
  questionIndex: number,
  config: GameConfig,
): number => {
  const prizeLevel = config.prizeLevels.find((level) => level.questionIndex === questionIndex);
  return prizeLevel?.amount ?? 0;
};

export const getMilestoneScore = (
  currentQuestionIndex: number,
  config: GameConfig,
): number => {
  const passedMilestones = config.prizeLevels
    .filter((level) => level.isMilestone && level.questionIndex < currentQuestionIndex)
    .sort((a, b) => b.questionIndex - a.questionIndex);

  return passedMilestones[0]?.amount ?? 0;
};

export type GameAction =
  | { type: 'START_GAME'; config: GameConfig }
  | { type: 'SELECT_ANSWER'; answerId: string }
  | { type: 'REVEAL_ANSWER'; config: GameConfig }
  | { type: 'NEXT_QUESTION'; config: GameConfig }
  | { type: 'TIMEOUT'; config: GameConfig }
  | { type: 'END_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'TICK' }
  | { type: 'RESTORE_STATE'; state: GameState };

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME': {
      if (state.status !== 'idle') return state;
      const firstQuestion = action.config.questions[0];
      return {
        ...createInitialState(),
        status: 'playing',
        timeRemaining: firstQuestion?.timeLimit ?? 30,
      };
    }

    case 'SELECT_ANSWER': {
      if (state.status !== 'playing') return state;
      return {
        ...state,
        status: 'revealing',
        selectedAnswerId: action.answerId,
      };
    }

    case 'REVEAL_ANSWER': {
      if (state.status !== 'revealing' || !state.selectedAnswerId) return state;

      const currentQuestion = action.config.questions[state.currentQuestionIndex];
      const selectedAnswer = currentQuestion?.answers.find(
        (a) => a.id === state.selectedAnswerId,
      );

      if (!selectedAnswer) return state;

      if (selectedAnswer.isCorrect) {
        const newScore = getScoreForQuestion(state.currentQuestionIndex, action.config);
        return {
          ...state,
          status: 'correct',
          score: newScore,
        };
      }

      const milestoneScore = getMilestoneScore(state.currentQuestionIndex, action.config);
      return {
        ...state,
        status: 'incorrect',
        score: milestoneScore,
      };
    }

    case 'NEXT_QUESTION': {
      if (state.status !== 'correct') return state;

      const nextIndex = state.currentQuestionIndex + 1;
      const isLastQuestion = nextIndex >= action.config.questions.length;

      if (isLastQuestion) {
        return {
          ...state,
          status: 'won',
        };
      }

      const nextQuestion = action.config.questions[nextIndex];
      return {
        ...state,
        status: 'playing',
        currentQuestionIndex: nextIndex,
        selectedAnswerId: null,
        timeRemaining: nextQuestion?.timeLimit ?? 30,
      };
    }

    case 'TIMEOUT': {
      if (state.status !== 'playing') return state;

      const milestoneScore = getMilestoneScore(state.currentQuestionIndex, action.config);
      return {
        ...state,
        status: 'timeout',
        score: milestoneScore,
        selectedAnswerId: null,
      };
    }

    case 'END_GAME': {
      if (state.status !== 'incorrect' && state.status !== 'timeout') return state;
      return {
        ...state,
        status: 'gameOver',
      };
    }

    case 'RESET_GAME': {
      return createInitialState();
    }

    case 'TICK': {
      if (state.status !== 'playing') return state;
      if (state.timeRemaining <= 0) return state;

      return {
        ...state,
        timeRemaining: state.timeRemaining - 1,
      };
    }

    case 'RESTORE_STATE': {
      return action.state;
    }

    default:
      return state;
  }
};
