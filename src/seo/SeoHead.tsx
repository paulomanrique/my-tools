import { Helmet } from 'react-helmet-async'
import { SITE_URL } from '../config/tools'
import type { FaqItem, LocaleCode } from '../types'

interface SeoHeadProps {
  locale: LocaleCode
  title: string
  description: string
  path: string
  alternates: { locale: LocaleCode; path: string }[]
  faq: FaqItem[]
}

export function SeoHead({ locale, title, description, path, alternates, faq }: SeoHeadProps) {
  const canonical = `${SITE_URL}${path}`
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: title,
    url: canonical,
    description,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript and a modern browser',
  }

  return (
    <Helmet>
      <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {alternates.map((alternate) => (
        <link
          key={alternate.locale}
          rel="alternate"
          hrefLang={alternate.locale}
          href={`${SITE_URL}${alternate.path}`}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}/en`} />
      <script type="application/ld+json">{JSON.stringify(appSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
    </Helmet>
  )
}
