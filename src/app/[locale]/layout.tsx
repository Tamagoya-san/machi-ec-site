import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, IBM_Plex_Mono, Noto_Serif_TC, Shippori_Mincho, Zen_Kaku_Gothic_New } from 'next/font/google'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { I18nProvider } from '@/i18n/client'
import { htmlLang, locales } from '@/i18n/config'
import { getI18n } from '@/i18n/server'
import { CartProvider } from '@/lib/cart'
import { siteUrl } from '@/lib/site'
import '@/styles/base.css'
import '@/styles/map.css'
import '@/styles/home.css'
import '@/styles/lp.css'
import '@/styles/shop.css'
import '@/styles/tryon.css'

// フォントはビルド時に取得して自ドメインから配信する（外部への通信なし）
const latin = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--f-latin',
  display: 'swap',
})
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--f-mono', display: 'swap' })
const mincho = Shippori_Mincho({ weight: ['500'], variable: '--f-mincho', display: 'swap', preload: false })
const gothic = Zen_Kaku_Gothic_New({ weight: ['400', '500'], variable: '--f-gothic', display: 'swap', preload: false })
// 繁體中文の見出し用。本文は端末の書体（PingFang TC など）を使う
const tcSerif = Noto_Serif_TC({ weight: ['500'], variable: '--f-tc-serif', display: 'swap', preload: false })

// ja / zh 以外のロケールは 404 にする
export const dynamicParams = false

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata(): Promise<Metadata> {
  const { d, locale } = await getI18n()
  return {
    metadataBase: new URL(siteUrl),
    title: { default: d.meta.title, template: '%s — Machi Atlas' },
    description: d.meta.description,
    // テスト公開中は検索結果に出さない
    robots: { index: false, follow: false },
    icons: { icon: '/favicon.svg' },
    openGraph: {
      siteName: 'Machi Atlas',
      type: 'website',
      locale: locale === 'zh' ? 'zh_TW' : 'ja_JP',
      title: d.meta.title,
      description: d.meta.description,
    },
    formatDetection: { telephone: false, address: false, email: false },
  }
}

export const viewport: Viewport = {
  themeColor: '#f5f3ee',
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({ children }: LayoutProps<'/[locale]'>) {
  const { locale } = await getI18n()
  const fonts = [latin, mono, mincho, gothic, tcSerif].map((font) => font.variable).join(' ')

  return (
    <html lang={htmlLang[locale]} className={fonts}>
      <body>
        <I18nProvider locale={locale}>
          <CartProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
