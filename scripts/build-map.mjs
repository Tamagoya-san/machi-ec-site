// 地図データ（scripts/geo/*.geojson）をメルカトル図法で投影し、
// SVG の path 文字列として src/data/geo/map.json に書き出す。
// 元データは Natural Earth（パブリックドメイン）。実行: npm run build:map
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (name) => JSON.parse(readFileSync(join(root, 'scripts/geo', name), 'utf8'))

// 表示範囲（台湾〜北海道）。src/lib/geo.ts の project() と同じ式を使う。
const LON0 = 118.4
const LON1 = 147.2
const LAT0 = 21.2
const LAT1 = 46.1
const WIDTH = 1000

const rad = (deg) => (deg * Math.PI) / 180
const merc = (lat) => Math.log(Math.tan(Math.PI / 4 + rad(lat) / 2))
const K = WIDTH / rad(LON1 - LON0)
const TOP = merc(LAT1)
const HEIGHT = Math.round((TOP - merc(LAT0)) * K)

const project = ([lon, lat]) => [rad(lon - LON0) * K, (TOP - merc(lat)) * K]
const round = (n) => Math.round(n * 10) / 10

function polygons(geometry) {
  if (!geometry) return []
  if (geometry.type === 'Polygon') return [geometry.coordinates]
  if (geometry.type === 'MultiPolygon') return geometry.coordinates
  if (geometry.type === 'GeometryCollection') return geometry.geometries.flatMap(polygons)
  return []
}

function ringPath(ring) {
  let d = ''
  let px = null
  let py = null
  for (const point of ring) {
    const [x, y] = project(point).map(round)
    if (x === px && y === py) continue
    d += d === '' ? `M${x} ${y}` : `L${x} ${y}`
    px = x
    py = y
  }
  return d === '' ? '' : `${d}Z`
}

const toPath = (geometry) =>
  polygons(geometry)
    .flatMap((polygon) => polygon.map(ringPath))
    .join('')

// 最大のポリゴンの重心（ラベルやズームの基準点）
function anchor(geometry) {
  let best = null
  for (const polygon of polygons(geometry)) {
    const ring = polygon[0].map(project)
    let area = 0
    let cx = 0
    let cy = 0
    for (let i = 0; i < ring.length - 1; i++) {
      const [x0, y0] = ring[i]
      const [x1, y1] = ring[i + 1]
      const cross = x0 * y1 - x1 * y0
      area += cross
      cx += (x0 + x1) * cross
      cy += (y0 + y1) * cross
    }
    if (area === 0) continue
    const size = Math.abs(area / 2)
    if (!best || size > best.size) best = { size, x: cx / (3 * area), y: cy / (3 * area) }
  }
  return best ? [round(best.x), round(best.y)] : [0, 0]
}

const ringArea = (ring) => {
  let area = 0
  for (let i = 0; i < ring.length - 1; i++) area += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1]
  return Math.abs(area / 2)
}

// 本土（最大のポリゴン）の外接矩形。離島まで含めるとズームが引きすぎるため。
function bounds(geometry) {
  const rings = polygons(geometry).map((polygon) => polygon[0].map(project))
  const main = rings.reduce((a, b) => (ringArea(b) > ringArea(a) ? b : a))
  const xs = main.map(([x]) => x)
  const ys = main.map(([, y]) => y)
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)].map(round)
}

const japan = read('japan.geojson')
const prefectures = japan.features
  .map((feature) => ({
    code: feature.properties.code,
    ja: feature.properties.ja,
    zh: feature.properties.code === '13' ? '東京都' : feature.properties.zh,
    en: feature.properties.en,
    d: toPath(feature.geometry),
    anchor: anchor(feature.geometry),
    bounds: bounds(feature.geometry),
  }))
  .sort((a, b) => a.code.localeCompare(b.code))

const single = (name) => {
  const data = read(name)
  const geometries = data.type === 'FeatureCollection' ? data.features.map((f) => f.geometry) : [data]
  return geometries.map(toPath).join('')
}

const out = {
  width: WIDTH,
  height: HEIGHT,
  projection: { lon0: LON0, k: round(K), top: TOP },
  prefectures,
  taiwan: single('taiwan.geojson'),
  neighbors: single('neighbors.geojson'),
}

const target = join(root, 'src/data/geo/map.json')
mkdirSync(dirname(target), { recursive: true })
writeFileSync(target, JSON.stringify(out))
// クライアント側でピンの位置を計算するための、投影パラメータだけの小さなファイル
writeFileSync(
  join(root, 'src/data/geo/projection.json'),
  JSON.stringify({ width: WIDTH, height: HEIGHT, ...out.projection }),
)
console.log(`map.json: ${WIDTH}x${HEIGHT}, ${prefectures.length} prefectures, ${(JSON.stringify(out).length / 1024).toFixed(0)}KB`)
