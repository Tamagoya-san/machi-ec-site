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

## ページ構成

| パス | 内容 |
| --- | --- |
| `/` | トップ（コンセプト・カテゴリー・おすすめ・限定品・新着・Journal・Instagram） |
| `/shop` | 商品一覧（カテゴリー絞り込み・検索・並び替え） |
| `/shop/:id` | 商品詳細（Machi's note・バリエーション・数量） |
| `/story` | Machiのプロフィール・歩み・お店の約束 |
| `/journal` | 商品にまつわる物語 |
| `/cart` `/checkout` `/complete` | カート・購入手続き（モック）・完了 |
| `/contact` `/guide` `/legal` `/privacy` `/terms` | お問い合わせ・ご利用ガイド・特商法表記・規約類 |

商品データは `src/data/products.ts`。商品画像は SVG イラスト（`src/components/ProductArt.tsx`）で、実写真に差し替える想定です。

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

### Vercel へのデプロイ例

```bash
npx vercel          # 初回はログインとプロジェクト作成
npx vercel --prod   # 本番 URL を発行
```

`vercel.json` に SPA のリライトとセキュリティヘッダーを設定済みです。
