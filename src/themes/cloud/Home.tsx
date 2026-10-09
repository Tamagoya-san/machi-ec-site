import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { NewsletterForm } from '../../components/NewsletterForm'
import { Photo } from '../../components/Photo'
import { ProductCard } from '../../components/ProductCard'
import { ProductPlate } from '../../components/ProductPlate'
import { categories, findProduct, journal, products, type CategoryId } from '../../data/products'
import { formatYen } from '../../lib/format'
import { photo } from '../../lib/photos'
import { INSTAGRAM_ROOM_URL, INSTAGRAM_URL } from '../../lib/site'

const categoryTone: Record<CategoryId, string> = {
  'taiwan-taste': '#c7dcc1',
  'taiwan-craft': '#efc6ce',
  'machi-original': '#b9d2ea',
  bridge: '#d3c9e8',
}

function Head({ en, ja, link }: { en: string; ja: string; link?: { to: string; label: string } }) {
  return (
    <header className="c-head">
      <p className="c-head__en">{en}</p>
      <h2 className="c-head__ja">{ja}</h2>
      {link && (
        <Link to={link.to} className="arrow-link c-head__link">
          {link.label}
        </Link>
      )}
    </header>
  )
}

function Polaroid({ id, note, className }: { id: string; note: string; className: string }) {
  const product = findProduct(id)!
  return (
    <Link to={`/shop/${product.id}`} className={`polaroid ${className}`}>
      <ProductPlate product={product} bare />
      <span className="polaroid__note">{note}</span>
    </Link>
  )
}

export function Home() {
  const featured = products.filter((p) => p.badge === 'Machi Select' || p.badge === '限定').slice(0, 4)
  const photobook = findProduct('photobook')!
  const hero = photo('hero')

  return (
    <>
      <section className="sky">
        <div className="sky__inner wrap">
          <p className="sky__en">Discover Taiwan, again.</p>
          <h1 className="sky__title">
            空のむこうの、
            <br />
            もうひとつのふるさと。
          </h1>
          <p className="sky__lead">台湾で生まれ、東京で暮らして9年。ふるさとの味や手しごとを、Machiがひとつずつ選んでお届けします。</p>
          <div className="sky__actions">
            <Link to="/shop" className="btn">
              商品をみる
            </Link>
            <Link to="/story" className="btn btn--ghost">
              Machiのこと
            </Link>
          </div>
        </div>
        <Polaroid id="alishan-oolong" note="おばあちゃんのお茶" className="polaroid--left" />
        {hero ? (
          <img className="sky__portrait" src={hero} alt="Machi" decoding="async" />
        ) : (
          <Polaroid id="photobook" note="9年分の空の写真" className="polaroid--right" />
        )}
        <Polaroid id="pineapple-cake" note="帰省のおみやげ" className="polaroid--small" />
      </section>

      <section className="hello wrap">
        <Photo name="profile" alt="Machiのポートレート" caption="Photo — Machi" className="hello__photo" />
        <div className="hello__body">
          <p className="eyebrow">Hello from Tokyo</p>
          <h2 className="hello__title">
            大家好、
            <br />
            Machiです。
          </h2>
          <p>東京で暮らして、九年になりました。台湾に帰るたびに、スーツケースの半分はおみやげでいっぱい。祖母が淹れてくれたお茶、市場のストライプの袋、迪化街で見つけた花柄の布。</p>
          <p>このお店には、そんな「持ち帰りたかったもの」を、少しずつ並べていきます。</p>
          <p className="signature" aria-hidden="true">
            Machi
          </p>
          <Link to="/story" className="arrow-link">
            Machiのこと
          </Link>
        </div>
      </section>

      <section className="section wrap">
        <Head en="Categories" ja="カテゴリーからさがす" />
        <ul className="bubbles">
          {categories.map((c) => (
            <li key={c.id}>
              <Link to={`/shop?category=${c.id}`} className="bubble">
                <span className="bubble__glyph" style={{ '--tone': categoryTone[c.id] } as CSSProperties} aria-hidden="true">
                  {c.glyph}
                </span>
                <span className="bubble__name">{c.name}</span>
                <span className="bubble__zh" lang="zh-Hant">
                  {c.nameZh}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="section wrap">
        <Head en="Machi's favorites" ja="Machiのおすすめ" link={{ to: '/shop', label: 'すべての商品' }} />
        <div className="grid">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="cloudband">
        <div className="wrap cloudband__inner">
          <Link to={`/shop/${photobook.id}`} className="cloudband__media">
            <ProductPlate product={photobook} />
          </Link>
          <div className="cloudband__card">
            <p className="eyebrow">Limited edition</p>
            <h2 className="cloudband__title">
              フォトブック
              <br />
              『雲のむこうへ』
            </h2>
            <p className="cloudband__text">九份の雨、浅草の朝、銭湯の湯けむり。東京生活9年目の節目に、ふたつの街で撮りためた写真と短いエッセイを一冊にまとめました。</p>
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
            <div className="cloudband__buy">
              <span className="num">{formatYen(photobook.price)}</span>
              <Link to={`/shop/${photobook.id}`} className="btn">
                詳しくみる
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section wrap">
        <Head en="Diary" ja="読みもの" link={{ to: '/journal', label: 'すべて読む' }} />
        <ul className="diary">
          {journal.map((j) => {
            const product = findProduct(j.productId)!
            return (
              <li key={j.id}>
                <Link to={`/journal#${j.id}`} className="diary__item">
                  <ProductPlate product={product} className="diary__thumb" bare />
                  <p className="diary__date num">{j.date}</p>
                  <h3 className="diary__title">{j.title}</h3>
                  <p className="diary__excerpt">{j.excerpt}</p>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="section wrap keep">
        <div className="keep__card keep__card--ig">
          <p className="eyebrow">Follow me</p>
          <h2 className="keep__title">Instagramでも、毎日すこしずつ。</h2>
          <p className="keep__text">日本の文化の小さな発見は本アカウントで。撮影の裏側や、ふだんの暮らしはサブアカウントで。</p>
          <div className="keep__links">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="pill">
              @machihistory
            </a>
            <a href={INSTAGRAM_ROOM_URL} target="_blank" rel="noopener noreferrer" className="pill">
              @machiroomhere
            </a>
          </div>
        </div>
        <div className="keep__card keep__card--letter">
          <p className="eyebrow">Letter</p>
          <h2 className="keep__title">雲のお便り</h2>
          <p className="keep__text">新しい入荷や、限定アイテムのお知らせを月に一度お届けします。</p>
          <NewsletterForm idPrefix="cloud-letter" buttonLabel="登録する" doneMessage="ご登録ありがとうございます（モックのため実際には登録されていません）。" />
        </div>
      </section>
    </>
  )
}
