import { Suspense } from 'react';
import styles from './header.module.css';
import { LocaleToggler } from '@/src/features/locale-toggler';
import { LoginMenu } from '@/src/features/login';
import { ThemeToggler, type ThemeConfig } from '@/src/features/theme-toggler';
import { Skeleton } from '@/src/shared/ui/components/skeleton';

type HeaderProps = {
  themes: ThemeConfig[];
};

function HeaderControlSkeleton() {
  return <Skeleton width="2.5rem" height="2.5rem" className={styles.controlSkeleton} />;
}

export function Header({ themes }: HeaderProps) {
  return (
    <header className={styles.host}>
      <div className={styles.controls}>
        <Suspense fallback={<HeaderControlSkeleton />}>
          <LocaleToggler />
        </Suspense>
        <Suspense fallback={<HeaderControlSkeleton />}>
          <ThemeToggler themes={themes} />
        </Suspense>
        <Suspense fallback={<HeaderControlSkeleton />}>
          <LoginMenu />
        </Suspense>
      </div>
    </header>
  );
}
