'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  LanguageCode,
  DEFAULT_LANGUAGE,
  getTranslations,
  isRTL,
  TranslationsType,
  getLanguage,
} from '@/lib/i18n';
import {
  CurrencyCode,
  DEFAULT_CURRENCY,
  convertFromAED,
  formatCurrencyAmount,
  getCurrency,
} from '@/lib/currency';

interface PreferencesContextType {
  // Language
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: TranslationsType;
  isRTL: boolean;

  // Currency
  currency: CurrencyCode;
  setCurrency: (curr: CurrencyCode) => void;
  formatCurrency: (amountInAED: number) => string;
  convertAmount: (amountInAED: number) => number;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LANGUAGE: 'ownly_language',
  CURRENCY: 'ownly_currency',
};

interface PreferencesProviderProps {
  children: ReactNode;
}

export function PreferencesProvider({ children }: PreferencesProviderProps) {
  const [language, setLanguageState] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [currency, setCurrencyState] = useState<CurrencyCode>(DEFAULT_CURRENCY);
  const [mounted, setMounted] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as LanguageCode | null;
    const savedCurr = localStorage.getItem(STORAGE_KEYS.CURRENCY) as CurrencyCode | null;

    if (savedLang && (savedLang === 'en' || savedLang === 'ar')) {
      setLanguageState(savedLang);
    }

    if (savedCurr && ['AED', 'USD', 'EUR', 'GBP', 'INR'].includes(savedCurr)) {
      setCurrencyState(savedCurr);
    }

    setMounted(true);
  }, []);

  // Update localStorage and document direction when language changes
  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL(language) ? 'rtl' : 'ltr';

    // Also add RTL class to body for easier styling
    if (isRTL(language)) {
      document.documentElement.classList.add('rtl');
      document.documentElement.classList.remove('ltr');
    } else {
      document.documentElement.classList.add('ltr');
      document.documentElement.classList.remove('rtl');
    }
  }, [language, mounted]);

  // Update localStorage when currency changes
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEYS.CURRENCY, currency);
  }, [currency, mounted]);

  // Language setter
  const setLanguage = useCallback((lang: LanguageCode) => {
    setLanguageState(lang);
  }, []);

  // Currency setter
  const setCurrency = useCallback((curr: CurrencyCode) => {
    setCurrencyState(curr);
  }, []);

  // Format currency helper (converts from AED and formats)
  const formatCurrency = useCallback(
    (amountInAED: number) => {
      const convertedAmount = convertFromAED(amountInAED, currency);
      return formatCurrencyAmount(convertedAmount, currency);
    },
    [currency]
  );

  // Convert amount from AED to selected currency
  const convertAmount = useCallback(
    (amountInAED: number) => {
      return convertFromAED(amountInAED, currency);
    },
    [currency]
  );

  // Get translations for current language
  const t = getTranslations(language);

  const value: PreferencesContextType = {
    language,
    setLanguage,
    t,
    isRTL: isRTL(language),
    currency,
    setCurrency,
    formatCurrency,
    convertAmount,
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}
