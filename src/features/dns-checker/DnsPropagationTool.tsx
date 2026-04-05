import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DNS_RECORD_TYPES, RESOLVERS } from '../../config/dns'
import type { DnsAnswer, DnsQueryResult, DnsRecordType, ResolverDefinition } from '../../types'

function getTypeCode(type: DnsRecordType) {
  return { A: 1, NS: 2, CNAME: 5, SOA: 6, TXT: 16, AAAA: 28, MX: 15 }[type]
}

function normalizeAnswers(payload: unknown): DnsAnswer[] {
  if (!payload || typeof payload !== 'object') return []
  const answer = (payload as { Answer?: DnsAnswer[] }).Answer
  return Array.isArray(answer) ? answer : []
}

async function queryResolver(hostname: string, recordType: DnsRecordType, resolver: ResolverDefinition): Promise<DnsQueryResult> {
  const started = performance.now()
  const timeoutSignal = AbortSignal.timeout(7000)

  try {
    const url =
      resolver.kind === 'google-json'
        ? `${resolver.endpoint}?name=${encodeURIComponent(hostname)}&type=${recordType}`
        : `${resolver.endpoint}?name=${encodeURIComponent(hostname)}&type=${getTypeCode(recordType)}`

    const response = await fetch(url, {
      headers: resolver.kind === 'rfc-json' ? { accept: 'application/dns-json' } : undefined,
      signal: timeoutSignal,
    })

    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const payload = (await response.json()) as unknown
    const answers = normalizeAnswers(payload)
    return {
      resolverId: resolver.id,
      resolverName: resolver.name,
      region: resolver.region,
      duration: Math.round(performance.now() - started),
      status: answers.length ? 'success' : 'empty',
      answers,
    }
  } catch (error) {
    return {
      resolverId: resolver.id,
      resolverName: resolver.name,
      region: resolver.region,
      duration: Math.round(performance.now() - started),
      status: 'error',
      answers: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export function DnsPropagationTool() {
  const { t } = useTranslation()
  const [hostname, setHostname] = useState('')
  const [recordType, setRecordType] = useState<DnsRecordType>('A')
  const [expectedValue, setExpectedValue] = useState('')
  const [results, setResults] = useState<DnsQueryResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleRun() {
    if (!hostname.trim()) {
      setError(t('dns.noHostname'))
      return
    }

    setError(null)
    setLoading(true)
    setResults(
      RESOLVERS.map((resolver) => ({
        resolverId: resolver.id,
        resolverName: resolver.name,
        region: resolver.region,
        duration: 0,
        status: 'loading',
        answers: [],
      })),
    )

    const settled = await Promise.all(RESOLVERS.map((resolver) => queryResolver(hostname.trim(), recordType, resolver)))
    setResults(settled)
    setLoading(false)
  }

  const normalizedFilter = expectedValue.trim().toLowerCase()

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-coral-200 bg-coral-50 p-4 text-sm leading-6 text-ink-700">
        {t('dns.limitation')}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_180px_220px_auto]">
        <label>
          <span className="mb-2 block text-sm font-medium text-ink-800">{t('dns.hostname')}</span>
          <input className="field" value={hostname} onChange={(event) => setHostname(event.target.value)} placeholder="example.com" />
        </label>

        <label>
          <span className="mb-2 block text-sm font-medium text-ink-800">{t('dns.recordType')}</span>
          <select className="field" value={recordType} onChange={(event) => setRecordType(event.target.value as DnsRecordType)}>
            {DNS_RECORD_TYPES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="mb-2 block text-sm font-medium text-ink-800">{t('dns.expectedValue')}</span>
          <input className="field" value={expectedValue} onChange={(event) => setExpectedValue(event.target.value)} placeholder="203.0.113.10" />
        </label>

        <button className="button-primary self-end" onClick={handleRun} disabled={loading}>
          {t('dns.runCheck')}
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="overflow-x-auto rounded-3xl border border-ink-200 bg-white">
        <table className="min-w-full divide-y divide-ink-200 text-left text-sm">
          <thead className="bg-ink-50">
            <tr>
              <th className="px-4 py-3 font-semibold text-ink-900">{t('dns.resolver')}</th>
              <th className="px-4 py-3 font-semibold text-ink-900">{t('dns.region')}</th>
              <th className="px-4 py-3 font-semibold text-ink-900">{t('dns.status')}</th>
              <th className="px-4 py-3 font-semibold text-ink-900">{t('dns.answers')}</th>
              <th className="px-4 py-3 font-semibold text-ink-900">{t('dns.duration')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {results.map((result) => {
              const filteredAnswers = normalizedFilter
                ? result.answers.filter((answer) => answer.data.toLowerCase().includes(normalizedFilter))
                : result.answers

              return (
                <tr key={result.resolverId}>
                  <td className="px-4 py-4 font-medium text-ink-900">{result.resolverName}</td>
                  <td className="px-4 py-4 text-ink-600">{result.region}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        result.status === 'success'
                          ? 'bg-teal-100 text-teal-500'
                          : result.status === 'loading'
                            ? 'bg-ink-100 text-ink-600'
                            : result.status === 'empty'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {result.status === 'loading'
                        ? t('dns.loading')
                        : result.status === 'empty'
                          ? t('dns.noAnswer')
                          : result.status === 'error'
                            ? t('dns.error')
                            : 'OK'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-ink-600">
                    {filteredAnswers.length > 0 ? (
                      <ul className="space-y-1">
                        {filteredAnswers.map((answer) => (
                          <li key={`${answer.name}-${answer.data}`}>{answer.data}</li>
                        ))}
                      </ul>
                    ) : result.error ? (
                      result.error
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-4 text-ink-600">{result.duration} ms</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
