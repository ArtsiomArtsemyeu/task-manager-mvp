import styles from './home.module.css';
import { Login } from '@/src/features/login';

export function HomeWidget() {
  return (
    <div className={styles.host}>
      <div className={styles.title}>
        Для работы с задачами войдите в учетную запись
      </div>
      <Login />
    </div>
  );
}
