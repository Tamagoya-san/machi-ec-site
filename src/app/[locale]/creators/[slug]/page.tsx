import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { CSSProperties } from 'react'
import { Art } from '@/components/Art'
import { MapLand } from '@/components/map/MapLand'
import { MapStage } from '@/components/map/MapStage'
import { Photo } from '@/components/Photo'
import { ProductCard } from '@/components/ProductCard'
import { TryOnDiagram } from '@/components/TryOnDiagram'
import { creators, getCreator, getPlace, productsByCreator } from '@/content'
import type { Creator, Place, Section } from '@/content/types'
import { getI18n, type I18n } from '@/i18n/server'
import { pad2 } from '@/lib/format'
import { formatCoord, project } from '@/lib/geo'
import { machiInstagram } from '@/lib/site'

// つくり手ごとのLP。内容は src/content/creators/*.ts の sections を上から順に描画する。

export const dynamicParams = false

export function generateStaticParams() {
  return creators.map((creator) => ({ slug: creator.slug }))
}

export async function generateMetadata({ params }: PageProps<'/[locale]/creators/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const { t } = await getI18n()
  const creator = getCreator(slug)
  if (!creator) return {}
  const title = `${creator.name} — ${t(creator.tagline)}`
  return {
    title,
    description: t(creator.summary),
    openGraph: {
      title,
      description: t(creator.summary),
      images: creator.cover ? [{ url: creator.cover.src, width: creator.cover.width, height: creator.cover.height }] : undefined,
    },
  }
}

export default async function CreatorPage({ params }: PageProps<'/[locale]/creators/[slug]'>) {
  const { slug } = await params
  const i18n = await getI18n()
  const { d, t, to } = i18n
  const creator = getCreator(slug)
  if (!creator) notFound()
  const place = getPlace(creator.place)

  const theme = {
    '--lp-paper': creator.theme.paper,
    '--lp-soft': creator.theme.soft,
    '--lp-ink': creator.theme.ink,
    '--lp-accent': creator.theme.accent,
  } as CSSProperties

  return (
    <article className="lp" style={theme}>
      <header className="lp-hero">
        <div className="wrap lp-hero__grid">
          <div className="lp-hero__copy">
            <ol className="crumbs rise">
              <li>
                <Link href={to('/')}>{d.common.home}</Link>
              </li>
              <li>
                <Link href={to('/creators')}>{d.nav.creators}</Link>
              </li>
              <li>{creator.name}</li>
            </ol>
            <p className="lp-hero__no rise">
              <span>
                {d.lp.number}
                {pad2(creator.no)}
              </span>
              {place && (
                <span>
                  {place.en} — {formatCoord(place.lat, place.lon)}
                </span>
              )}
            </p>
            <h1 className="lp-hero__name rise rise-2">{creator.name}</h1>
            <p className="lp-hero__tagline rise rise-3">{t(creator.tagline)}</p>
            <p className="lp-hero__summary rise rise-3">{t(creator.summary)}</p>
            <div className="lp-hero__cta rise rise-4">
              <a href="#items" className="btn">
                {d.common.viewItems}
              </a>
              <Link href={to('/try-on')} className="arrow-link">
                {d.common.tryOn}
              </Link>
            </div>
          </div>
          {creator.cover ? (
            <figure className="lp-hero__photo rise rise-2">
              <Photo photo={creator.cover} sizes="(min-width: 900px) 42vw, 100vw" priority />
              {creator.photoCredit && <figcaption>{creator.photoCredit}</figcaption>}
            </figure>
          ) : (
            <div className="lp-hero__art rise rise-2">
              <span className="lp-hero__moon" aria-hidden="true" />
              <Art kind={creator.heroArt} plate="transparent" />
            </div>
          )}
        </div>

        <div className="wrap">
          <dl className="lp-facts">
            {creator.facts.map((fact) => (
              <div key={fact.label.ja}>
                <dt>{t(fact.label)}</dt>
                <dd>{t(fact.value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      {creator.sections.map((section, index) => (
        <LpSection key={`${section.type}-${index}`} section={section} creator={creator} place={place} i18n={i18n} />
      ))}

      {/* スマホで常に見える購入導線 */}
      <div className="lp-sticky">
        <span>
          <b>{creator.name}</b>
          {t(creator.craft)}
        </span>
        <a href="#items" className="btn btn--sm">
          {d.lp.stickyCta}
        </a>
      </div>
    </article>
  )
}

async function LpSection({
  section,
  creator,
  place,
  i18n,
}: {
  section: Section
  creator: Creator
  place: Place | undefined
  i18n: I18n
}) {
  const { d, t, to } = i18n

  switch (section.type) {
    case 'note':
      return (
        <section className="lp-note">
          <div className="wrap lp-note__inner">
            <p className="eyebrow">
              {d.lp.machiNote}
              {section.provisional && <span className="tag">{d.lp.provisionalText}</span>}
            </p>
            <blockquote>{t(section.body)}</blockquote>
            <p className="lp-note__sign">
              Machi{' '}
              <a href={section.source?.url ?? machiInstagram} target="_blank" rel="noopener noreferrer">
                {section.source?.label ?? '@machihistory'}
              </a>
            </p>
            {section.context && <p className="lp-note__context">{t(section.context)}</p>}
          </div>
        </section>
      )

    case 'story':
      return (
        <section className="lp-section">
          <div className="wrap lp-split">
            <div className="lp-split__head">
              <p className="eyebrow">{section.eyebrow}</p>
              <h2 className="h-section">{t(section.title)}</h2>
            </div>
            <div className="lp-prose">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.ja}>{t(paragraph)}</p>
              ))}
            </div>
          </div>
          {section.images && section.images.length > 0 && (
            <div className="wrap lp-story__photos" data-count={section.images.length}>
              {section.images.map((image) => (
                <figure key={image.src}>
                  <Photo photo={image} sizes="(min-width: 900px) 40vw, 50vw" />
                </figure>
              ))}
              {creator.photoCredit && <p className="lp-credit">{creator.photoCredit}</p>}
            </div>
          )}
        </section>
      )

    case 'gallery':
      return (
        <section className="lp-section lp-gallery">
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">{section.eyebrow}</p>
              <h2 className="h-section">{t(section.title)}</h2>
              {section.body && <p className="lead">{t(section.body)}</p>}
            </div>
            <div className="lp-gallery__grid" data-count={section.images.length}>
              {section.images.map((image) => (
                <figure key={image.src}>
                  <Photo photo={image} sizes="(min-width: 900px) 46vw, 100vw" />
                </figure>
              ))}
            </div>
            {creator.photoCredit && <p className="lp-credit">{creator.photoCredit}</p>}
          </div>
        </section>
      )

    case 'points':
      return (
        <section className="lp-section lp-section--soft">
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">{section.eyebrow}</p>
              <h2 className="h-section">{t(section.title)}</h2>
            </div>
            <ol className="lp-points">
              {section.items.map((item, index) => (
                <li key={item.title.ja}>
                  <span className="lp-points__no">{pad2(index + 1)}</span>
                  <h3>{t(item.title)}</h3>
                  <p>{t(item.body)}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )

    case 'video':
      return (
        <section className="lp-section">
          <div className="wrap lp-video">
            {section.cover && section.url ? (
              <a href={section.url} target="_blank" rel="noopener noreferrer" className="lp-video__frame" aria-label={d.lp.watchOn}>
                <Photo photo={section.cover} sizes="300px" />
                <span className="lp-video__play" />
                <span className="lp-video__handle">@machihistory</span>
              </a>
            ) : (
              <div className="lp-video__frame" aria-hidden="true">
                <span className="lp-video__play" />
                <span className="lp-video__label">{d.lp.videoSoon}</span>
                <span className="lp-video__handle">@machihistory</span>
              </div>
            )}
            <div className="lp-video__copy">
              <p className="eyebrow">Reel</p>
              <h2 className="h-section">{t(section.title)}</h2>
              <p className="lead">{t(section.body)}</p>
              <a href={section.url ?? machiInstagram} target="_blank" rel="noopener noreferrer" className="arrow-link">
                {d.lp.watchOn}
              </a>
            </div>
          </div>
        </section>
      )

    case 'products': {
      const items = productsByCreator(creator.slug)
      return (
        <section className="lp-section" id="items">
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">{section.eyebrow}</p>
              <h2 className="h-section">{t(section.title)}</h2>
              {items.some((item) => item.provisional) && <p className="notice">{d.common.provisionalItem}</p>}
            </div>
            <div className="product-grid">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} showCreator={false} />
              ))}
            </div>
          </div>
        </section>
      )
    }

    case 'tryon':
      return (
        <section className="lp-section lp-section--soft">
          <div className="wrap tryband__grid">
            <div className="tryband__copy">
              <p className="eyebrow">AI try-on</p>
              <h2 className="h-section">{t(section.title)}</h2>
              <p className="lead">{t(section.body)}</p>
              <Link href={to('/try-on')} className="btn">
                {d.common.tryOn}
              </Link>
            </div>
            <TryOnDiagram labels={[d.home.tryPhoto, d.home.tryItem, d.home.tryResult]} />
          </div>
        </section>
      )

    case 'timeline':
      return (
        <section className="lp-section">
          <div className="wrap lp-split">
            <div className="lp-split__head">
              <p className="eyebrow">{section.eyebrow}</p>
              <h2 className="h-section">{t(section.title)}</h2>
            </div>
            <ol className="lp-timeline">
              {section.items.map((item) => {
                const spot = place?.spots.find((s) => s.id === item.spot)
                return (
                  <li key={`${item.date}-${item.title.ja}`}>
                    <p className="lp-timeline__date">{item.date}</p>
                    <div>
                      <h3>{t(item.title)}</h3>
                      <p>{t(item.body)}</p>
                      {item.image && (
                        <figure className="lp-timeline__photo">
                          <Photo photo={item.image} sizes="(min-width: 900px) 40vw, 90vw" />
                        </figure>
                      )}
                      <p className="lp-timeline__meta">
                        {spot && <span>{t(spot.name)}</span>}
                        {item.source && (
                          <a href={item.source.url} target="_blank" rel="noopener noreferrer">
                            {d.lp.source}：{item.source.label}
                          </a>
                        )}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </section>
      )

    case 'place': {
      if (!place) return null
      const { x, y } = project(place.lat, place.lon)
      return (
        <section className="lp-section lp-section--soft">
          <div className="wrap lp-place">
            <div className="lp-place__map">
              <MapStage
                pins={[
                  {
                    id: place.slug,
                    x,
                    y,
                    label: t(place.name),
                    sub: creator.name,
                    status: 'live',
                    href: to(`/map?place=${place.slug}`),
                  },
                ]}
                home={{ cx: x - 12, cy: y + 6, z: 3.4 }}
                ariaLabel={t(place.name)}
              >
                <MapLand live={[place.prefecture]} />
              </MapStage>
              <span className="map-plate__tick map-plate__tick--tl">{d.lp.mapCaption}</span>
            </div>
            <div className="lp-place__copy">
              <p className="eyebrow">{section.eyebrow}</p>
              <h2 className="h-section">{t(section.title)}</h2>
              <p className="lead">{t(section.body)}</p>
              {place.journey && (
                <Link href={to(`/places/${place.slug}#journey`)} className="journey-chip">
                  <span className="journey-chip__meta">
                    {d.common.journey} ・ {t(place.journey.duration)} ・ {place.journey.stops.length}
                    {d.common.stops}
                  </span>
                  <span className="journey-chip__title">{t(place.journey.title)}</span>
                </Link>
              )}
              <Link href={to(`/places/${place.slug}`)} className="arrow-link">
                {d.common.viewPlace}
              </Link>
            </div>
          </div>
        </section>
      )
    }

    case 'guide':
      return (
        <section className="lp-section">
          <div className="wrap lp-split">
            <div className="lp-split__head">
              <p className="eyebrow">Guide</p>
              <h2 className="h-section">{t(section.title)}</h2>
            </div>
            <div>
              <dl className="lp-guide">
                {section.items.map((item) => (
                  <div key={item.label.ja}>
                    <dt>{t(item.label)}</dt>
                    <dd>{t(item.value)}</dd>
                  </div>
                ))}
              </dl>
              {section.note && <p className="notice lp-guide__note">{t(section.note)}</p>}
              <div className="lp-guide__links">
                {creator.links.instagram && (
                  <a href={creator.links.instagram} target="_blank" rel="noopener noreferrer" className="arrow-link">
                    {creator.name} Instagram
                  </a>
                )}
                {creator.links.shop && (
                  <a href={creator.links.shop} target="_blank" rel="noopener noreferrer" className="arrow-link">
                    {d.common.officialShop}
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )
  }
}
