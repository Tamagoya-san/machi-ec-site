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
      <div className="card__meta">
        <span>{productNo(product)}</span>
        <span>{formatYen(product.price)}</span>
      </div>
      <p className="card__name">{product.name}</p>
      <p className="card__category">{findCategory(product.category)?.name}</p>
    </Link>
  )
}
