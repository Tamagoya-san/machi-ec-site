# Machi Atlas

台湾と日本をつなぐクリエイター Machi（[@machihistory](https://www.instagram.com/machihistory/)）が、日本で活動するつくり手の作品を「背景」と「土地」ごと紹介して販売するオンラインストアのテストサイトです。

- テスト公開：<https://machi-ec-site.vercel.app>
- 第一弾のつくり手：TEEENU（[@teeenu_official](https://www.instagram.com/teeenu_official/)）
- 言語：日本語（`/ja`）・繁體中文（`/zh`）

> テスト公開中のサイトです。検索エンジンには載らない設定（noindex）で、注文・決済は行われません。

## サイトの考え方

1. Machi が Instagram / TikTok の動画でつくり手を紹介する
2. 動画のリンクから、つくり手ごとのページ（LP）に来る
3. 背景を読み、作品を選ぶ。AI試着で身につけた姿も確かめられる
4. 作品が生まれた土地を地図でたどり、旅のプランにつなげる

## ページ

| パス | 内容 |
| --- | --- |
| `/[locale]` | ホーム（地図・掲載中のつくり手・土地の索引） |
| `/[locale]/map` | 日本地図。つくり手・地名の検索、ピンから土地の情報へ |
| `/[locale]/creators` | つくり手の一覧 |
| `/[locale]/creators/[slug]` | つくり手のLP |
| `/[locale]/items/[id]` | 作品の詳細 |
| `/[locale]/places/[slug]` | 土地のページ（つくり手・作品・旅のプラン） |
| `/[locale]/try-on` | AI試着 |
| `/[locale]/cart` `/checkout` `/complete` | カートと注文（モック。何も送信されません） |
| `/[locale]/about` `/guide` | Machi Atlas について・ご利用ガイド |

## 技術

Next.js 16（App Router）/ React 19 / TypeScript / zod。CSS は素の CSS（`src/styles`）で、外部のフォントや画像は読み込みません。

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # 本番ビルド
npm run lint       # oxlint
npm run typecheck  # tsc
```

## 中身の追加（LPを増やす）

内容はすべて `src/content` の型つきデータです。ページのコードに触らずに、つくり手・作品・土地を増やせます。

### つくり手を追加する

1. `src/content/creators/teeenu.ts` を複製して `src/content/creators/{slug}.ts` をつくる
2. `src/content/index.ts` の一覧に追加する
3. 写真を置く（下の「写真」を参照）

LP は `sections` に並べた順に表示されます。使えるセクションは次のとおりです（型は `src/content/types.ts`）。

| type | 用途 |
| --- | --- |
| `note` | Machi のひとこと（引用元のリンクつき） |
| `story` | 背景の文章と写真 |
| `gallery` | 写真のギャラリー |
| `points` | 3つの特徴 |
| `video` | 紹介動画へのリンク（カバー画像つき） |
| `products` | 作品の一覧 |
| `tryon` | AI試着への導線 |
| `timeline` | 出店・販売の歩み |
| `place` | 土地と旅のプランへの導線 |
| `guide` | お届けの案内 |

色は `theme`（`paper` / `soft` / `ink` / `accent`）でつくり手ごとに変えられます。文言は `{ ja, zh }` の二言語で書きます。

### 土地を追加する

`src/content/places.ts` に追加します。緯度経度から地図上の位置が決まり、`journey` に旅のプラン（立ち寄り先）を書けます。つくり手のいない土地は「つくり手募集中」として表示されます。

### 写真

| 置き場所 | 用途 |
| --- | --- |
| `public/photos/items/{商品ID}.jpg` | 作品写真。置くだけで一覧・詳細に反映され、AI試着の参照画像にもなります |
| `public/photos/creators/{slug}/` | LP の写真（データから `src` で指定） |
| `public/photos/machi/` | Machi の写真 |

作品写真がない場合は、イラスト（`art`）が代わりに表示されます。

## AI試着

自分の写真と作品を組み合わせた画像を、Google の Gemini API で生成します。

| 環境変数 | 内容 |
| --- | --- |
| `GEMINI_API_KEY` | 必須。[Google AI Studio](https://aistudio.google.com/) で発行（課金の有効化が必要） |
| `TRYON_MODEL` | 任意。使用する画像モデル |
| `TRYON_DAILY_LIMIT` | 任意。1日あたりの生成回数の上限（既定 200） |

ローカルでは `.env.local`、Vercel では Project Settings > Environment Variables に設定します。未設定のあいだは、試着ページに「準備中」と表示されます。

- キーはサーバー側（`src/app/api/try-on/route.ts`）でのみ使い、ブラウザには渡しません
- アップロードされた写真はサーバーに保存しません
- 回数制限はサーバーのメモリ上の簡易なものです。Google 側でも利用額の上限を設定してください

## デプロイ

GitHub の `main` に push すると、Vercel が自動でデプロイします（`vercel.json` で Next.js を指定）。

## 公開前に確認すること

- **写真**：TEEENU と Machi の写真は、テストサイト用に Instagram から取得したものです。正式公開の前に、本人（および撮影者）へ掲載の許可を確認してください
- **価格と商品名**：flower crown 以外の価格は仮です（サイト上でも「価格は仮」と表示）。バッグ2点は商品名も仮です
- **中国語の文面**：繁體中文は Machi さんの確認が必要です
- **サンプルの土地**：東京以外の土地は、地図の広がりを見せるための仮のデータです
- **決済**：注文フォームはモックです。公開時は Stripe などの決済を組み込みます
- **noindex**：`next.config.ts` の `X-Robots-Tag` を外すと検索結果に載るようになります
