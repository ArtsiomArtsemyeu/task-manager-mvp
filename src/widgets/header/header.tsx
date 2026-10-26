import { Suspense } from 'react';
import styles from './header.module.css';
import { LocaleToggler } from '@/src/features/locale-toggler';
import { ThemeToggler, type ThemeConfig } from '@/src/features/theme-toggler';
import { Skeleton } from '@/src/shared/ui/components/skeleton';

type HeaderProps = {
  themes: ThemeConfig[];
};

export function Header({ themes }: HeaderProps) {
  return (
    <header className={styles.host}>
      <div className={styles.controls}>
        <Suspense
          fallback={<Skeleton width="2.5rem" height="2.5rem" />}
        >
          <LocaleToggler />
        </Suspense>
        <ThemeToggler themes={themes} />
      </div>
    </header>
  );
}
