import { Link, NavLink, Outlet } from 'react-router-dom'
import { CartDrawer } from '../../components/CartDrawer'
import { NewsletterForm } from '../../components/NewsletterForm'
import { DesignSwitch, SkipLink } from '../../components/Shell'
import { categories } from '../../data/products'
import { useCart } from '../../lib/cart'
import { useMenu } from '../../lib/shell'
import { INSTAGRAM_ROOM_URL, INSTAGRAM_URL } from '../../lib/site'

const nav = [
  { to: '/shop', label: '商品', zh: '好物' },
  { to: '/journal', label: '読みもの', zh: '讀物' },
  { to: '/story', label: 'Machiのこと', zh: '關於瑪奇' },
  { to: '/contact', label: 'お問い合わせ', zh: '聯絡' },
]

function Header() {
  const { count, open } = useCart()
  const menu = useMenu()

  return (
    <header className="header">
      <div className="header__inner wrap">
        <Link to="/" className="sign" onClick={menu.close} aria-label="瑪奇商店 Machi Story Shop トップへ">
          <span className="sign__board" lang="zh-Hant">
            瑪奇商店
          </span>
          <span className="sign__sub">
            Machi
            <br />
            Story Shop
          </span>
        </Link>

        <nav className={`nav ${menu.isOpen ? 'is-open' : ''}`} aria-label="メインメニュー">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} className="nav__link" onClick={menu.close}>
              <span className="nav__zh" lang="zh-Hant" aria-hidden="true">
                {item.zh}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button type="button" className="cart-link" onClick={open} aria-label={`カートを開く（${count}点）`}>
          カート<span className="cart-link__count num">{count}</span>
        </button>
        <button type="button" className="menu-toggle" aria-expanded={menu.isOpen} onClick={menu.toggle}>
          {menu.isOpen ? '閉じる' : 'メニュー'}
        </button>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="tiles footer__tiles" aria-hidden="true" />
      <div className="wrap footer__top">
        <div>
          <p className="footer__sign" lang="zh-Hant" aria-hidden="true">
            瑪奇商店
          </p>
          <p className="footer__about">台湾出身・東京在住のMachi（瑪奇）が、ふるさとの「おいしい」と「かわいい」を集めた小さなお店です。</p>
        </div>
        <div className="footer__letter">
          <p className="footer__h">新入荷速報</p>
          <p className="footer__letter-text">入荷や限定アイテムのお知らせを、月に一度お届けします。</p>
          <NewsletterForm idPrefix="retro-letter" buttonLabel="受け取る" doneMessage="ご登録ありがとうございます（モックのため実際には登録されていません）。" />
        </div>
      </div>
      <div className="wrap footer__cols">
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
      <div className="wrap footer__bottom">
        <span>© 2026 Machi Story Shop</span>
        <span>TAIPEI ⇄ TOKYO</span>
      </div>
    </footer>
  )
}

export function Layout() {
  return (
    <>
      <SkipLink />
      <p className="notice" role="note">
        確認用モックサイト ― 実際のご注文・決済は行われません
      </p>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <DesignSwitch current="b" />
    </>
  )
}
