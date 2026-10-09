import type { CSSProperties } from 'react'
import { photo } from '../lib/photos'

interface Props {
  name: string
  alt: string
  caption: string
  tone?: string
  className?: string
}

/** src/assets/photos/{name}.jpg があれば表示し、なければ差し替え用の枠を出す。 */
export function Photo({ name, alt, caption, tone, className = '' }: Props) {
  const src = photo(name)
  if (src) return <img className={`photo ${className}`} src={src} alt={alt} decoding="async" />
  return (
    <div className={`photo photo--empty ${className}`} style={tone ? ({ '--tone': tone } as CSSProperties) : undefined} role="img" aria-label={alt}>
      <span className="photo__caption">{caption}</span>
    </div>
  )
}
