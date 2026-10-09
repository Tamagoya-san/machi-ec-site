export function HeroVisual() {
  return (
    <svg className="hero-visual" viewBox="0 0 520 520" role="img" aria-label="東京と台北をつなぐ雲の空">
      <defs>
        <radialGradient id="hero-sky" cx="0.45" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#e3f0f9" />
          <stop offset="1" stopColor="#c7e0f1" />
        </radialGradient>
        <linearGradient id="hero-island" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6d8dc" />
          <stop offset="1" stopColor="#e7a6b0" />
        </linearGradient>
      </defs>
      <circle cx="260" cy="260" r="236" fill="url(#hero-sky)" />

      <g className="hero-visual__cloud hero-visual__cloud--a" fill="#fff">
        <path d="M70 200a34 34 0 0 1 18-64 46 46 0 0 1 86-10 34 34 0 0 1 50 60 30 30 0 0 1-12 14z" />
      </g>
      <g className="hero-visual__cloud hero-visual__cloud--b" fill="#fff" opacity="0.9">
        <path d="M300 350a28 28 0 0 1 14-52 38 38 0 0 1 72-8 28 28 0 0 1 42 50 24 24 0 0 1-10 10z" />
      </g>

      <path
        d="M380 128C330 170 250 210 196 300"
        fill="none"
        stroke="#8fbcd9"
        strokeWidth="2.5"
        strokeDasharray="2 10"
        strokeLinecap="round"
      />
      <g transform="translate(296 192) rotate(-36)">
        <path d="M-16 0l32-6-4 6 4 6z" fill="#3c4657" />
        <path d="M-2 -2l-10-12h6l12 10zM-2 2l-10 12h6l12-10z" fill="#3c4657" />
      </g>

      <circle cx="380" cy="128" r="8" fill="#3c4657" />
      <circle cx="380" cy="128" r="18" fill="none" stroke="#3c4657" strokeWidth="1.5" opacity="0.4" />
      <text x="400" y="116" fontSize="15" letterSpacing="5" fill="#3c4657" className="hero-visual__label">
        TOKYO
      </text>
      <text x="400" y="136" fontSize="12" fill="#7d8798">東京</text>

      <path
        d="M202 282c10-10 22-12 28-4 6 10 2 30-4 50-6 22-14 46-24 62-6 10-14 8-16-2-4-22-8-48-6-70 0-16 10-28 22-36z"
        fill="url(#hero-island)"
        stroke="#3c4657"
        strokeWidth="2"
      />
      <circle cx="222" cy="290" r="6" fill="#3c4657" />
      <text x="110" y="300" fontSize="15" letterSpacing="5" fill="#3c4657" className="hero-visual__label">
        TAIPEI
      </text>
      <text x="110" y="320" fontSize="12" fill="#7d8798">台北</text>

      <text x="260" y="470" textAnchor="middle" fontSize="12" letterSpacing="6" fill="#7d8798">
        2,100 km of stories
      </text>
    </svg>
  )
}
