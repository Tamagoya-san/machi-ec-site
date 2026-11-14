'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import { z } from 'zod'
import { useI18n } from '@/i18n/client'
import { useCart } from '@/lib/cart'
import { formatPrice } from '@/lib/format'
import { CartTotals } from './CartView'

// テストサイト用の購入手続き。入力内容はブラウザの中で確認するだけで、どこにも送信・保存しない。
// 本番では、ここを決済サービス（Stripe など）の画面への遷移に置き換える。

const schema = z.object({
  email: z.email().max(200),
  name: z.string().trim().min(1).max(100),
  country: z.enum(['jp', 'tw']),
  postal: z.string().trim().min(1).max(20),
  address: z.string().trim().min(1).max(300),
})

type Field = keyof z.infer<typeof schema>
type Errors = Partial<Record<Field, 'required' | 'invalidEmail'>>

export function CheckoutForm() {
  const { d, t, to } = useI18n()
  const { ready, lines, clear } = useCart()
  const router = useRouter()
  const [errors, setErrors] = useState<Errors>({})
  const copy = d.checkout

  if (!ready) return <div className="checkout checkout--loading" />

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

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const values = Object.fromEntries(new FormData(event.currentTarget))
    const parsed = schema.safeParse(values)
    if (!parsed.success) {
      const next: Errors = {}
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as Field
        if (next[field]) continue
        const empty = String(values[field] ?? '').trim() === ''
        next[field] = field === 'email' && !empty ? 'invalidEmail' : 'required'
      }
      setErrors(next)
      const first = Object.keys(next)[0]
      if (first) event.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    // 送信はしない。カートを空にして完了画面へ進むだけ
    clear()
    router.push(to('/complete'))
  }

  const field = (name: Field, label: string, props: { type?: string; autoComplete: string; inputMode?: 'email' | 'text' }) => (
    <label className="field" data-invalid={Boolean(errors[name])}>
      <span>{label}</span>
      <input
        name={name}
        type={props.type ?? 'text'}
        autoComplete={props.autoComplete}
        inputMode={props.inputMode}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        onChange={() => errors[name] && setErrors((current) => ({ ...current, [name]: undefined }))}
      />
      {errors[name] && (
        <small id={`${name}-error`} role="alert">
          {copy[errors[name]]}
        </small>
      )}
    </label>
  )

  return (
    <form className="checkout" onSubmit={submit} noValidate>
      <div className="checkout__form">
        <p className="notice">{copy.notice}</p>

        <fieldset>
          <legend>{copy.contact}</legend>
          {field('email', copy.email, { type: 'email', autoComplete: 'email', inputMode: 'email' })}
        </fieldset>

        <fieldset>
          <legend>{copy.delivery}</legend>
          {field('name', copy.name, { autoComplete: 'name' })}
          <label className="field">
            <span>{copy.country}</span>
            <select name="country" autoComplete="country" defaultValue="jp">
              <option value="jp">{copy.countries.jp}</option>
              <option value="tw">{copy.countries.tw}</option>
            </select>
          </label>
          {field('postal', copy.postal, { autoComplete: 'postal-code' })}
          {field('address', copy.address, { autoComplete: 'street-address' })}
        </fieldset>

        <fieldset>
          <legend>{copy.payment}</legend>
          <p className="checkout__payment">{copy.paymentNote}</p>
        </fieldset>
      </div>

      <aside className="cart__summary">
        <h2>{copy.summary}</h2>
        <ul className="checkout__lines">
          {lines.map((line) => {
            const variant = line.product.variants?.find((v) => v.id === line.variant)
            return (
              <li key={`${line.id}:${line.variant ?? ''}`}>
                <span>
                  {t(line.product.name)}
                  <small>
                    {variant ? `${t(variant.label)} ・ ` : ''}× {line.qty}
                  </small>
                </span>
                <span>{formatPrice(line.lineTotal)}</span>
              </li>
            )
          })}
        </ul>
        <CartTotals />
        <button type="submit" className="btn btn--block">
          {copy.submit}
        </button>
        <Link href={to('/cart')} className="arrow-link">
          {d.cart.title}
        </Link>
      </aside>
    </form>
  )
}
