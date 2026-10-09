import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FREE_SHIPPING_THRESHOLD, useCart } from '../lib/cart'
import { formatYen } from '../lib/format'
import { ProductArt } from './ProductArt'
import { QtyStepper } from './QtyStepper'

export function CartDrawer() {
  const { lines, subtotal, isOpen, close, setQty, remove } = useCart()
  const navigate = useNavigate()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, close])

  const remaining = FREE_SHIPPING_THRESHOLD - subtotal

  return (
    <div className={`drawer ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen} inert={!isOpen}>
      <div className="drawer__backdrop" onClick={close} />
      <div className="drawer__panel" role="dialog" aria-modal="true" aria-label="カート" tabIndex={-1} ref={panelRef}>
        <div className="drawer__head">
          <p className="drawer__title">
            Cart <span>カート</span>
          </p>
          <button type="button" className="icon-button" onClick={close} aria-label="カートを閉じる">
            ×
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="drawer__empty">
            <p>カートはまだ空っぽです。</p>
            <Link to="/shop" className="button button--ghost" onClick={close}>
              商品を見る
            </Link>
          </div>
        ) : (
          <>
            <p className="drawer__shipping">
              {remaining > 0 ? (
                <>
                  あと<strong>{formatYen(remaining)}</strong>で送料無料
                </>
              ) : (
                '送料無料でお届けします ☁️'
              )}
            </p>
            <ul className="drawer__list">
              {lines.map((line) => (
                <li key={line.key} className="drawer__item">
                  <ProductArt product={line.product} className="drawer__thumb" />
                  <div className="drawer__info">
                    <p className="drawer__name">{line.product.name}</p>
                    {line.variantLabel && <p className="drawer__variant">{line.variantLabel}</p>}
                    <div className="drawer__row">
                      <QtyStepper
                        value={line.qty}
                        max={Math.min(10, line.product.stock)}
                        onChange={(q) => setQty(line.key, q)}
                        small
                      />
                      <span className="drawer__price">{formatYen(line.lineTotal)}</span>
                    </div>
                    <button type="button" className="text-button" onClick={() => remove(line.key)}>
                      削除
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="drawer__foot">
              <div className="drawer__subtotal">
                <span>小計（税込）</span>
                <strong>{formatYen(subtotal)}</strong>
              </div>
              <button
                type="button"
                className="button button--primary button--block"
                onClick={() => {
                  close()
                  navigate('/checkout')
                }}
              >
                ご購入手続きへ
              </button>
              <Link to="/cart" className="text-button text-button--center" onClick={close}>
                カートの詳細を見る
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
