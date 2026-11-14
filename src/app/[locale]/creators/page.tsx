import type { Metadata } from 'next'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { Art } from '@/components/Art'
import { Photo } from '@/components/Photo'
import { creators, getPlace, productsByCreator } from '@/content'
import { getI18n } from '@/i18n/server'
import { pad2 } from '@/lib/format'

export async function generateMetadata(): Promise<Metadata> {
  const { d } = await getI18n()
  return { title: d.creators.title, description: d.creators.lead }
}

export default async function CreatorsPage() {
  const { d, t, to } = await getI18n()

  return (
    <div className="wrap">
      <header className="page-head">
        <p className="eyebrow">Makers</p>
        <h1 className="page-head__title">{d.creators.title}</h1>
        <p className="lead page-head__lead">{d.creators.lead}</p>
      </header>

      <ul className="makers">
        {creators.map((creator) => {
          const place = getPlace(creator.place)
          const theme = {
            '--lp-paper': creator.theme.paper,
            '--lp-soft': creator.theme.soft,
            '--lp-ink': creator.theme.ink,
            '--lp-accent': creator.theme.accent,
          } as CSSProperties
          return (
            <li key={creator.slug} style={theme}>
              <Link href={to(`/creators/${creator.slug}`)} className="maker-card">
                <span className="maker-card__art">
                  {creator.cover ? (
                    <Photo photo={creator.cover} sizes="(min-width: 760px) 50vw, 100vw" priority />
                  ) : (
                    <Art kind={creator.heroArt} plate={creator.theme.soft} />
                  )}
                </span>
                <span className="maker-card__body">
                  <span className="mono">
                    {d.lp.number}
                    {pad2(creator.no)} — {place ? t(place.name) : ''}
                  </span>
                  <span className="maker-card__name">{creator.name}</span>
                  <span className="maker-card__tagline">{t(creator.tagline)}</span>
                  <span className="maker-card__meta">
                    {t(creator.craft)} ・ {productsByCreator(creator.slug).length} {d.common.items}
                  </span>
                </span>
              </Link>
            </li>
          )
        })}
        <li>
          <Link href={to('/about#makers')} className="maker-card maker-card--next">
            <span className="maker-card__body">
              <span className="mono">
                {d.lp.number}
                {pad2(creators.length + 1)} —
              </span>
              <span className="maker-card__next">{d.creators.nextTitle}</span>
              <span className="maker-card__tagline">{d.creators.nextBody}</span>
              <span className="arrow-link">{d.home.joinCta}</span>
            </span>
          </Link>
        </li>
      </ul>
    </div>
  )
}
