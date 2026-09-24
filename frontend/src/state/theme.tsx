import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export interface ThemeOption {
  id: string;
  label: string;
}

export const THEMES: ThemeOption[] = [{ id: 'apple', label: 'Apple' }];

const STORAGE_KEY = 'weather-theme';
const DEFAULT_THEME = 'apple';

interface ThemeContextValue {
  themeId: string;
  setThemeId: (id: string) => void;
  themes: ThemeOption[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(): string {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && THEMES.some((t) => t.id === stored)) return stored;
  } catch {
    // localStorage unavailable (e.g. private mode) — fall back to default
  }
  return DEFAULT_THEME;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState<string>(() => readStoredTheme());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeId);
    try {
      window.localStorage.setItem(STORAGE_KEY, themeId);
    } catch {
      // ignore persistence failures
    }
  }, [themeId]);

  const setThemeId = (id: string) => {
    if (THEMES.some((t) => t.id === id)) setThemeIdState(id);
  };

  return (
    <ThemeContext.Provider value={{ themeId, setThemeId, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
