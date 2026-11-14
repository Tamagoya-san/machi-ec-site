import { teeenu, teeenuProducts } from './creators/teeenu'
import { places } from './places'
import type { Category, Creator, Place, Product, Text } from './types'

// つくり手を追加するときは、creators/ にファイルを作り、ここに1行ずつ足す。
export const creators: Creator[] = [teeenu]
export const products: Product[] = [...teeenuProducts]
export { places }

export const getCreator = (slug: string): Creator | undefined => creators.find((c) => c.slug === slug)
export const getProduct = (id: string): Product | undefined => products.find((p) => p.id === id)
export const getPlace = (slug: string): Place | undefined => places.find((p) => p.slug === slug)

export const productsByCreator = (slug: string): Product[] => products.filter((p) => p.creator === slug)
export const creatorsByPlace = (slug: string): Creator[] => creators.filter((c) => c.place === slug)
export const productsByPlace = (slug: string): Product[] =>
  creatorsByPlace(slug).flatMap((c) => productsByCreator(c.slug))

export const categoryLabels: Record<Category, Text> = {
  ear: { ja: 'イヤーアクセサリー', zh: '耳飾' },
  hair: { ja: 'ヘアアクセサリー', zh: '髮飾' },
  bag: { ja: 'バッグ', zh: '包包' },
  clothes: { ja: '洋服', zh: '服飾' },
}
