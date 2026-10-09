import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { designs, type DesignId } from '../lib/shell'

export function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const target = hash ? document.getElementById(hash.slice(1)) : null
    if (target) target.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

/** モック確認用。同じページのまま、もう一方のデザイン案へ移動する。 */
export function DesignSwitch({ current }: { current: DesignId }) {
  const { pathname, search } = useLocation()
  return (
    <nav className="design-switch" aria-label="デザイン案の切り替え">
      <a href="/" className="design-switch__label">
        デザイン案
      </a>
      {designs.map((d) => (
        <a key={d.id} href={`/${d.id}${pathname}${search}`} aria-current={d.id === current ? 'true' : undefined}>
          {d.label}
        </a>
      ))}
    </nav>
  )
}

export function SkipLink() {
  return (
    <a href="#main" className="skip-link">
      本文へスキップ
    </a>
  )
}
