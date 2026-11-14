import Image from 'next/image'
import Link from 'next/link'
import { getCreator } from '@/content'
import type { Product } from '@/content/types'
import { getI18n } from '@/i18n/server'
import { formatPrice } from '@/lib/format'
import { findItemPhoto } from '@/lib/photos'
import { Art } from './Art'

/** 写真があれば写真、なければイラストを表示する。親要素（.plate）いっぱいに広がる */
export function ProductVisual({
  product,
  alt,
  sizes = '(min-width: 760px) 33vw, 50vw',
  priority = false,
}: {
  product: Product
  alt: string
  sizes?: string
  priority?: boolean
}) {
  const photo = findItemPhoto(product.id)
  if (photo) return <Image src={photo.url} alt={alt} fill sizes={sizes} priority={priority} />
  return <Art kind={product.art.kind} plate={product.art.plate} variant={product.art.variant} />
}

export async function ProductCard({ product, showCreator = true }: { product: Product; showCreator?: boolean }) {
  const { d, t, to } = await getI18n()
  const creator = getCreator(product.creator)
  const name = t(product.name)

  return (
    <Link href={to(`/items/${product.id}`)} className="product-card">
      <span className="plate">
        <ProductVisual product={product} alt={name} />
      </span>
      <span className="product-card__meta">
        {showCreator && creator && <span className="product-card__creator">{creator.name}</span>}
        <span className="product-card__name">{name}</span>
        <span className="product-card__price">
          {formatPrice(product.price)}
          <small>{d.common.taxIn}</small>
          {product.provisional && <span className="tag">{d.common.priceProvisional}</span>}
        </span>
      </span>
    </Link>
  )
}
