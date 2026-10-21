import styles from "./header.module.css";
import { ThemeToggler } from "@/src/features/theme-toggler";

export function Header() {
  return (
    <header className={styles.host}>
      <div className={styles.logo}>Приложение для управления задачами</div>
      <div>
        <ThemeToggler />
      </div>
    </header>
  );
}
