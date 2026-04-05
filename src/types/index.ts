export type LocaleCode =
  | 'en'
  | 'pt'
  | 'es'
  | 'it'
  | 'de'
  | 'nl'
  | 'ja'
  | 'zh'
  | 'ko'
  | 'ar'
  | 'ru'
  | 'sr'

export type ToolId = 'youtube-thumbnail-grabber' | 'image-converter' | 'dns-propagation-check'

export type DnsRecordType = 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS'

export type ImageOutputFormat = 'png' | 'jpeg' | 'webp' | 'avif'

export type YoutubeThumbnailVariant =
  | 'default'
  | 'mqdefault'
  | 'hqdefault'
  | 'sddefault'
  | 'maxresdefault'

export interface FaqItem {
  question: string
  answer: string
}

export interface SeoDefinition {
  title: string
  description: string
  intro: string
  howTo: string[]
  whyItMatters: string[]
  faq: FaqItem[]
}

export interface ToolDefinition {
  id: ToolId
  icon: string
  slugs: Record<LocaleCode, string>
}

export interface AdSlotConfig {
  slotId: string
  label: string
}

export interface ResolverDefinition {
  id: string
  name: string
  region: string
  endpoint: string
  kind: 'google-json' | 'rfc-json'
}

export interface DnsAnswer {
  name: string
  type: number
  ttl?: number
  data: string
}

export interface DnsQueryResult {
  resolverId: string
  resolverName: string
  region: string
  duration: number
  status: 'idle' | 'loading' | 'success' | 'empty' | 'error'
  answers: DnsAnswer[]
  error?: string
}
