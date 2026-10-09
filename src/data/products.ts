export type CategoryId = 'taiwan-taste' | 'taiwan-craft' | 'machi-original' | 'bridge'

export interface Category {
  id: CategoryId
  name: string
  nameZh: string
  lead: string
}

export interface Variant {
  id: string
  label: string
}

export interface Product {
  id: string
  name: string
  nameZh: string
  category: CategoryId
  price: number
  stock: number
  badge?: 'NEW' | '限定' | 'Machi Select'
  summary: string
  story: string
  details: string[]
  variants?: Variant[]
  /** 写真が用意されるまでの表示。商品を表す一字（繁体字）と台湾華語の読み、背景色。 */
  plate: { glyph: string; roman: string; tone: string }
}

export const categories: Category[] = [
  {
    id: 'taiwan-taste',
    name: '台湾の味',
    nameZh: '台灣味道',
    lead: 'わたしが育った島の、やさしい甘さとお茶の香り。',
  },
  {
    id: 'taiwan-craft',
    name: '台湾の雑貨',
    nameZh: '台灣雜貨',
    lead: '市場や路地裏で出会う、色あざやかな手しごと。',
  },
  {
    id: 'machi-original',
    name: 'Machi オリジナル',
    nameZh: 'Machi 原創',
    lead: '写真と言葉でつくった、Machiの小さな作品たち。',
  },
  {
    id: 'bridge',
    name: '台日をつなぐ',
    nameZh: '台日之間',
    lead: '東京と台湾、ふたつの「ただいま」を結ぶもの。',
  },
]

export const products: Product[] = [
  {
    id: 'alishan-oolong',
    name: '阿里山 高山烏龍茶 缶',
    nameZh: '阿里山高山烏龍茶',
    category: 'taiwan-taste',
    price: 2480,
    stock: 24,
    badge: 'Machi Select',
    summary: '標高1,500mの茶畑で育った、花のように香る烏龍茶。',
    story:
      '小さい頃、祖母が朝いちばんに淹れてくれたのがこのお茶でした。東京の朝にも、あの山の空気を少しだけ。',
    details: ['内容量：75g（約25杯分）', '原産地：台湾・嘉義県 阿里山', '賞味期限：製造より24ヶ月'],
    plate: { glyph: '茶', roman: 'chá', tone: '#dfe4da' },
  },
  {
    id: 'pineapple-cake',
    name: '手づくり 鳳梨酥 6個入',
    nameZh: '手工鳳梨酥',
    category: 'taiwan-taste',
    price: 1980,
    stock: 40,
    badge: 'NEW',
    summary: '台湾の定番おみやげ、パイナップルケーキ。甘酸っぱい果肉たっぷり。',
    story:
      '台湾に帰るたびに必ず買う、台中の小さなお店のもの。日本の友だちに配ると、いつも「どこで買えるの？」と聞かれます。',
    details: ['内容量：6個入', '原材料：小麦粉、バター、パイナップル、砂糖、卵', 'アレルゲン：小麦・乳・卵'],
    plate: { glyph: '酥', roman: 'sū', tone: '#ece4d3' },
  },
  {
    id: 'nougat',
    name: 'ミルクヌガー 牛軋糖',
    nameZh: '牛軋糖',
    category: 'taiwan-taste',
    price: 1280,
    stock: 32,
    summary: 'ピーナッツ入りのやわらかミルクヌガー。お茶のおともに。',
    story: '旧正月に家族みんなでつまんだ思い出の味。ひとつ食べると、もうひとつ欲しくなります。',
    details: ['内容量：200g（個包装）', '原産地：台湾・台北市', 'アレルゲン：乳・落花生'],
    plate: { glyph: '糖', roman: 'táng', tone: '#efe7e3' },
  },
  {
    id: 'hakka-pouch',
    name: '台湾花布 ポーチ',
    nameZh: '客家花布小包',
    category: 'taiwan-craft',
    price: 2200,
    stock: 15,
    summary: '客家の伝統柄「花布」を使った、手のひらサイズのポーチ。',
    story: '迪化街の布問屋さんで、ひと目惚れした柄を選びました。ひとつずつ柄の出方が違うのも魅力です。',
    details: ['サイズ：W18 × H12cm', '素材：綿100%', '生産：台湾・台北市の工房'],
    variants: [
      { id: 'red', label: '紅（あか）' },
      { id: 'blue', label: '藍（あお）' },
      { id: 'pink', label: '桃（もも）' },
    ],
    plate: { glyph: '布', roman: 'bù', tone: '#ecdcd7' },
  },
  {
    id: 'mini-tote',
    name: '茄芷袋 ミニトート',
    nameZh: '茄芷袋',
    category: 'taiwan-craft',
    price: 1650,
    stock: 20,
    badge: 'Machi Select',
    summary: '台湾の市場でおなじみのストライプバッグを、街使いサイズに。',
    story: 'おばあちゃんたちが市場で使っている、あの袋。東京で持つと、意外とおしゃれって言われます。',
    details: ['サイズ：W26 × H22 × D10cm', '素材：ポリプロピレン', '特長：軽量・撥水'],
    plate: { glyph: '袋', roman: 'dài', tone: '#e4e1d6' },
  },
  {
    id: 'tile-coaster',
    name: '台湾マジョリカタイル コースター 2枚組',
    nameZh: '花磚杯墊',
    category: 'taiwan-craft',
    price: 1320,
    stock: 28,
    summary: '古い洋館を彩った花磚（ファージュアン）柄の陶器コースター。',
    story: '台南の古民家カフェで見たタイルが忘れられなくて。食卓がぱっと明るくなります。',
    details: ['サイズ：10 × 10cm', '素材：陶器（裏面コルク）', '内容：2枚1組'],
    plate: { glyph: '磚', roman: 'zhuān', tone: '#d9e2e8' },
  },
  {
    id: 'photobook',
    name: 'フォトブック『雲のむこうへ』',
    nameZh: '寫真書《雲的彼端》',
    category: 'machi-original',
    price: 3300,
    stock: 8,
    badge: '限定',
    summary: '東京と台湾、ふたつの街で撮りためた写真とエッセイ。直筆サイン入り。',
    story:
      '来日してからの9年間を、写真と短い言葉で綴りました。迷った日も、うれしかった日も、ぜんぶ雲のむこうにつながっていた気がします。',
    details: ['判型：B5変形・96ページ', '言語：日本語／繁體中文 併記', '特典：直筆サイン入り（数量限定）'],
    plate: { glyph: '雲', roman: 'yún', tone: '#e3e9ed' },
  },
  {
    id: 'postcards',
    name: '旅のポストカード 8枚セット',
    nameZh: '旅行明信片組',
    category: 'machi-original',
    price: 1100,
    stock: 50,
    summary: '九份、台南、浅草、銭湯…Machiが歩いた風景をポストカードに。',
    story: '旅先で「この景色、誰かに送りたい」と思った瞬間を集めました。大切な人へのひとことに。',
    details: ['サイズ：148 × 100mm', '内容：8種各1枚', '用紙：マットコート紙'],
    plate: { glyph: '信', roman: 'xìn', tone: '#ebe5db' },
  },
  {
    id: 'stickers',
    name: '「Machi說故事」ステッカーセット',
    nameZh: '說故事貼紙組',
    category: 'machi-original',
    price: 660,
    stock: 80,
    badge: 'NEW',
    summary: 'シャボン玉や雲、台湾グルメをモチーフにした耐水ステッカー。',
    story: 'スマホやスーツケースに貼って、一緒に旅に出てくれたらうれしいです。',
    details: ['内容：6枚入', '加工：耐水・耐光', 'サイズ：最大 約60mm'],
    plate: { glyph: '說', roman: 'shuō', tone: '#e6e5ea' },
  },
  {
    id: 'acrylic-stand',
    name: 'アクリルスタンド 浴衣ver.',
    nameZh: '壓克力立牌 浴衣款',
    category: 'machi-original',
    price: 1800,
    stock: 30,
    summary: '夏祭りの撮影で生まれた、浴衣姿のMachiのアクリルスタンド。',
    story: 'はじめての撮り下ろしグッズです。デスクの片すみで、いつも応援しています。',
    details: ['サイズ：H約150mm', '素材：アクリル', '付属：台座'],
    plate: { glyph: '夏', roman: 'xià', tone: '#ece3e2' },
  },
  {
    id: 'sento-towel',
    name: '台日銭湯タオル',
    nameZh: '台日錢湯毛巾',
    category: 'bridge',
    price: 1540,
    stock: 36,
    badge: 'Machi Select',
    summary: '東京の銭湯と台湾の温泉をつなぐ、今治製のフェイスタオル。',
    story:
      '東京の銭湯に通うようになって、台湾の北投温泉を思い出しました。湯けむりの向こうは、どちらも同じあたたかさ。',
    details: ['サイズ：34 × 85cm', '素材：綿100%（今治産）', '生産：日本製'],
    plate: { glyph: '湯', roman: 'tāng', tone: '#e1e7e3' },
  },
  {
    id: 'temple-notebook',
    name: '台湾廟めぐり 御朱印帳風ノート',
    nameZh: '台灣廟宇散策帖',
    category: 'bridge',
    price: 2640,
    stock: 12,
    badge: '限定',
    summary: '日本の御朱印帳スタイルで、台湾の廟めぐりを記録できる蛇腹ノート。',
    story:
      '日本で御朱印を知って、台湾の廟にも記念スタンプ文化があることに気づきました。ふたつの文化を、一冊に。',
    details: ['サイズ：16 × 11cm', '仕様：蛇腹式・48面', '表紙：台湾花布'],
    plate: { glyph: '廟', roman: 'miào', tone: '#ebe0d8' },
  },
]

export const journal = [
  {
    id: 'grandma-tea',
    title: '阿里山の朝と、祖母のお茶',
    titleZh: '阿里山的早晨',
    date: '2026.09.20',
    excerpt: '湯気の向こうに見えた、山の稜線。わたしの「台湾の味」は、いつもここから始まります。',
    productId: 'alishan-oolong',
  },
  {
    id: 'sento',
    title: '東京の銭湯で、北投を想う',
    titleZh: '在東京錢湯想起北投',
    date: '2026.09.04',
    excerpt: 'はじめての銭湯はちょっと緊張。でも湯船につかった瞬間、ふるさとの温泉と同じ匂いがしました。',
    productId: 'sento-towel',
  },
  {
    id: 'nine-years',
    title: '東京生活、9年目の手紙',
    titleZh: '東京生活第九年',
    date: '2026.08.14',
    excerpt: '来日した日のスーツケースの重さを、今でも覚えています。写真集に込めた、9年分の「ありがとう」。',
    productId: 'photobook',
  },
]

export const findProduct = (id: string) => products.find((p) => p.id === id)
export const productNo = (product: Product) => `No.${String(products.indexOf(product) + 1).padStart(2, '0')}`
export const badgeLabel: Record<NonNullable<Product['badge']>, string> = {
  NEW: '新入荷',
  限定: '数量限定',
  'Machi Select': 'Machiのおすすめ',
}
export const findCategory = (id: string) => categories.find((c) => c.id === id)
