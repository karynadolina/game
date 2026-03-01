'use client';

import type { KeyboardEvent } from 'react';
import styles from './AnswerOption.module.css';

type AnswerState = 'default' | 'selected' | 'correct' | 'incorrect';

interface AnswerOptionProps {
  label: string;
  text: string;
  state: AnswerState;
  onClick: () => void;
  disabled?: boolean;
  tabIndex?: number;
  isRevealing?: boolean;
}

export const AnswerOption = ({
  label,
  text,
  state,
  onClick,
  disabled = false,
  tabIndex = 0,
  isRevealing = false,
}: AnswerOptionProps) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!disabled) {
        onClick();
      }
    }
  };

  const classNames = [
    styles.option,
    styles[state],
    isRevealing ? styles.revealing : '',
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={classNames}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      tabIndex={tabIndex}
      aria-pressed={state === 'selected'}
      aria-label={`Answer ${label}: ${text}`}
    >
      <span className={styles.label} aria-hidden="true">{label}</span>
      <span className={styles.text}>{text}</span>
    </button>
  );
};
