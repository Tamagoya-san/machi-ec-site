import { useRef, useState, type FormEvent } from 'react'
import { createThrottle, newsletterSchema } from '../lib/validation'
import { Honeypot } from './Field'

interface Props {
  idPrefix: string
  buttonLabel: string
  doneMessage: string
}

export function NewsletterForm({ idPrefix, buttonLabel, doneMessage }: Props) {
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const throttle = useRef(createThrottle(3000))
  const inputId = `${idPrefix}-email`

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!throttle.current()) return
    const form = new FormData(e.currentTarget)
    if (form.get('website')) return
    const result = newsletterSchema.safeParse({ email: String(form.get('email') ?? '') })
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? '入力内容をご確認ください')
      return
    }
    setError('')
    setDone(true)
  }

  if (done) {
    return (
      <p className="letter__done" role="status">
        {doneMessage}
      </p>
    )
  }

  return (
    <form className="letter" onSubmit={onSubmit} noValidate>
      <label htmlFor={inputId} className="visually-hidden">
        メールアドレス
      </label>
      <div className="letter__row">
        <input
          id={inputId}
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          placeholder="メールアドレス"
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
        <button type="submit" className="letter__button">
          {buttonLabel}
        </button>
      </div>
      {error && (
        <p id={`${inputId}-error`} className="letter__error" role="alert">
          {error}
        </p>
      )}
      <Honeypot />
    </form>
  )
}
