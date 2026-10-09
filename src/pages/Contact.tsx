import { useRef, useState, type FormEvent } from 'react'
import { PageHero } from '../components/Decor'
import { Field, Honeypot } from '../components/Field'
import { contactSchema, createThrottle, toFieldErrors, type FieldErrors } from '../lib/validation'

const topics = [
  { id: 'order', label: 'ご注文・配送について' },
  { id: 'item', label: '商品について' },
  { id: 'collab', label: 'お仕事・コラボのご依頼' },
  { id: 'other', label: 'その他' },
]

export function Contact() {
  const [errors, setErrors] = useState<FieldErrors>({})
  const [sent, setSent] = useState(false)
  const [message, setMessage] = useState('')
  const throttle = useRef(createThrottle(5000))

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!throttle.current()) return
    const form = new FormData(e.currentTarget)
    if (form.get('website')) return

    const result = contactSchema.safeParse({
      name: String(form.get('name') ?? ''),
      email: String(form.get('email') ?? ''),
      topic: String(form.get('topic') ?? ''),
      message: String(form.get('message') ?? ''),
    })
    if (!result.success) {
      setErrors(toFieldErrors(result.error))
      return
    }
    setErrors({})
    setSent(true)
  }

  return (
    <>
      <PageHero en="Contact" ja="お問い合わせ" lead="ご注文やお仕事のご相談など、お気軽にどうぞ。" />
      <section className="section section--tight">
        {sent ? (
          <div className="empty">
            <p>送信ありがとうございました（モックのため実際には送信されていません）。</p>
          </div>
        ) : (
          <form className="contact" onSubmit={onSubmit} noValidate>
            <Field id="contact-name" label="お名前" error={errors.name} required>
              <input id="contact-name" name="name" autoComplete="name" maxLength={40} aria-invalid={!!errors.name} />
            </Field>
            <Field id="contact-email" label="メールアドレス" error={errors.email} required>
              <input id="contact-email" name="email" type="email" autoComplete="email" maxLength={254} aria-invalid={!!errors.email} />
            </Field>
            <Field id="contact-topic" label="お問い合わせ種別" error={errors.topic} required>
              <select id="contact-topic" name="topic" defaultValue="" aria-invalid={!!errors.topic}>
                <option value="" disabled>
                  選択してください
                </option>
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="contact-message" label="お問い合わせ内容" error={errors.message} required hint={`${message.length} / 1000`}>
              <textarea id="contact-message" name="message" rows={6} maxLength={1000} onChange={(e) => setMessage(e.target.value)} aria-invalid={!!errors.message} />
            </Field>
            <Honeypot />
            <button type="submit" className="button button--primary button--block">
              送信する（モック）
            </button>
          </form>
        )}
      </section>
    </>
  )
}
