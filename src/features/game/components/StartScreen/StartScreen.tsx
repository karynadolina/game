import { Button } from '@/shared/components';
import { ThumbIcon } from '@/features/game';
import styles from './StartScreen.module.css';

interface StartScreenProps {
  onStart: () => void;
  hasResumableGame?: boolean;
}

export const StartScreen = ({
  onStart,
  hasResumableGame = false,
}: StartScreenProps) => (
  <main className={styles.container} role="main">
    <div className={styles.content}>
      <div className={styles.iconWrapper}>
        <ThumbIcon />
      </div>
      <div className={styles.textContent}>
        <h1 className={styles.title}>
          Who wants to be
          <br />
          a millionaire?
        </h1>
        <Button
          onClick={onStart}
          fullWidth
          aria-label={hasResumableGame ? 'Continue game' : 'Start new game'}
        >
          {hasResumableGame ? 'Continue' : 'Start'}
        </Button>
      </div>
    </div>
    <div className={styles.backgroundDiagonal} aria-hidden="true" />
  </main>
);
