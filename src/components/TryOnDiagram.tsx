// AI試着の流れを示す図（写真 ＋ 作品 → つけたイメージ）。

function Portrait({ withBow = false }: { withBow?: boolean }) {
  return (
    <svg viewBox="0 0 120 150" aria-hidden="true">
      <rect width="120" height="150" fill="#e6e3dc" />
      <path d="M12 150C12 118 34 104 60 104C86 104 108 118 108 150Z" fill="#fbfaf7" stroke="#9a9da3" strokeWidth="1.2" />
      <path d="M50 92V108C50 114 70 114 70 108V92" fill="#f3efe8" stroke="#9a9da3" strokeWidth="1.2" />
      <ellipse cx="60" cy="66" rx="25" ry="30" fill="#f6f2eb" stroke="#9a9da3" strokeWidth="1.2" />
      <path
        d="M35 66C31 38 45 26 60 26C78 26 90 40 85 68C82 54 76 46 66 44C54 46 42 50 35 66Z"
        fill="#4a4e55"
      />
      {withBow && (
        <g transform="translate(86 80) scale(0.16)">
          <path d="M-10 -8C-50 -62 -128 -70 -138 -18C-144 22 -112 52 -70 42C-42 35 -22 18 -10 8Z" fill="#fff" stroke="#d4432b" strokeWidth="9" />
          <path d="M10 -8C50 -62 128 -70 138 -18C144 22 112 52 70 42C42 35 22 18 10 8Z" fill="#fff" stroke="#d4432b" strokeWidth="9" />
          <path d="M-8 10C-16 34 -30 60 -44 84L-16 94C-8 66 0 38 6 12ZM8 10C18 36 30 62 42 88L14 96C8 68 2 40 -4 12Z" fill="#fff" stroke="#d4432b" strokeWidth="9" />
          <circle r="18" fill="#fff" stroke="#d4432b" strokeWidth="9" />
        </g>
      )}
    </svg>
  )
}

function BowTile() {
  return (
    <svg viewBox="0 0 120 150" aria-hidden="true">
      <rect width="120" height="150" fill="#e4e6e8" />
      <g transform="translate(60 66) scale(0.34)" stroke="#8f939a" strokeWidth="4" strokeLinejoin="round">
        <path d="M-8 10C-22 52 -46 96 -70 138L-44 134L-30 150C-14 104 -2 58 6 12Z" fill="#eeeeed" />
        <path d="M8 10C24 56 44 100 62 146L38 138L22 152C14 106 4 58 -4 12Z" fill="#eeeeed" />
        <path d="M-10 -8C-50 -62 -128 -70 -138 -18C-144 22 -112 52 -70 42C-42 35 -22 18 -10 8Z" fill="#fff" />
        <path d="M10 -8C50 -62 128 -70 138 -18C144 22 112 52 70 42C42 35 22 18 10 8Z" fill="#fff" />
        <path d="M-16 -17C-6 -21 6 -21 16 -17C21 -6 21 8 16 19C6 23 -6 23 -16 19C-21 8 -21 -6 -16 -17Z" fill="#fff" />
      </g>
    </svg>
  )
}

export function TryOnDiagram({ labels }: { labels: [string, string, string] }) {
  return (
    <div className="tryflow" role="img" aria-label={labels.join(' + ')}>
      <figure className="tryflow__tile">
        <Portrait />
        <figcaption>{labels[0]}</figcaption>
      </figure>
      <span className="tryflow__op">+</span>
      <figure className="tryflow__tile">
        <BowTile />
        <figcaption>{labels[1]}</figcaption>
      </figure>
      <span className="tryflow__op">→</span>
      <figure className="tryflow__tile tryflow__tile--result">
        <Portrait withBow />
        <figcaption>{labels[2]}</figcaption>
      </figure>
    </div>
  )
}
