import type { YoutubeThumbnailVariant } from '../../types'

export const THUMBNAIL_VARIANTS: YoutubeThumbnailVariant[] = [
  'default',
  'mqdefault',
  'hqdefault',
  'sddefault',
  'maxresdefault',
]

export function parseYoutubeVideoId(input: string) {
  const trimmed = input.trim()
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed

  try {
    const url = new URL(trimmed)
    if (url.hostname.includes('youtu.be')) {
      return url.pathname.replace('/', '').slice(0, 11)
    }
    if (url.searchParams.get('v')) {
      return url.searchParams.get('v')?.slice(0, 11) ?? null
    }
    if (url.pathname.includes('/embed/')) {
      return url.pathname.split('/embed/')[1]?.slice(0, 11) ?? null
    }
    if (url.pathname.includes('/shorts/')) {
      return url.pathname.split('/shorts/')[1]?.slice(0, 11) ?? null
    }
  } catch {
    return null
  }

  return null
}

export function buildThumbnailUrl(videoId: string, variant: YoutubeThumbnailVariant) {
  return `https://i.ytimg.com/vi/${videoId}/${variant}.jpg`
}
