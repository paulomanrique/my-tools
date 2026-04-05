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

  return (
    <div className="min-h-screen p-4 text-ink-50 md:p-6">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="panel glass-cut h-fit p-4 lg:sticky lg:top-6 lg:p-6">
          <div>
            <p className="eyebrow mb-3">{t('siteName')}</p>
            <h1 className="neon-title font-serif text-3xl leading-tight text-ink-50">{t('navTitle')}</h1>
            <p className="mt-3 text-sm text-ink-200/75">{t('siteTagline')}</p>
          </div>

          <div className="mt-6 space-y-6">
            <LanguageSwitcher locale={locale} toolId={toolId} />

            <nav className="space-y-3" aria-label={t('navTitle')}>
              {TOOLS.map((tool) => {
                const active = tool.id === toolId
                const section = sectionByTool[tool.id]
                return (
                  <Link
                    key={tool.id}
                    to={getToolPath(locale, tool.id)}
                    className={`glass-cut block p-4 transition ${
                      active
                        ? 'border border-coral-400/70 bg-coral-500/12 text-ink-50 shadow-[0_0_24px_rgba(255,30,200,0.16)]'
                        : 'border border-teal-300/20 bg-ink-800/55 text-ink-100 hover:border-teal-300/55 hover:bg-ink-800/75'
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-3">
                      <span className="rounded-xl border border-teal-300/30 bg-ink-900 px-2 py-1 text-xs font-semibold tracking-[0.18em] text-teal-300">
                        {tool.icon}
                      </span>
                      <span className="font-semibold text-ink-50">{t(`${section}.title`)}</span>
                    </div>
                    <p className="text-sm leading-6 text-ink-200/70">
                      {t(`${section}.short`)}
                    </p>
                  </Link>
                )
              })}
            </nav>

            <div className="glass-cut rounded-3xl border border-coral-400/30 bg-gradient-to-br from-coral-500/14 to-teal-400/10 p-5 text-ink-50">
              <p className="text-sm leading-6 text-ink-100/86">{t('allClientSide')}</p>
              <a
                className="mt-4 inline-flex text-sm font-semibold uppercase tracking-[0.16em] text-coral-300 underline-offset-4 hover:underline"
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
          <section className="panel glass-cut overflow-hidden">
            <div className="surface-grid cyber-line border-b border-teal-300/20 px-6 py-10 md:px-10">
              <div className="max-w-3xl">
                <h2 className="neon-title font-serif text-4xl leading-tight text-ink-50 md:text-5xl">{title}</h2>
                <p className="mt-4 text-lg leading-8 text-ink-100/76">{description}</p>
              </div>
            </div>
            <div className="space-y-10 px-6 py-8 md:px-10">
              {children}
              <AdSlot slotId="content-end" label={t('adLabel')} />
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
