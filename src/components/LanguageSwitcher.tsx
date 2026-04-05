import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_LOCALE, LOCALES, getToolPath } from '../config/tools'
import type { LocaleCode, ToolId } from '../types'

interface LanguageSwitcherProps {
  locale: LocaleCode
  toolId: ToolId
}

export function LanguageSwitcher({ locale, toolId }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation()
  const navigate = useNavigate()

  function handleChange(nextLocale: LocaleCode) {
    localStorage.setItem('tools-paulo-locale', nextLocale)
    void i18n.changeLanguage(nextLocale)
    navigate(getToolPath(nextLocale, toolId))
  }

  return (
    <label className="block text-sm text-ink-700">
      <span className="mb-2 block font-medium">{t('languageLabel')}</span>
      <select
        className="field"
        value={locale || DEFAULT_LOCALE}
        onChange={(event) => handleChange(event.target.value as LocaleCode)}
      >
        {LOCALES.map((language) => (
          <option key={language} value={language}>
            {t('localeName', { lng: language })}
          </option>
        ))}
      </select>
    </label>
  )
}
