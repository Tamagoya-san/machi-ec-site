import type { CSSProperties } from 'react'
import type { Product } from '../data/products'
import { photo } from '../lib/photos'

interface Props {
  product: Product
  className?: string
  /** サムネイル等では読みを出さない */
  bare?: boolean
}

export function ProductPlate({ product, className = '', bare }: Props) {
  const src = photo(`product-${product.id}`)
  if (src) {
    return <img className={`plate plate--photo ${className}`} src={src} alt={product.name} loading="lazy" decoding="async" />
  }
  return (
    <div
      className={`plate ${className}`}
      style={{ '--tone': product.plate.tone } as CSSProperties}
      role="img"
      aria-label={`${product.name}（イメージ）`}
    >
      <span className="plate__glyph" aria-hidden="true">
        {product.plate.glyph}
      </span>
      {!bare && (
        <span className="plate__roman" aria-hidden="true">
          {product.plate.roman}
        </span>
      )}
    </div>
  )
}
