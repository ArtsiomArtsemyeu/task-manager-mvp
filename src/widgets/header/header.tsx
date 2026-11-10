import { Suspense } from 'react';
import styles from './header.module.css';
import { LocaleToggler } from '@/src/features/locale-toggler';
import { ThemeToggler, type ThemeConfig } from '@/src/features/theme-toggler';

type HeaderProps = {
  themes: ThemeConfig[];
};

export function Header({ themes }: HeaderProps) {
  return (
    <header className={styles.host}>
      <div className={styles.controls}>
        <Suspense fallback={<span className={styles.togglerFallback} />}>
          <LocaleToggler />
        </Suspense>
        <ThemeToggler themes={themes} />
      </div>
    </header>
  );
}
