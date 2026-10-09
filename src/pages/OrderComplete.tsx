import { Link, Navigate, useLocation } from 'react-router-dom'
import { z } from 'zod'
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
    <section className="complete wrap">
      <p className="label">ご注文完了</p>
      <h1 className="complete__title">
        ご注文ありがとう
        <br />
        ございました。
      </h1>
      <p className="complete__zh" lang="zh-Hant">
        謝謝你的訂購。
      </p>
      <dl className="spec complete__spec">
        <div>
          <dt>ご注文番号</dt>
          <dd className="num">{orderId}</dd>
        </div>
        <div>
          <dt>お支払い金額</dt>
          <dd className="num">{formatYen(total)}</dd>
        </div>
        <div>
          <dt>発送予定</dt>
          <dd>2〜5営業日以内</dd>
        </div>
      </dl>
      <p className="complete__text">本番環境では、ご登録のメールアドレスに注文確認メールが届きます（モックのため送信されません）。</p>
      <Link to="/" className="arrow-link">
        トップへ戻る
      </Link>
    </section>
  )
}
