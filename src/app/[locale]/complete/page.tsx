import type { Metadata } from 'next'
import Link from 'next/link'
import { getI18n } from '@/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { d } = await getI18n()
  return { title: d.complete.title }
}

export default async function CompletePage() {
  const { d, to } = await getI18n()
  return (
    <div className="wrap message">
      <span className="message__pin" aria-hidden="true" />
      <p className="eyebrow eyebrow--plain">Thank you</p>
      <h1 className="page-head__title">{d.complete.title}</h1>
      <p className="lead">{d.complete.body}</p>
      <Link href={to('/')} className="btn">
        {d.complete.cta}
      </Link>
    </div>
  )
}
