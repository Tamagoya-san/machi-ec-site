import 'server-only'
import { creatorsByPlace, places, productsByPlace } from '@/content'
import type { I18n } from '@/i18n/server'
import { formatCoord, MAP, project } from '@/lib/geo'
import { findItemPhoto } from '@/lib/photos'
import type { AtlasPlace, AtlasPrefecture } from './MapExplorer'
import { prefectures } from './MapLand'
import type { MapLabel } from './MapStage'

// 地図に渡すデータを、現在の言語に合わせて組み立てる（サーバー側）。

const lower = (...values: string[]) => values.join(' ').toLowerCase()

export function buildAtlas({ locale, t, d }: I18n) {
  const prefectureName = (code: string) => prefectures.find((p) => p.code === code)?.[locale] ?? ''

  const atlasPlaces: AtlasPlace[] = places.map((place) => {
    const { x, y } = project(place.lat, place.lon)
    const creators = creatorsByPlace(place.slug)
    return {
      slug: place.slug,
      status: place.status,
      name: t(place.name),
      en: place.en,
      prefecture: place.prefecture,
      prefectureName: prefectureName(place.prefecture),
      x,
      y,
      coord: formatCoord(place.lat, place.lon),
      craft: t(place.craft),
      summary: t(place.summary),
      search: lower(place.name.ja, place.name.zh, place.en, place.slug, place.craft.ja, place.craft.zh),
      creators: creators.map((creator) => ({
        slug: creator.slug,
        name: creator.name,
        tagline: t(creator.tagline),
        search: lower(creator.name, creator.reading?.ja ?? '', creator.craft.ja, creator.craft.zh),
      })),
      items: productsByPlace(place.slug).map((product) => ({
        id: product.id,
        name: t(product.name),
        price: product.price,
        photo: findItemPhoto(product.id)?.url ?? null,
        art: product.art,
      })),
      journey: place.journey
        ? { title: t(place.journey.title), duration: t(place.journey.duration), stops: place.journey.stops.length }
        : null,
    }
  })

  const atlasPrefectures: AtlasPrefecture[] = prefectures.map((prefecture) => {
    const [x0, y0, x1, y1] = prefecture.bounds
    // 都道府県の本土が画面の半分ほどに収まる倍率
    const fit = 0.5 * Math.min(MAP.width / Math.max(x1 - x0, 1), MAP.height / Math.max(y1 - y0, 1))
    return {
      code: prefecture.code,
      name: prefecture[locale],
      search: lower(prefecture.ja, prefecture.zh, prefecture.en),
      view: { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, z: Math.max(2.4, Math.min(8, fit)) },
    }
  })

  const at = (lat: number, lon: number) => project(lat, lon)
  const labels: MapLabel[] = [
    { id: 'taiwan', ...at(23.75, 121.0), text: locale === 'ja' ? 'TAIWAN 台湾' : 'TAIWAN 台灣', kind: 'country' },
    { id: 'sea-of-japan', ...at(39.6, 134.2), text: 'SEA OF JAPAN', kind: 'sea' },
    { id: 'pacific', ...at(30.6, 141.2), text: 'PACIFIC OCEAN', kind: 'sea' },
  ]

  const livePrefectures = [...new Set(places.filter((p) => p.status === 'live').map((p) => p.prefecture))]

  return { places: atlasPlaces, prefectures: atlasPrefectures, labels, livePrefectures, title: d.map.title }
}
