import type { ReactNode } from 'react'

interface Props {
  id: string
  label: string
  error?: string
  required?: boolean
  hint?: string
  children: ReactNode
}

export function Field({ id, label, error, required, hint, children }: Props) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id} className="field__label">
        {label}
        {required && <span className="field__required">必須</span>}
      </label>
      {children}
      {hint && !error && <p className="field__hint">{hint}</p>}
      {error && (
        <p className="field__error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

/** ボット対策のハニーポット。人間には見えず、入力されていたら送信を破棄する。 */
export function Honeypot() {
  return (
    <div className="honeypot" aria-hidden="true">
      <label>
        website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  )
}
