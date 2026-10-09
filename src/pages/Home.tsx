import { Link } from 'react-router-dom'
import { Bubbles, SectionTitle } from '../components/Decor'
import { HeroVisual } from '../components/HeroVisual'
import { ProductArt } from '../components/ProductArt'
import { ProductCard } from '../components/ProductCard'
import { categories, findProduct, journal, products } from '../data/products'
import { INSTAGRAM_URL } from '../lib/site'

const categoryIcon: Record<string, string> = {
  'taiwan-taste': '🍵',
  'taiwan-craft': '🧺',
  'machi-original': '🫧',
  bridge: '♨️',
}

export function Home() {
  const featured = products.filter((p) => p.badge === 'Machi Select' || p.badge === '限定').slice(0, 4)
  const newArrivals = products.filter((p) => p.badge === 'NEW')
  const photobook = findProduct('photobook')!

  return (
    <>
      <section className="hero">
        <Bubbles />
        <div className="hero__inner">
          <div className="hero__copy">
            <p className="hero__eyebrow">☁️ Machi Story Shop</p>
            <h1 className="hero__title">
              <span className="hero__title-en">Discover Taiwan,</span>
              <span className="hero__title-en hero__title-en--italic">Again.</span>
            </h1>
            <p className="hero__lead">
              台湾と日本のあいだで見つけた、
              <br />
              ちいさな物語のお店。
            </p>
            <p className="hero__zh" lang="zh-Hant">
              在台灣與日本之間，說一個溫柔的故事。
            </p>
            <div className="hero__actions">
              <Link to="/shop" className="button button--primary">
                商品を見る
              </Link>
              <Link to="/story" className="button button--ghost">
                Machiについて
              </Link>
            </div>
          </div>
          <div className="hero__visual">
            <HeroVisual />
          </div>
        </div>
        <p className="hero__scroll" aria-hidden="true">
          scroll
        </p>
      </section>

      <section className="concept">
        <div className="concept__inner">
          <p className="concept__en">Every item has a story.</p>
          <p className="concept__text">
            台湾で生まれ、東京で暮らして9年。
            <br />
            ふたつの街を行き来しながら見つけた「好き」を、
            <br />
            ひとつずつ、物語といっしょにお届けします。
          </p>
          <p className="concept__sign">— Machi まち</p>
        </div>
      </section>

      <section className="section">
        <SectionTitle en="Category" ja="カテゴリーから探す" zh="商品分類" />
        <div className="category-grid">
          {categories.map((c) => (
            <Link key={c.id} to={`/shop?category=${c.id}`} className={`category-tile category-tile--${c.id}`}>
              <span className="category-tile__icon" aria-hidden="true">
                {categoryIcon[c.id]}
              </span>
              <span className="category-tile__name">{c.name}</span>
              <span className="category-tile__zh" lang="zh-Hant">
                {c.nameZh}
              </span>
              <span className="category-tile__lead">{c.lead}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section section--tint">
        <SectionTitle en="Machi's Select" ja="Machiのおすすめ" zh="Machi 推薦" />
        <div className="product-grid">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className="section__more">
          <Link to="/shop" className="button button--ghost">
            すべての商品を見る
          </Link>
        </div>
      </section>

      <section className="feature">
        <div className="feature__media">
          <ProductArt product={photobook} className="feature__art" />
        </div>
        <div className="feature__body">
          <p className="feature__label">Limited Edition</p>
          <h2 className="feature__title">
            フォトブック
            <br />
            『雲のむこうへ』
          </h2>
          <p className="feature__text">
            東京生活9年目の記念に。九份の雨、浅草の朝、銭湯の湯けむり——
            ふたつの街で撮りためた写真と、短いエッセイを一冊に綴りました。数量限定の直筆サイン入り。
          </p>
          <Link to={`/shop/${photobook.id}`} className="button button--primary">
            詳しく見る
          </Link>
        </div>
      </section>

      <section className="section">
        <SectionTitle en="New Arrivals" ja="新着アイテム" zh="新品上架" />
        <div className="product-grid product-grid--narrow">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="section section--tint">
        <SectionTitle en="Journal" ja="商品にまつわる物語" zh="商品背後的故事" />
        <div className="journal-grid">
          {journal.map((j) => {
            const product = findProduct(j.productId)!
            return (
              <article key={j.id} className="journal-card">
                <ProductArt product={product} className="journal-card__art" />
                <div className="journal-card__body">
                  <p className="journal-card__date">{j.date}</p>
                  <h3 className="journal-card__title">{j.title}</h3>
                  <p className="journal-card__zh" lang="zh-Hant">
                    {j.titleZh}
                  </p>
                  <p className="journal-card__excerpt">{j.excerpt}</p>
                  <Link to={`/shop/${product.id}`} className="text-button">
                    この物語のアイテム →
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="sns">
        <Bubbles count={8} />
        <p className="sns__en">Follow the story</p>
        <h2 className="sns__title">Instagram で、毎日の物語を。</h2>
        <p className="sns__text">
          日本文化の小さな発見や、台湾のおすすめを発信中。
          <br />
          新商品の情報もいち早くお届けします。
        </p>
        <a className="button button--primary" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
          @machihistory をフォロー
        </a>
      </section>
    </>
  )
}
