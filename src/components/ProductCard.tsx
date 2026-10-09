import { Link } from 'react-router-dom'
import { badgeLabel, findCategory, productNo, type Product } from '../data/products'
import { formatYen } from '../lib/format'
import { ProductPlate } from './ProductPlate'

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/shop/${product.id}`} className="card">
      <div className="card__media">
        <ProductPlate product={product} />
        {product.badge && <span className="card__badge">{badgeLabel[product.badge]}</span>}
      </div>
      <div className="card__body">
        <div className="card__meta">
          <span className="card__no num">{productNo(product)}</span>
          <span className="card__category">{findCategory(product.category)?.name}</span>
        </div>
        <p className="card__name">{product.name}</p>
        <p className="card__price num">{formatYen(product.price)}</p>
      </div>
    </Link>
  )
}
