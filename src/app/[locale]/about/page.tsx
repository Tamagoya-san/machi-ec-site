import type { Metadata } from 'next'
import Link from 'next/link'
import { Photo } from '@/components/Photo'
import { machi } from '@/content/machi'
import { getI18n } from '@/i18n/server'
import { pad2 } from '@/lib/format'
import { machiInstagram } from '@/lib/site'

export async function generateMetadata(): Promise<Metadata> {
  const { d } = await getI18n()
  return { title: d.about.title, description: d.about.lead }
}

export default async function AboutPage() {
  const { d, to } = await getI18n()
  const copy = d.about

  return (
    <>
      <div className="wrap">
        <header className="page-head about-head">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1 className="page-head__title">{copy.title}</h1>
          <p className="lead page-head__lead">{copy.lead}</p>
        </header>
      </div>

      <section className="lp-section about-concept">
        <div className="wrap lp-split">
          <div className="lp-split__head">
            <p className="eyebrow">Concept</p>
            <h2 className="h-section">{copy.conceptTitle}</h2>
            <p className="about-pun" aria-hidden="true">
              <span>
                まち<small>town</small>
              </span>
              <i>=</i>
              <span>
                Machi<small>storyteller</small>
              </span>
            </p>
          </div>
          <div className="lp-prose">
            {copy.concept.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section about-machi">
        <div className="wrap about-machi__grid">
          <figure className="about-machi__portrait">
            <Photo photo={machi.portrait} sizes="(min-width: 900px) 38vw, 100vw" priority />
            <figcaption>{machi.portraitCredit}</figcaption>
          </figure>
          <div className="about-machi__copy">
            <p className="eyebrow">Curator</p>
            <h2 className="h-section latin about-machi__name">{copy.machiTitle}</h2>
            <dl className="about-machi__facts">
              {copy.machiFacts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
            <div className="lp-prose">
              {copy.machi.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <p className="about-machi__note">{copy.machiProvisional}</p>
            <a href={machiInstagram} target="_blank" rel="noopener noreferrer" className="arrow-link">
              Instagram @machihistory
            </a>
          </div>
        </div>
        <div className="wrap about-machi__travel">
          {machi.travel.map((photo) => (
            <figure key={photo.src}>
              <Photo photo={photo} sizes="(min-width: 900px) 30vw, 33vw" />
            </figure>
          ))}
          <p className="lp-credit">{machi.travelCredit}</p>
        </div>
      </section>

      <section className="section how">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">{d.home.howEyebrow}</p>
            <h2 className="h-section">{copy.howTitle}</h2>
          </div>
          <ol className="how__steps">
            {d.home.how.map((step, index) => (
              <li key={step.title} className="how__step">
                <span className="how__no">{pad2(index + 1)}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section about-makers" id="makers">
        <div className="wrap">
          <div className="about-makers__card">
            <div className="about-makers__copy">
              <p className="eyebrow">{d.home.joinEyebrow}</p>
              <h2 className="h-section">{copy.makersTitle}</h2>
              {copy.makers.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <a href={machiInstagram} target="_blank" rel="noopener noreferrer" className="btn">
                {copy.makersCta}
              </a>
            </div>
            <ol className="about-makers__steps">
              {copy.makersSteps.map((step, index) => (
                <li key={step}>
                  <span>{pad2(index + 1)}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
          <p className="about-makers__back">
            <Link href={to('/map')} className="arrow-link">
              {d.home.ctaMap}
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
