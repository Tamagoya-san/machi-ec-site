import { Link } from 'react-router-dom'
import { findCategory, type Product } from '../data/products'
import { formatYen } from '../lib/format'
import { ProductArt } from './ProductArt'

export function ProductCard({ product }: { product: Product }) {
  const category = findCategory(product.category)
  return (
    <Link to={`/shop/${product.id}`} className="card">
      <div className="card__media">
        <ProductArt product={product} className="card__art" />
        {product.badge && <span className={`badge badge--${product.badge === '限定' ? 'limited' : 'default'}`}>{product.badge}</span>}
      </div>
      <div className="card__body">
        <p className="card__category">{category?.name}</p>
        <p className="card__name">{product.name}</p>
        <p className="card__zh" lang="zh-Hant">
          {product.nameZh}
        </p>
        <p className="card__price">
          {formatYen(product.price)}
          <span>税込</span>
        </p>
      </div>
    </Link>
  )
}
