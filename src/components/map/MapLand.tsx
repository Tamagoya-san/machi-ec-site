import map from '@/data/geo/map.json'
import { MAP, project } from '@/lib/geo'

// 地図の陸地（サーバーで描画する静的なSVG）。
// 拡大・移動などの操作は MapStage（クライアント）が外側から行う。

const LONGITUDES = [120, 125, 130, 135, 140, 145]
const LATITUDES = [25, 30, 35, 40, 45]

/** 台湾から東京へ、太平洋側にふくらむ弧 */
function arcPath(): string {
  const from = project(25.03, 121.56)
  const to = project(35.66, 139.74)
  const mx = (from.x + to.x) / 2
  const my = (from.y + to.y) / 2
  const dx = to.x - from.x
  const dy = to.y - from.y
  // 進行方向に対して右側（南東）へ制御点をずらす
  const bend = 0.22
  const cx = mx - dy * bend
  const cy = my + dx * bend
  const r = (n: number) => Math.round(n * 10) / 10
  return `M${r(from.x)} ${r(from.y)}Q${r(cx)} ${r(cy)} ${r(to.x)} ${r(to.y)}`
}

export function MapLand({ live = [] }: { live?: string[] }) {
  return (
    <>
      <g className="map-graticule">
        {LONGITUDES.map((lon) => {
          const { x } = project(0, lon)
          return <path key={lon} d={`M${x.toFixed(1)} -400V${MAP.height + 400}`} />
        })}
        {LATITUDES.map((lat) => {
          const { y } = project(lat, 0)
          return <path key={lat} d={`M-400 ${y.toFixed(1)}H${MAP.width + 400}`} />
        })}
      </g>
      <path className="map-far" d={map.neighbors} />
      <path className="map-arc" d={arcPath()} />
      <path className="map-taiwan" d={map.taiwan} />
      <g className="map-japan">
        {map.prefectures.map((prefecture) => (
          <path
            key={prefecture.code}
            d={prefecture.d}
            data-pref={prefecture.code}
            data-live={live.includes(prefecture.code) ? 'true' : undefined}
          />
        ))}
      </g>
    </>
  )
}

/** 都道府県の一覧（名前と位置）。検索やズームの基準に使う */
export const prefectures = map.prefectures.map((prefecture) => ({
  code: prefecture.code,
  ja: prefecture.ja,
  zh: prefecture.zh,
  en: prefecture.en,
  x: prefecture.anchor[0] ?? 0,
  y: prefecture.anchor[1] ?? 0,
  bounds: prefecture.bounds as [number, number, number, number],
}))
