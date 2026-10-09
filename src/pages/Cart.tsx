import { Link } from 'react-router-dom'
import { PageHero } from '../components/Decor'
import { ProductArt } from '../components/ProductArt'
import { QtyStepper } from '../components/QtyStepper'
import { FREE_SHIPPING_THRESHOLD, MAX_QTY_PER_ITEM, useCart } from '../lib/cart'
import { formatYen } from '../lib/format'

export function OrderSummary() {
  const { subtotal, shipping, total } = useCart()
  return (
    <dl className="summary">
      <div>
        <dt>小計</dt>
        <dd>{formatYen(subtotal)}</dd>
      </div>
      <div>
        <dt>送料</dt>
        <dd>{shipping === 0 ? '無料' : formatYen(shipping)}</dd>
      </div>
      <div className="summary__total">
        <dt>合計（税込）</dt>
        <dd>{formatYen(total)}</dd>
      </div>
    </dl>
  )
}

export function Cart() {
  const { lines, setQty, remove, subtotal } = useCart()

  return (
    <>
      <PageHero en="Cart" ja="カート" />
      <section className="section section--tight">
        {lines.length === 0 ? (
          <div className="empty">
            <p>カートに商品が入っていません。</p>
            <Link to="/shop" className="button button--primary">
              商品を見る
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <ul className="cart-list">
              {lines.map((line) => (
                <li key={line.key} className="cart-item">
                  <Link to={`/shop/${line.product.id}`} className="cart-item__thumb">
                    <ProductArt product={line.product} />
                  </Link>
                  <div className="cart-item__info">
                    <Link to={`/shop/${line.product.id}`} className="cart-item__name">
                      {line.product.name}
                    </Link>
                    {line.variantLabel && <p className="cart-item__variant">{line.variantLabel}</p>}
                    <p className="cart-item__unit">{formatYen(line.product.price)}</p>
                  </div>
                  <QtyStepper value={line.qty} max={Math.min(MAX_QTY_PER_ITEM, line.product.stock)} onChange={(q) => setQty(line.key, q)} />
                  <p className="cart-item__total">{formatYen(line.lineTotal)}</p>
                  <button type="button" className="icon-button" onClick={() => remove(line.key)} aria-label={`${line.product.name}を削除`}>
                    ×
                  </button>
                </li>
              ))}
            </ul>
            <aside className="cart-aside">
              <OrderSummary />
              {subtotal < FREE_SHIPPING_THRESHOLD && (
                <p className="cart-aside__hint">あと{formatYen(FREE_SHIPPING_THRESHOLD - subtotal)}で送料無料</p>
              )}
              <Link to="/checkout" className="button button--primary button--block">
                ご購入手続きへ
              </Link>
              <Link to="/shop" className="text-button text-button--center">
                買い物を続ける
              </Link>
            </aside>
          </div>
        )}
      </section>
    </>
  )
}
