'use client'

import { createContext, use, useMemo, type ReactNode } from 'react'
import type { Text } from '@/content/types'
import { href, type Locale } from './config'
import { dictionaries, type Dict } from './dict'

type Value = {
  locale: Locale
  d: Dict
  t: (text: Text) => string
  to: (path: string) => string
}

const I18nContext = createContext<Value | null>(null)

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const value = useMemo<Value>(
    () => ({
      locale,
      d: dictionaries[locale],
      t: (text) => text[locale],
      to: (path) => href(path, locale),
    }),
    [locale],
  )
  return <I18nContext value={value}>{children}</I18nContext>
}

/** Client Component 用 */
export function useI18n(): Value {
  const value = use(I18nContext)
  if (!value) throw new Error('useI18n は I18nProvider の内側で使ってください')
  return value
}
