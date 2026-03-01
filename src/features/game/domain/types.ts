export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  answers: Answer[];
  timeLimit: number;
}

export interface PrizeLevel {
  questionIndex: number;
  amount: number;
  isMilestone: boolean;
}

export interface GameConfig {
  questions: Question[];
  prizeLevels: PrizeLevel[];
}

export type GameStatus =
  | 'idle'
  | 'playing'
  | 'revealing' // suspense animation state
  | 'correct'
  | 'incorrect'
  | 'timeout'
  | 'won'
  | 'gameOver';

export interface GameState {
  status: GameStatus;
  currentQuestionIndex: number;
  selectedAnswerId: string | null;
  score: number;
  timeRemaining: number;
}

export interface GameActions {
  startGame: () => void;
  selectAnswer: (answerId: string) => void;
  nextQuestion: () => void;
  endGame: () => void;
  resetGame: () => void;
  tick: () => void;
}

export interface ConfigValidationError {
  type: 'empty' | 'noCorrectAnswer' | 'duplicateId' | 'invalidData' | 'mismatchedLevels';
  message: string;
  questionId?: string;
}

export interface ConfigValidationResult {
  isValid: boolean;
  errors: ConfigValidationError[];
}
