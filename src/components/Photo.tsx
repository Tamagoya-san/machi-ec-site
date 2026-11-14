import Image from 'next/image'
import type { Photo as PhotoData } from '@/content/types'
import { getI18n } from '@/i18n/server'

/**
 * コンテンツの写真を表示する。
 * sizes には「画面幅ごとの表示幅」を渡す（例："(min-width: 900px) 50vw, 100vw"）。
 * 画像は next/image が表示幅に合わせて自動で縮小・変換する。
 */
export async function Photo({
  photo,
  sizes,
  priority = false,
  className,
}: {
  photo: PhotoData
  sizes: string
  /** ページの最初に見える大きな写真だけ true にする */
  priority?: boolean
  className?: string
}) {
  const { t } = await getI18n()
  return (
    <Image
      src={photo.src}
      width={photo.width}
      height={photo.height}
      alt={t(photo.alt)}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  )
}
