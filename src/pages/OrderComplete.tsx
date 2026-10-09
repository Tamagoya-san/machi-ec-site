import { Link, Navigate, useLocation } from 'react-router-dom'
import { z } from 'zod'
import { Bubbles } from '../components/Decor'
import { formatYen } from '../lib/format'

const stateSchema = z.object({
  orderId: z.string().regex(/^MS-\d{6}-[0-9A-F]{8}$/),
  total: z.number().int().nonnegative(),
})

export function OrderComplete() {
  const parsed = stateSchema.safeParse(useLocation().state)
  if (!parsed.success) return <Navigate to="/" replace />
  const { orderId, total } = parsed.data

  return (
    <section className="complete">
      <Bubbles count={10} />
      <p className="complete__en">Thank you!</p>
      <h1 className="complete__title">ご注文ありがとうございました</h1>
      <p className="complete__zh" lang="zh-Hant">
        謝謝你的訂購，願這個小故事帶給你溫暖。
      </p>
      <dl className="complete__info">
        <div>
          <dt>ご注文番号</dt>
          <dd>{orderId}</dd>
        </div>
        <div>
          <dt>お支払い金額</dt>
          <dd>{formatYen(total)}</dd>
        </div>
      </dl>
      <p className="complete__text">
        （モック）本番環境では、ご登録のメールアドレスに注文確認メールが届きます。
        <br />
        商品は2〜5営業日以内に発送いたします。
      </p>
      <Link to="/" className="button button--primary">
        トップへ戻る
      </Link>
    </section>
  )
}
