# Machi Story Shop（モック）

Machiまち（@machihistory）さんの台湾関連商品・オリジナルグッズを扱う EC サイトの、クライアント確認用モックです。
React 19 + TypeScript + Vite。EC 機能（カート・購入手続き）は見せかけで、実際の決済・送信は行いません。

## ローカル起動

```bash
npm install
npm run dev       # http://127.0.0.1:5173 開発サーバー
npm run build     # 型チェック + 本番ビルド（dist/）
npm run preview   # http://127.0.0.1:4173 本番ビルドを本番同等のセキュリティヘッダー付きで確認
```

## デザイン案（2パターン）

| パス | 案 | 内容 |
| --- | --- | --- |
| `/` | — | 案の選択ページ（クライアントに最初に見せる入口） |
| `/a/` | A「雲と透明感」 | モデルとしての Machi さんの、やわらかく透明感のある世界観。空と雲・白／空色／淡いピンク・丸ゴシック |
| `/b/` | B「台湾レトロ・夜市」 | 語り手としての明るくユーモアのある一面。看板・タイル・夜市。屋号は愛称から「瑪奇商店」 |

各ページ左下のスイッチで、同じページのまま A / B を行き来できます。
先頭のパスで案を判定し、選ばれた案の JS・CSS・フォントだけを読み込みます（`src/main.tsx`）。

```
src/
  AppShell.tsx        ルーティング・カート（両案共通）
  pages/              商品一覧・詳細・カート・購入手続きなど（両案共通。見た目はテーマ CSS で変える）
  styles/base.css     共通の骨格。色・書体・角丸は CSS 変数
  themes/cloud/       A案の Layout（ヘッダー・フッター）・Home・CSS・雲の SVG
  themes/retro/       B案の Layout・Home・CSS
  chooser/            案の選択ページ
```

## ページ構成（各案共通。`/a` `/b` の下に並びます）

| パス | 内容 |
| --- | --- |
| `/` | トップ |
| `/shop` | 商品一覧（カテゴリー絞り込み・検索・並び替え） |
| `/shop/:id` | 商品詳細（バリエーション・数量・Machi のひとこと） |
| `/story` | Machiのプロフィール・歩み・お店の約束 |
| `/journal` | 商品にまつわる物語 |
| `/cart` `/checkout` `/complete` | カート・購入手続き（モック）・完了 |
| `/contact` `/guide` `/legal` `/privacy` `/terms` | お問い合わせ・ご利用ガイド・特商法表記・規約類 |

商品データは `src/data/products.ts`。

## 写真の差し替え

写真がない間は、商品を表す一字（茶・布・雲など）を色面に置いた仮ビジュアルを表示しています。
`src/assets/photos/` に次の名前で画像を置くと、ビルド時に自動で写真に切り替わります（jpg / png / webp / avif）。

| ファイル名 | 表示場所 |
| --- | --- |
| `hero.jpg` | A案トップの空の中のポートレート（3:4） |
| `profile.jpg` | A案トップの自己紹介・Machiのことページのポートレート（3:4〜4:5） |
| `product-{商品ID}.jpg` | 各商品（4:5）。例：`product-alishan-oolong.jpg` |

## セキュリティ方針（モック段階で実装済み）

- **CSP**：`script-src 'self'` などすべて自ドメインのみ。インラインスクリプト・外部 CDN なし（フォントもセルフホスト）
- **セキュリティヘッダー**：HSTS / X-Frame-Options / nosniff / Referrer-Policy / Permissions-Policy / COOP / CORP（`security-headers.ts`, `vercel.json`）
- **価格改ざん対策**：カートは商品 ID と数量のみ保存し、価格は常にカタログから再計算。localStorage の内容は zod で検証し不正行は破棄
- **入力検証**：全フォームを zod で検証（長さ制限・形式・制御文字除去）、URL パラメータは許可リスト方式
- **ボット対策**：ハニーポット項目 + 送信スロットル
- **XSS**：`dangerouslySetInnerHTML` 不使用、外部リンクは `rel="noopener noreferrer"`
- **カード情報非保持**：本番はホスト型決済（Stripe Checkout 等）へリダイレクトする設計
- 本番ビルドでソースマップを出力しない

本番化の際は、注文・在庫・価格の確定をサーバー側で行い、サーバー側のレート制限・CSRF 対策・監査ログを追加してください。

## 非公開テスト公開（検索に出さない）

- 全ページに `<meta name="robots" content="noindex, nofollow, ...">` と `X-Robots-Tag` ヘッダーを付与
- `robots.txt` は検索エンジンが noindex を読めるようクロールを許可し、AI 学習用クローラーのみ拒否。サイトマップは置かない
- URL を知っている人だけが閲覧できる状態になります（より厳密にするなら Vercel の Password Protection 等を併用）

### Vercel へのデプロイ

GitHub リポジトリを Vercel にインポートすれば、`main` への push ごとに自動でデプロイされます（Framework: Vite / Build: `npm run build` / Output: `dist`）。
CLI の場合は次のとおりです。

```bash
npx vercel login                     # ブラウザで承認
npx vercel link --scope tamagoya-san # プロジェクトを紐づけ
npx vercel --prod                    # 本番 URL を発行
```

`vercel.json` に SPA のリライトとセキュリティヘッダーを設定済みです。
