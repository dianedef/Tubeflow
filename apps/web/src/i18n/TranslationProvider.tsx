"use client";

import { createContext, useCallback, useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import en from "./en";
import fr from "./fr";
import type { TranslationKeys } from "./en";

export type Locale = "en" | "fr";

const dictionaries: Record<Locale, TranslationKeys> = { en, fr };

interface TranslationContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationKeys;
}

export const TranslationContext = createContext<TranslationContextValue>({
  locale: "en",
  setLocale: () => {},
  t: en,
});

const LOCALE_KEY = "tubeflow-locale";

export function TranslationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // Try to read user's language preference from Convex settings
  const settings = useQuery(api.settings.getSettings);

  // On mount, read from localStorage first for instant rendering
  useEffect(() => {
    const stored = localStorage.getItem(LOCALE_KEY);
    if (stored === "fr" || stored === "en") {
      setLocaleState(stored);
    }
  }, []);

  // When Convex settings load, sync language preference
  useEffect(() => {
    if (settings?.language) {
      const lang = settings.language as Locale;
      if (lang === "en" || lang === "fr") {
        setLocaleState(lang);
        localStorage.setItem(LOCALE_KEY, lang);
      }
    }
  }, [settings?.language]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(LOCALE_KEY, newLocale);
  }, []);

  const t = dictionaries[locale];

  return (
    <TranslationContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </TranslationContext.Provider>
  );
}
