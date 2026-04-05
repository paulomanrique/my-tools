import { useTranslation } from 'react-i18next'
import { AdSlot } from './AdSlot'

interface ContentBlocksProps {
  section: 'youtube' | 'image' | 'dns'
}

export function ContentBlocks({ section }: ContentBlocksProps) {
  const { t } = useTranslation()
  const howTo = t(`${section}.howTo`, { returnObjects: true }) as string[]
  const whyItMatters = t(`${section}.whyItMatters`, { returnObjects: true }) as string[]
  const faq = t(`${section}.faq`, { returnObjects: true }) as { question: string; answer: string }[]

  return (
    <div className="space-y-8">
      <AdSlot slotId={`${section}-top`} label={t('adLabel')} />

      <section className="grid gap-4 md:grid-cols-2">
        <article className="glass-cut rounded-3xl border border-teal-300/20 bg-ink-800/60 p-6">
          <h3 className="font-serif text-2xl text-ink-50">{t('howToTitle')}</h3>
          <ol className="mt-4 space-y-3 text-sm leading-6 text-ink-100/72">
            {howTo.map((item, index) => (
              <li key={item}>
                <span className="mr-2 font-semibold text-coral-300">{index + 1}.</span>
                {item}
              </li>
            ))}
          </ol>
        </article>
        <article className="glass-cut rounded-3xl border border-coral-400/20 bg-ink-800/60 p-6">
          <h3 className="font-serif text-2xl text-ink-50">{t('whyItMattersTitle')}</h3>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-ink-100/72">
            {whyItMatters.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <AdSlot slotId={`${section}-bottom`} label={t('adLabel')} />

      <section className="glass-cut rounded-3xl border border-teal-300/20 bg-ink-800/60 p-6">
        <h3 className="font-serif text-2xl text-ink-50">{t('faqTitle')}</h3>
        <div className="mt-6 space-y-4">
          {faq.map((item) => (
            <article key={item.question} className="rounded-2xl border border-teal-300/15 bg-ink-900/55 p-4">
              <h4 className="font-semibold text-ink-50">{item.question}</h4>
              <p className="mt-2 text-sm leading-6 text-ink-100/70">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
