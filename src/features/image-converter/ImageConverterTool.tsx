import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ImageOutputFormat } from '../../types'

const INPUT_ACCEPT = 'image/png,image/jpeg,image/webp,image/bmp,image/gif'
const OUTPUT_MIME_TYPES: Record<ImageOutputFormat, string> = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  avif: 'image/avif',
}

function canEncode(format: ImageOutputFormat) {
  const canvas = document.createElement('canvas')
  const mimeType = OUTPUT_MIME_TYPES[format]
  const dataUrl = canvas.toDataURL(mimeType)
  return dataUrl.startsWith(`data:${mimeType}`)
}

async function loadBitmap(file: File) {
  return createImageBitmap(file)
}

function dataUrlToBlob(dataUrl: string) {
  const [header, content] = dataUrl.split(',')
  const mimeMatch = header.match(/data:(.*?);base64/)
  const mimeType = mimeMatch?.[1] ?? 'application/octet-stream'
  const binary = atob(content)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return new Blob([bytes], { type: mimeType })
}

export function ImageConverterTool() {
  const { t } = useTranslation()
  const [file, setFile] = useState<File | null>(null)
  const [quality, setQuality] = useState(0.92)
  const [format, setFormat] = useState<ImageOutputFormat>('png')
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const formats = useMemo<ImageOutputFormat[]>(() => {
    const available: ImageOutputFormat[] = ['png', 'jpeg', 'webp']
    if (canEncode('avif')) available.push('avif')
    return available
  }, [])

  const sourceUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])

  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl)
    }
  }, [downloadUrl])

  useEffect(() => {
    return () => {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl)
    }
  }, [sourceUrl])

  async function handleConvert() {
    if (!file) {
      setError(t('image.noFile'))
      return
    }

    if (!file.type.startsWith('image/')) {
      setError(t('image.unsupported'))
      return
    }

    setError(null)
    const bitmap = await loadBitmap(file)
    const canvas = document.createElement('canvas')
    canvas.width = bitmap.width
    canvas.height = bitmap.height
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      setError(t('image.unsupported'))
      return
    }

    if (format === 'jpeg') {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    ctx.drawImage(bitmap, 0, 0)
    const mimeType = OUTPUT_MIME_TYPES[format]
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, mimeType, quality)
    })
    const finalBlob = blob ?? dataUrlToBlob(canvas.toDataURL(mimeType, quality))

    if (downloadUrl) URL.revokeObjectURL(downloadUrl)
    setDownloadUrl(URL.createObjectURL(finalBlob))
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-dashed border-ink-300 bg-ink-50/70 p-6">
        <label className="flex cursor-pointer flex-col items-center justify-center gap-3 text-center">
          <span className="eyebrow">{t('image.selectFile')}</span>
          <span className="text-sm text-ink-600">{t('image.dropHint')}</span>
          <input
            className="hidden"
            type="file"
            accept={INPUT_ACCEPT}
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
          <span className="button-secondary">{file?.name ?? t('image.selectFile')}</span>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-medium text-ink-800">{t('image.targetFormat')}</span>
          <select className="field" value={format} onChange={(event) => setFormat(event.target.value as ImageOutputFormat)}>
            {formats.map((option) => (
              <option key={option} value={option}>
                {option.toUpperCase()}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="mb-2 block text-sm font-medium text-ink-800">
            {t('image.quality')}: {Math.round(quality * 100)}%
          </span>
          <input
            className="mt-3 w-full accent-coral-500"
            type="range"
            min="0.4"
            max="1"
            step="0.01"
            value={quality}
            onChange={(event) => setQuality(Number(event.target.value))}
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <button className="button-primary" onClick={handleConvert}>
          {t('image.convert')}
        </button>
        {downloadUrl && (
          <a className="button-secondary" href={downloadUrl} download={`converted.${format}`}>
            {t('image.download')}
          </a>
        )}
      </div>

      <p className="text-sm text-ink-600">{t('image.privacy')}</p>
      {error && <p className="text-sm text-red-600">{error}</p>}

      {(file || downloadUrl) && (
        <div className="grid gap-4 lg:grid-cols-2">
          {sourceUrl && (
            <article className="rounded-3xl border border-ink-200 bg-white p-4">
              <p className="mb-3 font-semibold text-ink-900">{t('image.original')}</p>
              <img className="max-h-96 w-full rounded-2xl object-contain" src={sourceUrl} alt="Original preview" />
            </article>
          )}
          {downloadUrl && (
            <article className="rounded-3xl border border-ink-200 bg-white p-4">
              <p className="mb-3 font-semibold text-ink-900">{t('image.converted')}</p>
              <img className="max-h-96 w-full rounded-2xl object-contain" src={downloadUrl} alt="Converted preview" />
            </article>
          )}
        </div>
      )}
    </div>
  )
}
