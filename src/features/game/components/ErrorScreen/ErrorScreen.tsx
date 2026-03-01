import styles from './ErrorScreen.module.css';

interface ErrorScreenProps {
  message: string;
}

export const ErrorScreen = ({ message }: ErrorScreenProps) => (
  <main className={styles.container} role="alert">
    <div className={styles.content}>
      <h1 className={styles.title}>Configuration Error</h1>
      <p className={styles.message}>{message}</p>
      <p className={styles.hint}>
        Please check your game configuration and try again.
      </p>
    </div>
  </main>
);
