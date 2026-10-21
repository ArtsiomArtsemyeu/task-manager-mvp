import { Login } from "@/src/features/login";
import styles from "./home.module.css";

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
