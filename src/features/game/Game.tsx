'use client';

import { useGame } from './hooks';
import {
  StartScreen,
  GameScreen,
  GameOverScreen,
  ErrorScreen,
} from './components';

interface GameProps {
  config: unknown;
}

export const Game = ({ config }: GameProps) => {
  const {
    state,
    actions,
    config: validatedConfig,
    configError,
    currentQuestion,
  } = useGame(config);

  if (configError) {
    return <ErrorScreen message={configError} />;
  }

  if (!validatedConfig) {
    return <ErrorScreen message="Unable to load game configuration" />;
  }

  if (state.status === 'idle') {
    return (
      <StartScreen
        onStart={actions.startGame}
      />
    );
  }

  if (state.status === 'gameOver' || state.status === 'won') {
    return (
      <GameOverScreen
        score={state.score}
        isWinner={state.status === 'won'}
        onPlayAgain={actions.resetGame}
      />
    );
  }

  if (!currentQuestion) {
    return <ErrorScreen message="Unable to load current question" />;
  }

  return (
    <GameScreen
      question={currentQuestion}
      currentQuestionIndex={state.currentQuestionIndex}
      prizeLevels={validatedConfig.prizeLevels}
      selectedAnswerId={state.selectedAnswerId}
      status={state.status}
      onSelectAnswer={actions.selectAnswer}
      onNextQuestion={actions.nextQuestion}
      onEndGame={actions.endGame}
    />
  );
};
