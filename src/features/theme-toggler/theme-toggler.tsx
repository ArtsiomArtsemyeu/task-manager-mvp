"use client";

import { clsx } from "clsx";
import Image from "next/image";
import { useTheme } from "next-themes";
import { ThemeConfig } from "./theme.config";
import styles from "./theme-toggler.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { ThemeTogglerItem } from "./theme-toggler-item/theme-toggler-item";
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
        className={clsx(styles.dropdownButton, isOpenDropdown && styles.active)}
        onClick={onToggleDropdown}
        aria-haspopup
        aria-expanded={isOpenDropdown}
      >
        <Image
          src="/images/icons/color-bucket.svg"
          alt="Кнопка выбора темы"
          width={24}
          height={24}
        />
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
