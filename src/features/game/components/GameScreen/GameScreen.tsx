'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/shared/components';
import type { Question, PrizeLevel, GameStatus } from '@/features/game';
import { AnswerOption, PrizeLadder, MobileMenu } from '@/features/game';
import styles from './GameScreen.module.css';

interface GameScreenProps {
  question: Question;
  currentQuestionIndex: number;
  prizeLevels: PrizeLevel[];
  selectedAnswerId: string | null;
  status: GameStatus;
  onSelectAnswer: (answerId: string) => void;
  onNextQuestion: () => void;
  onEndGame: () => void;
}

const ANSWER_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

type AnswerState = 'default' | 'selected' | 'correct' | 'incorrect';

const getAnswerState = (
  answerId: string,
  isCorrect: boolean,
  selectedAnswerId: string | null,
  status: GameStatus,
): AnswerState => {
  const isResultPhase = status === 'correct' || status === 'incorrect';
  const isRevealingPhase = status === 'revealing';
  const isTimeoutPhase = status === 'timeout';

  if (isTimeoutPhase) {
    return 'incorrect';
  }

  if (isResultPhase) {
    if (isCorrect) return 'correct';
    if (answerId === selectedAnswerId) return 'incorrect';
    return 'default';
  }

  if (isRevealingPhase && answerId === selectedAnswerId) {
    return 'selected';
  }

  return answerId === selectedAnswerId ? 'selected' : 'default';
};

export const GameScreen = ({
  question,
  currentQuestionIndex,
  prizeLevels,
  selectedAnswerId,
  status,
  onSelectAnswer,
  onNextQuestion,
  onEndGame,
}: GameScreenProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const openMobileMenu = useCallback(() => setIsMobileMenuOpen(true), []);
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  const canSelectAnswer = status === 'playing';
  const isRevealing = status === 'revealing';
  const showNextButton = status === 'correct';
  const showEndButton = status === 'incorrect' || status === 'timeout';

  const handleAnswerClick = useCallback((answerId: string) => {
    if (canSelectAnswer) {
      onSelectAnswer(answerId);
    }
  }, [canSelectAnswer, onSelectAnswer]);

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.menuButton}
          onClick={openMobileMenu}
          aria-label="Open prize ladder"
          aria-expanded={isMobileMenuOpen}
        >
          <span className={styles.menuIcon} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.content}>
        <section className={styles.questionSection}>

          <h1 className={styles.questionText}>{question.text}</h1>

          <div className={styles.answers} role="radiogroup" aria-label="Answer options">
            {question.answers.map((answer, index) => (
              <AnswerOption
                key={answer.id}
                label={ANSWER_LABELS[index] || String(index + 1)}
                text={answer.text}
                state={getAnswerState(answer.id, answer.isCorrect, selectedAnswerId, status)}
                onClick={() => handleAnswerClick(answer.id)}
                disabled={!canSelectAnswer}
                tabIndex={canSelectAnswer ? 0 : -1}
                isRevealing={isRevealing && answer.id === selectedAnswerId}
              />
            ))}
          </div>

          <div className={styles.actions}>
            {showNextButton && (
              <Button onClick={onNextQuestion}>Next Question</Button>
            )}
            {showEndButton && (
              <Button onClick={onEndGame}>See Results</Button>
            )}
          </div>
        </section>

        <aside className={styles.sidebar}>
          <PrizeLadder levels={prizeLevels} currentQuestionIndex={currentQuestionIndex} />
        </aside>
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        prizeLevels={prizeLevels}
        currentQuestionIndex={currentQuestionIndex}
      />
    </main>
  );
};
