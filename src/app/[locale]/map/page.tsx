import type { Metadata } from 'next'
import { buildAtlas } from '@/components/map/data'
import { MapExplorer } from '@/components/map/MapExplorer'
import { MapLand } from '@/components/map/MapLand'
import { getI18n } from '@/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { d } = await getI18n()
  return { title: d.map.title, description: d.map.lead }
}

export default async function MapPage() {
  const i18n = await getI18n()
  const atlas = buildAtlas(i18n)

  return (
    <MapExplorer places={atlas.places} prefectures={atlas.prefectures} labels={atlas.labels}>
      <MapLand live={atlas.livePrefectures} />
    </MapExplorer>
  )
}
