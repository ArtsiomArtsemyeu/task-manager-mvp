'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useSyncExternalStore,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { useServerInsertedHTML } from 'next/navigation';

const STORAGE_KEY = 'theme';
const ATTRIBUTE = 'data-theme';
const DEFAULT_THEME = 'default';
const THEMES = ['default', 'light', 'dark'] as const;

type ThemeContextValue = {
  theme?: string;
  setTheme: Dispatch<SetStateAction<string>>;
  themes: string[];
  resolvedTheme?: string;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const listeners = new Set<() => void>();

function isTheme(value: string): boolean {
  return (THEMES as readonly string[]).includes(value);
}

function readStoredTheme(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && isTheme(stored)) {
      return stored;
    }
  } catch {}

  return DEFAULT_THEME;
}

function applyTheme(theme: string): void {
  document.documentElement.setAttribute(ATTRIBUTE, theme);
}

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  const onStorage = (event: StorageEvent): void => {
    if (event.key === STORAGE_KEY || event.key === null) {
      onStoreChange();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener('storage', onStorage);
  };
}

function getClientSnapshot(): string {
  return readStoredTheme();
}

function getServerSnapshot(): string {
  return DEFAULT_THEME;
}

function emitThemeChange(): void {
  listeners.forEach((listener) => listener());
}

function getThemeInitScript(): string {
  return `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}')||'${DEFAULT_THEME}';var a=${JSON.stringify(THEMES)};if(a.indexOf(t)===-1)t='${DEFAULT_THEME}';document.documentElement.setAttribute('${ATTRIBUTE}',t);}catch(e){document.documentElement.setAttribute('${ATTRIBUTE}','${DEFAULT_THEME}');}})();`;
}

export function ColorThemeProvider({ children }: { children: ReactNode }) {
  const scriptInserted = useRef(false);
  const theme = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  useServerInsertedHTML(() => {
    if (scriptInserted.current) {
      return null;
    }

    scriptInserted.current = true;

    return (
      <script
        dangerouslySetInnerHTML={{
          __html: getThemeInitScript(),
        }}
      />
    );
  });

  const setTheme = useCallback<Dispatch<SetStateAction<string>>>((value) => {
    const previous = readStoredTheme();
    const next = typeof value === 'function' ? value(previous) : value;
    const resolved = isTheme(next) ? next : DEFAULT_THEME;

    try {
      localStorage.setItem(STORAGE_KEY, resolved);
    } catch {}

    applyTheme(resolved);
    emitThemeChange();
  }, []);

  const contextValue = useMemo(
    () => ({
      theme,
      setTheme,
      themes: [...THEMES],
      resolvedTheme: theme,
    }),
    [setTheme, theme],
  );

  return (
    <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    return {
      theme: DEFAULT_THEME,
      setTheme: () => undefined,
      themes: [...THEMES],
      resolvedTheme: DEFAULT_THEME,
    };
  }

  return context;
}
