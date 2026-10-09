import { useId } from 'react'
import type { Motif, Product } from '../data/products'

const INK = '#3c4657'
const ROSE = '#e7a6b0'
const SKY = '#8fbcd9'
const GOLD = '#e7c27d'

function MotifShape({ motif }: { motif: Motif }) {
  switch (motif) {
    case 'tea':
      return (
        <g>
          <ellipse cx="200" cy="300" rx="78" ry="14" fill={INK} opacity="0.08" />
          <rect x="132" y="130" width="136" height="170" rx="14" fill="#fbfcfe" stroke={INK} strokeWidth="3" />
          <ellipse cx="200" cy="130" rx="68" ry="14" fill="#eef4ee" stroke={INK} strokeWidth="3" />
          <rect x="132" y="180" width="136" height="70" fill="#9fc6a4" opacity="0.8" />
          <path d="M200 196c18 6 26 22 20 40-18-4-28-20-20-40z" fill="#fbfcfe" />
          <path d="M200 196c-14 10-16 26-8 40" stroke="#fbfcfe" strokeWidth="3" fill="none" />
          <text x="200" y="278" textAnchor="middle" fontSize="15" fill={INK} letterSpacing="4">ALISHAN</text>
          <path d="M150 104c6-14 2-22 8-34M200 100c6-14 2-22 8-34M248 104c6-14 2-22 8-34" stroke={INK} strokeWidth="2.5" fill="none" opacity="0.35" strokeLinecap="round" />
        </g>
      )
    case 'cake':
      return (
        <g>
          <ellipse cx="200" cy="300" rx="110" ry="14" fill={INK} opacity="0.08" />
          <rect x="96" y="150" width="208" height="146" rx="10" fill="#fbfcfe" stroke={INK} strokeWidth="3" />
          {[0, 1, 2].map((c) =>
            [0, 1].map((r) => (
              <g key={`${c}-${r}`}>
                <rect x={114 + c * 62} y={168 + r * 62} width="50" height="50" rx="6" fill={GOLD} stroke={INK} strokeWidth="2" />
                <rect x={122 + c * 62} y={176 + r * 62} width="34" height="34" rx="4" fill="#f2d59b" />
              </g>
            )),
          )}
          <path d="M200 92l10 22h-20z" fill="#9fc6a4" />
          <path d="M200 96c-16-4-26 4-30 14 14 0 24-4 30-14zM200 96c16-4 26 4 30 14-14 0-24-4-30-14z" fill="#9fc6a4" />
          <ellipse cx="200" cy="130" rx="18" ry="16" fill={GOLD} stroke={INK} strokeWidth="2.5" />
        </g>
      )
    case 'candy':
      return (
        <g>
          <ellipse cx="200" cy="296" rx="110" ry="12" fill={INK} opacity="0.08" />
          {[
            [130, 180, -14],
            [230, 160, 12],
            [180, 250, 4],
            [270, 245, -10],
          ].map(([x, y, r], i) => (
            <g key={i} transform={`rotate(${r} ${x} ${y})`}>
              <path d={`M${x - 52} ${y - 16}l18 16-18 16zM${x + 52} ${y - 16}l-18 16 18 16z`} fill={ROSE} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
              <rect x={x - 36} y={y - 20} width="72" height="40" rx="8" fill="#fbfcfe" stroke={INK} strokeWidth="2.5" />
              <circle cx={x - 14} cy={y} r="4" fill="#c99a6b" />
              <circle cx={x + 6} cy={y - 6} r="3.5" fill="#c99a6b" />
              <circle cx={x + 16} cy={y + 6} r="3" fill="#c99a6b" />
            </g>
          ))}
        </g>
      )
    case 'pouch':
      return (
        <g>
          <ellipse cx="200" cy="300" rx="104" ry="12" fill={INK} opacity="0.08" />
          <path d="M100 170q0-30 30-30h140q30 0 30 30v90q0 36-36 36H136q-36 0-36-36z" fill="#d9475b" stroke={INK} strokeWidth="3" />
          {[
            [140, 190, 22],
            [220, 176, 16],
            [262, 238, 22],
            [170, 258, 18],
            [208, 222, 10],
          ].map(([x, y, r], i) => (
            <g key={i}>
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse key={a} cx={x} cy={y - r * 0.55} rx={r * 0.38} ry={r * 0.6} fill="#f6b8c3" transform={`rotate(${a} ${x} ${y})`} />
              ))}
              <circle cx={x} cy={y} r={r * 0.28} fill={GOLD} />
            </g>
          ))}
          <path d="M120 152h160" stroke={INK} strokeWidth="5" strokeLinecap="round" />
          <path d="M280 152c18 0 24 16 14 26" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      )
    case 'bag':
      return (
        <g>
          <ellipse cx="200" cy="304" rx="106" ry="12" fill={INK} opacity="0.08" />
          <path d="M150 160c0-50 100-50 100 0" stroke={INK} strokeWidth="6" fill="none" strokeLinecap="round" />
          <clipPath id="bag-clip">
            <path d="M112 160h176l-14 140H126z" />
          </clipPath>
          <g clipPath="url(#bag-clip)">
            {['#d9475b', '#fbfcfe', '#4f7fb5', '#fbfcfe', '#5ea37a', '#fbfcfe', '#d9475b', '#fbfcfe', '#4f7fb5'].map((c, i) => (
              <rect key={i} x="100" y={160 + i * 16} width="200" height="16" fill={c} />
            ))}
          </g>
          <path d="M112 160h176l-14 140H126z" fill="none" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        </g>
      )
    case 'tile':
      return (
        <g>
          {[
            [92, 120, -6],
            [196, 150, 8],
          ].map(([x, y, r], i) => (
            <g key={i} transform={`rotate(${r} ${x + 56} ${y + 56})`}>
              <rect x={x} y={y} width="112" height="112" rx="8" fill="#fbfcfe" stroke={INK} strokeWidth="3" />
              <circle cx={x + 56} cy={y + 56} r="34" fill="none" stroke={SKY} strokeWidth="6" />
              {[0, 90, 180, 270].map((a) => (
                <ellipse key={a} cx={x + 56} cy={y + 34} rx="9" ry="16" fill={i === 0 ? ROSE : '#9fc6a4'} transform={`rotate(${a} ${x + 56} ${y + 56})`} />
              ))}
              <circle cx={x + 56} cy={y + 56} r="7" fill={GOLD} />
              {[
                [x, y],
                [x + 112, y],
                [x, y + 112],
                [x + 112, y + 112],
              ].map(([cx, cy], k) => (
                <circle key={k} cx={cx} cy={cy} r="16" fill={SKY} opacity="0.45" />
              ))}
            </g>
          ))}
        </g>
      )
    case 'book':
      return (
        <g>
          <ellipse cx="206" cy="306" rx="96" ry="12" fill={INK} opacity="0.08" />
          <rect x="128" y="96" width="156" height="206" rx="6" fill="#c9d9e8" stroke={INK} strokeWidth="3" />
          <rect x="118" y="90" width="156" height="206" rx="6" fill="#fbfcfe" stroke={INK} strokeWidth="3" />
          <rect x="138" y="112" width="116" height="110" rx="4" fill="#dbe9f6" />
          <path d="M156 196a18 18 0 0 1 10-32 24 24 0 0 1 44-4 18 18 0 0 1 26 30z" fill="#fbfcfe" />
          <circle cx="232" cy="134" r="8" fill="#fbfcfe" opacity="0.9" />
          <text x="196" y="252" textAnchor="middle" fontSize="16" fill={INK} letterSpacing="3">雲のむこうへ</text>
          <text x="196" y="274" textAnchor="middle" fontSize="10" fill={INK} letterSpacing="4" opacity="0.6">MACHI PHOTOBOOK</text>
        </g>
      )
    case 'postcard':
      return (
        <g>
          {[
            [-12, '#fbeee4'],
            [6, '#e3eef6'],
            [-2, '#fbfcfe'],
          ].map(([r, fill], i) => (
            <g key={i} transform={`rotate(${r} 200 200)`}>
              <rect x="96" y={130 + i * 10} width="208" height="140" rx="4" fill={fill as string} stroke={INK} strokeWidth="2.5" />
            </g>
          ))}
          <g transform="rotate(-2 200 200)">
            <rect x="112" y="166" width="120" height="92" fill="#dbe9f6" />
            <path d="M112 258l36-40 26 24 22-30 36 46z" fill="#9fc6a4" />
            <circle cx="206" cy="190" r="10" fill={GOLD} />
            <rect x="252" y="166" width="34" height="40" fill="none" stroke={ROSE} strokeWidth="2.5" strokeDasharray="4 3" />
            <path d="M246 228h44M246 242h44" stroke={INK} strokeWidth="2" opacity="0.4" />
          </g>
        </g>
      )
    case 'sticker':
      return (
        <g>
          <circle cx="150" cy="160" r="54" fill="#fbfcfe" stroke={INK} strokeWidth="3" />
          <text x="150" y="168" textAnchor="middle" fontSize="20" fill={INK}>說故事</text>
          <circle cx="258" cy="150" r="38" fill="#dbe9f6" stroke={INK} strokeWidth="3" />
          <circle cx="248" cy="138" r="9" fill="#fbfcfe" />
          <path d="M218 268a22 22 0 0 1 12-40 30 30 0 0 1 56-6 22 22 0 0 1 32 38z" fill="#fbfcfe" stroke={INK} strokeWidth="3" />
          <rect x="98" y="232" width="92" height="62" rx="12" fill={ROSE} stroke={INK} strokeWidth="3" transform="rotate(-8 144 263)" />
          <text x="144" y="270" textAnchor="middle" fontSize="16" fill="#fbfcfe" transform="rotate(-8 144 263)">TAIWAN</text>
        </g>
      )
    case 'stand':
      return (
        <g>
          <ellipse cx="200" cy="306" rx="70" ry="14" fill="#fbfcfe" stroke={INK} strokeWidth="3" opacity="0.9" />
          <rect x="132" y="80" width="136" height="222" rx="16" fill="#fbfcfe" opacity="0.55" stroke={INK} strokeWidth="2" />
          <circle cx="200" cy="136" r="28" fill="#4a3f45" />
          <circle cx="200" cy="142" r="22" fill="#fbe9e2" />
          <path d="M176 128q24-26 48 0" fill="#4a3f45" />
          <circle cx="222" cy="120" r="7" fill={ROSE} />
          <path d="M164 290l12-112q24-10 48 0l12 112z" fill="#f3d3d6" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          <rect x="170" y="206" width="60" height="12" fill={SKY} />
          {[
            [184, 246],
            [214, 266],
            [196, 278],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="6" fill="#fbfcfe" />
          ))}
        </g>
      )
    case 'towel':
      return (
        <g>
          <ellipse cx="200" cy="300" rx="112" ry="12" fill={INK} opacity="0.08" />
          <rect x="96" y="180" width="208" height="112" rx="10" fill="#fbfcfe" stroke={INK} strokeWidth="3" />
          <rect x="96" y="150" width="208" height="56" rx="10" fill="#e3eef6" stroke={INK} strokeWidth="3" />
          <path d="M96 236q26-12 52 0t52 0 52 0 52 0" stroke={SKY} strokeWidth="5" fill="none" />
          <path d="M96 258q26-12 52 0t52 0 52 0 52 0" stroke={ROSE} strokeWidth="5" fill="none" />
          <g stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round">
            <path d="M184 112c-8-10 8-18 0-28M200 112c-8-10 8-18 0-28M216 112c-8-10 8-18 0-28" />
            <path d="M170 124q30 18 60 0" />
          </g>
        </g>
      )
    case 'notebook':
      return (
        <g>
          <ellipse cx="200" cy="304" rx="110" ry="12" fill={INK} opacity="0.08" />
          {[0, 1, 2, 3].map((i) => (
            <path
              key={i}
              d={`M${100 + i * 52} ${150 + (i % 2) * 10}l52 ${i % 2 ? -10 : 10}v130l-52 ${i % 2 ? 10 : -10}z`}
              fill={i % 2 ? '#fbf3ef' : '#fbfcfe'}
              stroke={INK}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          ))}
          <circle cx="178" cy="214" r="26" fill="none" stroke="#c8414f" strokeWidth="4" />
          <text x="178" y="221" textAnchor="middle" fontSize="18" fill="#c8414f">廟</text>
          <rect x="226" y="196" width="34" height="34" fill="none" stroke="#c8414f" strokeWidth="3.5" transform="rotate(6 243 213)" />
          <text x="243" y="220" textAnchor="middle" fontSize="13" fill="#c8414f" transform="rotate(6 243 213)">台</text>
        </g>
      )
  }
}

export function ProductArt({ product, className }: { product: Product; className?: string }) {
  const id = useId()
  const [from, to] = product.art.palette
  return (
    <svg className={className} viewBox="0 0 400 400" role="img" aria-label={`${product.name}のイメージ`}>
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill={`url(#${id}-bg)`} />
      <circle cx="330" cy="70" r="26" fill="#fff" opacity="0.5" />
      <circle cx="356" cy="112" r="10" fill="#fff" opacity="0.6" />
      <circle cx="60" cy="330" r="16" fill="#fff" opacity="0.5" />
      <MotifShape motif={product.art.motif} />
    </svg>
  )
}
