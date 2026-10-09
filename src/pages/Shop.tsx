import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHead } from '../components/Heads'
import { ProductCard } from '../components/ProductCard'
import { categories, products, type CategoryId } from '../data/products'
import { clean } from '../lib/validation'

const sorts = [
  { id: 'recommend', label: 'おすすめ順' },
  { id: 'price-asc', label: '価格の安い順' },
  { id: 'price-desc', label: '価格の高い順' },
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
  const tabs = [{ id: null, name: 'すべて' }, ...categories]

  return (
    <>
      <PageHead
        label="商品"
        title={current ? current.name : 'すべての商品'}
        lead={current?.lead ?? '台湾の味、手しごとの雑貨、そしてMachiのオリジナル。'}
        aside={<span className="num">{list.length} items</span>}
      />
      <div className="wrap">
        <div className="toolbar">
          <div className="tabs" role="tablist" aria-label="カテゴリー">
            {tabs.map((t) => (
              <button
                key={t.id ?? 'all'}
                type="button"
                role="tab"
                aria-selected={category === t.id}
                className={`tab ${category === t.id ? 'is-active' : ''}`}
                onClick={() => update('category', t.id)}
              >
                {t.name}
              </button>
            ))}
          </div>
          <div className="toolbar__tools">
            <label className="search">
              <span className="visually-hidden">商品を検索</span>
              <input
                type="search"
                placeholder="検索"
                maxLength={MAX_QUERY}
                defaultValue={query}
                onChange={(e) => update('q', clean(e.target.value).slice(0, MAX_QUERY) || null)}
              />
            </label>
            <label className="sort">
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

        {list.length > 0 ? (
          <div className="grid grid--shop">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="empty">条件に合う商品が見つかりませんでした。</p>
        )}
      </div>
    </>
  )
}
