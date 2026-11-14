import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { CartView } from '@/components/CartView'
import { ProductVisual } from '@/components/ProductCard'
import { products } from '@/content'
import { getI18n } from '@/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { d } = await getI18n()
  return { title: d.cart.title }
}

export default async function CartPage() {
  const { d, t } = await getI18n()
  const visuals: Record<string, ReactNode> = {}
  for (const product of products) {
    visuals[product.id] = <ProductVisual product={product} alt={t(product.name)} />
  }

  return (
    <div className="wrap shop">
      <header className="page-head">
        <p className="eyebrow">Cart</p>
        <h1 className="page-head__title">{d.cart.title}</h1>
      </header>
      <CartView visuals={visuals} />
    </div>
  )
}
