import { readFile } from 'node:fs/promises'
import { ApiError, GoogleGenAI } from '@google/genai'
import { z } from 'zod'
import { getProduct } from '@/content'
import { findItemPhoto } from '@/lib/photos'

// AI試着のAPI。
// ブラウザから届いた写真と、商品の説明（と商品写真があればその画像）を Gemini の画像モデルに渡し、
// 身につけたイメージを返す。写真はメモリ上で扱うだけで、どこにも保存しない。
//
// 必要な環境変数：GEMINI_API_KEY（Google AI Studio で発行。画像生成は有料）
// 任意：TRYON_MODEL（既定 gemini-nano-banana-2.1）、TRYON_DAILY_LIMIT（1日の上限回数・既定 200）

export const runtime = 'nodejs'
export const maxDuration = 60
export const dynamic = 'force-dynamic'

const MODEL = process.env.TRYON_MODEL || 'gemini-nano-banana-2.1'
const DAILY_LIMIT = Number(process.env.TRYON_DAILY_LIMIT) || 200
/** 1つのIPアドレスから、10分間に受け付ける回数 */
const PER_IP = { limit: 5, windowMs: 10 * 60 * 1000 }
/** 受け付ける画像の上限（バイナリで約3MB。ブラウザ側で縮小してから送られてくる） */
const MAX_BASE64 = 4_200_000

const bodySchema = z.object({
  item: z.string().min(1).max(80),
  image: z
    .string()
    .min(100)
    .regex(/^[A-Za-z0-9+/]+={0,2}$/),
  /** 元写真の縦横比（幅 ÷ 高さ） */
  ratio: z.number().min(0.2).max(5).optional(),
})

type ErrorCode = 'not_configured' | 'invalid_image' | 'too_large' | 'rate_limited' | 'blocked' | 'failed' | 'bad_request'

const fail = (code: ErrorCode, status: number) =>
  Response.json({ error: code }, { status, headers: { 'Cache-Control': 'no-store' } })

// ── 回数制限 ──
// サーバーのメモリ上で数える簡易なもの。Vercel では関数のインスタンスごとに数えるため厳密ではない。
// 費用の上限は Google 側の利用上限でも必ず設定すること（README参照）。
const hits = new Map<string, number[]>()
let day = { key: '', count: 0 }

function allow(ip: string): boolean {
  const now = Date.now()
  const today = new Date(now).toISOString().slice(0, 10)
  if (day.key !== today) day = { key: today, count: 0 }
  if (day.count >= DAILY_LIMIT) return false

  const recent = (hits.get(ip) ?? []).filter((time) => now - time < PER_IP.windowMs)
  if (recent.length >= PER_IP.limit) {
    hits.set(ip, recent)
    return false
  }
  recent.push(now)
  hits.set(ip, recent)
  day.count += 1

  // 古い記録を掃除して、Map が増え続けないようにする
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((time) => now - time >= PER_IP.windowMs)) hits.delete(key)
    }
  }
  return true
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return request.headers.get('x-real-ip') ?? forwarded ?? 'unknown'
}

/** 他サイトのページから呼び出されないよう、同じオリジンからのリクエストだけ受け付ける */
function sameOrigin(request: Request): boolean {
  const site = request.headers.get('sec-fetch-site')
  if (site && site !== 'same-origin') return false
  const origin = request.headers.get('origin')
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  if (!origin || !host) return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

/** ファイルの先頭バイトから画像形式を判定する（申告された形式は信用しない） */
function sniff(bytes: Buffer): 'image/jpeg' | 'image/png' | 'image/webp' | null {
  if (bytes.length < 12) return null
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg'
  if (bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png'
  if (bytes.toString('latin1', 0, 4) === 'RIFF' && bytes.toString('latin1', 8, 12) === 'WEBP') return 'image/webp'
  return null
}

const RATIOS = [
  ['9:16', 9 / 16],
  ['2:3', 2 / 3],
  ['3:4', 3 / 4],
  ['4:5', 4 / 5],
  ['1:1', 1],
  ['5:4', 5 / 4],
  ['4:3', 4 / 3],
  ['3:2', 3 / 2],
  ['16:9', 16 / 9],
] as const

/** 元写真にいちばん近い縦横比をえらぶ */
function nearestRatio(ratio: number | undefined): string {
  if (!ratio) return '3:4'
  let best: (typeof RATIOS)[number] = RATIOS[0]
  for (const candidate of RATIOS) {
    if (Math.abs(Math.log(candidate[1] / ratio)) < Math.abs(Math.log(best[1] / ratio))) best = candidate
  }
  return best[0]
}

function buildPrompt(itemPrompt: string, hasReference: boolean): string {
  return [
    'You are a virtual try-on editor for an online accessory shop.',
    'The first image is a photo of the customer. Edit this photo so that the customer is wearing the product described below.',
    `Product and how it is worn: ${itemPrompt}`,
    hasReference
      ? 'The second image is a reference photo of the actual product. It may show the product worn by another person or laid flat. Use it only to reproduce the design, color, material and proportions of the product itself; never copy that person, their hair, their clothing or the background.'
      : 'No product photo is provided, so follow the product description closely.',
    'Keep the person exactly the same: face, identity, expression, skin tone, hairstyle, body shape and pose must not change.',
    'Keep the background, lighting, framing and existing clothing unchanged, unless the product itself is a garment that replaces a piece of clothing.',
    'Render the product at a realistic size with natural shadows and occlusion, so that it looks like a real photograph.',
    'Do not add text, logos, watermarks, borders or any other accessories.',
  ].join('\n')
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return fail('bad_request', 403)

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return fail('not_configured', 503)

  const length = Number(request.headers.get('content-length') ?? 0)
  if (length > MAX_BASE64 + 2000) return fail('too_large', 413)

  let json: unknown
  try {
    json = await request.json()
  } catch {
    return fail('bad_request', 400)
  }
  if (typeof json === 'object' && json !== null && 'image' in json) {
    const { image } = json as { image: unknown }
    if (typeof image === 'string' && image.length > MAX_BASE64) return fail('too_large', 413)
  }
  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) return fail('bad_request', 400)

  // 生成に使う指示文は、必ずサーバー側のカタログから取り出す（利用者の入力は混ぜない）
  const product = getProduct(parsed.data.item)
  if (!product?.tryOn) return fail('bad_request', 400)

  const photo = Buffer.from(parsed.data.image, 'base64')
  const mime = sniff(photo)
  if (!mime) return fail('invalid_image', 400)

  if (!allow(clientIp(request))) return fail('rate_limited', 429)

  const input: Array<{ type: 'text'; text: string } | { type: 'image'; data: string; mime_type: string }> = [
    { type: 'image', data: parsed.data.image, mime_type: mime },
  ]

  // 商品写真が登録されていれば、参照画像として添える
  const reference = findItemPhoto(product.id)
  let hasReference = false
  if (reference) {
    try {
      const file = await readFile(reference.file)
      input.push({ type: 'image', data: file.toString('base64'), mime_type: reference.mime })
      hasReference = true
    } catch {
      // 読めなければ説明文だけで生成する
    }
  }
  input.unshift({ type: 'text', text: buildPrompt(product.tryOn.prompt, hasReference) })

  try {
    // 画像の入力は v1beta でだけ受け付ける。既定の v1 だと生成前に 400 になる。
    const ai = new GoogleGenAI({ apiKey, apiVersion: 'v1beta' })
    const interaction = await ai.interactions.create({
      model: MODEL,
      input,
      response_format: {
        type: 'image',
        mime_type: 'image/jpeg',
        aspect_ratio: nearestRatio(parsed.data.ratio),
        image_size: '1K',
      },
      // Google 側にやりとりを保存しない
      store: false,
      api_version: 'v1beta',
    })

    const output = interaction.output_image
    if (!output?.data) {
      // 安全フィルターなどで画像が返らなかった場合
      console.warn('[try-on] no image returned', { status: interaction.status, item: product.id })
      return fail('blocked', 422)
    }

    return Response.json(
      { image: `data:${output.mime_type ?? 'image/jpeg'};base64,${output.data}`, reference: hasReference },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    // 写真やキーをログに残さないよう、要点だけ記録する
    const status = error instanceof ApiError ? error.status : undefined
    const message = error instanceof Error ? error.message.slice(0, 300) : 'unknown'
    console.error('[try-on] generation failed', { status, message, item: product.id })
    if (status === 429) return fail('rate_limited', 429)
    return fail('failed', 502)
  }
}
