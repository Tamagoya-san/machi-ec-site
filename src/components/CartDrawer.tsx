import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FREE_SHIPPING_THRESHOLD, MAX_QTY_PER_ITEM, useCart } from '../lib/cart'
import { formatYen } from '../lib/format'
import { ProductPlate } from './ProductPlate'
import { QtyStepper } from './QtyStepper'

export function CartDrawer() {
  const { lines, count, subtotal, isOpen, close, setQty, remove } = useCart()
  const navigate = useNavigate()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    document.body.classList.add('is-locked')
    panelRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.classList.remove('is-locked')
    }
  }, [isOpen, close])

  const remaining = FREE_SHIPPING_THRESHOLD - subtotal

  return (
    <div className={`drawer ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen} inert={!isOpen}>
      <div className="drawer__backdrop" onClick={close} />
      <div className="drawer__panel" role="dialog" aria-modal="true" aria-label="カート" tabIndex={-1} ref={panelRef}>
        <div className="drawer__head">
          <p className="drawer__title">
            カート<span>{count}点</span>
          </p>
          <button type="button" className="close-link" onClick={close}>
            閉じる
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="drawer__empty">
            <p>カートに商品はありません。</p>
            <Link to="/shop" className="arrow-link" onClick={close}>
              商品をみる
            </Link>
          </div>
        ) : (
          <>
            <ul className="drawer__list">
              {lines.map((line) => (
                <li key={line.key} className="drawer__item">
                  <ProductPlate product={line.product} className="drawer__thumb" bare />
                  <div className="drawer__info">
                    <p className="drawer__name">{line.product.name}</p>
                    {line.variantLabel && <p className="drawer__variant">{line.variantLabel}</p>}
                    <div className="drawer__row">
                      <QtyStepper
                        value={line.qty}
                        max={Math.min(MAX_QTY_PER_ITEM, line.product.stock)}
                        onChange={(q) => setQty(line.key, q)}
                        small
                      />
                      <span className="num">{formatYen(line.lineTotal)}</span>
                    </div>
                    <button type="button" className="text-link" onClick={() => remove(line.key)}>
                      削除
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="drawer__foot">
              <div className="drawer__subtotal">
                <span>小計（税込）</span>
                <span className="num">{formatYen(subtotal)}</span>
              </div>
              <p className="drawer__shipping">
                {remaining > 0 ? `あと${formatYen(remaining)}のお買いもので送料無料になります。` : '送料無料でお届けします。'}
              </p>
              <button
                type="button"
                className="btn btn--block"
                onClick={() => {
                  close()
                  navigate('/checkout')
                }}
              >
                ご購入手続きへ
              </button>
              <Link to="/cart" className="text-link drawer__cart-link" onClick={close}>
                カートの詳細
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
