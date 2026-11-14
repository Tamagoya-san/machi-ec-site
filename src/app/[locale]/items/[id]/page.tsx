import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AddToCart } from '@/components/AddToCart'
import { ProductCard, ProductVisual } from '@/components/ProductCard'
import { categoryLabels, getCreator, getPlace, getProduct, products, productsByCreator } from '@/content'
import { getI18n } from '@/i18n/server'
import { formatPrice } from '@/lib/format'

export const dynamicParams = false

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }))
}

export async function generateMetadata({ params }: PageProps<'/[locale]/items/[id]'>): Promise<Metadata> {
  const { id } = await params
  const { t } = await getI18n()
  const product = getProduct(id)
  if (!product) return {}
  const creator = getCreator(product.creator)
  const title = `${t(product.name)}｜${creator?.name ?? ''}`
  return { title, description: t(product.description), openGraph: { title, description: t(product.description) } }
}

export default async function ItemPage({ params }: PageProps<'/[locale]/items/[id]'>) {
  const { id } = await params
  const { d, t, to } = await getI18n()
  const product = getProduct(id)
  if (!product) notFound()
  const creator = getCreator(product.creator)
  const place = creator ? getPlace(creator.place) : undefined
  const guide = creator?.sections.find((section) => section.type === 'guide')
  const related = productsByCreator(product.creator)
    .filter((other) => other.id !== product.id)
    .slice(0, 3)
  const name = t(product.name)

  return (
    <div className="wrap item">
      <ol className="crumbs item__crumbs">
        <li>
          <Link href={to('/')}>{d.common.home}</Link>
        </li>
        {creator && (
          <li>
            <Link href={to(`/creators/${creator.slug}`)}>{creator.name}</Link>
          </li>
        )}
        <li>{name}</li>
      </ol>

      <div className="item__grid">
        <div className="item__visual">
          <span className="plate">
            <ProductVisual product={product} alt={name} sizes="(min-width: 860px) 50vw, 100vw" priority />
          </span>
          {product.source && (
            <p className="item__visual-note">
              {d.common.photoSource}：
              <a href={product.source.url} target="_blank" rel="noopener noreferrer">
                {product.source.label}
              </a>
            </p>
          )}
        </div>

        <div className="item__info">
          <div className="item__head">
            {creator && (
              <Link href={to(`/creators/${creator.slug}`)} className="item__creator">
                {creator.name}
              </Link>
            )}
            <h1 className="item__name">{name}</h1>
            <p className="item__lead">{t(product.lead)}</p>
            <p className="item__price">
              {formatPrice(product.price)}
              <small>{d.common.taxIn}</small>
              {product.provisional && <span className="tag">{d.common.priceProvisional}</span>}
            </p>
            {product.provisional && <p className="item__provisional">{d.common.provisionalItem}</p>}
          </div>

          <AddToCart id={product.id} variants={(product.variants ?? []).map((v) => ({ id: v.id, label: t(v.label) }))} />

          {product.tryOn && (
            <div className="item__tryon">
              <p>{d.item.tryOnLead}</p>
              <Link href={to(`/try-on?item=${product.id}`)} className="btn btn--ghost btn--block">
                {d.common.tryOn}
              </Link>
            </div>
          )}

          <section className="item__block">
            <h2>{d.item.details}</h2>
            <p>{t(product.description)}</p>
            <ul className="item__details">
              <li>{t(categoryLabels[product.category])}</li>
              {product.details.map((detail) => (
                <li key={detail.ja}>{t(detail)}</li>
              ))}
            </ul>
          </section>

          {creator && (
            <section className="item__block">
              <h2>{d.item.madeBy}</h2>
              <Link href={to(`/creators/${creator.slug}`)} className="maker-chip">
                <span className="maker-chip__name">{creator.name}</span>
                <span className="maker-chip__tagline">{t(creator.tagline)}</span>
                <span className="maker-chip__arrow">→</span>
              </Link>
            </section>
          )}

          {place && (
            <section className="item__block">
              <h2>{d.item.from}</h2>
              <Link href={to(`/places/${place.slug}`)} className="journey-chip">
                <span className="journey-chip__meta">
                  {place.en} {place.journey ? `・ ${d.common.journey}` : ''}
                </span>
                <span className="journey-chip__title">
                  {t(place.name)} — {t(place.summary)}
                </span>
              </Link>
            </section>
          )}

          {guide?.type === 'guide' && (
            <section className="item__block">
              <h2>{d.item.shipping}</h2>
              <dl className="lp-guide">
                {guide.items.map((row) => (
                  <div key={row.label.ja}>
                    <dt>{t(row.label)}</dt>
                    <dd>{t(row.value)}</dd>
                  </div>
                ))}
              </dl>
              {guide.note && <p className="item__provisional">{t(guide.note)}</p>}
            </section>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="item__related">
          <div className="section-head">
            <p className="eyebrow">Items</p>
            <h2 className="h-section">{d.item.related}</h2>
          </div>
          <div className="product-grid">
            {related.map((other) => (
              <ProductCard key={other.id} product={other} showCreator={false} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
