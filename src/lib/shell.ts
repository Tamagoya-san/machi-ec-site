import { useEffect, useState } from 'react'

export const designs = [
  { id: 'a', label: 'A' },
  { id: 'b', label: 'B' },
] as const
export type DesignId = (typeof designs)[number]['id']

export function useMenu() {
  const [isOpen, setOpen] = useState(false)
  useEffect(() => {
    document.body.classList.toggle('menu-open', isOpen)
  }, [isOpen])
  return { isOpen, toggle: () => setOpen((v) => !v), close: () => setOpen(false) }
}
