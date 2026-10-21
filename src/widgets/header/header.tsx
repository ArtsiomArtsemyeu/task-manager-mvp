import styles from "./header.module.css";

export function Header() {
  return (
    <header className={styles.root}>
      <p>Приложение для управления задачами</p>
    </header>
  );
}
