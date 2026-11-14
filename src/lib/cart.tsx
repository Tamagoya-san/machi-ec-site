'use client'

import { createContext, use, useCallback, useMemo, useSyncExternalStore, type ReactNode } from 'react'
import { z } from 'zod'
import { getProduct } from '@/content'
import type { Product } from '@/content/types'

// カートは「商品ID・タイプ・数量」だけを localStorage に持つ。
// 価格は必ずカタログ（src/content）から引き直すので、保存データを書き換えても金額は変わらない。

const KEY = 'machi-atlas:cart:v1'
const MAX_QTY = 10

const lineSchema = z.object({
  id: z.string().min(1).max(80),
  variant: z.string().max(40).nullable(),
  qty: z.number().int().min(1).max(MAX_QTY),
})
const cartSchema = z.array(lineSchema).max(50)

export type CartLine = z.infer<typeof lineSchema>
export type ResolvedLine = CartLine & { product: Product; lineTotal: number }

/** 国内送料（TEEENU公式ショップの現行条件をもとにした仮の設定） */
export const SHIPPING = { fee: 550, freeFrom: 10000 }

const EMPTY: CartLine[] = []
let cache: { raw: string | null; lines: CartLine[] } = { raw: null, lines: EMPTY }
const listeners = new Set<() => void>()

function read(): CartLine[] {
  let raw: string | null = null
  try {
    raw = window.localStorage.getItem(KEY)
  } catch {
    return EMPTY
  }
  if (raw === cache.raw) return cache.lines
  let lines: CartLine[] = EMPTY
  if (raw) {
    try {
      const parsed = cartSchema.safeParse(JSON.parse(raw))
      // カタログに無い商品・存在しないタイプの行は捨てる
      if (parsed.success) lines = parsed.data.filter(isValidLine)
    } catch {
      lines = EMPTY
    }
  }
  cache = { raw, lines }
  return lines
}

function isValidLine(line: CartLine): boolean {
  const product = getProduct(line.id)
  if (!product) return false
  if (!product.variants) return line.variant === null
  return product.variants.some((v) => v.id === line.variant)
}

function write(lines: CartLine[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(lines))
  } catch {
    // 保存できない環境（プライベートブラウズ等）でも、表示中の状態は保つ
    cache = { raw: cache.raw, lines }
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  window.addEventListener('storage', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', listener)
  }
}

type CartValue = {
  /** localStorage を読み終えるまでは false（サーバー描画との食い違いを避ける） */
  ready: boolean
  lines: ResolvedLine[]
  count: number
  subtotal: number
  shipping: number
  total: number
  add: (id: string, variant: string | null, qty: number) => void
  setQty: (id: string, variant: string | null, qty: number) => void
  remove: (id: string, variant: string | null) => void
  clear: () => void
}

const CartContext = createContext<CartValue | null>(null)

const same = (line: CartLine, id: string, variant: string | null) => line.id === id && line.variant === variant
const clamp = (qty: number) => Math.max(1, Math.min(MAX_QTY, Math.round(qty)))

export function CartProvider({ children }: { children: ReactNode }) {
  const stored = useSyncExternalStore(subscribe, read, () => EMPTY)
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )

  const add = useCallback((id: string, variant: string | null, qty: number) => {
    const lines = read()
    const existing = lines.find((line) => same(line, id, variant))
    const next = existing
      ? lines.map((line) => (same(line, id, variant) ? { ...line, qty: clamp(line.qty + qty) } : line))
      : [...lines, { id, variant, qty: clamp(qty) }]
    write(next.filter(isValidLine))
  }, [])

  const setQty = useCallback((id: string, variant: string | null, qty: number) => {
    write(read().map((line) => (same(line, id, variant) ? { ...line, qty: clamp(qty) } : line)))
  }, [])

  const remove = useCallback((id: string, variant: string | null) => {
    write(read().filter((line) => !same(line, id, variant)))
  }, [])

  const clear = useCallback(() => write([]), [])

  const value = useMemo<CartValue>(() => {
    const lines = stored.flatMap((line) => {
      const product = getProduct(line.id)
      return product ? [{ ...line, product, lineTotal: product.price * line.qty }] : []
    })
    const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0)
    const shipping = lines.length === 0 || subtotal >= SHIPPING.freeFrom ? 0 : SHIPPING.fee
    return {
      ready,
      lines,
      count: lines.reduce((sum, line) => sum + line.qty, 0),
      subtotal,
      shipping,
      total: subtotal + shipping,
      add,
      setQty,
      remove,
      clear,
    }
  }, [stored, ready, add, setQty, remove, clear])

  return <CartContext value={value}>{children}</CartContext>
}

export function useCart(): CartValue {
  const value = use(CartContext)
  if (!value) throw new Error('useCart は CartProvider の内側で使ってください')
  return value
}
