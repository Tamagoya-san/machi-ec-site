import { useRef, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { PageHero } from '../components/Decor'
import { Field, Honeypot } from '../components/Field'
import { useCart } from '../lib/cart'
import { formatYen } from '../lib/format'
import {
  checkoutSchema,
  createThrottle,
  paymentMethods,
  prefectures,
  randomOrderId,
  toFieldErrors,
  type FieldErrors,
} from '../lib/validation'
import { OrderSummary } from './Cart'

export function Checkout() {
  const { lines, total, clear } = useCart()
  const navigate = useNavigate()
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const throttle = useRef(createThrottle(3000))

  if (lines.length === 0 && !submitting) return <Navigate to="/cart" replace />

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (submitting || !throttle.current()) return
    const form = new FormData(e.currentTarget)
    if (form.get('website')) return

    const result = checkoutSchema.safeParse({
      name: String(form.get('name') ?? ''),
      kana: String(form.get('kana') ?? ''),
      email: String(form.get('email') ?? ''),
      phone: String(form.get('phone') ?? ''),
      postal: String(form.get('postal') ?? ''),
      prefecture: String(form.get('prefecture') ?? ''),
      address: String(form.get('address') ?? ''),
      payment: String(form.get('payment') ?? ''),
      note: String(form.get('note') ?? ''),
      agree: form.get('agree') === 'on',
    })

    if (!result.success) {
      const next = toFieldErrors(result.error)
      setErrors(next)
      const first = Object.keys(next)[0]
      document.getElementById(`checkout-${first}`)?.focus()
      return
    }

    // モックのため送信は行わない。本番では注文内容（商品ID・数量のみ）をサーバーへ送り、
    // 価格・在庫はサーバー側で再計算したうえで決済代行のホスト型決済画面へリダイレクトする。
    setSubmitting(true)
    const orderId = randomOrderId()
    window.setTimeout(() => {
      clear()
      navigate('/complete', { replace: true, state: { orderId, total } })
    }, 900)
  }

  const err = (key: string) => errors[key]
  const describedBy = (key: string) => (errors[key] ? `checkout-${key}-error` : undefined)

  return (
    <>
      <PageHero en="Checkout" ja="ご購入手続き" />
      <section className="section section--tight">
        <form className="checkout" onSubmit={onSubmit} noValidate>
          <div className="checkout__main">
            <fieldset className="form-section">
              <legend>お届け先</legend>
              <div className="form-grid">
                <Field id="checkout-name" label="お名前" error={err('name')} required>
                  <input id="checkout-name" name="name" autoComplete="name" maxLength={40} aria-invalid={!!err('name')} aria-describedby={describedBy('name')} />
                </Field>
                <Field id="checkout-kana" label="フリガナ" error={err('kana')} required>
                  <input id="checkout-kana" name="kana" maxLength={40} placeholder="マチ ハナコ" aria-invalid={!!err('kana')} aria-describedby={describedBy('kana')} />
                </Field>
                <Field id="checkout-email" label="メールアドレス" error={err('email')} required>
                  <input id="checkout-email" name="email" type="email" autoComplete="email" maxLength={254} aria-invalid={!!err('email')} aria-describedby={describedBy('email')} />
                </Field>
                <Field id="checkout-phone" label="電話番号" error={err('phone')} required>
                  <input id="checkout-phone" name="phone" type="tel" autoComplete="tel" inputMode="numeric" maxLength={13} placeholder="09012345678" aria-invalid={!!err('phone')} aria-describedby={describedBy('phone')} />
                </Field>
                <Field id="checkout-postal" label="郵便番号" error={err('postal')} required>
                  <input id="checkout-postal" name="postal" autoComplete="postal-code" inputMode="numeric" maxLength={8} placeholder="1500001" aria-invalid={!!err('postal')} aria-describedby={describedBy('postal')} />
                </Field>
                <Field id="checkout-prefecture" label="都道府県" error={err('prefecture')} required>
                  <select id="checkout-prefecture" name="prefecture" autoComplete="address-level1" defaultValue="" aria-invalid={!!err('prefecture')} aria-describedby={describedBy('prefecture')}>
                    <option value="" disabled>
                      選択してください
                    </option>
                    {prefectures.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </Field>
                <div className="form-grid__wide">
                  <Field id="checkout-address" label="市区町村・番地・建物名" error={err('address')} required>
                    <input id="checkout-address" name="address" autoComplete="street-address" maxLength={120} aria-invalid={!!err('address')} aria-describedby={describedBy('address')} />
                  </Field>
                </div>
              </div>
            </fieldset>

            <fieldset className="form-section">
              <legend>お支払い方法</legend>
              <div className="payment-list" id="checkout-payment" tabIndex={-1}>
                {paymentMethods.map((m, i) => (
                  <label key={m.id} className="payment">
                    <input type="radio" name="payment" value={m.id} defaultChecked={i === 0} />
                    <span className="payment__label">{m.label}</span>
                    <span className="payment__note">{m.note}</span>
                  </label>
                ))}
              </div>
              {err('payment') && <p className="field__error">{err('payment')}</p>}
              <p className="secure-note">
                🔒 カード情報は当サイトでは入力・保存しません。決済は PCI DSS 準拠の決済代行会社の画面で安全に行われます（本番想定）。
              </p>
            </fieldset>

            <fieldset className="form-section">
              <legend>備考</legend>
              <Field id="checkout-note" label="ギフト包装・メッセージなど" error={err('note')} hint="300文字以内">
                <textarea id="checkout-note" name="note" rows={3} maxLength={300} />
              </Field>
            </fieldset>

            <Honeypot />

            <label className={`agree ${err('agree') ? 'has-error' : ''}`}>
              <input id="checkout-agree" type="checkbox" name="agree" />
              <span>
                <Link to="/terms" target="_blank">
                  利用規約
                </Link>
                と
                <Link to="/privacy" target="_blank">
                  プライバシーポリシー
                </Link>
                に同意します
              </span>
            </label>
            {err('agree') && <p className="field__error">{err('agree')}</p>}
          </div>

          <aside className="checkout__aside">
            <p className="checkout__aside-title">ご注文内容</p>
            <ul className="mini-lines">
              {lines.map((l) => (
                <li key={l.key}>
                  <span>
                    {l.product.name}
                    {l.variantLabel && `（${l.variantLabel}）`} × {l.qty}
                  </span>
                  <span>{formatYen(l.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <OrderSummary />
            <button type="submit" className="button button--primary button--block" disabled={submitting}>
              {submitting ? '処理中…' : '注文を確定する（モック）'}
            </button>
            <p className="checkout__mock">※ モックサイトのため、実際の注文・決済・メール送信は行われません。</p>
          </aside>
        </form>
      </section>
    </>
  )
}
