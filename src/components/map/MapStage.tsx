'use client'

import Link from 'next/link'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'
import { MAP } from '@/lib/geo'

// 地図の表示枠。陸地のSVG（children）を拡大・移動し、その上にピンとラベルを重ねる。
// 座標はすべて地図座標（MAP.width × MAP.height）で受け取り、ここで画面上の位置に変換する。

export type MapView = { cx: number; cy: number; z: number }

export type MapPin = {
  id: string
  x: number
  y: number
  label: string
  sub?: string
  status: 'live' | 'sample'
  /** 指定するとピンがリンクになる（操作できない地図で使う） */
  href?: string
}

export type MapLabel = { id: string; x: number; y: number; text: string; kind: 'sea' | 'country' }

type Props = {
  children: ReactNode
  pins: MapPin[]
  labels?: MapLabel[]
  /** ドラッグ・ホイール・ピンチでの操作を有効にする */
  interactive?: boolean
  home?: MapView
  /** 値が変わると、その位置へアニメーションで移動する */
  focus?: MapView | null
  selectedPin?: string | null
  activePrefecture?: string | null
  onPin?: (id: string) => void
  onPrefecture?: (code: string) => void
  controls?: { zoomIn: string; zoomOut: string; reset: string }
  ariaLabel: string
}

const MIN_ZOOM = 1
const MAX_ZOOM = 10
export const HOME_VIEW: MapView = { cx: MAP.width / 2, cy: MAP.height / 2, z: 1 }

const clampView = (view: MapView): MapView => ({
  cx: Math.max(0, Math.min(MAP.width, view.cx)),
  cy: Math.max(0, Math.min(MAP.height, view.cy)),
  z: Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, view.z)),
})

type Gesture = {
  pointers: Map<number, { x: number; y: number }>
  startView: MapView
  startX: number
  startY: number
  startDistance: number
  startTarget: EventTarget | null
  moved: boolean
}

export function MapStage({
  children,
  pins,
  labels = [],
  interactive = false,
  home = HOME_VIEW,
  focus = null,
  selectedPin = null,
  activePrefecture = null,
  onPin,
  onPrefecture,
  controls,
  ariaLabel,
}: Props) {
  const stageRef = useRef<HTMLDivElement>(null)
  const landRef = useRef<SVGGElement>(null)
  const gesture = useRef<Gesture | null>(null)

  const [size, setSize] = useState<{ w: number; h: number } | null>(null)
  const [view, setView] = useState<MapView>(focus ?? home)
  const [animate, setAnimate] = useState(false)

  // focus が変わったら、その位置へ移動する（描画中に状態を合わせる React の定石）
  const [lastFocus, setLastFocus] = useState(focus)
  if (focus !== lastFocus) {
    setLastFocus(focus)
    setView(clampView(focus ?? home))
    setAnimate(true)
  }

  // 計測前（サーバー描画時）は地図座標そのままの大きさとして扱う
  const w = size?.w ?? MAP.width
  const h = size?.h ?? MAP.height
  const base = Math.min(w / MAP.width, h / MAP.height)
  const k = base * view.z
  const tx = w / 2 - view.cx * k
  const ty = h / 2 - view.cy * k

  // ハンドラから最新の値を読むための控え
  const live = useRef({ view, w, h, base })
  useEffect(() => {
    live.current = { view, w, h, base }
  })

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return
      const { width, height } = entry.contentRect
      if (width > 0 && height > 0) {
        setAnimate(false)
        setSize({ w: width, h: height })
      }
    })
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  // 選択中の都道府県に印を付ける（陸地はサーバー描画なので、属性で伝える）
  useEffect(() => {
    const land = landRef.current
    if (!land) return
    land.querySelectorAll('[data-active]').forEach((node) => node.removeAttribute('data-active'))
    if (activePrefecture) land.querySelector(`[data-pref="${activePrefecture}"]`)?.setAttribute('data-active', 'true')
  }, [activePrefecture])

  /** 画面上の点 (px, py) を中心に倍率を変える */
  const zoomAt = useCallback((factor: number, px?: number, py?: number, smooth = false) => {
    const { view: current, w: cw, h: ch, base: s } = live.current
    const z = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, current.z * factor))
    const ax = px ?? cw / 2
    const ay = py ?? ch / 2
    const k0 = s * current.z
    const k1 = s * z
    // カーソル下の地図座標が、拡大後も同じ画面位置に来るように中心を決める
    const mapX = current.cx + (ax - cw / 2) / k0
    const mapY = current.cy + (ay - ch / 2) / k0
    setAnimate(smooth)
    setView(clampView({ cx: mapX - (ax - cw / 2) / k1, cy: mapY - (ay - ch / 2) / k1, z }))
  }, [])

  // ホイールでの拡大縮小（ページのスクロールを止めるため、passive でないリスナーが必要）
  useEffect(() => {
    const stage = stageRef.current
    if (!stage || !interactive) return
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const rect = stage.getBoundingClientRect()
      zoomAt(Math.exp(-event.deltaY * 0.0016), event.clientX - rect.left, event.clientY - rect.top)
    }
    stage.addEventListener('wheel', onWheel, { passive: false })
    return () => stage.removeEventListener('wheel', onWheel)
  }, [interactive, zoomAt])

  const distance = (points: { x: number; y: number }[]) => {
    const [a, b] = points
    return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : 0
  }

  const beginGesture = (pointers: Map<number, { x: number; y: number }>, target: EventTarget | null, moved: boolean) => {
    const points = [...pointers.values()]
    const cx = points.reduce((sum, p) => sum + p.x, 0) / Math.max(points.length, 1)
    const cy = points.reduce((sum, p) => sum + p.y, 0) / Math.max(points.length, 1)
    gesture.current = {
      pointers,
      startView: live.current.view,
      startX: cx,
      startY: cy,
      startDistance: distance(points),
      startTarget: target,
      moved,
    }
  }

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!interactive) return
    if ((event.target as Element).closest('[data-pin], [data-control]')) return
    const rect = event.currentTarget.getBoundingClientRect()
    const pointers = gesture.current?.pointers ?? new Map<number, { x: number; y: number }>()
    pointers.set(event.pointerId, { x: event.clientX - rect.left, y: event.clientY - rect.top })
    event.currentTarget.setPointerCapture(event.pointerId)
    // 指が増えたらタップではなくなる
    beginGesture(pointers, event.target, pointers.size > 1 || (gesture.current?.moved ?? false))
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const current = gesture.current
    if (!current || !current.pointers.has(event.pointerId)) return
    const rect = event.currentTarget.getBoundingClientRect()
    current.pointers.set(event.pointerId, { x: event.clientX - rect.left, y: event.clientY - rect.top })

    const points = [...current.pointers.values()]
    const cx = points.reduce((sum, p) => sum + p.x, 0) / points.length
    const cy = points.reduce((sum, p) => sum + p.y, 0) / points.length
    if (Math.hypot(cx - current.startX, cy - current.startY) > 5) current.moved = true
    if (!current.moved && points.length === 1) return

    const { w: cw, h: ch, base: s } = live.current
    const start = current.startView
    const ratio = points.length > 1 && current.startDistance > 0 ? distance(points) / current.startDistance : 1
    const z = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, start.z * ratio))
    const k0 = s * start.z
    const k1 = s * z
    // ジェスチャー開始時に指の下にあった地図座標を、いまの指の位置へ運ぶ
    const mapX = start.cx + (current.startX - cw / 2) / k0
    const mapY = start.cy + (current.startY - ch / 2) / k0
    setAnimate(false)
    setView(clampView({ cx: mapX - (cx - cw / 2) / k1, cy: mapY - (cy - ch / 2) / k1, z }))
  }

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const current = gesture.current
    if (!current || !current.pointers.has(event.pointerId)) return
    current.pointers.delete(event.pointerId)
    if (current.pointers.size > 0) {
      // 残った指で続きの操作ができるよう、基準を取り直す
      beginGesture(current.pointers, current.startTarget, true)
      return
    }
    gesture.current = null
    if (current.moved || event.type === 'pointercancel') return
    const code = (current.startTarget as Element | null)?.closest('[data-pref]')?.getAttribute('data-pref')
    if (code) onPrefecture?.(code)
  }

  const reset = () => {
    setAnimate(true)
    setView(home)
  }

  const place = (x: number, y: number) => `translate(${(x * k + tx).toFixed(1)}px, ${(y * k + ty).toFixed(1)}px)`

  return (
    <div
      ref={stageRef}
      className="map-stage"
      data-interactive={interactive}
      data-animate={animate}
      data-zoomed={view.z > 2.2}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <svg className="map-svg" viewBox={`0 0 ${w} ${h}`} role="img" aria-label={ariaLabel}>
        <g ref={landRef} className="map-land" style={{ transform: `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${k.toFixed(4)})` }}>
          {children}
        </g>
      </svg>

      <div className="map-overlay" data-ready={size !== null}>
        {labels.map((label) => (
          <span key={label.id} className={`map-label map-label--${label.kind}`} style={{ transform: place(label.x, label.y) }}>
            {label.text}
          </span>
        ))}
        {pins.map((pin, index) => {
          const content = (
            <>
              <span className="map-pin__dot" />
              <span className="map-pin__label">
                {pin.label}
                {pin.sub && <small>{pin.sub}</small>}
              </span>
            </>
          )
          const shared = {
            className: 'map-pin',
            'data-pin': pin.id,
            'data-status': pin.status,
            'data-selected': selectedPin === pin.id,
            style: { transform: place(pin.x, pin.y), '--i': index } as CSSProperties,
          }
          return pin.href ? (
            <Link key={pin.id} href={pin.href} {...shared}>
              {content}
            </Link>
          ) : (
            <button key={pin.id} type="button" {...shared} aria-pressed={selectedPin === pin.id} onClick={() => onPin?.(pin.id)}>
              {content}
            </button>
          )
        })}
      </div>

      {interactive && controls && (
        <div className="map-controls" data-control>
          <button type="button" aria-label={controls.zoomIn} onClick={() => zoomAt(1.6, undefined, undefined, true)} disabled={view.z >= MAX_ZOOM}>
            +
          </button>
          <button type="button" aria-label={controls.zoomOut} onClick={() => zoomAt(1 / 1.6, undefined, undefined, true)} disabled={view.z <= MIN_ZOOM}>
            −
          </button>
          <button type="button" aria-label={controls.reset} onClick={reset}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
              <path d="M2.5 6V2.5H6M13.5 10v3.5H10M10 2.5h3.5V6M6 13.5H2.5V10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
