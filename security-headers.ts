const cspDirectives = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self'",
  "font-src 'self'",
  "connect-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
]

// upgrade-insecure-requests は http://127.0.0.1 の preview を壊すため HTTPS 本番のみ付与する。
export const contentSecurityPolicy = [...cspDirectives, 'upgrade-insecure-requests'].join('; ')
export const localContentSecurityPolicy = cspDirectives.join('; ')

/** CSP 以外のセキュリティヘッダー。開発サーバーでも適用する。 */
export const baseSecurityHeaders: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet, noimageindex',
}

export const previewSecurityHeaders: Record<string, string> = {
  ...baseSecurityHeaders,
  'Content-Security-Policy': localContentSecurityPolicy,
}

export const productionSecurityHeaders: Record<string, string> = {
  ...baseSecurityHeaders,
  'Content-Security-Policy': contentSecurityPolicy,
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains',
}
