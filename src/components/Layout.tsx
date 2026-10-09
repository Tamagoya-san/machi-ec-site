import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { categories } from '../data/products'
import { useCart } from '../lib/cart'
import { INSTAGRAM_ROOM_URL, INSTAGRAM_URL } from '../lib/site'
import { CartDrawer } from './CartDrawer'

const nav = [
  { to: '/shop', label: '商品' },
  { to: '/journal', label: '読みもの' },
  { to: '/story', label: 'Machiのこと' },
  { to: '/contact', label: 'お問い合わせ' },
]

function Header() {
  const { count, open } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
  }, [menuOpen])

  return (
    <header className="header">
      <div className="header__inner wrap">
        <Link to="/" className="wordmark" onClick={closeMenu} aria-label="Machi Story Shop トップへ">
          Machi <span>Story Shop</span>
        </Link>

        <nav className={`nav ${menuOpen ? 'is-open' : ''}`} aria-label="メインメニュー">
          {nav.map((item, i) => (
            <NavLink key={item.to} to={item.to} className="nav__link" onClick={closeMenu}>
              <span className="nav__no">{`0${i + 1}`}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button type="button" className="cart-link" onClick={open} aria-label={`カートを開く（${count}点）`}>
          カート<span className="cart-link__count">{count}</span>
        </button>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? '閉じる' : 'メニュー'}
        </button>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__grid">
        <p className="footer__about">
          台湾で生まれ、東京で暮らすMachiが、
          <br />
          ふたつの街のあいだで見つけたものを選んでお届けする小さなお店です。
        </p>
        <div className="footer__col">
          <p className="footer__h">商品</p>
          <Link to="/shop">すべての商品</Link>
          {categories.map((c) => (
            <Link key={c.id} to={`/shop?category=${c.id}`}>
              {c.name}
            </Link>
          ))}
        </div>
        <div className="footer__col">
          <p className="footer__h">ご案内</p>
          <Link to="/guide">ご利用ガイド</Link>
          <Link to="/legal">特定商取引法に基づく表記</Link>
          <Link to="/privacy">プライバシーポリシー</Link>
          <Link to="/terms">利用規約</Link>
          <Link to="/contact">お問い合わせ</Link>
        </div>
        <div className="footer__col">
          <p className="footer__h">Instagram</p>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            @machihistory ↗
          </a>
          <a href={INSTAGRAM_ROOM_URL} target="_blank" rel="noopener noreferrer">
            @machiroomhere ↗
          </a>
        </div>
      </div>
      <p className="footer__mark wrap" aria-hidden="true">
        Machi Story Shop
      </p>
      <div className="wrap footer__bottom">
        <span>© 2026 Machi Story Shop</span>
        <span>Tokyo — Taipei</span>
      </div>
    </footer>
  )
}

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const target = hash ? document.getElementById(hash.slice(1)) : null
    if (target) target.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export function Layout() {
  return (
    <>
      <ScrollToTop />
      <a href="#main" className="skip-link">
        本文へスキップ
      </a>
      <div className="topbar" role="note">
        <div className="wrap topbar__inner">
          <span>Mockup — 確認用のため、実際のご注文・決済は行われません</span>
          <span className="topbar__right">送料無料 ¥5,000〜</span>
        </div>
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
