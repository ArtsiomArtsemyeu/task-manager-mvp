import { useTranslations } from 'next-intl';
import styles from './home.module.css';
import { Login } from '@/src/features/login';

export function HomeWidget() {
  const t = useTranslations();

  return (
    <div className={styles.host}>
      <div className={styles.title}>{t('home.signInToManageTasks')}</div>
      <Login />
    </div>
  );
}
