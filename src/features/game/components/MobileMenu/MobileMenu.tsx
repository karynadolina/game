'use client';

import { useEffect, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import type { PrizeLevel } from '@/features/game';
import { PrizeLadder } from '@/features/game';
import styles from './MobileMenu.module.css';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  prizeLevels: PrizeLevel[];
  currentQuestionIndex: number;
}

export const MobileMenu = ({
  isOpen,
  onClose,
  prizeLevels,
  currentQuestionIndex,
}: MobileMenuProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
    return undefined;
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className={styles.menu}
      role="dialog"
      aria-modal="true"
      aria-label="Prize ladder"
    >
      <button
        type="button"
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Close prize ladder"
      >
        <span className={styles.closeIcon} aria-hidden="true" />
      </button>
      <div className={styles.prizeLadderWrapper}>
        <PrizeLadder
          levels={prizeLevels}
          currentQuestionIndex={currentQuestionIndex}
        />
      </div>
    </div>,
    document.body,
  );
};
