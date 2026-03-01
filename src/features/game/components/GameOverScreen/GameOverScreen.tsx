import { Button } from '@/shared/components';
import { formatCurrency } from '@/shared/utils';
import { ThumbIcon } from '@/features/game';
import styles from './GameOverScreen.module.css';

interface GameOverScreenProps {
  score: number;
  isWinner: boolean;
  onPlayAgain: () => void;
}

export const GameOverScreen = ({
  score,
  isWinner,
  onPlayAgain,
}: GameOverScreenProps) => (
  <main className={styles.container} role="main">
    <div className={styles.content}>
      <div className={styles.iconWrapper}>
        <ThumbIcon />
      </div>
      <div className={styles.textContent}>
        <p className={styles.label}>Total score:</p>
        <h1 className={styles.score}>
          {formatCurrency(score)}
          {' '}
          earned
        </h1>
        {isWinner && (
          <p className={styles.congratulations}>
            Congratulations! You are a millionaire!
          </p>
        )}
        <div className={styles.buttonWrapper}>
          <Button
            onClick={onPlayAgain}
            fullWidth
            aria-label="Play the game again"
          >
            Try again
          </Button>
        </div>
      </div>
    </div>
  </main>
);
