import { notFound } from 'next/navigation'
import { locale as rootLocale } from 'next/root-params'
import type { Text } from '@/content/types'
import { href, isLocale, type Locale } from './config'
import { dictionaries, type Dict } from './dict'

export type I18n = {
  locale: Locale
  d: Dict
  /** 対訳テキストから現在の言語を取り出す */
  t: (text: Text) => string
  /** 現在の言語のパスを作る */
  to: (path: string) => string
}

/** Server Component 用。URL先頭のロケールを読み、辞書とヘルパーを返す */
export async function getI18n(): Promise<I18n> {
  const value = await rootLocale()
  if (!isLocale(value)) notFound()
  return {
    locale: value,
    d: dictionaries[value],
    t: (text) => text[value],
    to: (path) => href(path, value),
  }
}
