// コンテンツの型定義。
// つくり手・商品・土地はすべてこの型に沿ったデータファイルとして追加する（README「LPの追加」参照）。

export const locales = ['ja', 'zh'] as const
export type Locale = (typeof locales)[number]

/** 日本語と繁體中文の対訳テキスト */
export type Text = Record<Locale, string>

/** live: 掲載中 / sample: 掲載イメージ（実在のつくり手ではない仮の枠） */
export type Status = 'live' | 'sample'

export type Category = 'ear' | 'hair' | 'bag' | 'clothes'

/** LPごとの配色。サイト共通の枠の中で、つくり手の世界観に合わせて差し替える */
export type Theme = {
  /** LPの地色 */
  paper: string
  /** 一段濃い面（カードや帯） */
  soft: string
  /** 文字色 */
  ink: string
  /** 差し色 */
  accent: string
}

/** 写真。src は public/ からのパス。width / height は元画像の大きさ（縦横比の計算に使う） */
export type Photo = {
  src: string
  width: number
  height: number
  alt: Text
}

export type Source = { label: string; url: string }

/** 商品写真がない間に表示するイラストの種類 */
export type ArtKind = 'bow' | 'earrings' | 'hair' | 'bag' | 'blouse'

export type Product = {
  id: string
  creator: string
  name: Text
  category: Category
  /** 税込・円 */
  price: number
  /** true の間は「価格は仮」の表示を出す */
  provisional: boolean
  lead: Text
  description: Text
  details: Text[]
  /** 商品名・価格・写真の出どころ（投稿のURLなど） */
  source?: Source
  variants?: { id: string; label: Text }[]
  art: { kind: ArtKind; plate: string; variant?: number }
  /** AI試着の設定。prompt はモデルに渡す英語の指示（商品の見た目と着け方） */
  tryOn?: { prompt: string; hint: Text }
}

export type Fact = { label: Text; value: Text }

export type TimelineItem = {
  date: string
  title: Text
  body: Text
  spot?: string
  source?: Source
  image?: Photo
}

/** LPを構成するブロック。並べた順に表示される */
export type Section =
  | { type: 'note'; body: Text; provisional?: boolean; context?: Text; source?: Source }
  | { type: 'story'; eyebrow: string; title: Text; paragraphs: Text[]; images?: Photo[] }
  | { type: 'gallery'; eyebrow: string; title: Text; body?: Text; images: Photo[] }
  | { type: 'points'; eyebrow: string; title: Text; items: { title: Text; body: Text }[] }
  | { type: 'video'; title: Text; body: Text; url?: string; cover?: Photo }
  | { type: 'products'; eyebrow: string; title: Text }
  | { type: 'tryon'; title: Text; body: Text }
  | { type: 'timeline'; eyebrow: string; title: Text; items: TimelineItem[] }
  | { type: 'place'; eyebrow: string; title: Text; body: Text }
  | { type: 'guide'; title: Text; items: Fact[]; note?: Text }

export type Creator = {
  slug: string
  /** 掲載順の通し番号（No.01 など） */
  no: number
  name: string
  reading?: Text
  status: Status
  craft: Text
  tagline: Text
  summary: Text
  /** 地図のピンになる土地 */
  place: string
  theme: Theme
  /** LPの冒頭と一覧カードに使う写真。無い間は heroArt のイラストを表示する */
  cover?: Photo
  /** 写真の提供元の表記（例：Photo: TEEENU） */
  photoCredit?: string
  heroArt: ArtKind
  facts: Fact[]
  links: { instagram?: string; shop?: string }
  sections: Section[]
}

export type Spot = {
  id: string
  name: Text
  lat: number
  lon: number
  note: Text
}

export type JourneyStop = {
  spot: string
  time: Text
  title: Text
  body: Text
  /** つくり手ゆかりの立ち寄り先に付ける */
  creator?: string
}

export type Journey = {
  title: Text
  lead: Text
  duration: Text
  provisional: boolean
  stops: JourneyStop[]
}

export type Place = {
  slug: string
  status: Status
  name: Text
  en: string
  /** 都道府県コード（JIS X 0401） */
  prefecture: string
  lat: number
  lon: number
  /** その土地のものづくりを一言で */
  craft: Text
  summary: Text
  body: Text[]
  spots: Spot[]
  journey?: Journey
}
