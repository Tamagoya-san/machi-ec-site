import { locales, type Locale, type Text } from '@/content/types'

export { locales }
export type { Locale }

export const defaultLocale: Locale = 'ja'

export const isLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value)

/** <html lang> に入れる言語タグ */
export const htmlLang: Record<Locale, string> = { ja: 'ja', zh: 'zh-Hant-TW' }

/** 言語切り替えに表示する名前 */
export const localeNames: Record<Locale, string> = { ja: '日本語', zh: '繁體中文' }

export const pick = (text: Text, locale: Locale): string => text[locale]

/** ロケール付きのパスを作る。href('/map', 'zh') → '/zh/map' */
export const href = (path: string, locale: Locale): string => `/${locale}${path === '/' ? '' : path}`
