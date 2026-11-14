import Link from 'next/link'
import type { CSSProperties } from 'react'
import { Art } from '@/components/Art'
import { buildAtlas } from '@/components/map/data'
import { MapLand } from '@/components/map/MapLand'
import { MapStage, type MapPin } from '@/components/map/MapStage'
import { Photo } from '@/components/Photo'
import { ProductCard } from '@/components/ProductCard'
import { TryOnDiagram } from '@/components/TryOnDiagram'
import { creators, getPlace, productsByCreator } from '@/content'
import { machi } from '@/content/machi'
import { getI18n } from '@/i18n/server'
import { pad2 } from '@/lib/format'
import { machiInstagram } from '@/lib/site'

export default async function HomePage() {
  const i18n = await getI18n()
  const { d, t, to } = i18n
  const atlas = buildAtlas(i18n)

  const pins: MapPin[] = atlas.places.map((place) => ({
    id: place.slug,
    x: place.x,
    y: place.y,
    label: place.name,
    sub: place.status === 'live' ? place.creators[0]?.name : place.craft,
    status: place.status,
    href: to(`/map?place=${place.slug}`),
  }))

  const featured = creators.filter((creator) => creator.status === 'live')

  return (
    <>
      {/* ヒーロー：コピーと日本地図 */}
      <section className="hero">
        <div className="wrap hero__grid">
          <div className="hero__copy">
            <p className="eyebrow rise">{d.home.eyebrow}</p>
            <h1 className="hero__title rise rise-2">
              {d.home.title.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h1>
            <p className="lead hero__lead rise rise-3">{d.home.lead}</p>
            <div className="hero__cta rise rise-4">
              <Link href={to('/map')} className="btn">
                {d.home.ctaMap}
              </Link>
              <Link href={to('/creators/teeenu')} className="arrow-link">
                {d.home.ctaFirst}
              </Link>
            </div>
            <p className="hero__route rise rise-4">
              <span>Tokyo 35.66°N 139.74°E</span>
              <i aria-hidden="true" />
              <span>Taiwan</span>
            </p>
          </div>

          <div className="hero__map rise rise-2">
            <div className="map-plate">
              <MapStage pins={pins} labels={atlas.labels} ariaLabel={d.map.title}>
                <MapLand live={atlas.livePrefectures} />
              </MapStage>
              <span className="map-plate__tick map-plate__tick--tl">46°N</span>
              <span className="map-plate__tick map-plate__tick--tr">147°E</span>
              <span className="map-plate__tick map-plate__tick--bl">118°E</span>
              <span className="map-plate__tick map-plate__tick--br">21°N</span>
            </div>
            <p className="hero__map-note">
              <span>{d.home.mapNote}</span>
              <Link href={to('/map')} className="arrow-link">
                {d.common.viewMap}
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* 掲載中のつくり手 */}
      <section className="section">
        <div className="wrap">
          <div className="section-head section-head--row">
            <div className="section-head">
              <p className="eyebrow">{d.home.featuredEyebrow}</p>
              <h2 className="h-section">{d.home.featuredTitle}</h2>
            </div>
            <Link href={to('/creators')} className="arrow-link">
              {d.common.viewAll}
            </Link>
          </div>

          {featured.map((creator) => {
            const place = getPlace(creator.place)
            const items = productsByCreator(creator.slug).slice(0, 3)
            const theme = {
              '--lp-paper': creator.theme.paper,
              '--lp-soft': creator.theme.soft,
              '--lp-ink': creator.theme.ink,
              '--lp-accent': creator.theme.accent,
            } as CSSProperties
            return (
              <div key={creator.slug} className="feature" style={theme}>
                <Link href={to(`/creators/${creator.slug}`)} className="feature__card">
                  <div className="feature__art">
                    {creator.cover ? (
                      <Photo photo={creator.cover} sizes="(min-width: 900px) 45vw, 100vw" />
                    ) : (
                      <Art kind={creator.heroArt} plate={creator.theme.soft} />
                    )}
                  </div>
                  <div className="feature__body">
                    <p className="mono">
                      {d.lp.number}
                      {pad2(creator.no)} — {place?.en.toUpperCase()}
                    </p>
                    <h3 className="feature__name">{creator.name}</h3>
                    <p className="feature__tagline">{t(creator.tagline)}</p>
                    <p className="feature__summary">{t(creator.summary)}</p>
                    <span className="btn btn--ghost">{d.common.readStory}</span>
                  </div>
                </Link>
                <div className="product-grid feature__items">
                  {items.map((product) => (
                    <ProductCard key={product.id} product={product} showCreator={false} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* しくみ */}
      <section className="section how">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">{d.home.howEyebrow}</p>
            <h2 className="h-section">{d.home.howTitle}</h2>
          </div>
          <ol className="how__steps">
            {d.home.how.map((step, index) => (
              <li key={step.title} className="how__step">
                <span className="how__no">{pad2(index + 1)}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* AI試着 */}
      <section className="section tryband">
        <div className="wrap tryband__grid">
          <div className="tryband__copy">
            <p className="eyebrow">{d.home.tryEyebrow}</p>
            <h2 className="h-section">{d.home.tryTitle}</h2>
            <p className="lead">{d.home.tryBody}</p>
            <Link href={to('/try-on')} className="btn">
              {d.common.tryOn}
            </Link>
          </div>
          <TryOnDiagram labels={[d.home.tryPhoto, d.home.tryItem, d.home.tryResult]} />
        </div>
      </section>

      {/* 土地の索引 */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">{d.home.placesEyebrow}</p>
            <h2 className="h-section">{d.home.placesTitle}</h2>
            <p className="lead index__lead">{d.home.placesBody}</p>
          </div>
          <ul className="index">
            {atlas.places.map((place, i) => (
              <li key={place.slug}>
                <Link href={to(`/map?place=${place.slug}`)} className="index__row" data-status={place.status}>
                  <span className="index__no">{pad2(i + 1)}</span>
                  <span className="index__name">{place.name}</span>
                  <span className="index__en">{place.en}</span>
                  <span className="index__craft">
                    {place.status === 'live' ? place.creators.map((c) => c.name).join('・') : place.craft}
                  </span>
                  <span className={`tag ${place.status === 'live' ? 'tag--live' : ''}`}>
                    {place.status === 'live' ? d.common.live : d.common.recruiting}
                  </span>
                  <span className="index__arrow">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Machi と つくり手募集 */}
      <section className="section closing">
        <div className="wrap">
          <div className="closing__machi">
            <figure className="closing__photo">
              <Photo photo={machi.travel[0]!} sizes="(min-width: 900px) 420px, 90vw" />
              <figcaption>{machi.travelCredit}</figcaption>
            </figure>
            <div className="closing__copy">
              <p className="eyebrow">{d.home.machiEyebrow}</p>
              <h2 className="h-section">{d.home.machiTitle}</h2>
              <p className="lead">{d.home.machiBody}</p>
              <dl className="closing__facts">
                {d.about.machiFacts.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="closing__links">
                <Link href={to('/about')} className="arrow-link">
                  {d.home.machiCta}
                </Link>
                <a href={machiInstagram} target="_blank" rel="noopener noreferrer" className="arrow-link">
                  Instagram
                </a>
              </div>
            </div>
          </div>
          <div className="closing__join">
            <div>
              <p className="eyebrow">{d.home.joinEyebrow}</p>
              <h2>{d.home.joinTitle}</h2>
            </div>
            <div className="closing__join-body">
              <p>{d.home.joinBody}</p>
              <Link href={to('/about#makers')} className="btn">
                {d.home.joinCta}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
