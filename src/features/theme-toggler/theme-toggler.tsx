"use client";

import { useTheme } from "next-themes";
import { useCallback } from "react";

export function ThemeToggler() {
  const { theme, setTheme } = useTheme();

  const changeThemeValue = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => setTheme(e.target.value),
    [setTheme],
  );

  return (
    <select value={theme} onChange={changeThemeValue}>
      <option value="default">Системная</option>
      <option value="light">Светлая</option>
      <option value="dark">Тёмная</option>
    </select>
  );
}
