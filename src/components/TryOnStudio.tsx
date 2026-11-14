'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState, type DragEvent, type ReactNode } from 'react'
import { useI18n } from '@/i18n/client'
import type { Dict } from '@/i18n/dict'

export type TryOnItem = {
  id: string
  name: string
  hint: string
  /** 商品写真が登録されているか（なければ説明文だけで生成する） */
  hasPhoto: boolean
}

type ErrorKey = keyof Dict['tryOn']['errors'] | 'file_too_large' | 'network'

type Photo = {
  /** 画面表示用のURL（ブラウザ内だけで有効） */
  url: string
  /** 送信用のJPEG（base64） */
  base64: string
  ratio: number
}

type Result = { image: string; item: string }

const MAX_FILE = 10 * 1024 * 1024
/** 送信前に、長辺をこの大きさまで縮小する */
const MAX_SIDE = 1280
const ACCEPT = ['image/jpeg', 'image/png', 'image/webp']

/**
 * 写真をブラウザ内で縮小し、JPEGに描き直す。
 * 描き直すことで、撮影場所などの付帯情報（EXIF）も取り除かれる。
 */
async function prepare(file: File): Promise<Photo> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('canvas')
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, width, height)
  context.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.88))
  if (!blob) throw new Error('encode')
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('read'))
    reader.readAsDataURL(blob)
  })
  return { url: URL.createObjectURL(blob), base64: dataUrl.slice(dataUrl.indexOf(',') + 1), ratio: width / height }
}

export function TryOnStudio({
  items,
  visuals,
  configured,
}: {
  items: TryOnItem[]
  /** 作品ごとの画像（サーバー側で描画したもの） */
  visuals: Record<string, ReactNode>
  configured: boolean
}) {
  const { d, to } = useI18n()
  const copy = d.tryOn
  const requested = useSearchParams().get('item')

  const [picked, setPicked] = useState<string | null>(null)
  const [photo, setPhoto] = useState<Photo | null>(null)
  const [consent, setConsent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<ErrorKey | null>(configured ? null : 'not_configured')
  const fileInput = useRef<HTMLInputElement>(null)
  const request = useRef<AbortController | null>(null)
  const photoUrl = useRef<string | null>(null)

  const selected =
    items.find((item) => item.id === picked) ?? items.find((item) => item.id === requested) ?? items[0]

  // 画面を離れるときに、通信と写真のURLを片づける
  useEffect(
    () => () => {
      request.current?.abort()
      if (photoUrl.current) URL.revokeObjectURL(photoUrl.current)
    },
    [],
  )

  if (!selected) return null

  const errorText = (key: ErrorKey): string => {
    if (key === 'file_too_large') return copy.fileTooLarge
    if (key === 'network') return copy.network
    return copy.errors[key]
  }

  const replacePhoto = (next: Photo | null) => {
    if (photoUrl.current) URL.revokeObjectURL(photoUrl.current)
    photoUrl.current = next?.url ?? null
    setPhoto(next)
    setResult(null)
  }

  const takeFile = async (file: File | undefined) => {
    if (!file) return
    setError(configured ? null : 'not_configured')
    if (!ACCEPT.includes(file.type)) return setError('invalid_image')
    if (file.size > MAX_FILE) return setError('file_too_large')
    try {
      replacePhoto(await prepare(file))
    } catch {
      setError('invalid_image')
    }
  }

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setDragging(false)
    void takeFile(event.dataTransfer.files[0])
  }

  const generate = async () => {
    if (!photo || !consent || busy) return
    const controller = new AbortController()
    request.current = controller
    setBusy(true)
    setError(null)
    try {
      const response = await fetch('/api/try-on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: selected.id, image: photo.base64, ratio: photo.ratio }),
        signal: controller.signal,
      })
      const data: unknown = await response.json().catch(() => null)
      const body = (data ?? {}) as { image?: unknown; error?: unknown }
      if (response.ok && typeof body.image === 'string' && body.image.startsWith('data:image/')) {
        setResult({ image: body.image, item: selected.id })
      } else {
        const code = typeof body.error === 'string' && body.error in copy.errors ? (body.error as ErrorKey) : 'failed'
        setError(code)
      }
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === 'AbortError') return
      setError('network')
    } finally {
      setBusy(false)
    }
  }

  const ready = Boolean(photo) && consent && configured
  const shown = result && result.item === selected.id ? result : null

  return (
    <div className="studio">
      <div className="studio__steps">
        {/* 1. 作品 */}
        <section className="studio__step">
          <h2>
            <span>01</span>
            {copy.step1}
          </h2>
          <div className="studio__items" role="radiogroup" aria-label={copy.step1}>
            {items.map((item) => (
              <label key={item.id} className="studio__item" data-checked={item.id === selected.id}>
                <input
                  type="radio"
                  name="item"
                  value={item.id}
                  checked={item.id === selected.id}
                  onChange={() => setPicked(item.id)}
                />
                <span className="plate">{visuals[item.id]}</span>
                <span className="studio__item-name">{item.name}</span>
              </label>
            ))}
          </div>
        </section>

        {/* 2. 写真 */}
        <section className="studio__step">
          <h2>
            <span>02</span>
            {copy.step2}
          </h2>
          <label
            className="drop"
            data-dragging={dragging}
            data-filled={Boolean(photo)}
            onDragOver={(event) => {
              event.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            <input
              ref={fileInput}
              type="file"
              accept={ACCEPT.join(',')}
              className="sr-only"
              onChange={(event) => {
                void takeFile(event.target.files?.[0])
                event.target.value = ''
              }}
            />
            {photo ? (
              <>
                {/* ブラウザ内の一時URLなので、最適化は通さない */}
                <img src={photo.url} alt="" />
                <span className="drop__change">{copy.change}</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 16V5M7.5 9.5 12 5l4.5 4.5M5 19h14" />
                </svg>
                <span className="drop__main">{copy.drop}</span>
                <span className="drop__sub">{copy.formats}</span>
              </>
            )}
          </label>
          {photo && (
            <button type="button" className="studio__remove" onClick={() => replacePhoto(null)}>
              {copy.removePhoto}
            </button>
          )}
          <p className="studio__hint">
            <b>{copy.hintLabel}</b>
            {selected.hint}
          </p>
          <label className="check">
            <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
            <span>{copy.consent}</span>
          </label>
        </section>

        {/* 3. 生成 */}
        <section className="studio__step">
          <h2>
            <span>03</span>
            {copy.step3}
          </h2>
          <button type="button" className="btn btn--block" disabled={!ready || busy} onClick={() => void generate()}>
            {busy ? copy.generating : shown ? copy.again : copy.generate}
          </button>
          {!ready && configured && <p className="studio__note">{copy.requirement}</p>}
          {!selected.hasPhoto && <p className="studio__note">{copy.textOnlyNote}</p>}
          <p className="studio__error" role="alert">
            {error && errorText(error)}
          </p>
        </section>
      </div>

      {/* 結果 */}
      <div className="studio__stage" aria-live="polite" aria-busy={busy}>
        <div className="stage" data-busy={busy}>
          {shown ? (
            <div className="stage__compare">
              <figure>
                {photo && <img src={photo.url} alt={copy.before} />}
                <figcaption>{copy.before}</figcaption>
              </figure>
              <figure className="stage__after">
                <img src={shown.image} alt={`${copy.after} — ${selected.name}`} />
                <figcaption>{copy.after}</figcaption>
              </figure>
            </div>
          ) : (
            <div className="stage__empty">
              <span className="plate">{visuals[selected.id]}</span>
              <p>
                <b>{selected.name}</b>
                {busy ? copy.generating : copy.stageEmpty}
              </p>
            </div>
          )}
          {busy && <span className="stage__scan" aria-hidden="true" />}
        </div>

        {shown && (
          <div className="stage__actions">
            <a href={shown.image} download={`machi-atlas-${selected.id}.jpg`} className="btn btn--sm">
              {copy.download}
            </a>
            <Link href={to(`/items/${selected.id}`)} className="arrow-link">
              {copy.viewItem}
            </Link>
          </div>
        )}
        {shown && <p className="studio__note">{copy.resultNote}</p>}

        <div className="studio__privacy">
          <h3>{copy.privacyTitle}</h3>
          <ul>
            {copy.privacy.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
