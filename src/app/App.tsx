import { useEffect } from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ToolShell } from '../components/ToolShell'
import { DEFAULT_LOCALE, LOCALES, getToolBySlug, getToolPath } from '../config/tools'
import { DnsPropagationTool } from '../features/dns-checker/DnsPropagationTool'
import { ImageConverterTool } from '../features/image-converter/ImageConverterTool'
import { YouTubeThumbnailTool } from '../features/youtube-thumbnail/YouTubeThumbnailTool'
import { SeoHead } from '../seo/SeoHead'
import type { LocaleCode, ToolId } from '../types'

function ToolRoute({ locale, toolId }: { locale: LocaleCode; toolId: ToolId }) {
  const { i18n, t } = useTranslation()
  useEffect(() => {
    void i18n.changeLanguage(locale)
    localStorage.setItem('tools-paulo-locale', locale)
  }, [i18n, locale])

  const section = toolId === 'youtube-thumbnail-grabber' ? 'youtube' : toolId === 'image-converter' ? 'image' : 'dns'
  const title = t(`${section}.seoTitle`)
  const description = t(`${section}.intro`)
  const metaDescription = t(`${section}.seoDescription`)
  const faq = t(`${section}.faq`, { returnObjects: true }) as { question: string; answer: string }[]
  const path = getToolPath(locale, toolId)
  const alternates = LOCALES.map((language) => ({
    locale: language,
    path: getToolPath(language, toolId),
  }))

  return (
    <>
      <SeoHead locale={locale} title={title} description={metaDescription} path={path} alternates={alternates} faq={faq} />
      <ToolShell locale={locale} toolId={toolId} title={title} description={description}>
        {toolId === 'youtube-thumbnail-grabber' && <YouTubeThumbnailTool />}
        {toolId === 'image-converter' && <ImageConverterTool />}
        {toolId === 'dns-propagation-check' && <DnsPropagationTool />}
      </ToolShell>
    </>
  )
}

function RootRedirect() {
  const { locale } = useParams()
  const pathLocale = locale as LocaleCode | undefined

  if (pathLocale && LOCALES.includes(pathLocale)) {
    return <Navigate replace to={getToolPath(pathLocale, 'youtube-thumbnail-grabber')} />
  }

  return <Navigate replace to={getToolPath(DEFAULT_LOCALE, 'youtube-thumbnail-grabber')} />
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/:locale" element={<RootRedirect />} />
      <Route
        path="/:locale/tool/:slug"
        element={<DynamicToolRoute />}
      />
      <Route path="*" element={<Navigate replace to={getToolPath(DEFAULT_LOCALE, 'youtube-thumbnail-grabber')} />} />
    </Routes>
  )
}

function DynamicToolRoute() {
  const { locale, slug } = useParams()
  const safeLocale = LOCALES.includes(locale as LocaleCode) ? (locale as LocaleCode) : DEFAULT_LOCALE
  const tool = slug ? getToolBySlug(safeLocale, slug) : undefined

  if (!tool) {
    return <Navigate replace to={getToolPath(safeLocale, 'youtube-thumbnail-grabber')} />
  }

  return <ToolRoute locale={safeLocale} toolId={tool.id} />
}
