import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { AdSlotConfig } from '../types'

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

export function AdSlot({ slotId, label }: AdSlotConfig) {
  const { t } = useTranslation()
  const publisherId = import.meta.env.VITE_ADSENSE_CLIENT

  useEffect(() => {
    if (!publisherId) return
    try {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
    } catch {
      // Ignore AdSense bootstrap errors in local or unapproved environments.
    }
  }, [publisherId, slotId])

  if (!publisherId) {
    return (
      <div className="panel glass-cut surface-grid flex min-h-32 items-center justify-center p-6 text-center text-sm text-ink-200/70">
        <div>
          <p className="eyebrow mb-2">{label}</p>
          <p>{t('adPlaceholder')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="panel overflow-hidden p-2">
      <ins
        className="adsbygoogle block min-h-32 w-full"
        data-ad-client={publisherId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
