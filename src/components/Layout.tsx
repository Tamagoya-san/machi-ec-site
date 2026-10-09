import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useCart } from '../lib/cart'
import { INSTAGRAM_URL } from '../lib/site'
import { CartDrawer } from './CartDrawer'

const nav = [
  { to: '/shop', label: 'Shop', sub: '商品一覧' },
  { to: '/story', label: 'Story', sub: 'Machiのこと' },
  { to: '/journal', label: 'Journal', sub: '物語' },
  { to: '/contact', label: 'Contact', sub: 'お問い合わせ' },
]

function Header() {
  const { count, open } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="logo" aria-label="Machi Story Shop トップへ" onClick={closeMenu}>
          <span className="logo__mark" aria-hidden="true">
            <span />
            <span />
          </span>
          <span className="logo__text">
            Machi <em>Story Shop</em>
          </span>
        </Link>

        <nav className={`nav ${menuOpen ? 'is-open' : ''}`} aria-label="メインメニュー">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} className="nav__link" onClick={closeMenu}>
              <span className="nav__en">{item.label}</span>
              <span className="nav__ja">{item.sub}</span>
            </NavLink>
          ))}
        </nav>

        <div className="header__actions">
          <button type="button" className="cart-button" onClick={open} aria-label={`カートを開く（${count}点）`}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z" />
              <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
            </svg>
            {count > 0 && <span className="cart-button__count">{count}</span>}
          </button>
          <button
            type="button"
            className={`menu-button ${menuOpen ? 'is-open' : ''}`}
            aria-expanded={menuOpen}
            aria-label="メニュー"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__clouds" aria-hidden="true" />
      <div className="footer__inner">
        <div className="footer__brand">
          <p className="footer__logo">
            Machi <em>Story Shop</em>
          </p>
          <p className="footer__tagline">
            台湾と日本のあいだで生まれた、小さな物語をお届けします。
            <br />
            <span lang="zh-Hant">把台灣與日本之間的小故事，送到你手上。</span>
          </p>
          <a className="footer__sns" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            Instagram @machihistory
          </a>
        </div>
        <div className="footer__links">
          <div>
            <p className="footer__heading">Shop</p>
            <Link to="/shop">すべての商品</Link>
            <Link to="/shop?category=taiwan-taste">台湾の味</Link>
            <Link to="/shop?category=taiwan-craft">台湾の雑貨</Link>
            <Link to="/shop?category=machi-original">Machi オリジナル</Link>
            <Link to="/shop?category=bridge">台日をつなぐ</Link>
          </div>
          <div>
            <p className="footer__heading">Guide</p>
            <Link to="/guide">ご利用ガイド</Link>
            <Link to="/legal">特定商取引法に基づく表記</Link>
            <Link to="/privacy">プライバシーポリシー</Link>
            <Link to="/terms">利用規約</Link>
            <Link to="/contact">お問い合わせ</Link>
          </div>
        </div>
      </div>
      <p className="footer__copy">© 2026 Machi Story Shop — Mock site for client review</p>
    </footer>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

export function Layout() {
  return (
    <>
      <ScrollToTop />
      <a href="#main" className="skip-link">
        本文へスキップ
      </a>
      <div className="mock-banner" role="note">
        このサイトはクライアント確認用のモックです。実際のご注文・決済は行われません。
      </div>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </>
  )
}
