import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { ProductPlate } from '../components/ProductPlate'
import { QtyStepper } from '../components/QtyStepper'
import { badgeLabel, findCategory, findProduct, productNo, products, type Product } from '../data/products'
import { FREE_SHIPPING_THRESHOLD, MAX_QTY_PER_ITEM, useCart } from '../lib/cart'
import { formatYen } from '../lib/format'
import { NotFound } from './NotFound'

export function ProductDetail() {
  const { id = '' } = useParams()
  const product = findProduct(id)
  if (!product) return <NotFound />
  return <ProductView key={product.id} product={product} />
}

function ProductView({ product }: { product: Product }) {
  const { add } = useCart()
  const [qty, setQty] = useState(1)
  const [variantId, setVariantId] = useState<string | null>(product.variants?.[0]?.id ?? null)

  const category = findCategory(product.category)
  const max = Math.min(MAX_QTY_PER_ITEM, product.stock)
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  return (
    <>
      <nav className="breadcrumb wrap" aria-label="パンくずリスト">
        <Link to="/shop">商品</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/shop?category=${product.category}`}>{category?.name}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{product.name}</span>
      </nav>

      <section className="pdp wrap">
        <div className="pdp__media">
          <ProductPlate product={product} />
          <p className="caption">画像はイメージです。商品写真は撮影後に差し替えます。</p>
        </div>

        <div className="pdp__info">
          <p className="pdp__meta num">
            {productNo(product)}
            {product.badge && <span className="pdp__badge">{badgeLabel[product.badge]}</span>}
          </p>
          <h1 className="pdp__name">{product.name}</h1>
          <p className="pdp__zh" lang="zh-Hant">
            {product.nameZh}
          </p>
          <p className="pdp__price num">
            {formatYen(product.price)}
            <span>税込</span>
          </p>
          <p className="pdp__summary">{product.summary}</p>

          {product.variants && (
            <fieldset className="options">
              <legend>
                カラー<span>{product.variants.find((v) => v.id === variantId)?.label}</span>
              </legend>
              <div className="options__list">
                {product.variants.map((v) => (
                  <label key={v.id} className={`option ${variantId === v.id ? 'is-active' : ''}`}>
                    <input type="radio" name="variant" value={v.id} checked={variantId === v.id} onChange={() => setVariantId(v.id)} />
                    <span className={`option__swatch option__swatch--${v.id}`} aria-hidden="true" />
                    <span className="visually-hidden">{v.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <div className="pdp__buy">
            <QtyStepper value={qty} max={max} onChange={(q) => setQty(Math.max(1, Math.min(max, q)))} />
            <button type="button" className="btn btn--grow" onClick={() => add(product.id, variantId, qty)} disabled={product.stock === 0}>
              {product.stock === 0 ? '在庫切れ' : 'カートに入れる'}
            </button>
          </div>
          <p className="pdp__note">
            {product.stock <= 10 ? `残り${product.stock}点です。` : '在庫があります。'}
            {formatYen(FREE_SHIPPING_THRESHOLD)}以上のご注文で送料無料。
          </p>

          <blockquote className="quote">
            <p>{product.story}</p>
            <footer>— Machi</footer>
          </blockquote>

          <dl className="spec">
            {product.details.map((d) => {
              const [k, ...rest] = d.split('：')
              return (
                <div key={d}>
                  <dt>{k}</dt>
                  <dd>{rest.join('：')}</dd>
                </div>
              )
            })}
          </dl>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section wrap">
          <div className="section-head">
            <span className="section-head__no">—</span>
            <h2 className="section-head__title">同じカテゴリーの商品</h2>
          </div>
          <div className="grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
