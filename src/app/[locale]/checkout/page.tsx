import type { Metadata } from 'next'
import { CheckoutForm } from '@/components/CheckoutForm'
import { getI18n } from '@/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { d } = await getI18n()
  return { title: d.checkout.title }
}

export default async function CheckoutPage() {
  const { d } = await getI18n()
  return (
    <div className="wrap shop">
      <header className="page-head">
        <p className="eyebrow">Checkout</p>
        <h1 className="page-head__title">{d.checkout.title}</h1>
      </header>
      <CheckoutForm />
    </div>
  )
}
