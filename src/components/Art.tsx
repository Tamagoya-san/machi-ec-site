import { useId } from 'react'
import type { ArtKind } from '@/content/types'

// 商品写真が届くまでの間に表示する、リボンのイラスト。
// 写真を public/photos/items/{商品ID}.jpg に置くと、自動で写真に切り替わる（lib/photos.ts）。

type Paint = { satin: string; fold: string; shade: string }

const LINE = '#8f939a'
const LINE_SOFT = '#b9bcc1'

const LOOP = 'M-10 -8C-50 -62 -128 -70 -138 -18C-144 22 -112 52 -70 42C-42 35 -22 18 -10 8Z'
const LOOP_FOLD = 'M-12 -3C-46 -34 -96 -42 -118 -14C-98 -24 -52 -14 -12 6Z'
const LOOP_CREASE = 'M-22 2C-52 4 -88 18 -108 30'
const KNOT = 'M-16 -17C-6 -21 6 -21 16 -17C21 -6 21 8 16 19C6 23 -6 23 -16 19C-21 8 -21 -6 -16 -17Z'

const TAILS: Record<'short' | 'mid' | 'long', [string, string]> = {
  short: [
    'M-8 10C-16 34 -30 60 -44 84L-26 80L-16 94C-8 66 0 38 6 12Z',
    'M8 10C18 36 30 62 42 88L24 82L14 96C8 68 2 40 -4 12Z',
  ],
  mid: [
    'M-8 10C-22 52 -46 96 -70 138L-44 134L-30 150C-14 104 -2 58 6 12Z',
    'M8 10C24 56 44 100 62 146L38 138L22 152C14 106 4 58 -4 12Z',
  ],
  long: [
    'M-8 10C-26 78 -54 150 -66 226L-40 214L-26 234C-16 160 -4 84 6 12Z',
    'M8 10C28 82 50 156 56 240L32 226L14 244C12 166 4 86 -4 12Z',
  ],
}

function Bow({ paint, tails = 'mid' }: { paint: Paint; tails?: keyof typeof TAILS }) {
  const [left, right] = TAILS[tails]
  const stroke = { stroke: LINE, strokeWidth: 1.4, strokeLinejoin: 'round' as const }
  return (
    <g>
      <path d={left} fill={paint.shade} {...stroke} />
      <path d={right} fill={paint.shade} {...stroke} />
      {[1, -1].map((side) => (
        <g key={side} transform={`scale(${side} 1)`}>
          <path d={LOOP} fill={paint.satin} {...stroke} />
          <path d={LOOP_FOLD} fill={paint.fold} opacity="0.75" />
          <path d={LOOP_CREASE} fill="none" stroke={LINE_SOFT} strokeWidth="1.2" strokeLinecap="round" />
        </g>
      ))}
      <path d={KNOT} fill={paint.satin} {...stroke} />
      <path d="M-7 -14C-9 -4 -9 8 -7 17M7 -14C9 -4 9 8 7 17" fill="none" stroke={LINE_SOFT} strokeWidth="1.2" strokeLinecap="round" />
    </g>
  )
}

function Earring({ paint, pearl, x, pearlFill }: { paint: Paint; pearl: boolean; x: number; pearlFill: string }) {
  return (
    <g transform={`translate(${x} 232)`}>
      <path d="M0 -24C0 -64 -30 -70 -30 -42" fill="none" stroke={LINE} strokeWidth="2" strokeLinecap="round" />
      <circle cy="-22" r="4" fill="#fff" stroke={LINE} strokeWidth="1.4" />
      <g transform="scale(0.56)">
        <Bow paint={paint} tails="short" />
      </g>
      {pearl && (
        <g>
          <path d="M0 12V30" stroke={LINE} strokeWidth="1.4" />
          <circle cy="44" r="14" fill={pearlFill} stroke={LINE} strokeWidth="1.2" />
        </g>
      )}
    </g>
  )
}

/** 4:5 の色面にリボンのイラストを置く。variant はイヤリングのパールの有無など、同じ kind の描き分け */
export function Art({ kind, plate, variant = 0 }: { kind: ArtKind; plate: string; variant?: number }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  const paint: Paint = { satin: `url(#${id}-satin)`, fold: `url(#${id}-fold)`, shade: `url(#${id}-shade)` }
  const stroke = { stroke: LINE, strokeWidth: 1.4, strokeLinejoin: 'round' as const }

  return (
    <svg viewBox="0 0 400 500" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}-satin`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#f6f6f4" />
          <stop offset="1" stopColor="#dfe0e1" />
        </linearGradient>
        <linearGradient id={`${id}-fold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d9dadc" />
          <stop offset="1" stopColor="#eeeeec" />
        </linearGradient>
        <linearGradient id={`${id}-shade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e2e3e4" />
          <stop offset="1" stopColor="#fafaf9" />
        </linearGradient>
        <radialGradient id={`${id}-pearl`} cx="0.36" cy="0.32" r="0.8">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.6" stopColor="#f1efea" />
          <stop offset="1" stopColor="#d2d0cb" />
        </radialGradient>
        <radialGradient id={`${id}-glow`} cx="0.5" cy="0.42" r="0.6">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>

      <rect width="400" height="500" fill={plate} />
      <rect width="400" height="500" fill={`url(#${id}-glow)`} />

      {kind === 'bow' && (
        <g>
          <ellipse cx="200" cy="408" rx="96" ry="10" fill="#3c4048" opacity="0.16" filter={`url(#${id}-blur)`} />
          <g transform="translate(200 196) scale(1.08)">
            <Bow paint={paint} tails="long" />
          </g>
        </g>
      )}

      {kind === 'hair' && (
        <g>
          <ellipse cx="200" cy="392" rx="110" ry="10" fill="#3c4048" opacity="0.16" filter={`url(#${id}-blur)`} />
          <g transform="translate(200 224) scale(1.22)">
            <Bow paint={paint} tails="mid" />
          </g>
        </g>
      )}

      {kind === 'earrings' && (
        <g>
          <ellipse cx="200" cy="356" rx="120" ry="9" fill="#3c4048" opacity="0.14" filter={`url(#${id}-blur)`} />
          <Earring paint={paint} pearl={variant === 1} x={128} pearlFill={`url(#${id}-pearl)`} />
          <Earring paint={paint} pearl={variant === 1} x={272} pearlFill={`url(#${id}-pearl)`} />
        </g>
      )}

      {kind === 'bag' && (
        <g>
          <ellipse cx="200" cy="412" rx="118" ry="11" fill="#3c4048" opacity="0.18" filter={`url(#${id}-blur)`} />
          <g transform="translate(200 258)">
            <path d="M-52 -22C-52 -112 52 -112 52 -22" fill="none" stroke={LINE} strokeWidth="13" strokeLinecap="round" />
            <path d="M-52 -22C-52 -112 52 -112 52 -22" fill="none" stroke="#f4f4f2" strokeWidth="10" strokeLinecap="round" />
            <path
              d="M-82 -22H82C89 -22 93 -17 94 -10L106 112C108 128 99 138 84 138H-84C-99 138 -108 128 -106 112L-94 -10C-93 -17 -89 -22 -82 -22Z"
              fill={paint.satin}
              {...stroke}
            />
            <path d="M-92 4H92" stroke={LINE_SOFT} strokeWidth="1.2" strokeDasharray="3 5" />
            <g transform="translate(0 62) scale(0.62)">
              <Bow paint={paint} tails="short" />
            </g>
          </g>
        </g>
      )}

      {kind === 'blouse' && (
        <g>
          <ellipse cx="200" cy="420" rx="124" ry="10" fill="#3c4048" opacity="0.16" filter={`url(#${id}-blur)`} />
          <g transform="translate(200 246)">
            <path
              d="M-46 -112C-30 -100 30 -100 46 -112L112 -86C124 -80 132 -70 136 -58L162 34L118 52L98 -8V152C98 158 94 162 88 162H-88C-94 162 -98 158 -98 152V-8L-118 52L-162 34L-136 -58C-132 -70 -124 -80 -112 -86Z"
              fill={paint.satin}
              {...stroke}
            />
            <path d="M-46 -112C-34 -92 -18 -78 0 -72C18 -78 34 -92 46 -112" fill="none" {...stroke} />
            <path d="M0 -40V162" stroke={LINE_SOFT} strokeWidth="1.2" />
            <path d="M-98 -8C-92 -30 -90 -52 -96 -72M98 -8C92 -30 90 -52 96 -72" fill="none" stroke={LINE_SOFT} strokeWidth="1.2" strokeLinecap="round" />
            {[8, 46, 84, 122].map((y) => (
              <circle key={y} cx="0" cy={y} r="2.6" fill="#fff" stroke={LINE_SOFT} strokeWidth="1" />
            ))}
            <g transform="translate(0 -62) scale(0.5)">
              <Bow paint={paint} tails="mid" />
            </g>
          </g>
        </g>
      )}
    </svg>
  )
}
