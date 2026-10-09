import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProductArt } from '../components/ProductArt'
import { ProductCard } from '../components/ProductCard'
import { QtyStepper } from '../components/QtyStepper'
import { findCategory, findProduct, products, type Product } from '../data/products'
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
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3)

  return (
    <>
      <nav className="breadcrumb" aria-label="パンくずリスト">
        <Link to="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/shop?category=${product.category}`}>{category?.name}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{product.name}</span>
      </nav>

      <section className="pdp">
        <div className="pdp__gallery">
          <ProductArt product={product} className="pdp__art" />
          <p className="pdp__note">※ 画像はイメージです。実際の商品写真に差し替え予定。</p>
        </div>

        <div className="pdp__info">
          {product.badge && <span className="badge badge--inline">{product.badge}</span>}
          <h1 className="pdp__name">{product.name}</h1>
          <p className="pdp__zh" lang="zh-Hant">
            {product.nameZh}
          </p>
          <p className="pdp__price">
            {formatYen(product.price)}
            <span>（税込）</span>
          </p>
          <p className="pdp__summary">{product.summary}</p>

          {product.variants && (
            <fieldset className="pdp__variants">
              <legend>カラー</legend>
              {product.variants.map((v) => (
                <label key={v.id} className={`variant ${variantId === v.id ? 'is-active' : ''}`}>
                  <input type="radio" name="variant" value={v.id} checked={variantId === v.id} onChange={() => setVariantId(v.id)} />
                  <span className={`variant__swatch variant__swatch--${v.id}`} aria-hidden="true" />
                  {v.label}
                </label>
              ))}
            </fieldset>
          )}

          <div className="pdp__buy">
            <QtyStepper value={qty} max={max} onChange={(q) => setQty(Math.max(1, Math.min(max, q)))} />
            <button type="button" className="button button--primary button--grow" onClick={() => add(product.id, variantId, qty)} disabled={product.stock === 0}>
              {product.stock === 0 ? '在庫切れ' : 'カートに入れる'}
            </button>
          </div>
          <p className="pdp__stock">
            {product.stock <= 10 ? `残りわずか（あと${product.stock}点）` : '在庫あり'}・{formatYen(FREE_SHIPPING_THRESHOLD)}以上で送料無料
          </p>

          <div className="pdp__story">
            <p className="pdp__story-label">Machi's note ☁️</p>
            <p>{product.story}</p>
          </div>

          <dl className="pdp__details">
            {product.details.map((d) => {
              const [k, ...rest] = d.split('：')
              return (
                <div key={d}>
                  <dt>{rest.length ? k : '仕様'}</dt>
                  <dd>{rest.length ? rest.join('：') : d}</dd>
                </div>
              )
            })}
          </dl>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section section--tint">
          <div className="section-title">
            <p className="section-title__en">You may also like</p>
            <h2 className="section-title__ja">同じカテゴリーの商品</h2>
          </div>
          <div className="product-grid product-grid--narrow">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
