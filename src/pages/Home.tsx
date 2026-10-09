import { Link } from 'react-router-dom'
import { SectionHead } from '../components/Heads'
import { ProductCard } from '../components/ProductCard'
import { ProductPlate } from '../components/ProductPlate'
import { categories, findProduct, journal, products } from '../data/products'
import { formatYen } from '../lib/format'
import { photo } from '../lib/photos'
import { INSTAGRAM_URL } from '../lib/site'

function HeroVisual() {
  const src = photo('hero')
  if (src) return <img className="hero__img" src={src} alt="Machi" decoding="async" />
  return (
    <div className="poster" role="img" aria-label="台北と東京">
      <span className="poster__glyph poster__glyph--tw" aria-hidden="true">
        台
      </span>
      <span className="poster__glyph poster__glyph--jp" aria-hidden="true">
        日
      </span>
      <svg className="poster__line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <line x1="43" y1="47" x2="59" y2="57" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="poster__coord poster__coord--tw">
        Taipei
        <br />
        25.03°N 121.56°E
      </span>
      <span className="poster__coord poster__coord--jp">
        Tokyo
        <br />
        35.68°N 139.65°E
      </span>
      <span className="poster__caption">Photo — 撮り下ろし写真に差し替え予定</span>
    </div>
  )
}

export function Home() {
  const featured = products.filter((p) => p.badge === 'Machi Select' || p.badge === '限定').slice(0, 4)
  const photobook = findProduct('photobook')!

  return (
    <>
      <section className="hero wrap">
        <div className="hero__visual">
          <HeroVisual />
        </div>
        <div className="hero__copy">
          <h1 className="hero__title">
            台湾と日本の、
            <br />
            あいだのもの。
          </h1>
          <p className="hero__sub">
            ふたつの街を行き来して
            <br />
            見つけた、小さな定番。
          </p>
        </div>
        <div className="hero__foot">
          <p className="hero__en">Discover Taiwan, again.</p>
          <p className="hero__desc">
            台湾出身、東京在住9年のMachi（鄭羽婷）が、故郷の味や手しごとの雑貨、自身のオリジナルアイテムを選んで届けるお店です。
          </p>
          <Link to="/shop" className="arrow-link">
            商品をみる
          </Link>
        </div>
      </section>

      <section className="intro wrap">
        <p className="label">はじめに</p>
        <div>
          <p className="intro__text">
            東京で暮らして、九年になりました。台湾に帰るたびに、スーツケースの半分はおみやげでいっぱいになります。祖母が淹れてくれたお茶、市場で使われているストライプの袋、迪化街で見つけた花柄の布。このお店には、そんな「持ち帰りたかったもの」を、少しずつ並べていきます。
          </p>
          <p className="intro__sign">Machi まち　鄭羽婷</p>
        </div>
      </section>

      <section className="section wrap">
        <SectionHead no="01" title="カテゴリー" link={{ to: '/shop', label: 'すべての商品' }} />
        <ol className="index">
          {categories.map((c, i) => (
            <li key={c.id}>
              <Link to={`/shop?category=${c.id}`} className="index__row">
                <span className="index__no num">{`0${i + 1}`}</span>
                <span className="index__name">
                  {c.name}
                  <span className="index__zh" lang="zh-Hant">
                    {c.nameZh}
                  </span>
                </span>
                <span className="index__lead">{c.lead}</span>
                <span className="index__count num">{products.filter((p) => p.category === c.id).length} items</span>
                <span className="index__arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="section wrap">
        <SectionHead no="02" title="Machiのおすすめ" note="いま、いちばん手にとってほしいもの。" />
        <div className="grid">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="feature">
        <div className="wrap feature__inner">
          <Link to={`/shop/${photobook.id}`} className="feature__media">
            <ProductPlate product={photobook} />
          </Link>
          <div className="feature__body">
            <p className="label">03 — 数量限定</p>
            <h2 className="feature__title">
              フォトブック
              <br />
              『雲のむこうへ』
            </h2>
            <p className="feature__text">
              九份の雨、浅草の朝、銭湯の湯けむり。東京生活9年目の節目に、ふたつの街で撮りためた写真と短いエッセイを一冊にまとめました。
            </p>
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
              <div>
                <dt>価格</dt>
                <dd className="num">{formatYen(photobook.price)}</dd>
              </div>
            </dl>
            <Link to={`/shop/${photobook.id}`} className="btn">
              詳しくみる
            </Link>
          </div>
        </div>
      </section>

      <section className="section wrap">
        <SectionHead no="04" title="読みもの" note="商品のうしろにある、小さな話。" link={{ to: '/journal', label: 'すべて読む' }} />
        <ul className="journal">
          {journal.map((j) => {
            const product = findProduct(j.productId)!
            return (
              <li key={j.id}>
                <Link to={`/journal#${j.id}`} className="journal__row">
                  <span className="journal__date num">{j.date}</span>
                  <span className="journal__title">{j.title}</span>
                  <span className="journal__excerpt">{j.excerpt}</span>
                  <ProductPlate product={product} className="journal__thumb" bare />
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="sns wrap">
        <p className="label">05 — Instagram</p>
        <p className="sns__text">日本の文化の小さな発見や、新しい入荷のお知らせは、Instagramで。</p>
        <a className="sns__handle" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
          @machihistory<span aria-hidden="true">↗</span>
        </a>
      </section>
    </>
  )
}
