import { Link, NavLink, Outlet } from 'react-router-dom'
import { CartDrawer } from '../../components/CartDrawer'
import { DesignSwitch, SkipLink } from '../../components/Shell'
import { categories } from '../../data/products'
import { useCart } from '../../lib/cart'
import { useMenu } from '../../lib/shell'
import { INSTAGRAM_ROOM_URL, INSTAGRAM_URL } from '../../lib/site'

const nav = [
  { to: '/shop', label: '商品', en: 'Shop' },
  { to: '/journal', label: '読みもの', en: 'Diary' },
  { to: '/story', label: 'Machiのこと', en: 'About' },
  { to: '/contact', label: 'お問い合わせ', en: 'Contact' },
]

function Bubbles({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="7" cy="17" r="4.6" />
      <circle cx="16" cy="10.5" r="2.8" />
      <circle cx="20.5" cy="3.5" r="1.7" />
    </svg>
  )
}

function Header() {
  const { count, open } = useCart()
  const menu = useMenu()

  return (
    <header className="header">
      <div className="header__inner wrap">
        <button type="button" className="menu-toggle" aria-expanded={menu.isOpen} onClick={menu.toggle}>
          {menu.isOpen ? '閉じる' : 'メニュー'}
        </button>

        <nav className={`nav ${menu.isOpen ? 'is-open' : ''}`} aria-label="メインメニュー">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} className="nav__link" onClick={menu.close}>
              <span className="nav__en" aria-hidden="true">
                {item.en}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Link to="/" className="logo" onClick={menu.close} aria-label="Machi Story Shop トップへ">
          <span className="logo__name">
            Machi
            <Bubbles className="logo__bubbles" />
          </span>
          <span className="logo__sub">story shop</span>
        </Link>

        <button type="button" className="cart-link" onClick={open} aria-label={`カートを開く（${count}点）`}>
          カート<span className="cart-link__count num">{count}</span>
        </button>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <div className="footer__brand">
          <p className="footer__logo">
            Machi
            <Bubbles className="footer__bubbles" />
          </p>
          <p className="footer__about">台湾で生まれ、東京で暮らすMachiが、ふたつの街のあいだで見つけたものを届ける小さなお店です。</p>
        </div>
        <div className="footer__col">
          <p className="footer__h">Shop</p>
          <Link to="/shop">すべての商品</Link>
          {categories.map((c) => (
            <Link key={c.id} to={`/shop?category=${c.id}`}>
              {c.name}
            </Link>
          ))}
        </div>
        <div className="footer__col">
          <p className="footer__h">Guide</p>
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
      <div className="wrap footer__bottom">
        <span>© 2026 Machi Story Shop</span>
        <span>Tokyo ⇄ Taipei</span>
      </div>
    </footer>
  )
}

export function Layout() {
  return (
    <>
      <SkipLink />
      <p className="notice" role="note">
        こちらは確認用のモックサイトです。実際のご注文・決済は行われません。
      </p>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <DesignSwitch current="a" />
    </>
  )
}
