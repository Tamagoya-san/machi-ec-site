import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react'
import { z } from 'zod'
import { findProduct, type Product } from '../data/products'

const STORAGE_KEY = 'machi-shop:cart:v1'
export const MAX_QTY_PER_ITEM = 10
export const FREE_SHIPPING_THRESHOLD = 5000
export const SHIPPING_FEE = 600

// localStorage はユーザーが自由に書き換えられるため、ID と数量だけを保存し、
// 価格や商品名は必ずカタログ側から引き直す（価格改ざん対策）。
const storedLineSchema = z.object({
  productId: z.string().max(64).regex(/^[a-z0-9-]+$/),
  variantId: z.string().max(32).regex(/^[a-z0-9-]+$/).nullable(),
  qty: z.number().int().min(1).max(MAX_QTY_PER_ITEM),
})
const storedCartSchema = z.array(z.unknown()).max(50)

type StoredLine = z.infer<typeof storedLineSchema>

export interface CartLine extends StoredLine {
  key: string
  product: Product
  variantLabel: string | null
  lineTotal: number
}

type Action =
  | { type: 'add'; productId: string; variantId: string | null; qty: number }
  | { type: 'setQty'; key: string; qty: number }
  | { type: 'remove'; key: string }
  | { type: 'clear' }

const lineKey = (productId: string, variantId: string | null) => `${productId}::${variantId ?? '-'}`

const maxQtyFor = (productId: string) => {
  const product = findProduct(productId)
  return product ? Math.min(MAX_QTY_PER_ITEM, product.stock) : 0
}

const isValidLine = (line: StoredLine) => {
  const product = findProduct(line.productId)
  if (!product) return false
  if (product.variants) return product.variants.some((v) => v.id === line.variantId)
  return line.variantId === null
}

const clamp = (qty: number, productId: string) =>
  Math.max(1, Math.min(Math.floor(qty), maxQtyFor(productId)))

function reducer(state: StoredLine[], action: Action): StoredLine[] {
  switch (action.type) {
    case 'add': {
      const candidate = { productId: action.productId, variantId: action.variantId, qty: action.qty }
      if (!isValidLine(candidate) || !Number.isFinite(action.qty)) return state
      const key = lineKey(action.productId, action.variantId)
      const existing = state.find((l) => lineKey(l.productId, l.variantId) === key)
      if (existing) {
        return state.map((l) =>
          l === existing ? { ...l, qty: clamp(l.qty + action.qty, l.productId) } : l,
        )
      }
      return [...state, { ...candidate, qty: clamp(action.qty, action.productId) }]
    }
    case 'setQty':
      if (!Number.isFinite(action.qty)) return state
      return state.map((l) =>
        lineKey(l.productId, l.variantId) === action.key ? { ...l, qty: clamp(action.qty, l.productId) } : l,
      )
    case 'remove':
      return state.filter((l) => lineKey(l.productId, l.variantId) !== action.key)
    case 'clear':
      return []
  }
}

function loadCart(): StoredLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw || raw.length > 10_000) return []
    const parsed = storedCartSchema.safeParse(JSON.parse(raw))
    if (!parsed.success) return []
    return parsed.data.flatMap((item) => {
      const line = storedLineSchema.safeParse(item)
      return line.success && isValidLine(line.data) ? [{ ...line.data, qty: clamp(line.data.qty, line.data.productId) }] : []
    })
  } catch {
    return []
  }
}

interface CartContextValue {
  lines: CartLine[]
  count: number
  subtotal: number
  shipping: number
  total: number
  isOpen: boolean
  add: (productId: string, variantId: string | null, qty?: number) => void
  setQty: (key: string, qty: number) => void
  remove: (key: string) => void
  clear: () => void
  open: () => void
  close: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [stored, dispatch] = useReducer(reducer, undefined, loadCart)
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
    } catch {
      /* ストレージが使えない環境ではメモリ上のみで保持 */
    }
  }, [stored])

  const lines = useMemo<CartLine[]>(
    () =>
      stored.flatMap((l) => {
        const product = findProduct(l.productId)
        if (!product) return []
        const variantLabel = product.variants?.find((v) => v.id === l.variantId)?.label ?? null
        return [{ ...l, key: lineKey(l.productId, l.variantId), product, variantLabel, lineTotal: product.price * l.qty }]
      }),
    [stored],
  )

  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0)
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  const count = lines.reduce((sum, l) => sum + l.qty, 0)

  const add = useCallback((productId: string, variantId: string | null, qty = 1) => {
    dispatch({ type: 'add', productId, variantId, qty })
    setOpen(true)
  }, [])
  const setQty = useCallback((key: string, qty: number) => dispatch({ type: 'setQty', key, qty }), [])
  const remove = useCallback((key: string) => dispatch({ type: 'remove', key }), [])
  const clear = useCallback(() => dispatch({ type: 'clear' }), [])
  const open = useCallback(() => setOpen(true), [])
  const close = useCallback(() => setOpen(false), [])

  const value: CartContextValue = {
    lines,
    count,
    subtotal,
    shipping,
    total: subtotal + shipping,
    isOpen,
    add,
    setQty,
    remove,
    clear,
    open,
    close,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// oxlint-disable-next-line react/only-export-components
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
