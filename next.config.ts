import type { NextConfig } from 'next'

const isDev = process.env.NODE_ENV !== 'production'

// 静的生成を保つため nonce は使わず、Next.js が埋め込むインラインスクリプトを許可する。
// 外部ドメインの読み込みは一切許可しない（フォントも画像も自ドメインのみ）。
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? ' ws:' : ''}`,
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  // テスト公開中は検索結果に出さない。本番公開時にこの行を外す。
  { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive, nosnippet, noimageindex' },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  // AI試着のAPIが、登録された商品写真（public/photos/items）を参照画像として読めるようにする
  outputFileTracingIncludes: {
    '/api/try-on': ['./public/photos/items/**/*'],
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
  async redirects() {
    return [
      // 入口：ブラウザの言語が中国語なら繁體中文、それ以外は日本語へ
      {
        source: '/',
        has: [{ type: 'header', key: 'accept-language', value: 'zh.*' }],
        destination: '/zh',
        permanent: false,
      },
      { source: '/', destination: '/ja', permanent: false },
    ]
  },
}

export default nextConfig
