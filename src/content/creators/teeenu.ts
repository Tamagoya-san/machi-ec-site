import type { Creator, Photo, Product, Source } from '../types'

// TEEENU（ティーヌ）
//
// 出典
// - Instagram @teeenu_official（プロフィール文・2026年10〜11月の投稿）
// - 公式ショップ https://teeenu.official.ec/
// - Maison KOSÉ「SELECT STAND」告知ページ
//
// 写真はすべて TEEENU の Instagram 投稿から取得したもの（テストサイト用）。
// 正式公開の前に、TEEENU 側へ掲載の許可と、商品との対応が正しいかを確認すること。
//   items/teeenu-flower-crown.jpg      … /p/DfjstEgn5oW/（5枚目）
//   items/teeenu-ear-f1.jpg            … /p/De_12NFHyq9/（2枚目）
//   items/teeenu-ear-m1.jpg            … /reel/De6NHf9ICSI/（カバー）
//   items/teeenu-braid-hair-dress.jpg  … /p/De1O0kFn080/（4枚目・右上）
//   items/teeenu-frill-bag.jpg         … /p/DfjstEgn5oW/（3枚目）
//   items/teeenu-lace-ribbon-bag.jpg   … /p/De1O0kFn080/（4枚目・左上）
//   creators/teeenu/hero.jpg           … /p/De_12NFHyq9/（1枚目）
//   creators/teeenu/atelier-*.jpg      … /p/DfjstEgn5oW/（1・4枚目）
//   creators/teeenu/lookbook-*.jpg     … /p/De1O0kFn080/（2・3枚目）
//   creators/teeenu/booth.jpg          … /p/DfErJgan-kP/（2枚目）
//
// 価格が確認できたのは flower crown（¥5,940）のみ。ほかは provisional: true（価格は仮）。

const ig = (path: string, label = 'TEEENU Instagram'): Source => ({
  label,
  url: `https://www.instagram.com${path}`,
})

const photo = (file: string, width: number, height: number, ja: string, zh: string): Photo => ({
  src: `/photos/creators/teeenu/${file}`,
  width,
  height,
  alt: { ja, zh },
})

const photos = {
  hero: photo(
    'hero.jpg',
    1200,
    1500,
    'TEEENUのイヤーアクセサリーと、白いワンピースを身につけた人の横顔',
    '戴著TEEENU耳飾、穿著白色洋裝的側臉',
  ),
  flowers: photo(
    'atelier-flowers.jpg',
    1200,
    1500,
    'アトリエに並ぶ、色とりどりの flower crown',
    '工作室裡排列著各種顏色的 flower crown',
  ),
  hands: photo('atelier-hands.jpg', 1200, 1502, 'アトリエで作業をする手元', '在工作室裡製作的雙手'),
  lookbookEar: photo(
    'lookbook-ear.jpg',
    1200,
    1500,
    'イヤーアクセサリーをつけたモデルの写真（5点）',
    '模特兒配戴耳飾的照片（5款）',
  ),
  lookbookCrown: photo(
    'lookbook-crown.jpg',
    1109,
    1387,
    'flower crown の色違いを髪につけた後ろ姿（9色）',
    '配戴不同顏色 flower crown 的背影（9色）',
  ),
  booth: photo(
    'booth.jpg',
    1206,
    690,
    'デザインフェスタのTEEENUブースのイメージ',
    'Design Festa 的TEEENU攤位示意',
  ),
}

export const teeenu: Creator = {
  slug: 'teeenu',
  no: 1,
  name: 'TEEENU',
  reading: { ja: 'ティーヌ', zh: 'TEEENU' },
  status: 'live',
  craft: { ja: 'ホワイトコーデに合うアクセサリー', zh: '適合白色穿搭的飾品' },
  tagline: { ja: 'ホワイトコーデに合う、リボンのお店。', zh: '為白色穿搭而生的蝴蝶結小店。' },
  summary: {
    ja: '花をつないだヘアアクセサリー、羽のような耳飾り、刺繍のバッグ。白い装いに合わせて、すべて手作業でつくられています。',
    zh: '串起花朵的髮飾、羽翼般的耳飾、刺繡包包。為了搭配白色穿搭，全部以手工製作。',
  },
  place: 'tokyo',
  theme: { paper: '#F8F7F5', soft: '#ECEAEF', ink: '#3A3B40', accent: '#8A86A0' },
  cover: photos.hero,
  photoCredit: 'Photo: TEEENU（@teeenu_official）',
  heroArt: 'bow',
  facts: [
    {
      label: { ja: 'つくるもの', zh: '作品' },
      value: { ja: 'ヘアアクセサリー・イヤーアクセサリー・バッグ・洋服', zh: '髮飾・耳飾・包包・服飾' },
    },
    {
      label: { ja: 'つくり方', zh: '製作方式' },
      value: { ja: 'すべて手作業', zh: '全部手工製作' },
    },
    {
      label: { ja: '出会える場所', zh: '哪裡遇得到' },
      value: { ja: 'オンライン販売会・東京のPOPUP', zh: '線上販售會・東京POPUP' },
    },
    {
      label: { ja: '海外発送', zh: '海外配送' },
      value: { ja: '対応（worldwide）', zh: '可寄送（worldwide）' },
    },
  ],
  links: {
    instagram: 'https://www.instagram.com/teeenu_official/',
    shop: 'https://teeenu.official.ec/',
  },
  sections: [
    {
      type: 'note',
      body: {
        ja: '日本のクリエイターが、こんなにたくさん集まっている。みなさんも、好きなクリエイターのデザインに出会えますように。',
        zh: '超多日本創作者集結。希望大家都可以找到喜歡的創作者設計。',
      },
      context: {
        ja: 'TEEENUも出店したデザインフェスタを訪れた日の投稿より（日本語訳：Machi Atlas）',
        zh: '摘自Machi造訪Design Festa當天的貼文（TEEENU也在此設攤）',
      },
      source: { label: 'Instagram @machihistory 2026.11.15', url: 'https://www.instagram.com/reel/Dfue_j-gx0M/' },
    },
    {
      type: 'story',
      eyebrow: 'Story',
      title: { ja: '白い服の日の、主役をつくる。', zh: '為穿白色的日子，做一個主角。' },
      paragraphs: [
        {
          ja: 'TEEENUは「ホワイトコーデに合うリボンのお店」。髪に、耳元に、手元に。白いワンピースに合わせることを考えてつくられたアクセサリーと洋服が揃います。',
          zh: 'TEEENU是一間「適合白色穿搭的蝴蝶結小店」。髮間、耳畔、手邊——為了搭配白色洋裝而設計的飾品與服飾，都在這裡。',
        },
        {
          ja: 'いま一番人気なのは、花をつないだヘアアクセサリー「flower crown」。子どもの頃に作っていた花冠を、もう一度作ってみた——そんな発想から生まれ、オンラインの販売会では早々に完売しました。',
          zh: '現在最受歡迎的，是把花朵串起來的髮飾「flower crown」。把小時候做過的花冠再做一次——從這樣的想法誕生，在線上販售會很快就售完。',
        },
        {
          ja: '作品はすべて手作業。だから数には限りがあり、販売はオンラインの販売会と、POPUPの期間だけ。アトリエには、色とりどりの花が少しずつ積み重なっていきます。',
          zh: '所有作品都是手工製作，所以數量有限，只在線上販售會與POPUP期間販售。工作室裡，各種顏色的花朵一點一點地堆疊起來。',
        },
      ],
      images: [photos.flowers, photos.hands],
    },
    {
      type: 'points',
      eyebrow: 'Craft',
      title: { ja: 'TEEENUの、3つのこと。', zh: '關於TEEENU的三件事。' },
      items: [
        {
          title: { ja: 'すべて、手作業で', zh: '全部親手製作' },
          body: {
            ja: 'ヘアアクセサリーもバッグも、一つひとつ手作業で制作。数に限りがあるのは、そのためです。',
            zh: '無論髮飾或包包，都是一件一件手工製作。數量有限，正是因為如此。',
          },
        },
        {
          title: { ja: '白いワンピースに合わせて', zh: '為白色洋裝而設計' },
          body: {
            ja: '羽のような耳飾りも、三つ編み専用のヘアドレスも。どれも白い装いのなかで映えるように考えられています。',
            zh: '羽翼般的耳飾、麻花辮專用的髮飾……每一件都是為了在白色穿搭中更顯好看而設計。',
          },
        },
        {
          title: { ja: '試着してから、決めてほしい', zh: '希望你試戴後再決定' },
          body: {
            ja: '「実際に着けてから決めたい」という声に応えて、対面販売を開始。デザインフェスタへの出店は4回目になりました。',
            zh: '為了回應「想實際戴過再決定」的聲音，開始了面對面販售。至今已是第4次在Design Festa設攤。',
          },
        },
      ],
    },
    {
      type: 'gallery',
      eyebrow: 'Lookbook',
      title: { ja: '白に、花と羽を。', zh: '在白色上，添上花與羽。' },
      body: {
        ja: 'flower crown の色違いと、イヤーアクセサリーの着用写真。TEEENUのInstagramより。',
        zh: 'flower crown 的各種顏色，以及耳飾的配戴照。摘自TEEENU的Instagram。',
      },
      images: [photos.lookbookCrown, photos.lookbookEar],
    },
    {
      type: 'products',
      eyebrow: 'Items',
      title: { ja: 'TEEENUの作品', zh: 'TEEENU的作品' },
    },
    {
      type: 'tryon',
      title: { ja: '会場に行けなくても、つけた姿を見てみる。', zh: '就算無法到現場，也能看看戴上的樣子。' },
      body: {
        ja: '「実際に着けてから決めたい」。TEEENUが対面販売を始めたきっかけになった声です。Machi Atlasでは、自分の写真を1枚えらぶと、AIが作品を合わせたイメージをつくります。',
        zh: '「想實際戴過再決定。」這是TEEENU開始面對面販售的契機。在Machi Atlas，只要選一張自己的照片，AI就會生成你戴上作品的模擬圖。',
      },
    },
    {
      type: 'video',
      title: { ja: 'Machi、デザインフェスタを歩く。', zh: 'Machi逛Design Festa。' },
      body: {
        ja: 'TEEENUも出店した「デザインフェスタ vol.64」（2026年11月14日）を、Machiが歩いて紹介したリールです。TEEENUの紹介動画は、公開後にここへ掲載します。',
        zh: 'Machi親自走訪「Design Festa vol.64」（2026年11月14日）並介紹的Reels，TEEENU也在這場活動設攤。TEEENU的介紹影片上線後會刊登在這裡。',
      },
      url: 'https://www.instagram.com/reel/Dfue_j-gx0M/',
      cover: {
        src: '/photos/machi/designfesta.jpg',
        width: 900,
        height: 1600,
        alt: { ja: 'デザインフェスタの会場に立つMachi', zh: '站在Design Festa會場的Machi' },
      },
    },
    {
      type: 'timeline',
      eyebrow: 'Footprints',
      title: { ja: 'TEEENUに出会える場所', zh: '遇見TEEENU的地方' },
      items: [
        {
          date: '2025.02',
          title: { ja: 'Maison KOSÉ「SELECT STAND」第5弾', zh: 'Maison KOSÉ「SELECT STAND」第5彈' },
          body: {
            ja: '原宿・ハラカドのMaison KOSÉで、“主役級アクセサリー”として作品を販売。',
            zh: '在原宿HARAKADO的Maison KOSÉ，以「主角級飾品」販售作品。',
          },
          spot: 'harakado',
          source: { label: 'Maison KOSÉ', url: 'https://maison.kose.co.jp/site/p/harakado_article14.aspx' },
        },
        {
          date: '2025.08 – 09',
          title: { ja: '「SELECT STAND」第9弾', zh: '「SELECT STAND」第9彈' },
          body: {
            ja: 'ハラカド店限定のアクセサリーが登場。',
            zh: '推出HARAKADO店限定飾品。',
          },
          spot: 'harakado',
          source: { label: 'Maison KOSÉ', url: 'https://maison.kose.co.jp/site/p/harakado_article23.aspx' },
        },
        {
          date: '2026.10.26 – 11.01',
          title: { ja: '10月オンライン販売会', zh: '10月線上販售會' },
          body: {
            ja: 'オンラインストアでの販売会。flower crown は、オンラインではホワイトとブルーの2色展開です。',
            zh: '線上商店的販售會。flower crown 在線上為白色與藍色兩色。',
          },
          source: ig('/p/DfErJgan-kP/'),
        },
        {
          date: '2026.11.14 – 15',
          title: { ja: 'デザインフェスタ vol.64', zh: 'Design Festa vol.64' },
          body: {
            ja: '東京ビッグサイト 南館4階（ブース R161-162）。いつもの倍の広さのブースに、デザフェス限定色の flower crown や洋服、バッグが並ぶ、試着のできるブースです。',
            zh: '東京Big Sight 南館4樓（攤位 R161-162）。比平常大一倍的攤位上，陳列著Design Festa限定色的 flower crown、服飾與包包，現場可以試戴。',
          },
          spot: 'bigsight',
          source: ig('/p/De1O0kFn080/'),
          image: photos.booth,
        },
        {
          date: '2026.11.24 – 30',
          title: { ja: '11月オンライン販売会（予定）', zh: '11月線上販售會（預定）' },
          body: {
            ja: '次回のオンライン販売会。販売は、販売会とPOPUPの期間のみです。',
            zh: '下一次的線上販售會。僅在販售會與POPUP期間販售。',
          },
          source: ig('/p/DfErJgan-kP/'),
        },
      ],
    },
    {
      type: 'place',
      eyebrow: 'Place',
      title: { ja: 'TEEENUをつけて、東京を歩く。', zh: '戴上TEEENU，漫步東京。' },
      body: {
        ja: 'TEEENUが作品を届けてきた原宿と有明。その足あとをたどる一日のプランを用意しました。',
        zh: '原宿與有明，是TEEENU曾經把作品送到大家面前的地方。我們準備了一日行程，沿著這些足跡走一趟。',
      },
    },
    {
      type: 'guide',
      title: { ja: 'お届けについて', zh: '配送說明' },
      items: [
        {
          label: { ja: '発送', zh: '出貨' },
          value: { ja: 'ご注文から1〜3営業日以内', zh: '下單後1〜3個工作天內' },
        },
        {
          label: { ja: '送料', zh: '運費' },
          value: { ja: '国内一律550円（10,000円以上で無料）', zh: '日本國內一律550日圓（滿10,000日圓免運）' },
        },
        {
          label: { ja: '海外発送', zh: '海外配送' },
          value: { ja: '対応（送料は国・地域により異なります）', zh: '可寄送（運費依國家・地區而異）' },
        },
        {
          label: { ja: '返品・交換', zh: '退換貨' },
          value: { ja: '不良・誤配送のみ（到着後5日以内）', zh: '僅限瑕疵或寄錯商品（到貨後5日內）' },
        },
      ],
      note: {
        ja: 'TEEENU公式ショップの現在の条件をもとにした仮の内容です。',
        zh: '以上為參考TEEENU官方商店現行條件的暫定內容。',
      },
    },
  ],
}

const handmade = {
  ja: 'すべて手作業で制作するため、数に限りがあり、仕上がりにわずかな個体差があります。',
  zh: '因全部手工製作，數量有限，成品也會有些微個體差異。',
}

const nameIsProvisional = {
  ja: '商品名はMachi Atlasでの仮の呼び名です。',
  zh: '商品名稱為Machi Atlas暫時使用的稱呼。',
}

export const teeenuProducts: Product[] = [
  {
    id: 'teeenu-flower-crown',
    creator: 'teeenu',
    name: { ja: 'flower crown', zh: 'flower crown 花冠髮飾' },
    category: 'hair',
    price: 5940,
    provisional: false,
    lead: { ja: '子どもの頃の花冠を、もう一度。', zh: '把小時候的花冠，再做一次。' },
    description: {
      ja: '花をつないだヘアアクセサリー。おろした髪の後ろに留めると、後ろ姿に花冠がかかったように見えます。オンラインの販売会では一番人気で、早々に完売しました。',
      zh: '把花朵串起來的髮飾。別在放下的頭髮後方，背影就像戴上了花冠。在線上販售會是人氣第一，很快就售完。',
    },
    details: [
      handmade,
      {
        ja: 'オンラインではホワイトとブルーの2色。POPUPでは限定色が登場することがあります。',
        zh: '線上為白色與藍色兩色。POPUP有時會推出限定色。',
      },
    ],
    variants: [
      { id: 'white', label: { ja: 'ホワイト', zh: '白色' } },
      { id: 'blue', label: { ja: 'ブルー', zh: '藍色' } },
    ],
    source: ig('/p/DfjstEgn5oW/'),
    art: { kind: 'hair', plate: '#E9E7EC' },
    tryOn: {
      prompt:
        'a hair accessory called "flower crown": a horizontal band of five or six white crocheted flowers joined side by side, about 20 cm wide, clipped across the back of the head over loose hair, like a flower crown seen from behind',
      hint: {
        ja: '髪をおろした後ろ姿、または横顔の写真がおすすめです。',
        zh: '建議使用放下頭髮的背影或側臉照片。',
      },
    },
  },
  {
    id: 'teeenu-ear-f1',
    creator: 'teeenu',
    name: { ja: 'イヤーアクセサリー design F-1', zh: '耳飾 design F-1' },
    category: 'ear',
    price: 4950,
    provisional: true,
    lead: { ja: '耳元に、羽のようなかたち。', zh: '耳畔一抹羽翼般的形狀。' },
    description: {
      ja: '白いワンピースによく合う、羽のようなデザインのイヤーアクセサリー。耳に沿って広がり、横顔をやわらかく縁取ります。',
      zh: '羽翼般的設計，非常適合白色洋裝的耳飾。沿著耳朵展開，柔和地勾勒出側臉。',
    },
    details: [handmade],
    source: ig('/p/De_12NFHyq9/'),
    art: { kind: 'earrings', plate: '#ECEAEF' },
    tryOn: {
      prompt:
        'a statement ear accessory (design F-1): a wing-shaped ear cuff made of small white pearl-like beads and delicate white lace-like loops, covering the outer edge of the ear and spreading slightly behind it like a small feathered wing',
      hint: { ja: '耳が見える横顔の写真がおすすめです。', zh: '建議使用看得到耳朵的側臉照片。' },
    },
  },
  {
    id: 'teeenu-ear-m1',
    creator: 'teeenu',
    name: { ja: 'イヤーアクセサリー design M-1', zh: '耳飾 design M-1' },
    category: 'ear',
    price: 4400,
    provisional: true,
    lead: { ja: '細いリボンが、肩先まで揺れる。', zh: '細細的緞帶，一路搖曳到肩頭。' },
    description: {
      ja: '小さなリボンを連ね、細いリボンを長く垂らしたイヤーアクセサリー。TEEENUのなかでも人気のデザインです。',
      zh: '串起小小的蝴蝶結，再垂下長長細緞帶的耳飾，是TEEENU的人氣設計。',
    },
    details: [handmade],
    source: ig('/reel/De6NHf9ICSI/'),
    art: { kind: 'earrings', plate: '#E6EAEE', variant: 1 },
    tryOn: {
      prompt:
        'a long ear accessory (design M-1): a vertical row of three or four tiny pale-blue ribbon bows with small silver beads worn along the ear, with two thin pale-blue ribbons hanging down from it to the shoulder',
      hint: { ja: '耳から肩まで写っている写真がおすすめです。', zh: '建議使用拍到耳朵至肩膀的照片。' },
    },
  },
  {
    id: 'teeenu-braid-hair-dress',
    creator: 'teeenu',
    name: { ja: '三つ編み専用ヘアドレス', zh: '麻花辮專用髮飾' },
    category: 'hair',
    price: 4400,
    provisional: true,
    lead: { ja: '三つ編みの先に、レースをひとつ。', zh: '在麻花辮的尾端，添上一片蕾絲。' },
    description: {
      ja: '三つ編みを華やかに、かわいく見せるためのヘアアクセサリー。編んだ髪の先に留めると、白いレースがふわりと広がります。',
      zh: '讓麻花辮更華麗、更可愛的髮飾。別在編好的髮尾，白色蕾絲便輕盈地展開。',
    },
    details: [handmade],
    source: ig('/reel/DewQ2AjIqAc/'),
    art: { kind: 'hair', plate: '#E8E6EA' },
    tryOn: {
      prompt:
        'a hair accessory for braids: a soft white lace frill shaped like a small skirt, about 15 cm wide, wrapped around and attached near the end of a single braid so that the lace flares out around the braid tip',
      hint: {
        ja: '三つ編みにした髪が写っている写真がおすすめです。',
        zh: '建議使用拍到麻花辮的照片。',
      },
    },
  },
  {
    id: 'teeenu-frill-bag',
    creator: 'teeenu',
    name: { ja: 'フリル刺繍バッグ', zh: '荷葉邊刺繡包' },
    category: 'bag',
    price: 13200,
    provisional: true,
    lead: { ja: 'TEEENUはじめてのバッグ。', zh: 'TEEENU的第一款包包。' },
    description: {
      ja: '丸いかたちをフリルで縁取り、中央に花の刺繍をあしらったバッグ。発売から人気を集め、再販を重ねてきました。',
      zh: '圓形包身以荷葉邊鑲邊，中央綴有花朵刺繡。自發售以來大受歡迎，已多次再販。',
    },
    details: [handmade, nameIsProvisional],
    source: ig('/reel/DfhAnYHozmf/'),
    art: { kind: 'bag', plate: '#EAE7E2' },
    tryOn: {
      prompt:
        'a round white fabric shoulder bag about 30 cm across, edged all around with a white ruffle frill, with an oval lace panel in the centre embroidered with small pink roses and green leaves, hanging from the shoulder on a gathered white strap',
      hint: { ja: '上半身から腰あたりまで写っている写真がおすすめです。', zh: '建議使用拍到上半身至腰部的照片。' },
    },
  },
  {
    id: 'teeenu-lace-ribbon-bag',
    creator: 'teeenu',
    name: { ja: 'レースリボンバッグ', zh: '蕾絲蝴蝶結包' },
    category: 'bag',
    price: 9900,
    provisional: true,
    lead: { ja: '大きなリボンを、手元に。', zh: '把大大的蝴蝶結帶在手邊。' },
    description: {
      ja: '白いレースの生地で仕立て、正面に大きなリボンを結んだバッグ。白でまとめた日の、最後のひと仕上げに。',
      zh: '以白色蕾絲布料製作，正面繫上大大的蝴蝶結。為一身白色的日子，畫下最後的句點。',
    },
    details: [handmade, nameIsProvisional],
    source: ig('/p/De1O0kFn080/'),
    art: { kind: 'bag', plate: '#E6E3DD' },
    tryOn: {
      prompt:
        'a soft white lace handbag with a single short handle, its front tied into one large lace ribbon bow with two long tails hanging below the bag, carried in one hand or on the forearm',
      hint: { ja: '上半身から腰あたりまで写っている写真がおすすめです。', zh: '建議使用拍到上半身至腰部的照片。' },
    },
  },
]
