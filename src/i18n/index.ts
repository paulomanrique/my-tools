import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { DEFAULT_LOCALE, LOCALES } from '../config/tools'
import { resources } from './resources'
import type { LocaleCode } from '../types'

const storedLocale = localStorage.getItem('tools-paulo-locale') as LocaleCode | null
const browserLocale = navigator.language.slice(0, 2) as LocaleCode
const initialLocale = LOCALES.includes(storedLocale ?? DEFAULT_LOCALE)
  ? (storedLocale ?? DEFAULT_LOCALE)
  : LOCALES.includes(browserLocale)
    ? browserLocale
    : DEFAULT_LOCALE

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLocale,
  fallbackLng: DEFAULT_LOCALE,
  interpolation: { escapeValue: false },
})

export default i18n
