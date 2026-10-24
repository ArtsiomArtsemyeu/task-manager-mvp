import styles from './home.module.css';
import { Login } from '@/src/features/login';
import { defaultUser } from '@/src/shared/config';

export function HomeWidget() {
  return (
    <div className={styles.host}>
      <div className={styles.title}>
        Для работы с задачами войдите в учетную запись
      </div>
      <Login
        stubCredentials={{
          email: defaultUser.email,
          password: defaultUser.password,
        }}
      />
    </div>
  );
}
