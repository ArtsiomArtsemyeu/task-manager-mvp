import styles from "./error-highlight.module.css";

type ErrorHighlightProps = {
  message?: string;
};

export function ErrorHighlight({ message }: ErrorHighlightProps) {
  return message ? <div className={styles.host}>{message}</div> : null;
}
