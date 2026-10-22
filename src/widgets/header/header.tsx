import styles from "./header.module.css";
import { ThemeToggler } from "@/src/features/theme-toggler";
import { supportedThemes } from "@/src/app/configs/theme-configs";

export function Header() {
  return (
    <header className={styles.host}>
      <ThemeToggler themes={supportedThemes} />
    </header>
  );
}
