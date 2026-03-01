import Image from 'next/image';
import styles from './ThumbIcon.module.css';

export const ThumbIcon = () => (
  <div className={styles.container} aria-hidden="true">
    <Image
      src="/hand.svg"
      alt=""
      width={624}
      height={367}
      className={styles.icon}
      priority
    />
  </div>
);
