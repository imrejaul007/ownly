// i18n configuration and utilities
import { en, TranslationsType } from './en';
import { ar } from './ar';

export type LanguageCode = 'en' | 'ar';

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const LANGUAGES: Record<LanguageCode, Language> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    dir: 'ltr',
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇦🇪',
    dir: 'rtl',
  },
};

export const DEFAULT_LANGUAGE: LanguageCode = 'en';

const translations: Record<LanguageCode, TranslationsType> = {
  en,
  ar,
};

/**
 * Get translations for a specific language
 */
export function getTranslations(lang: LanguageCode = DEFAULT_LANGUAGE): TranslationsType {
  return translations[lang] || translations[DEFAULT_LANGUAGE];
}

/**
 * Get all available languages as array
 */
export function getAllLanguages(): Language[] {
  return Object.values(LANGUAGES);
}

/**
 * Get language config by code
 */
export function getLanguage(code: LanguageCode): Language {
  return LANGUAGES[code];
}

/**
 * Check if language is RTL
 */
export function isRTL(lang: LanguageCode): boolean {
  return LANGUAGES[lang].dir === 'rtl';
}

export type { TranslationsType };
