import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHero } from '../components/Decor'
import { ProductCard } from '../components/ProductCard'
import { categories, products, type CategoryId } from '../data/products'
import { clean } from '../lib/validation'

const sorts = [
  { id: 'recommend', label: 'おすすめ順' },
  { id: 'price-asc', label: '価格が安い順' },
  { id: 'price-desc', label: '価格が高い順' },
] as const
type SortId = (typeof sorts)[number]['id']

const MAX_QUERY = 40

export function Shop() {
  const [params, setParams] = useSearchParams()

  // URL パラメータは外部から自由に指定できるため、許可リストで検証してから使う。
  const rawCategory = params.get('category')
  const category = categories.some((c) => c.id === rawCategory) ? (rawCategory as CategoryId) : null
  const rawSort = params.get('sort')
  const sort: SortId = sorts.some((s) => s.id === rawSort) ? (rawSort as SortId) : 'recommend'
  const query = clean(params.get('q') ?? '').slice(0, MAX_QUERY)

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const list = useMemo(() => {
    const q = query.toLowerCase()
    const filtered = products.filter(
      (p) =>
        (!category || p.category === category) &&
        (!q || [p.name, p.nameZh, p.summary].some((t) => t.toLowerCase().includes(q))),
    )
    if (sort === 'price-asc') return [...filtered].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') return [...filtered].sort((a, b) => b.price - a.price)
    return filtered
  }, [category, sort, query])

  const current = categories.find((c) => c.id === category)

  return (
    <>
      <PageHero en="Shop" ja={current ? current.name : 'すべての商品'} lead={current?.lead ?? '台湾の味、手しごとの雑貨、そしてMachiのオリジナルアイテム。'} />
      <section className="section section--tight">
        <div className="filters">
          <div className="chips" role="tablist" aria-label="カテゴリー">
            <button type="button" role="tab" aria-selected={!category} className={`chip ${!category ? 'is-active' : ''}`} onClick={() => update('category', null)}>
              すべて
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={category === c.id}
                className={`chip ${category === c.id ? 'is-active' : ''}`}
                onClick={() => update('category', c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>
          <div className="filters__row">
            <label className="search">
              <span className="visually-hidden">商品を検索</span>
              <input
                type="search"
                placeholder="商品を検索（例：烏龍茶）"
                maxLength={MAX_QUERY}
                defaultValue={query}
                onChange={(e) => update('q', clean(e.target.value).slice(0, MAX_QUERY) || null)}
              />
            </label>
            <label className="select">
              <span className="visually-hidden">並び替え</span>
              <select value={sort} onChange={(e) => update('sort', e.target.value === 'recommend' ? null : e.target.value)}>
                {sorts.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <p className="result-count">{list.length}件の商品</p>
        {list.length > 0 ? (
          <div className="product-grid">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="empty">条件に合う商品が見つかりませんでした。</p>
        )}
      </section>
    </>
  )
}
