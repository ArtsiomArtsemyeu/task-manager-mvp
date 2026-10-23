"use client";

import { clsx } from "clsx";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";
import { ThemeConfig } from "./config/theme.config";
import styles from "./theme-toggler.module.css";
import { ThemeTogglerItem } from "./ui/theme-toggler-item/theme-toggler-item";

type ThemeTogglerProps = {
  themes: ThemeConfig[];
};

export function ThemeToggler({ themes }: ThemeTogglerProps) {
  const { theme, setTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpenDropdown, setIsOpenDropdown] = useState<boolean>(false);

  const changeTheme = useCallback(
    (newTheme: string) => {
      setTheme(newTheme);
      setIsOpenDropdown(false);
    },
    [setTheme],
  );

  const onToggleDropdown = useCallback(
    (): void => setIsOpenDropdown((prevState: boolean) => !prevState),
    [],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpenDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <button
        type="button"
        className={clsx(styles.dropdownButton, isOpenDropdown && styles.active)}
        onClick={onToggleDropdown}
        aria-label="Выбор темы"
        aria-haspopup
        aria-expanded={isOpenDropdown}
      >
        <svg
          className={styles.icon}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          width={24}
          height={24}
          aria-hidden
        >
          <path
            d="M3 14.5L12.5 5l4.5 4.5L7.5 19H3v-4.5z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <path
            d="M14 6.5l3.5 3.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <path
            d="M18 13.5c1.2 0 2.5 1 2.5 2.2S19.5 19 18 19s-2-.8-2-2 .8-3.5 2-3.5z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpenDropdown && (
        <ul className={styles.dropdownMenu}>
          {themes.map((themeItem) => (
            <ThemeTogglerItem
              key={`themeOption-${themeItem.value}`}
              theme={themeItem}
              selected={theme === themeItem.value}
              onChange={changeTheme}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
