import styles from './header.module.css';
import { ThemeToggler, type ThemeConfig } from '@/src/features/theme-toggler';

type HeaderProps = {
  themes: ThemeConfig[];
};

export function Header({ themes }: HeaderProps) {
  return (
    <header className={styles.host}>
      <ThemeToggler themes={themes} />
    </header>
  );
}
