import { Link } from 'react-router-dom'
import { PageHead } from '../components/Heads'
import { ProductPlate } from '../components/ProductPlate'
import { findProduct, journal } from '../data/products'

export function Journal() {
  return (
    <>
      <PageHead label="読みもの" title="商品のうしろにある、小さな話。" lead="掲載している文章はモック用のサンプルです。" />
      <div className="wrap">
        {journal.map((j) => {
          const product = findProduct(j.productId)!
          return (
            <article key={j.id} id={j.id} className="article">
              <div className="article__media">
                <ProductPlate product={product} />
              </div>
              <div className="article__body">
                <p className="article__date num">{j.date}</p>
                <h2 className="article__title">{j.title}</h2>
                <p className="article__zh" lang="zh-Hant">
                  {j.titleZh}
                </p>
                <p>{j.excerpt}</p>
                <p>{product.story}</p>
                <Link to={`/shop/${product.id}`} className="arrow-link">
                  {product.name}
                </Link>
              </div>
            </article>
          )
        })}
      </div>
    </>
  )
}
