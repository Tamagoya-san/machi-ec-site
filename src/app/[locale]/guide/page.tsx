import type { Metadata } from 'next'
import { getI18n } from '@/i18n/server'
import { pad2 } from '@/lib/format'

export async function generateMetadata(): Promise<Metadata> {
  const { d } = await getI18n()
  return { title: d.guide.title }
}

export default async function GuidePage() {
  const { d } = await getI18n()
  return (
    <div className="wrap">
      <header className="page-head">
        <p className="eyebrow">Guide</p>
        <h1 className="page-head__title">{d.guide.title}</h1>
      </header>
      <div className="guide">
        <p className="notice">{d.guide.notice}</p>
        <dl className="guide__list">
          {d.guide.sections.map((section, index) => (
            <div key={section.title}>
              <dt>
                <span className="mono">{pad2(index + 1)}</span>
                {section.title}
              </dt>
              <dd>{section.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
