import 'server-only'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

// 商品写真の差し替え口。
// public/photos/items/{商品ID}.jpg（png / webp も可）を置くと、イラストの代わりに写真を表示し、
// AI試着でも参照画像として使う。

const EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'] as const

const MIME: Record<(typeof EXTENSIONS)[number], string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
}

export type ItemPhoto = { url: string; file: string; mime: string }

export function findItemPhoto(id: string): ItemPhoto | null {
  for (const ext of EXTENSIONS) {
    const file = join(process.cwd(), 'public', 'photos', 'items', `${id}.${ext}`)
    if (existsSync(file)) return { url: `/photos/items/${id}.${ext}`, file, mime: MIME[ext] }
  }
  return null
}
