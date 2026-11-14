'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useI18n } from '@/i18n/client'
import { useCart } from '@/lib/cart'

type Variant = { id: string; label: string }

/** 商品ページの購入欄（タイプ・数量・カートに入れる） */
export function AddToCart({ id, variants }: { id: string; variants: Variant[] }) {
  const { d, to } = useI18n()
  const { add } = useCart()
  const [variant, setVariant] = useState<string | null>(variants[0]?.id ?? null)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  return (
    <div className="buy">
      {variants.length > 0 && (
        <fieldset className="buy__group">
          <legend>{d.item.variant}</legend>
          <div className="buy__options">
            {variants.map((option) => (
              <label key={option.id} data-checked={variant === option.id}>
                <input
                  type="radio"
                  name="variant"
                  value={option.id}
                  checked={variant === option.id}
                  onChange={() => {
                    setVariant(option.id)
                    setAdded(false)
                  }}
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="buy__group">
        <span className="buy__legend" id="qty-label">
          {d.item.quantity}
        </span>
        <div className="stepper" role="group" aria-labelledby="qty-label">
          <button type="button" aria-label={d.cart.decrease} disabled={qty <= 1} onClick={() => setQty((n) => Math.max(1, n - 1))}>
            −
          </button>
          <output aria-live="polite">{qty}</output>
          <button type="button" aria-label={d.cart.increase} disabled={qty >= 10} onClick={() => setQty((n) => Math.min(10, n + 1))}>
            +
          </button>
        </div>
      </div>

      <button
        type="button"
        className="btn btn--block"
        onClick={() => {
          add(id, variant, qty)
          setAdded(true)
        }}
      >
        {d.common.addToCart}
      </button>

      <p className="buy__added" role="status" data-show={added}>
        {added && (
          <>
            {d.common.added}
            <Link href={to('/cart')}>{d.nav.cart} →</Link>
          </>
        )}
      </p>
    </div>
  )
}
