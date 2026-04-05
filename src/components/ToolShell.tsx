import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AdSlot } from './AdSlot'
import { LanguageSwitcher } from './LanguageSwitcher'
import { TOOLS, getToolPath } from '../config/tools'
import type { LocaleCode, ToolId } from '../types'

const sectionByTool: Record<ToolId, 'youtube' | 'image' | 'dns'> = {
  'youtube-thumbnail-grabber': 'youtube',
  'image-converter': 'image',
  'dns-propagation-check': 'dns',
}

interface ToolShellProps {
  locale: LocaleCode
  toolId: ToolId
  title: string
  description: string
  children: React.ReactNode
}

export function ToolShell({ locale, toolId, title, description, children }: ToolShellProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const relatedTools = useMemo(() => TOOLS.filter((tool) => tool.id !== toolId), [toolId])

  return (
    <div className="min-h-screen p-4 text-ink-900 md:p-6">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="panel h-fit p-4 lg:sticky lg:top-6 lg:p-6">
          <div className="flex items-start justify-between gap-4 lg:block">
            <div>
              <p className="eyebrow mb-3">{t('siteName')}</p>
              <h1 className="font-serif text-3xl leading-tight text-ink-900">{t('navTitle')}</h1>
              <p className="mt-3 text-sm text-ink-600">{t('siteTagline')}</p>
            </div>
            <button className="button-secondary lg:hidden" onClick={() => setOpen((value) => !value)}>
              Menu
            </button>
          </div>

          <div className={`mt-6 space-y-6 ${open ? 'block' : 'hidden lg:block'}`}>
            <LanguageSwitcher locale={locale} toolId={toolId} />

            <nav className="space-y-3" aria-label={t('navTitle')}>
              {TOOLS.map((tool) => {
                const active = tool.id === toolId
                const section = sectionByTool[tool.id]
                return (
                  <Link
                    key={tool.id}
                    to={getToolPath(locale, tool.id)}
                    className={`block rounded-3xl border p-4 transition ${
                      active
                        ? 'border-coral-500 bg-coral-50 text-ink-900'
                        : 'border-ink-200 bg-white/70 text-ink-700 hover:border-coral-300 hover:bg-white'
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-3">
                      <span className="rounded-xl bg-ink-900 px-2 py-1 text-xs font-semibold tracking-[0.18em] text-ink-50">
                        {tool.icon}
                      </span>
                      <span className="font-semibold">{t(`${section}.title`)}</span>
                    </div>
                    <p className="text-sm leading-6 text-ink-600">
                      {t(`${section}.short`)}
                    </p>
                  </Link>
                )
              })}
            </nav>

            <AdSlot slotId="sidebar" label={t('adLabel')} />

            <div className="rounded-3xl border border-ink-200 bg-ink-900 p-5 text-ink-50">
              <p className="text-sm leading-6">{t('allClientSide')}</p>
              <a
                className="mt-4 inline-flex text-sm font-semibold text-coral-300 underline-offset-4 hover:underline"
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
              >
                {t('githubCta')}
              </a>
            </div>
          </div>
        </aside>

        <main className="space-y-4">
          <section className="panel overflow-hidden">
            <div className="surface-grid border-b border-ink-200/80 px-6 py-10 md:px-10">
              <p className="eyebrow mb-4">{title}</p>
              <div className="max-w-3xl">
                <h2 className="font-serif text-4xl leading-tight text-ink-900 md:text-5xl">{title}</h2>
                <p className="mt-4 text-lg leading-8 text-ink-600">{description}</p>
              </div>
            </div>
            <div className="space-y-10 px-6 py-8 md:px-10">{children}</div>
          </section>

          <section className="panel p-6">
            <p className="eyebrow mb-4">{t('relatedTools')}</p>
            <div className="grid gap-3 md:grid-cols-2">
              {relatedTools.map((tool) => {
                const section = sectionByTool[tool.id]
                return (
                  <Link
                    key={tool.id}
                    to={getToolPath(locale, tool.id)}
                    className="rounded-3xl border border-ink-200 bg-white p-5 transition hover:border-coral-400"
                  >
                    <p className="font-semibold text-ink-900">{t(`${section}.title`)}</p>
                    <p className="mt-2 text-sm leading-6 text-ink-600">{t(`${section}.short`)}</p>
                  </Link>
                )
              })}
            </div>
          </section>

          <p className="px-1 pb-8 text-sm text-ink-600">{t('footerNote')}</p>
        </main>
      </div>
    </div>
  )
}
