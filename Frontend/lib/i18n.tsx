"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { vi } from "./locales/vi";
import { en } from "./locales/en";

export type Locale = "vi" | "en";
export type LocaleDict = typeof vi;

const dictionaries: Record<Locale, LocaleDict> = { vi, en };

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

function getNestedValue(obj: unknown, path: string): string {
  const keys = path.split(".");
  let value: unknown = obj;
  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof value === "string" ? value : path;
}

export function I18nProvider({ children, initialLocale = "vi" }: { children: ReactNode; initialLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", newLocale);
    }
  }, []);

  const t = useCallback(
    (key: string): string => {
      return getNestedValue(dictionaries[locale], key);
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

export function getLocaleFromStorage(): Locale {
  if (typeof window === "undefined") return "vi";
  const stored = localStorage.getItem("locale");
  return stored === "vi" || stored === "en" ? stored : "vi";
}

export const t = (key: string, locale: Locale = "vi"): string => {
  return getNestedValue(dictionaries[locale], key);
};