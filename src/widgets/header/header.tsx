import styles from "./header.module.css";
import { ThemeToggler } from "@/src/features/theme-toggler";

export function Header() {
  return (
    <header className={styles.root}>
      <p>Приложение для управления задачами</p>
      <ThemeToggler />
    </header>
  );
}
