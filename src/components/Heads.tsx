import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface SectionHeadProps {
  no: string
  title: string
  note?: string
  link?: { to: string; label: string }
}

export function SectionHead({ no, title, note, link }: SectionHeadProps) {
  return (
    <div className="section-head">
      <span className="section-head__no">{no}</span>
      <h2 className="section-head__title">{title}</h2>
      {note && <p className="section-head__note">{note}</p>}
      {link && (
        <Link to={link.to} className="arrow-link section-head__link">
          {link.label}
        </Link>
      )}
    </div>
  )
}

interface PageHeadProps {
  label: string
  title: string
  lead?: string
  aside?: ReactNode
}

export function PageHead({ label, title, lead, aside }: PageHeadProps) {
  return (
    <header className="page-head wrap">
      <p className="page-head__label">{label}</p>
      <h1 className="page-head__title">{title}</h1>
      {lead && <p className="page-head__lead">{lead}</p>}
      {aside && <div className="page-head__aside">{aside}</div>}
    </header>
  )
}
