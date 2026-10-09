import { Link } from 'react-router-dom'
import { PageHero } from '../components/Decor'
import { ProductArt } from '../components/ProductArt'
import { findProduct, journal } from '../data/products'

export function Journal() {
  return (
    <>
      <PageHero en="Journal" ja="商品にまつわる物語" lead="ひとつのアイテムの向こうにある、Machiの小さなエピソード。" />
      <section className="section section--tight">
        <div className="journal-list">
          {journal.map((j) => {
            const product = findProduct(j.productId)!
            return (
              <article key={j.id} className="journal-row">
                <ProductArt product={product} className="journal-row__art" />
                <div className="journal-row__body">
                  <p className="journal-card__date">{j.date}</p>
                  <h2 className="journal-row__title">{j.title}</h2>
                  <p className="journal-card__zh" lang="zh-Hant">
                    {j.titleZh}
                  </p>
                  <p className="journal-row__excerpt">{j.excerpt}</p>
                  <p className="journal-row__excerpt">{product.story}</p>
                  <Link to={`/shop/${product.id}`} className="button button--ghost">
                    {product.name}を見る
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
        <p className="pdp__note">※ 掲載文章はモック用のサンプルです。</p>
      </section>
    </>
  )
}
