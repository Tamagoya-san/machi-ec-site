import Link from 'next/link'
import { getI18n } from '@/i18n/server'

export default async function NotFound() {
  const { d, to } = await getI18n()
  return (
    <div className="wrap message">
      <p className="message__code latin">404</p>
      <h1 className="page-head__title">{d.notFound.title}</h1>
      <p className="lead">{d.notFound.body}</p>
      <Link href={to('/')} className="btn">
        {d.notFound.cta}
      </Link>
    </div>
  )
}
