import { Link } from 'react-router-dom'
import { PageHead } from '../components/Heads'
import { ProductPlate } from '../components/ProductPlate'
import { QtyStepper } from '../components/QtyStepper'
import { FREE_SHIPPING_THRESHOLD, MAX_QTY_PER_ITEM, useCart } from '../lib/cart'
import { formatYen } from '../lib/format'

export function OrderSummary() {
  const { subtotal, shipping, total } = useCart()
  return (
    <dl className="summary">
      <div>
        <dt>小計</dt>
        <dd className="num">{formatYen(subtotal)}</dd>
      </div>
      <div>
        <dt>送料</dt>
        <dd className="num">{shipping === 0 ? '無料' : formatYen(shipping)}</dd>
      </div>
      <div className="summary__total">
        <dt>合計（税込）</dt>
        <dd className="num">{formatYen(total)}</dd>
      </div>
    </dl>
  )
}

export function Cart() {
  const { lines, count, setQty, remove, subtotal } = useCart()

  return (
    <>
      <PageHead label="カート" title="カートの中身" aside={<span className="num">{count} items</span>} />
      <div className="wrap">
        {lines.length === 0 ? (
          <div className="empty">
            <p>カートに商品はありません。</p>
            <Link to="/shop" className="arrow-link">
              商品をみる
            </Link>
          </div>
        ) : (
          <div className="split">
            <ul className="lines">
              {lines.map((line) => (
                <li key={line.key} className="line">
                  <Link to={`/shop/${line.product.id}`} className="line__thumb">
                    <ProductPlate product={line.product} bare />
                  </Link>
                  <div className="line__info">
                    <Link to={`/shop/${line.product.id}`} className="line__name">
                      {line.product.name}
                    </Link>
                    <p className="line__sub">
                      {line.variantLabel && `${line.variantLabel}　`}
                      <span className="num">{formatYen(line.product.price)}</span>
                    </p>
                  </div>
                  <QtyStepper value={line.qty} max={Math.min(MAX_QTY_PER_ITEM, line.product.stock)} onChange={(q) => setQty(line.key, q)} />
                  <p className="line__total num">{formatYen(line.lineTotal)}</p>
                  <button type="button" className="text-link line__remove" onClick={() => remove(line.key)} aria-label={`${line.product.name}を削除`}>
                    削除
                  </button>
                </li>
              ))}
            </ul>
            <aside className="panel">
              <OrderSummary />
              {subtotal < FREE_SHIPPING_THRESHOLD && (
                <p className="panel__note">あと{formatYen(FREE_SHIPPING_THRESHOLD - subtotal)}で送料無料になります。</p>
              )}
              <Link to="/checkout" className="btn btn--block">
                ご購入手続きへ
              </Link>
              <Link to="/shop" className="text-link panel__link">
                買いものを続ける
              </Link>
            </aside>
          </div>
        )}
      </div>
    </>
  )
}
