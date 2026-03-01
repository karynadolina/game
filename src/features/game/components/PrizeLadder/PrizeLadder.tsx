'use client';

import { formatCurrency } from '@/shared/utils';
import type { PrizeLevel } from '@/features/game';
import styles from './PrizeLadder.module.css';

interface PrizeLadderProps {
  levels: PrizeLevel[];
  currentQuestionIndex: number;
}

export const PrizeLadder = ({
  levels,
  currentQuestionIndex,
}: PrizeLadderProps) => {
  const sortedLevels = [...levels].sort((a, b) => b.questionIndex - a.questionIndex);

  return (
    <nav className={styles.container} aria-label="Prize ladder">
      <ul className={styles.list}>
        {sortedLevels.map((level) => {
          const isCurrent = level.questionIndex === currentQuestionIndex;
          const isPassed = level.questionIndex < currentQuestionIndex;

          let stateClass = '';
          if (isCurrent) stateClass = styles.current;
          else if (isPassed) stateClass = styles.passed;

          return (
            <li
              key={level.questionIndex}
              className={`${styles.item} ${stateClass}`}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <span className={styles.stripeLeft} aria-hidden="true" />
              <span className={styles.hexagon}>
                <span className={styles.amount}>
                  {formatCurrency(level.amount)}
                </span>
              </span>
              <span className={styles.stripeRight} aria-hidden="true" />
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
