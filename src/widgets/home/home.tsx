import { getTranslations } from 'next-intl/server';
import styles from './home.module.css';
import { Login } from '@/src/features/login';

export async function HomeWidget() {
  const t = await getTranslations();

  return (
    <div className={styles.host}>
      <div className={styles.title}>{t('home.title')}</div>
      <Login />
    </div>
  );
}
