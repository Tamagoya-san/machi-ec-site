/** ロゴ（仮称 Machi Atlas）。地図のピンとワードマーク */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={`brand ${className ?? ''}`}>
      <svg className="brand__pin" viewBox="0 0 15 20" aria-hidden="true">
        <path
          d="M7.5 0.8C3.8 0.8 0.9 3.7 0.9 7.3c0 4.7 6.6 11.7 6.6 11.7s6.6-7 6.6-11.7c0-3.6-2.9-6.5-6.6-6.5Z"
          fill="#d4432b"
        />
        <circle cx="7.5" cy="7.3" r="2.3" fill="#fff" />
      </svg>
      <span>
        Machi <em>Atlas</em>
      </span>
    </span>
  )
}
