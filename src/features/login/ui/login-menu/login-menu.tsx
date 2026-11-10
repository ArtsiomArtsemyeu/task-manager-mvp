'use client';

import { clsx } from 'clsx';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Login } from '../../login';
import { OPEN_LOGIN_EVENT } from '../../lib/open-login-event';
import styles from './login-menu.module.css';

export function LoginMenu() {
  const t = useTranslations();
  const reduceMotion = useReducedMotion() ?? false;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  const onToggleDropdown = useCallback((): void => {
    setIsOpenDropdown((prevState: boolean) => !prevState);
  }, []);

  useEffect(() => {
    const openLogin = (): void => setIsOpenDropdown(true);
    window.addEventListener(OPEN_LOGIN_EVENT, openLogin);
    return () => window.removeEventListener(OPEN_LOGIN_EVENT, openLogin);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpenDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <button
        type="button"
        className={clsx(styles.dropdownButton, isOpenDropdown && styles.active)}
        onClick={onToggleDropdown}
        aria-label={t('login.openForm')}
        aria-haspopup="dialog"
        aria-expanded={isOpenDropdown}
      >
        <span className={styles.icon} aria-hidden />
      </button>

      <AnimatePresence>
        {isOpenDropdown ? (
          <motion.div
            className={styles.dropdownMenu}
            role="dialog"
            aria-label={t('login.signIn')}
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -10, scale: 0.96, filter: 'blur(4px)' }
            }
            animate={
              reduceMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
            }
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -8, scale: 0.97, filter: 'blur(3px)' }
            }
            transition={{
              duration: reduceMotion ? 0.12 : 0.38,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ transformOrigin: 'top right' }}
          >
            <Login className={styles.loginForm} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
