import projection from '@/data/geo/projection.json'

// 地図の座標系。scripts/build-map.mjs と同じメルカトル図法の式で、
// 緯度経度を地図上の座標（幅 MAP.width × 高さ MAP.height）に変換する。

export const MAP = { width: projection.width, height: projection.height }

const rad = (deg: number) => (deg * Math.PI) / 180

export function project(lat: number, lon: number): { x: number; y: number } {
  const x = rad(lon - projection.lon0) * projection.k
  const y = (projection.top - Math.log(Math.tan(Math.PI / 4 + rad(lat) / 2))) * projection.k
  return { x, y }
}

/** 35.6595, 139.7405 → "35.66°N 139.74°E" */
export function formatCoord(lat: number, lon: number): string {
  return `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? 'N' : 'S'} ${Math.abs(lon).toFixed(2)}°${lon >= 0 ? 'E' : 'W'}`
}
