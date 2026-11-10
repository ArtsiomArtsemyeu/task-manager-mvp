'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import styles from './home-hero.module.css';
import { openLoginForm } from '@/src/features/login';

type HomeHeroProps = {
  aside?: ReactNode;
};

export function HomeHero({ aside }: HomeHeroProps) {
  const t = useTranslations();
  const reduceMotion = useReducedMotion() ?? false;
  const showCoverflow = Boolean(aside);

  return (
    <section className={styles.host}>
      <div className={styles.copy}>
        <motion.p
          className={styles.brand}
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          {t('metadata.appTitle')}
        </motion.p>

        <motion.h1
          className={styles.headline}
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.6, ease: 'easeOut' }}
        >
          {t('home.headline')}
        </motion.h1>

        <motion.p
          className={styles.support}
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.55, ease: 'easeOut' }}
        >
          {t('home.support')}
        </motion.p>

        <motion.div
          className={styles.ctaGroup}
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24, duration: 0.5, ease: 'easeOut' }}
        >
          <button type="button" className={styles.cta} onClick={openLoginForm}>
            {t('home.ctaSignIn')}
          </button>
        </motion.div>
      </div>

      <div className={styles.aside}>
        {showCoverflow ? (
          <motion.div
            className={styles.asideCoverflow}
            initial={reduceMotion ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            {aside}
          </motion.div>
        ) : (
          <motion.div
            className={styles.board}
            initial={reduceMotion ? false : { opacity: 0, y: 28, rotateX: 8 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden
          >
            <div className={styles.boardHeader}>
              <span className={styles.boardDot} />
              <span className={styles.boardDot} />
              <span className={styles.boardDot} />
            </div>
            <div className={styles.columns}>
              {[0, 1, 2].map((column) => (
                <motion.div
                  key={column}
                  className={styles.column}
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.18 + column * 0.1,
                    duration: 0.55,
                    ease: 'easeOut',
                  }}
                >
                  <div className={styles.columnTitle} />
                  <div className={styles.task} />
                  <div className={styles.task} />
                  {column !== 1 && <div className={styles.taskShort} />}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
