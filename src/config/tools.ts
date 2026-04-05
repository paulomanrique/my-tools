import type { LocaleCode, ToolDefinition, ToolId } from '../types'

export const LOCALES: LocaleCode[] = ['en', 'pt', 'es', 'it', 'de', 'nl', 'ja', 'zh', 'ko', 'ar', 'ru', 'sr']

export const DEFAULT_LOCALE: LocaleCode = 'en'

export const SITE_URL = 'https://tools.paulo.dev'

export const TOOLS: ToolDefinition[] = [
  {
    id: 'youtube-thumbnail-grabber',
    icon: 'YT',
    slugs: Object.fromEntries(LOCALES.map((locale) => [locale, 'youtube-thumbnail-grabber'])) as Record<LocaleCode, string>,
  },
  {
    id: 'image-converter',
    icon: 'IMG',
    slugs: Object.fromEntries(LOCALES.map((locale) => [locale, 'image-converter'])) as Record<LocaleCode, string>,
  },
  {
    id: 'dns-propagation-check',
    icon: 'DNS',
    slugs: Object.fromEntries(LOCALES.map((locale) => [locale, 'dns-propagation-check'])) as Record<LocaleCode, string>,
  },
]

export function getToolById(toolId: ToolId) {
  return TOOLS.find((tool) => tool.id === toolId)
}

export function getToolBySlug(locale: LocaleCode, slug: string) {
  return TOOLS.find((tool) => tool.slugs[locale] === slug)
}

export function getToolPath(locale: LocaleCode, toolId: ToolId) {
  const tool = getToolById(toolId)
  return `/${locale}/tool/${tool?.slugs[locale] ?? toolId}`
}
