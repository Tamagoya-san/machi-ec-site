'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { useI18n } from '@/i18n/client'
import { useCart } from '@/lib/cart'
import { formatPrice } from '@/lib/format'

/** 小計・送料・合計の表（カートと購入手続きで共用） */
export function CartTotals() {
  const { d } = useI18n()
  const { subtotal, shipping, total } = useCart()
  return (
    <dl className="totals">
      <div>
        <dt>{d.cart.subtotal}</dt>
        <dd>{formatPrice(subtotal)}</dd>
      </div>
      <div>
        <dt>{d.cart.shipping}</dt>
        <dd>{shipping === 0 ? d.cart.shippingFree : formatPrice(shipping)}</dd>
      </div>
      <div className="totals__total">
        <dt>
          {d.cart.total}
          <small>{d.common.taxIn}</small>
        </dt>
        <dd>{formatPrice(total)}</dd>
      </div>
    </dl>
  )
}

export function CartView({ visuals }: { visuals: Record<string, ReactNode> }) {
  const { d, t, to } = useI18n()
  const { ready, lines, setQty, remove } = useCart()

  // localStorage を読み終えるまでは何も出さない（空表示が一瞬ちらつくのを防ぐ）
  if (!ready) return <div className="cart cart--loading" />

  if (lines.length === 0) {
    return (
      <div className="cart-empty">
        <p>{d.cart.empty}</p>
        <Link href={to('/creators')} className="btn">
          {d.cart.emptyCta}
        </Link>
      </div>
    )
  }

  return (
    <div className="cart">
      <ul className="cart__lines">
        {lines.map((line) => {
          const variant = line.product.variants?.find((v) => v.id === line.variant)
          const name = t(line.product.name)
          return (
            <li key={`${line.id}:${line.variant ?? ''}`} className="line">
              <Link href={to(`/items/${line.id}`)} className="plate line__visual" aria-label={name}>
                {visuals[line.id]}
              </Link>
              <div className="line__info">
                <Link href={to(`/items/${line.id}`)} className="line__name">
                  {name}
                </Link>
                {variant && <p className="line__variant">{t(variant.label)}</p>}
                <p className="line__price">{formatPrice(line.product.price)}</p>
              </div>
              <div className="line__tools">
                <div className="stepper stepper--sm" role="group" aria-label={d.item.quantity}>
                  <button
                    type="button"
                    aria-label={d.cart.decrease}
                    disabled={line.qty <= 1}
                    onClick={() => setQty(line.id, line.variant, line.qty - 1)}
                  >
                    −
                  </button>
                  <output>{line.qty}</output>
                  <button
                    type="button"
                    aria-label={d.cart.increase}
                    disabled={line.qty >= 10}
                    onClick={() => setQty(line.id, line.variant, line.qty + 1)}
                  >
                    +
                  </button>
                </div>
                <button type="button" className="line__remove" onClick={() => remove(line.id, line.variant)}>
                  {d.cart.remove}
                </button>
              </div>
              <p className="line__total">{formatPrice(line.lineTotal)}</p>
            </li>
          )
        })}
      </ul>

      <aside className="cart__summary">
        <CartTotals />
        <p className="cart__note">{d.cart.shippingNote}</p>
        <Link href={to('/checkout')} className="btn btn--block">
          {d.cart.checkout}
        </Link>
        <Link href={to('/creators')} className="arrow-link">
          {d.cart.continue}
        </Link>
      </aside>
    </div>
  )
}
