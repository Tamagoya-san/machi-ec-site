'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useI18n } from '@/i18n/client'
import { locales, type Locale } from '@/i18n/config'
import { useCart } from '@/lib/cart'
import { BrandMark } from './BrandMark'

const short: Record<Locale, string> = { ja: '日本語', zh: '繁中' }

function LanguageSwitch() {
  const { locale, d } = useI18n()
  const pathname = usePathname()
  // 先頭のロケールだけを差し替え、同じページの別言語版へ移動する
  const rest = pathname.replace(/^\/[^/]+/, '')

  return (
    <div className="lang" role="group" aria-label={d.nav.language}>
      {locales.map((code) => (
        <Link key={code} href={`/${code}${rest}`} aria-current={code === locale ? 'true' : undefined} lang={code}>
          {short[code]}
        </Link>
      ))}
    </div>
  )
}

export function Header() {
  const { d, to } = useI18n()
  const { count, ready } = useCart()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const links = [
    { href: to('/map'), label: d.nav.map, en: 'Map' },
    { href: to('/creators'), label: d.nav.creators, en: 'Makers' },
    { href: to('/try-on'), label: d.nav.tryOn, en: 'Try-on' },
    { href: to('/about'), label: d.nav.about, en: 'About' },
  ]

  // メニューを開いている間は背面をスクロールさせない
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <>
      <header className="header">
        <div className="wrap header__inner">
          <Link href={to('/')} aria-label="Machi Atlas">
            <BrandMark />
          </Link>

          <nav className="nav" aria-label={d.nav.menu}>
            {links.map((link) => (
              <Link key={link.href} href={link.href} aria-current={isCurrent(link.href) ? 'page' : undefined}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="header__tools">
            <LanguageSwitch />
            <Link href={to('/cart')} className="icon-btn" aria-label={`${d.nav.cart}（${ready ? count : 0}）`}>
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                <path d="M4.2 7h11.6l-.9 9.6H5.1L4.2 7Z" strokeLinejoin="round" />
                <path d="M7.2 7V5.8a2.8 2.8 0 0 1 5.6 0V7" strokeLinecap="round" />
              </svg>
              {ready && count > 0 && <span className="cart-count">{count}</span>}
            </Link>
            <button type="button" className="icon-btn menu-btn" aria-label={d.nav.menu} aria-expanded={open} onClick={() => setOpen(true)}>
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                <path d="M3 7h14M3 13h14" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="sheet" data-open={open} aria-hidden={!open} inert={!open}>
        <div className="sheet__top">
          <BrandMark />
          <button type="button" className="icon-btn" aria-label={d.nav.close} onClick={() => setOpen(false)}>
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <path d="M4.5 4.5l11 11M15.5 4.5l-11 11" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav className="sheet__nav" aria-label={d.nav.menu}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
              <span>{link.en}</span>
            </Link>
          ))}
          <Link href={to('/cart')} onClick={() => setOpen(false)}>
            {d.nav.cart}
            <span>Cart</span>
          </Link>
        </nav>
        <p className="sheet__foot">Tokyo ⇄ Taiwan — makers &amp; their towns</p>
      </div>
    </>
  )
}
