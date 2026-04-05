import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { buildThumbnailUrl, parseYoutubeVideoId, THUMBNAIL_VARIANTS } from './utils'

type AvailabilityMap = Partial<Record<(typeof THUMBNAIL_VARIANTS)[number], boolean>>

export function YouTubeThumbnailTool() {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const [submitted, setSubmitted] = useState('')
  const [availability, setAvailability] = useState<AvailabilityMap>({})
  const [copiedVariant, setCopiedVariant] = useState<string | null>(null)
  const videoId = useMemo(() => parseYoutubeVideoId(submitted), [submitted])

  useEffect(() => {
    if (!videoId) return

    const next: AvailabilityMap = {}
    THUMBNAIL_VARIANTS.forEach((variant) => {
      const image = new Image()
      image.onload = () => {
        next[variant] = variant === 'maxresdefault' ? image.naturalWidth > 120 : true
        setAvailability((current) => ({ ...current, ...next }))
      }
      image.onerror = () => {
        setAvailability((current) => ({ ...current, [variant]: false }))
      }
      image.src = buildThumbnailUrl(videoId, variant)
    })
  }, [videoId])

  async function copyUrl(url: string, variant: string) {
    await navigator.clipboard.writeText(url)
    setCopiedVariant(variant)
    window.setTimeout(() => setCopiedVariant(null), 1200)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-ink-800">{t('youtube.inputLabel')}</span>
          <input
            className="field"
            placeholder={t('youtube.inputPlaceholder')}
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </label>
        <button
          className="button-primary self-end"
          onClick={() => {
            setAvailability({})
            setSubmitted(value)
          }}
        >
          {t('youtube.submit')}
        </button>
      </div>

      {submitted && !videoId && <p className="text-sm text-red-600">{t('youtube.invalidInput')}</p>}

      {videoId && (
        <div className="space-y-5">
          <div className="rounded-3xl border border-ink-200 bg-ink-50 p-4 text-sm text-ink-700">
            <span className="font-semibold text-ink-900">{t('youtube.parsedVideoId')}:</span> {videoId}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {THUMBNAIL_VARIANTS.map((variant) => {
              const url = buildThumbnailUrl(videoId, variant)
              const isAvailable = availability[variant]
              return (
                <article key={variant} className="rounded-3xl border border-ink-200 bg-white p-4">
                  <img
                    className="aspect-video w-full rounded-2xl border border-ink-200 object-cover"
                    src={url}
                    alt={`${variant} thumbnail`}
                    loading="lazy"
                  />
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold capitalize text-ink-900">{variant}</p>
                      <p className={`text-sm ${isAvailable === false ? 'text-red-600' : 'text-teal-500'}`}>
                        {isAvailable === false ? t('youtube.unavailable') : t('youtube.available')}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button className="button-secondary" onClick={() => copyUrl(url, variant)}>
                        {copiedVariant === variant ? t('youtube.copied') : t('youtube.copyUrl')}
                      </button>
                      <a className="button-secondary" href={url} target="_blank" rel="noreferrer">
                        {t('youtube.openImage')}
                      </a>
                      <a className="button-secondary" href={url} download={`${videoId}-${variant}.jpg`}>
                        {t('youtube.download')}
                      </a>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
