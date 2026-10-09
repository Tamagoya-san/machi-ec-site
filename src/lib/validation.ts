import { z } from 'zod'

// 制御文字や不可視文字を除去し、前後の空白を落とす。
// oxlint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u001F\u007F-\u009F\u200B-\u200F\u202A-\u202E\u2066-\u2069]/g
export const clean = (value: string) => value.replace(CONTROL_CHARS, '').trim()

const text = (label: string, max: number) =>
  z
    .string()
    .transform(clean)
    .pipe(z.string().min(1, `${label}を入力してください`).max(max, `${label}は${max}文字以内で入力してください`))

export const prefectures = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県', '茨城県', '栃木県', '群馬県',
  '埼玉県', '千葉県', '東京都', '神奈川県', '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県',
  '岐阜県', '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
  '鳥取県', '島根県', '岡山県', '広島県', '山口県', '徳島県', '香川県', '愛媛県', '高知県', '福岡県',
  '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県',
] as const

export const paymentMethods = [
  { id: 'card', label: 'クレジットカード', note: '外部決済画面（Stripe等）でお支払い' },
  { id: 'paypay', label: 'PayPay', note: 'PayPayアプリでお支払い' },
  { id: 'konbini', label: 'コンビニ払い', note: '注文後に払込番号をお送りします' },
] as const

const email = z
  .string()
  .transform(clean)
  .pipe(z.email('メールアドレスの形式が正しくありません').max(254))

export const checkoutSchema = z.object({
  name: text('お名前', 40),
  kana: text('フリガナ', 40).pipe(z.string().regex(/^[ァ-ヶー\s　]+$/, 'フリガナは全角カタカナで入力してください')),
  email,
  phone: z
    .string()
    .transform((v) => clean(v).replace(/[-‐ー\s]/g, ''))
    .pipe(z.string().regex(/^0\d{9,10}$/, '電話番号はハイフンなし10〜11桁で入力してください')),
  postal: z
    .string()
    .transform((v) => clean(v).replace(/[-‐ー]/g, ''))
    .pipe(z.string().regex(/^\d{7}$/, '郵便番号は7桁で入力してください')),
  prefecture: z.enum(prefectures, { message: '都道府県を選択してください' }),
  address: text('住所', 120),
  payment: z.enum(['card', 'paypay', 'konbini'], { message: 'お支払い方法を選択してください' }),
  note: z.string().transform(clean).pipe(z.string().max(300, '備考は300文字以内で入力してください')),
  agree: z.literal(true, { message: '利用規約とプライバシーポリシーへの同意が必要です' }),
})

export type CheckoutInput = z.input<typeof checkoutSchema>

export const contactSchema = z.object({
  name: text('お名前', 40),
  email,
  topic: z.enum(['order', 'item', 'collab', 'other'], { message: 'お問い合わせ種別を選択してください' }),
  message: text('お問い合わせ内容', 1000),
})

export type FieldErrors = Partial<Record<string, string>>

export function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form')
    if (!out[key]) out[key] = issue.message
  }
  return out
}

// 連打・自動送信対策としての簡易スロットル（本番はサーバー側のレート制限が必須）。
export function createThrottle(intervalMs: number) {
  let last = 0
  return () => {
    const now = Date.now()
    if (now - last < intervalMs) return false
    last = now
    return true
  }
}

export function randomOrderId() {
  const bytes = new Uint8Array(4)
  crypto.getRandomValues(bytes)
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('').toUpperCase()
  const d = new Date()
  const ymd = [d.getFullYear() % 100, d.getMonth() + 1, d.getDate()].map((n) => String(n).padStart(2, '0')).join('')
  return `MS-${ymd}-${hex}`
}
