'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { ArtKind } from '@/content/types'
import { useI18n } from '@/i18n/client'
import { formatPrice } from '@/lib/format'
import { Art } from '../Art'
import { MapStage, type MapLabel, type MapPin, type MapView } from './MapStage'

// 地図ページの本体。検索・ピン・都道府県の選択と、左側（スマホでは下）のパネルを管理する。

export type AtlasPlace = {
  slug: string
  status: 'live' | 'sample'
  name: string
  en: string
  prefecture: string
  prefectureName: string
  x: number
  y: number
  coord: string
  craft: string
  summary: string
  /** 検索用。日本語・中国語・英語の名前をまとめて小文字にしたもの */
  search: string
  creators: { slug: string; name: string; tagline: string; search: string }[]
  items: {
    id: string
    name: string
    price: number
    photo: string | null
    art: { kind: ArtKind; plate: string; variant?: number }
  }[]
  journey: { title: string; duration: string; stops: number } | null
}

export type AtlasPrefecture = { code: string; name: string; search: string; view: MapView }

type Selection = { kind: 'place'; slug: string } | { kind: 'prefecture'; code: string } | null

type Result =
  | { key: string; kind: 'creator'; title: string; sub: string; slug: string }
  | { key: string; kind: 'place'; title: string; sub: string; slug: string }
  | { key: string; kind: 'prefecture'; title: string; sub: string; code: string }

const PLACE_ZOOM = 4.5

export function MapExplorer({
  children,
  places,
  prefectures,
  labels,
}: {
  children: ReactNode
  places: AtlasPlace[]
  prefectures: AtlasPrefecture[]
  labels: MapLabel[]
}) {
  const { d, to } = useI18n()
  const [selection, setSelection] = useState<Selection>(null)
  const [focus, setFocus] = useState<MapView | null>(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [cursor, setCursor] = useState(0)
  const searchRef = useRef<HTMLDivElement>(null)

  const place = selection?.kind === 'place' ? places.find((p) => p.slug === selection.slug) : undefined
  const prefecture = selection?.kind === 'prefecture' ? prefectures.find((p) => p.code === selection.code) : undefined
  const placesInPrefecture = prefecture ? places.filter((p) => p.prefecture === prefecture.code) : []

  const select = (next: Selection) => {
    setSelection(next)
    if (next?.kind === 'place') {
      const target = places.find((p) => p.slug === next.slug)
      setFocus(target ? { cx: target.x, cy: target.y, z: PLACE_ZOOM } : null)
    } else if (next?.kind === 'prefecture') {
      setFocus(prefectures.find((p) => p.code === next.code)?.view ?? null)
    } else {
      setFocus(null)
    }
    // 共有や再読み込みで同じ場所が開くよう、URLにも残す
    const url = new URL(window.location.href)
    url.search = next?.kind === 'place' ? `?place=${next.slug}` : ''
    window.history.replaceState(null, '', url)
  }

  // ホームのピンや共有リンク（?place=tokyo）から来たときは、その土地を開く
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('place')
    const target = slug ? places.find((p) => p.slug === slug) : undefined
    if (!target) return
    setSelection({ kind: 'place', slug: target.slug })
    setFocus({ cx: target.x, cy: target.y, z: PLACE_ZOOM })
  }, [places])

  // 検索欄の外を押したら候補を閉じる
  useEffect(() => {
    if (!open) return
    const onDown = (event: PointerEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const found: Result[] = []
    for (const p of places) {
      for (const c of p.creators) {
        if (c.search.includes(q)) found.push({ key: `c-${c.slug}`, kind: 'creator', title: c.name, sub: `${p.name}・${c.tagline}`, slug: p.slug })
      }
    }
    for (const p of places) {
      if (p.search.includes(q)) found.push({ key: `p-${p.slug}`, kind: 'place', title: p.name, sub: `${p.prefectureName}・${p.craft}`, slug: p.slug })
    }
    for (const p of prefectures) {
      if (p.search.includes(q)) found.push({ key: `f-${p.code}`, kind: 'prefecture', title: p.name, sub: d.map.kindPrefecture, code: p.code })
    }
    return found.slice(0, 8)
  }, [query, places, prefectures, d.map.kindPrefecture])

  const choose = (result: Result) => {
    select(result.kind === 'prefecture' ? { kind: 'prefecture', code: result.code } : { kind: 'place', slug: result.slug })
    setQuery(result.title)
    setOpen(false)
  }

  const kindLabel = { creator: d.map.kindCreator, place: d.map.kindPlace, prefecture: d.map.kindPrefecture }

  const pins: MapPin[] = places.map((p) => ({
    id: p.slug,
    x: p.x,
    y: p.y,
    label: p.name,
    sub: p.status === 'live' ? p.creators[0]?.name : p.craft,
    status: p.status,
  }))

  const live = places.filter((p) => p.status === 'live')
  const sample = places.filter((p) => p.status === 'sample')

  const row = (p: AtlasPlace) => (
    <li key={p.slug}>
      <button type="button" className="atlas-row" data-status={p.status} onClick={() => select({ kind: 'place', slug: p.slug })}>
        <span className="atlas-row__dot" />
        <span className="atlas-row__name">
          {p.name}
          <small>{p.status === 'live' ? p.creators.map((c) => c.name).join('・') : p.craft}</small>
        </span>
        <span className="atlas-row__arrow">→</span>
      </button>
    </li>
  )

  return (
    <div className="atlas">
      <div className="atlas__map">
        <MapStage
          interactive
          pins={pins}
          labels={labels}
          focus={focus}
          selectedPin={place?.slug ?? null}
          activePrefecture={place?.prefecture ?? prefecture?.code ?? null}
          onPin={(slug) => select({ kind: 'place', slug })}
          onPrefecture={(code) => {
            // 掲載中の土地が1つだけある都道府県は、その土地を直接開く
            const inside = places.filter((p) => p.prefecture === code)
            const only = inside.length === 1 ? inside[0] : undefined
            select(only ? { kind: 'place', slug: only.slug } : { kind: 'prefecture', code })
          }}
          controls={{ zoomIn: d.map.zoomIn, zoomOut: d.map.zoomOut, reset: d.map.reset }}
          ariaLabel={d.map.title}
        >
          {children}
        </MapStage>
        <p className="atlas__credit">{d.map.credit}</p>
      </div>

      <div className="atlas__panel">
        {!selection && (
          <header>
            <p className="eyebrow">Atlas</p>
            <h1 className="atlas__title">{d.map.title}</h1>
            <p className="atlas__lead">{d.map.lead}</p>
          </header>
        )}

        <div className="search" ref={searchRef} data-floating={selection ? 'true' : 'false'}>
          <label className="search__field">
            <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <circle cx="8" cy="8" r="5.2" />
              <path d="M12 12l4 4" strokeLinecap="round" />
            </svg>
            <span className="sr-only">{d.map.searchLabel}</span>
            <input
              type="search"
              value={query}
              placeholder={d.map.searchPlaceholder}
              autoComplete="off"
              enterKeyHint="search"
              role="combobox"
              aria-expanded={open && query.trim() !== ''}
              aria-controls="atlas-results"
              aria-autocomplete="list"
              onChange={(event) => {
                setQuery(event.target.value)
                setOpen(true)
                setCursor(0)
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown') {
                  event.preventDefault()
                  setCursor((i) => Math.min(i + 1, results.length - 1))
                } else if (event.key === 'ArrowUp') {
                  event.preventDefault()
                  setCursor((i) => Math.max(i - 1, 0))
                } else if (event.key === 'Enter') {
                  const result = results[cursor]
                  if (result) choose(result)
                } else if (event.key === 'Escape') {
                  setOpen(false)
                }
              }}
            />
            {query && (
              <button
                type="button"
                className="search__clear"
                aria-label={d.nav.close}
                onClick={() => {
                  setQuery('')
                  setOpen(false)
                }}
              >
                ×
              </button>
            )}
          </label>

          {open && query.trim() !== '' && (
            <div className="search__results" id="atlas-results" role="listbox">
              {results.length === 0 && <p className="search__empty">{d.map.noResult}</p>}
              {results.map((result, index) => (
                <button
                  key={result.key}
                  type="button"
                  role="option"
                  aria-selected={index === cursor}
                  data-active={index === cursor}
                  onPointerEnter={() => setCursor(index)}
                  onClick={() => choose(result)}
                >
                  <span>
                    {result.title}
                    <small>{result.sub}</small>
                  </span>
                  <span className="tag">{kindLabel[result.kind]}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {!selection && (
          <>
            <section className="atlas-list">
              <h3>{d.map.listLive}</h3>
              <ul>{live.map(row)}</ul>
            </section>
            <section className="atlas-list">
              <h3>{d.map.listSample}</h3>
              <ul>{sample.map(row)}</ul>
            </section>
          </>
        )}

        {place && (
          <article className="atlas-detail" key={place.slug}>
            <button type="button" className="atlas-back" onClick={() => select(null)}>
              {d.map.back}
            </button>
            <div className="atlas-detail__head">
              <p className="mono">
                {place.en.toUpperCase()} — {place.coord}
              </p>
              <h2 className="atlas-detail__name">
                {place.name}
                <span className={`tag ${place.status === 'live' ? 'tag--live' : ''}`}>
                  {place.status === 'live' ? d.common.live : d.common.sample}
                </span>
              </h2>
              <p className="atlas-detail__summary">{place.summary}</p>
            </div>

            {place.status === 'sample' && (
              <div className="atlas-empty">
                <p>{d.map.sampleNote}</p>
                <Link href={to('/about#makers')} className="arrow-link">
                  {d.map.emptyCta}
                </Link>
              </div>
            )}

            {place.creators.length > 0 && (
              <section className="atlas-block">
                <h3>{d.map.creatorsHere}</h3>
                {place.creators.map((creator) => (
                  <Link key={creator.slug} href={to(`/creators/${creator.slug}`)} className="maker-chip">
                    <span className="maker-chip__name">{creator.name}</span>
                    <span className="maker-chip__tagline">{creator.tagline}</span>
                    <span className="maker-chip__arrow">→</span>
                  </Link>
                ))}
              </section>
            )}

            {place.items.length > 0 && (
              <section className="atlas-block">
                <h3>{d.map.itemsHere}</h3>
                <div className="mini-items">
                  {place.items.map((item) => (
                    <Link key={item.id} href={to(`/items/${item.id}`)} className="mini-item">
                      <span className="plate">
                        {item.photo ? (
                          <img src={item.photo} alt="" loading="lazy" decoding="async" />
                        ) : (
                          <Art kind={item.art.kind} plate={item.art.plate} variant={item.art.variant} />
                        )}
                      </span>
                      <span className="mini-item__name">{item.name}</span>
                      <span className="mini-item__price">{formatPrice(item.price)}</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {place.journey && (
              <section className="atlas-block">
                <h3>{d.map.journeyHere}</h3>
                <Link href={to(`/places/${place.slug}#journey`)} className="journey-chip">
                  <span className="journey-chip__title">{place.journey.title}</span>
                  <span className="journey-chip__meta">
                    {place.journey.duration} ・ {place.journey.stops}
                    {d.common.stops}
                  </span>
                </Link>
              </section>
            )}

            <div className="atlas-actions">
              <Link href={to(`/places/${place.slug}`)} className="btn btn--ghost btn--block">
                {d.common.viewPlace}
              </Link>
            </div>
          </article>
        )}

        {prefecture && (
          <article className="atlas-detail" key={prefecture.code}>
            <button type="button" className="atlas-back" onClick={() => select(null)}>
              {d.map.back}
            </button>
            <div className="atlas-detail__head">
              <p className="mono">{d.map.kindPrefecture}</p>
              <h2 className="atlas-detail__name">{prefecture.name}</h2>
            </div>
            {placesInPrefecture.length > 0 ? (
              <section className="atlas-list">
                <ul>{placesInPrefecture.map(row)}</ul>
              </section>
            ) : (
              <div className="atlas-empty">
                <p>{d.map.emptyPrefecture}</p>
                <Link href={to('/about#makers')} className="arrow-link">
                  {d.map.emptyCta}
                </Link>
              </div>
            )}
          </article>
        )}
      </div>
    </div>
  )
}
