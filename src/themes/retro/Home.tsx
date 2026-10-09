import { Link } from 'react-router-dom'
import { ProductCard } from '../../components/ProductCard'
import { ProductPlate } from '../../components/ProductPlate'
import { categories, findProduct, journal, products } from '../../data/products'
import { formatYen } from '../../lib/format'
import { INSTAGRAM_ROOM_URL, INSTAGRAM_URL } from '../../lib/site'

const marquee = ['新入荷　手づくり鳳梨酥', '数量限定　フォトブック『雲のむこうへ』', '客家花布ポーチ　3色', '送料無料　¥5,000〜', '台北 ⇄ 東京']

function Head({ zh, ja, note, link }: { zh: string; ja: string; note?: string; link?: { to: string; label: string } }) {
  return (
    <header className="r-head">
      <p className="r-head__zh" lang="zh-Hant">
        {zh}
      </p>
      <h2 className="r-head__ja">{ja}</h2>
      {note && <p className="r-head__note">{note}</p>}
      {link && (
        <Link to={link.to} className="arrow-link r-head__link">
          {link.label}
        </Link>
      )}
    </header>
  )
}

function Sticker({ id, className }: { id: string; className: string }) {
  const product = findProduct(id)!
  return (
    <Link to={`/shop/${product.id}`} className={`sticker ${className}`} aria-label={product.name}>
      <ProductPlate product={product} />
    </Link>
  )
}

function Stamp() {
  return (
    <svg className="stamp" viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <path id="stamp-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
      </defs>
      <circle cx="60" cy="60" r="58" />
      <text>
        <textPath href="#stamp-circle">MACHI SELECT ✦ 瑪奇推薦 ✦ SINCE 2026 ✦</textPath>
      </text>
      <text x="60" y="68" textAnchor="middle" className="stamp__center">
        推
      </text>
    </svg>
  )
}

export function Home() {
  const picks = products.filter((p) => p.badge === 'Machi Select' || p.badge === 'NEW').slice(0, 4)
  const photobook = findProduct('photobook')!
  const minPrice = (id: string) => Math.min(...products.filter((p) => p.category === id).map((p) => p.price))

  return (
    <>
      <section className="night wrap">
        <div className="night__panel">
          <div className="night__lights" aria-hidden="true" />
          <div className="night__copy">
            <p className="night__eyebrow">TAIPEI ⇄ TOKYO　台灣好物雜貨店</p>
            <h1 className="night__title">
              台湾の<em>「好き」</em>を、
              <br />
              ぜんぶ詰めこみました。
            </h1>
            <p className="night__lead">鳳梨酥に客家花布、マジョリカタイル。台湾出身・東京在住9年のMachi（瑪奇）が、ふるさとの「おいしい」と「かわいい」を集めたお店です。</p>
            <div className="night__actions">
              <Link to="/shop" className="btn">
                商品をみる
              </Link>
              <Link to="/story" className="btn btn--ghost">
                瑪奇ってだれ？
              </Link>
            </div>
          </div>
          <div className="night__stage">
            <p className="neon" lang="zh-Hant" aria-hidden="true">
              台灣好物
            </p>
            <Sticker id="pineapple-cake" className="sticker--a" />
            <Sticker id="hakka-pouch" className="sticker--b" />
            <Sticker id="tile-coaster" className="sticker--c" />
            <Stamp />
          </div>
        </div>
      </section>

      <div className="marquee" role="note" aria-label={marquee.join('、')}>
        <div className="marquee__track" aria-hidden="true">
          {[...marquee, ...marquee].map((m, i) => (
            <span key={i}>{m}</span>
          ))}
        </div>
      </div>

      <section className="section wrap">
        <Head zh="菜單" ja="メニュー" note="気になる屋台からどうぞ。" />
        <ol className="menu">
          {categories.map((c, i) => (
            <li key={c.id}>
              <Link to={`/shop?category=${c.id}`} className="menu__row">
                <span className="menu__glyph" data-swatch={i} aria-hidden="true">
                  {c.glyph}
                </span>
                <span className="menu__name">
                  {c.name}
                  <small lang="zh-Hant">{c.nameZh}</small>
                </span>
                <span className="menu__lead">{c.lead}</span>
                <span className="menu__price">{formatYen(minPrice(c.id))}〜</span>
                <span className="menu__arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="section wrap">
        <Head zh="瑪奇推薦" ja="Machiのおすすめ" link={{ to: '/shop', label: 'すべての商品' }} />
        <div className="grid">
          {picks.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="section wrap">
        <div className="box">
          <Link to={`/shop/${photobook.id}`} className="box__media">
            <ProductPlate product={photobook} />
          </Link>
          <div className="box__body">
            <p className="box__kicker">數量限定 ― 数量限定</p>
            <h2 className="box__title">
              フォトブック
              <br />
              『雲のむこうへ』
            </h2>
            <p className="box__text">九份の雨、浅草の朝、銭湯の湯けむり。東京生活9年目の節目に、ふたつの街で撮りためた写真と短いエッセイを一冊にまとめました。</p>
            <dl className="spec">
              <div>
                <dt>判型</dt>
                <dd>B5変形・96ページ</dd>
              </div>
              <div>
                <dt>言語</dt>
                <dd>日本語／繁體中文</dd>
              </div>
              <div>
                <dt>特典</dt>
                <dd>直筆サイン（数量限定）</dd>
              </div>
            </dl>
            <div className="box__buy">
              <span className="box__price">{formatYen(photobook.price)}</span>
              <Link to={`/shop/${photobook.id}`} className="btn">
                詳しくみる
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section wrap">
        <Head zh="讀物" ja="読みもの" note="商品のうしろにある、小さな話。" link={{ to: '/journal', label: 'すべて読む' }} />
        <ul className="postcards">
          {journal.map((j) => {
            const product = findProduct(j.productId)!
            return (
              <li key={j.id}>
                <Link to={`/journal#${j.id}`} className="postcard">
                  <span className="postcard__stamp">
                    <ProductPlate product={product} bare />
                  </span>
                  <span className="postcard__mark" aria-hidden="true">
                    TOKYO
                    <br />
                    {j.date.slice(0, 4)}
                  </span>
                  <p className="postcard__date num">{j.date}</p>
                  <h3 className="postcard__title">{j.title}</h3>
                  <p className="postcard__excerpt">{j.excerpt}</p>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="section wrap">
        <div className="follow">
          <div>
            <p className="follow__kicker">Instagram</p>
            <h2 className="follow__title">
              フォローしてね！
              <span lang="zh-Hant">追蹤瑪奇！</span>
            </h2>
            <p className="follow__text">本アカウントでは日本の文化や歴史のこと。サブアカウント「瑪奇的日本首相」では、撮影の裏側やふだんの暮らしを発信中。</p>
          </div>
          <div className="follow__links">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="ticket">
              <span>@machihistory</span>
              <small>Machi說故事</small>
            </a>
            <a href={INSTAGRAM_ROOM_URL} target="_blank" rel="noopener noreferrer" className="ticket">
              <span>@machiroomhere</span>
              <small lang="zh-Hant">瑪奇的日本首相</small>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
