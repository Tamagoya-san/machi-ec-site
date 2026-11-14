import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapLand } from '@/components/map/MapLand'
import { MapStage } from '@/components/map/MapStage'
import { ProductCard } from '@/components/ProductCard'
import { creatorsByPlace, getCreator, getPlace, places, productsByPlace } from '@/content'
import type { Spot } from '@/content/types'
import { getI18n } from '@/i18n/server'
import { pad2 } from '@/lib/format'
import { formatCoord, project } from '@/lib/geo'

// 土地のページ。つくり手・作品・旅のプランを、その土地を軸にまとめる。

export const dynamicParams = false

export function generateStaticParams() {
  return places.map((place) => ({ slug: place.slug }))
}

export async function generateMetadata({ params }: PageProps<'/[locale]/places/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const { t } = await getI18n()
  const place = getPlace(slug)
  if (!place) return {}
  const title = `${t(place.name)} — ${t(place.craft)}`
  return { title, description: t(place.summary), openGraph: { title, description: t(place.summary) } }
}

const coord = (spot: Spot) => `${spot.lat},${spot.lon}`
const mapsSearch = (spot: Spot) => `https://www.google.com/maps/search/?api=1&query=${coord(spot)}`

/** 立ち寄り先を順につないだ Google マップの経路URL */
function mapsRoute(spots: Spot[]): string | null {
  const first = spots[0]
  const last = spots[spots.length - 1]
  if (!first || !last || spots.length < 2) return null
  const query = new URLSearchParams({ api: '1', origin: coord(first), destination: coord(last), travelmode: 'transit' })
  const between = spots.slice(1, -1).map(coord).join('|')
  if (between) query.set('waypoints', between)
  return `https://www.google.com/maps/dir/?${query.toString()}`
}

export default async function PlacePage({ params }: PageProps<'/[locale]/places/[slug]'>) {
  const { slug } = await params
  const { d, t, to } = await getI18n()
  const place = getPlace(slug)
  if (!place) notFound()

  const makers = creatorsByPlace(place.slug)
  const items = productsByPlace(place.slug)
  const live = place.status === 'live'
  const { x, y } = project(place.lat, place.lon)
  const journey = place.journey
  const stops = (journey?.stops ?? []).flatMap((stop) => {
    const spot = place.spots.find((s) => s.id === stop.spot)
    return spot ? [{ stop, spot }] : []
  })
  const route = mapsRoute(stops.map(({ spot }) => spot))
  const others = places.filter((other) => other.slug !== place.slug)

  return (
    <>
      <header className="place-hero">
        <div className="wrap place-hero__grid">
          <div className="place-hero__copy">
            <ol className="crumbs">
              <li>
                <Link href={to('/')}>{d.common.home}</Link>
              </li>
              <li>
                <Link href={to('/map')}>{d.nav.map}</Link>
              </li>
              <li>{t(place.name)}</li>
            </ol>
            <p className="eyebrow">
              {d.place.eyebrow} — {formatCoord(place.lat, place.lon)}
            </p>
            <h1 className="place-hero__name">
              {t(place.name)}
              <span className="latin">{place.en}</span>
            </h1>
            <p className="place-hero__tags">
              <span className={`tag ${live ? 'tag--live' : ''}`}>{live ? d.common.live : d.common.sample}</span>
              <span className="tag">{t(place.craft)}</span>
            </p>
            <p className="lead">{t(place.summary)}</p>
            <Link href={to(`/map?place=${place.slug}`)} className="arrow-link">
              {d.place.locate}
            </Link>
          </div>
          <div className="place-hero__map">
            <MapStage
              pins={[{ id: place.slug, x, y, label: t(place.name), sub: place.en, status: place.status }]}
              home={{ cx: x, cy: y, z: 2.6 }}
              ariaLabel={t(place.name)}
            >
              <MapLand live={live ? [place.prefecture] : []} />
            </MapStage>
          </div>
        </div>
      </header>

      {place.body.length > 0 && (
        <section className="section place-body">
          <div className="wrap">
            <div className="lp-prose place-body__prose">
              {place.body.map((paragraph) => (
                <p key={paragraph.ja}>{t(paragraph)}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {makers.length > 0 && (
        <section className="section place-makers">
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">Makers</p>
              <h2 className="h-section">{d.place.creators}</h2>
            </div>
            <div className="place-makers__list">
              {makers.map((creator) => (
                <Link key={creator.slug} href={to(`/creators/${creator.slug}`)} className="maker-chip">
                  <span className="maker-chip__name">{creator.name}</span>
                  <span className="maker-chip__tagline">{t(creator.tagline)}</span>
                  <span className="maker-chip__arrow">→</span>
                </Link>
              ))}
            </div>
            <div className="section-head place-makers__items">
              <p className="eyebrow">Items</p>
              <h2 className="h-section">{d.place.items}</h2>
            </div>
            <div className="product-grid">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {journey && (
        <section className="section journey" id="journey">
          <div className="wrap journey__grid">
            <div className="journey__head">
              <p className="eyebrow">{d.place.journeyEyebrow}</p>
              <h2 className="h-section">{t(journey.title)}</h2>
              <p className="lead">{t(journey.lead)}</p>
              <p className="journey__meta">
                <span>{t(journey.duration)}</span>
                <span>
                  {stops.length}
                  {d.common.stops}
                </span>
              </p>
              {route && (
                <a href={route} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
                  {d.place.openRoute}
                </a>
              )}
              {journey.provisional && <p className="notice">{d.place.journeyProvisional}</p>}
            </div>

            <ol className="journey__stops">
              {stops.map(({ stop, spot }, index) => {
                const creator = stop.creator ? getCreator(stop.creator) : undefined
                return (
                  <li key={stop.spot} className="stop" data-creator={Boolean(creator)}>
                    <span className="stop__no">{pad2(index + 1)}</span>
                    <div className="stop__body">
                      <p className="stop__time">{t(stop.time)}</p>
                      <h3>{t(stop.title)}</h3>
                      <p className="stop__place">
                        {t(spot.name)}
                        <small>{t(spot.note)}</small>
                      </p>
                      <p className="stop__text">{t(stop.body)}</p>
                      <p className="stop__links">
                        <a href={mapsSearch(spot)} target="_blank" rel="noopener noreferrer">
                          {formatCoord(spot.lat, spot.lon)} ・ {d.place.openMap}
                        </a>
                        {creator && (
                          <Link href={to(`/creators/${creator.slug}`)} className="stop__creator">
                            {creator.name} {d.place.related}
                          </Link>
                        )}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </section>
      )}

      {!live && (
        <section className="section">
          <div className="wrap">
            <div className="place-empty">
              <p className="eyebrow">{d.common.recruiting}</p>
              <h2 className="h-section">{d.place.sampleTitle}</h2>
              <p className="lead">{d.place.sampleBody}</p>
              <Link href={to('/about#makers')} className="btn">
                {d.map.emptyCta}
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="section place-others">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Places</p>
            <h2 className="h-section">{d.place.others}</h2>
          </div>
          <ul className="index">
            {others.map((other, i) => (
              <li key={other.slug}>
                <Link href={to(`/places/${other.slug}`)} className="index__row" data-status={other.status}>
                  <span className="index__no">{pad2(i + 1)}</span>
                  <span className="index__name">{t(other.name)}</span>
                  <span className="index__en">{other.en}</span>
                  <span className="index__craft">
                    {other.status === 'live'
                      ? creatorsByPlace(other.slug)
                          .map((c) => c.name)
                          .join('・')
                      : t(other.craft)}
                  </span>
                  <span className={`tag ${other.status === 'live' ? 'tag--live' : ''}`}>
                    {other.status === 'live' ? d.common.live : d.common.recruiting}
                  </span>
                  <span className="index__arrow">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
