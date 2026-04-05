import type { DnsQueryResult, ResolverDefinition } from '../../types'

interface DnsWorldMapProps {
  resolvers: ResolverDefinition[]
  results: DnsQueryResult[]
}

export function DnsWorldMap({ resolvers, results }: DnsWorldMapProps) {
  function getResultStatus(resolverId: string) {
    return results.find((result) => result.resolverId === resolverId)?.status ?? 'idle'
  }

  function getMarkerClass(status: DnsQueryResult['status']) {
    if (status === 'success') return 'fill-teal-300 stroke-teal-300'
    if (status === 'error') return 'fill-red-400 stroke-red-400'
    if (status === 'loading') return 'fill-coral-300 stroke-coral-300'
    if (status === 'empty') return 'fill-amber-300 stroke-amber-300'
    return 'fill-ink-200/70 stroke-ink-200/70'
  }

  return (
    <section className="glass-cut overflow-hidden rounded-3xl border border-teal-300/20 bg-ink-900/70">
      <div className="cyber-line surface-grid border-b border-teal-300/20 px-5 py-4">
        <p className="eyebrow">Resolver map</p>
        <h3 className="mt-2 font-serif text-2xl text-ink-50">Browser-safe DNS network view</h3>
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="overflow-hidden rounded-[24px] border border-teal-300/15 bg-[#06101a] p-3">
          <svg viewBox="0 0 1000 420" className="h-full w-full" role="img" aria-label="Resolver world map">
            <rect x="0" y="0" width="1000" height="420" fill="#06101a" />
            <g fill="none" stroke="rgba(130,255,248,0.14)" strokeWidth="1">
              <path d="M42 110h916" />
              <path d="M42 210h916" />
              <path d="M42 310h916" />
              <path d="M170 32v356" />
              <path d="M330 32v356" />
              <path d="M500 32v356" />
              <path d="M670 32v356" />
              <path d="M830 32v356" />
            </g>
            <g fill="rgba(130,255,248,0.08)">
              <path d="M95 140l45-30 44 8 28 34-15 36-39 7-44-10-26-25z" />
              <path d="M236 111l59-14 58 9 42 28 5 29-37 14-65-5-42-19z" />
              <path d="M451 105l63-16 85 10 53 28-7 33-84 17-78-6-44-22z" />
              <path d="M468 208l65-18 34 16 17 32-16 28-45 16-52-8-20-35z" />
              <path d="M654 116l94 10 78 35-18 43-75 7-74-28-20-31z" />
              <path d="M756 242l70 7 69 31-20 38-85 10-49-24-13-33z" />
            </g>
            {resolvers.map((resolver) => {
              const x = ((resolver.mapX ?? 50) / 100) * 1000
              const y = ((resolver.mapY ?? 50) / 100) * 420
              const status = getResultStatus(resolver.id)
              return (
                <g key={resolver.id}>
                  <circle cx={x} cy={y} r="20" fill="rgba(255,30,200,0.08)" />
                  <circle cx={x} cy={y} r="8" className={getMarkerClass(status)} strokeWidth="2" />
                  <circle cx={x} cy={y} r="16" fill="none" className={getMarkerClass(status)} strokeOpacity="0.4" strokeWidth="1.5" />
                </g>
              )
            })}
          </svg>
        </div>

        <div className="space-y-3">
          {resolvers.map((resolver) => {
            const status = getResultStatus(resolver.id)
            return (
              <div key={resolver.id} className="rounded-2xl border border-teal-300/15 bg-ink-800/65 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink-50">{resolver.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-ink-200/55">{resolver.region}</p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                      status === 'success'
                        ? 'bg-teal-400/15 text-teal-300'
                        : status === 'error'
                          ? 'bg-red-500/15 text-red-300'
                          : status === 'loading'
                            ? 'bg-coral-500/15 text-coral-300'
                            : status === 'empty'
                              ? 'bg-amber-500/15 text-amber-300'
                              : 'bg-ink-100/10 text-ink-100/70'
                    }`}
                  >
                    {status}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
