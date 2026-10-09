export function Bubbles({ count = 10 }: { count?: number }) {
  return (
    <div className="bubbles" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={`bubble bubble--${i % 10}`} />
      ))}
    </div>
  )
}

export function SectionTitle({ en, ja, zh }: { en: string; ja: string; zh?: string }) {
  return (
    <div className="section-title">
      <p className="section-title__en">{en}</p>
      <h2 className="section-title__ja">{ja}</h2>
      {zh && (
        <p className="section-title__zh" lang="zh-Hant">
          {zh}
        </p>
      )}
    </div>
  )
}

export function PageHero({ en, ja, lead }: { en: string; ja: string; lead?: string }) {
  return (
    <section className="page-hero">
      <Bubbles count={6} />
      <p className="page-hero__en">{en}</p>
      <h1 className="page-hero__ja">{ja}</h1>
      {lead && <p className="page-hero__lead">{lead}</p>}
    </section>
  )
}
