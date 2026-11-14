import type { Place } from './types'

// 土地のデータ。status: 'live' は掲載中のつくり手がいる土地、
// 'sample' は「これから広がる」ことを地図上で見せるための掲載イメージ。

export const places: Place[] = [
  {
    slug: 'tokyo',
    status: 'live',
    name: { ja: '東京', zh: '東京' },
    en: 'Tokyo',
    prefecture: '13',
    lat: 35.6595,
    lon: 139.7405,
    craft: { ja: 'ホワイトコーデのアクセサリー', zh: '白色穿搭的飾品' },
    summary: {
      ja: 'TEEENUの作品に出会える街。原宿の交差点から、湾岸の有明まで。',
      zh: '能遇見TEEENU作品的城市。從原宿的十字路口，到灣岸的有明。',
    },
    body: [
      {
        ja: 'つくり手が作品を届ける場所は、アトリエだけではありません。TEEENUは原宿・ハラカドのMaison KOSÉ、そして有明の東京ビッグサイトで開かれるデザインフェスタと、東京の街なかで作品を手に取れる機会をつくってきました。',
        zh: '創作者把作品交到大家手上的地方，不只有工作室。TEEENU曾在原宿HARAKADO的Maison KOSÉ，以及有明東京Big Sight舉辦的Design Festa，創造了在東京街頭親手拿起作品的機會。',
      },
      {
        ja: '流行が生まれる原宿と、全国のつくり手が集まる有明。ふたつの場所を結ぶと、白い服で歩きたくなる一日ができあがります。',
        zh: '孕育流行的原宿，以及日本各地創作者齊聚的有明。把這兩個地方連起來，就成了讓人想穿上白色衣服漫步的一天。',
      },
    ],
    spots: [
      {
        id: 'meiji',
        name: { ja: '明治神宮', zh: '明治神宮' },
        lat: 35.6764,
        lon: 139.6993,
        note: { ja: '原宿駅すぐの森', zh: '緊鄰原宿站的森林' },
      },
      {
        id: 'harakado',
        name: { ja: 'ハラカド', zh: 'HARAKADO' },
        lat: 35.6689,
        lon: 139.7056,
        note: { ja: '神宮前交差点の商業施設', zh: '神宮前十字路口的商場' },
      },
      {
        id: 'omotesando',
        name: { ja: '表参道', zh: '表參道' },
        lat: 35.6672,
        lon: 139.709,
        note: { ja: 'けやき並木の大通り', zh: '櫸樹林蔭大道' },
      },
      {
        id: 'bigsight',
        name: { ja: '東京ビッグサイト', zh: '東京Big Sight' },
        lat: 35.63,
        lon: 139.794,
        note: { ja: 'デザインフェスタの会場', zh: 'Design Festa 會場' },
      },
      {
        id: 'odaiba',
        name: { ja: 'お台場海浜公園', zh: '御台場海濱公園' },
        lat: 35.6298,
        lon: 139.7745,
        note: { ja: '東京湾に面した砂浜', zh: '面向東京灣的沙灘' },
      },
    ],
    journey: {
      title: { ja: '白い服で歩く、東京の一日', zh: '穿著白色漫步，東京的一日' },
      lead: {
        ja: 'TEEENUの足あとをたどりながら、白い服が映える場所をめぐるプランです。',
        zh: '沿著TEEENU的足跡，走訪最襯白色穿搭的地方。',
      },
      duration: { ja: '1日・電車と徒歩', zh: '1日・電車＋步行' },
      provisional: true,
      stops: [
        {
          spot: 'meiji',
          time: { ja: '午前', zh: '上午' },
          title: { ja: '森の参道を歩く', zh: '走進森林參道' },
          body: {
            ja: '原宿駅のすぐそばに広がる森から一日をはじめます。木漏れ日のなかで、白い服と髪飾りがよく映えます。',
            zh: '從緊鄰原宿站的森林開始這一天。在灑落的陽光下，白色衣服與髮飾格外好看。',
          },
        },
        {
          spot: 'harakado',
          time: { ja: '昼前', zh: '近午' },
          title: { ja: 'TEEENUが作品を並べた場所へ', zh: '前往TEEENU展售過作品的地方' },
          body: {
            ja: '神宮前交差点のハラカドへ。2025年、TEEENUがMaison KOSÉの「SELECT STAND」で作品を販売した場所です。',
            zh: '前往神宮前十字路口的HARAKADO。2025年，TEEENU曾在這裡的Maison KOSÉ「SELECT STAND」販售作品。',
          },
          creator: 'teeenu',
        },
        {
          spot: 'omotesando',
          time: { ja: '午後', zh: '下午' },
          title: { ja: 'けやき並木をゆっくりと', zh: '在櫸樹大道慢慢散步' },
          body: {
            ja: '表参道のけやき並木を歩きます。ショーウィンドウに映る耳元を、ときどき確かめながら。',
            zh: '漫步表參道的櫸樹林蔭大道，不時看看櫥窗玻璃上映出的耳畔。',
          },
        },
        {
          spot: 'bigsight',
          time: { ja: '午後', zh: '下午' },
          title: { ja: 'ゆりかもめで湾岸へ', zh: '搭百合海鷗號前往灣岸' },
          body: {
            ja: '新橋からゆりかもめに乗って有明へ。TEEENUが2026年11月のデザインフェスタに出店した東京ビッグサイトがあります。',
            zh: '從新橋搭乘百合海鷗號前往有明。這裡的東京Big Sight，是TEEENU於2026年11月參加Design Festa的會場。',
          },
          creator: 'teeenu',
        },
        {
          spot: 'odaiba',
          time: { ja: '夕方', zh: '傍晚' },
          title: { ja: '海辺で、今日の一枚を', zh: '在海邊拍下今天的一張' },
          body: {
            ja: '一日の終わりはお台場の海辺で。夕暮れの光のなかで、今日の装いを写真に残しましょう。',
            zh: '一天的最後來到御台場的海邊。在夕陽的光線裡，把今天的穿搭留在照片中。',
          },
        },
      ],
    },
  },
  {
    slug: 'otaru',
    status: 'sample',
    name: { ja: '小樽', zh: '小樽' },
    en: 'Otaru',
    prefecture: '01',
    lat: 43.1907,
    lon: 140.9947,
    craft: { ja: 'ガラス', zh: '玻璃工藝' },
    summary: {
      ja: '石油ランプと漁の浮き玉づくりから育った、ガラスの街。',
      zh: '從煤油燈與漁業浮球的製作中發展起來的玻璃之城。',
    },
    body: [],
    spots: [],
  },
  {
    slug: 'tsubame-sanjo',
    status: 'sample',
    name: { ja: '燕三条', zh: '燕三條' },
    en: 'Tsubame-Sanjo',
    prefecture: '15',
    lat: 37.65,
    lon: 138.93,
    craft: { ja: '金属加工', zh: '金屬加工' },
    summary: {
      ja: '洋食器の燕、刃物の三条。金属を扱う技術が集まる産地。',
      zh: '西式餐具的燕、刀具的三條。匯聚金屬加工技術的產地。',
    },
    body: [],
    spots: [],
  },
  {
    slug: 'mashiko',
    status: 'sample',
    name: { ja: '益子', zh: '益子' },
    en: 'Mashiko',
    prefecture: '09',
    lat: 36.4673,
    lon: 140.0934,
    craft: { ja: '焼きもの', zh: '陶器' },
    summary: {
      ja: '江戸時代の終わりに始まった益子焼の里。春と秋には陶器市が開かれます。',
      zh: '始於江戶時代末期的益子燒之鄉，每年春秋都會舉辦陶器市集。',
    },
    body: [],
    spots: [],
  },
  {
    slug: 'imabari',
    status: 'sample',
    name: { ja: '今治', zh: '今治' },
    en: 'Imabari',
    prefecture: '38',
    lat: 34.0663,
    lon: 132.9978,
    craft: { ja: 'タオル', zh: '毛巾' },
    summary: {
      ja: '瀬戸内海に面した、日本を代表するタオルの産地。',
      zh: '面向瀨戶內海，日本具代表性的毛巾產地。',
    },
    body: [],
    spots: [],
  },
  {
    slug: 'hasami',
    status: 'sample',
    name: { ja: '波佐見', zh: '波佐見' },
    en: 'Hasami',
    prefecture: '42',
    lat: 33.1381,
    lon: 129.8956,
    craft: { ja: '焼きもの', zh: '陶瓷器' },
    summary: {
      ja: 'およそ400年にわたり、日々の器をつくり続けてきた波佐見焼の町。',
      zh: '約400年來，持續製作日常器皿的波佐見燒之町。',
    },
    body: [],
    spots: [],
  },
]
