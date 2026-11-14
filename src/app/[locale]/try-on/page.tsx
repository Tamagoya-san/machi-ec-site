import type { Metadata } from 'next'
import { Suspense, type ReactNode } from 'react'
import { ProductVisual } from '@/components/ProductCard'
import { TryOnStudio, type TryOnItem } from '@/components/TryOnStudio'
import { products } from '@/content'
import { getI18n } from '@/i18n/server'
import { findItemPhoto } from '@/lib/photos'

// APIキーの設定状況をその都度確かめるため、リクエストごとに描画する
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { d } = await getI18n()
  return { title: d.tryOn.title, description: d.tryOn.lead }
}

export default async function TryOnPage() {
  const { d, t } = await getI18n()

  const items: TryOnItem[] = []
  const visuals: Record<string, ReactNode> = {}
  for (const product of products) {
    if (!product.tryOn) continue
    const name = t(product.name)
    items.push({
      id: product.id,
      name,
      hint: t(product.tryOn.hint),
      hasPhoto: findItemPhoto(product.id) !== null,
    })
    visuals[product.id] = <ProductVisual product={product} alt={name} />
  }

  return (
    <div className="wrap tryon">
      <header className="page-head">
        <p className="eyebrow">AI try-on</p>
        <h1 className="page-head__title">{d.tryOn.title}</h1>
        <p className="lead page-head__lead">{d.tryOn.lead}</p>
      </header>
      {/* ?item= を読むため、クライアント側で描画が確定するまで待つ */}
      <Suspense fallback={<div className="studio studio--loading" />}>
        <TryOnStudio items={items} visuals={visuals} configured={Boolean(process.env.GEMINI_API_KEY)} />
      </Suspense>
    </div>
  )
}
