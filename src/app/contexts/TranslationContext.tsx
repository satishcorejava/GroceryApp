import React, { createContext, useState, useCallback } from "react";
import enTranslations from "../locales/en.json";
import hiTranslations from "../locales/hi.json";
import teTranslations from "../locales/te.json";
import knTranslations from "../locales/kn.json";

export type Language = "en" | "hi" | "te" | "kn";

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultValue?: string) => string;
}

const translations: Record<Language, any> = {
  en: enTranslations,
  hi: hiTranslations,
  te: teTranslations,
  kn: knTranslations,
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("app-language");
    return (saved as Language) || "en";
  });

  const t = useCallback(
    (key: string, defaultValue: string = key) => {
      const keys = key.split(".");
      let value: any = translations[language];

      for (const k of keys) {
        value = value?.[k];
      }

      return value || defaultValue;
    },
    [language]
  );

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("app-language", lang);
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = React.useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within TranslationProvider");
  }
  return context;
}
