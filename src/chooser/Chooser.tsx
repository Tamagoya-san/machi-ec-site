import '@fontsource/zen-kaku-gothic-new/400.css'
import '@fontsource/zen-kaku-gothic-new/500.css'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import './chooser.css'
import previewA from './preview-a.jpg'
import previewB from './preview-b.jpg'

const proposals = [
  {
    id: 'a',
    name: '雲と透明感',
    en: 'Cloud',
    preview: previewA,
    text: 'モデルとしてのMachiさんの、やわらかく透明感のある世界観をベースにした案。空と雲、白・空色・淡いピンク、丸みのある文字で、写真が映えるやさしい画面にまとめました。',
    keywords: ['透明感', '空と雲', 'やさしい色', '写真映え'],
    colors: ['#a6c8e6', '#ffffff', '#f8e6ea', '#3a4154'],
  },
  {
    id: 'b',
    name: '台湾レトロ・夜市',
    en: 'Night market',
    preview: previewB,
    text: '語り手としてのMachiさんの、明るくユーモアのある一面をベースにした案。台湾の看板やタイル、夜市のにぎわいをモチーフに、屋号は中国語の愛称から「瑪奇商店」としました。',
    keywords: ['台湾らしさ', '看板とタイル', 'にぎやか', 'ユーモア'],
    colors: ['#d63a2b', '#17795a', '#f3b52b', '#1c2546'],
  },
]

export default function Chooser() {
  return (
    <main className="chooser">
      <header className="chooser__head">
        <p className="chooser__label">Machi Story Shop — Design proposal</p>
        <h1 className="chooser__title">デザイン案を、ふたつご用意しました。</h1>
        <p className="chooser__lead">
          商品一覧・商品詳細・カート・購入手続きなどの機能は共通で、見た目だけが異なります。気になる案をクリックしてご覧ください。各ページ左下のスイッチで、同じページのまま案を切り替えられます。
        </p>
      </header>

      <ul className="chooser__list">
        {proposals.map((p) => (
          <li key={p.id}>
            <a href={`/${p.id}/`} className="proposal">
              <span className="proposal__frame">
                <img src={p.preview} alt={`デザイン案${p.id.toUpperCase()}のトップページ`} width={1200} height={750} decoding="async" />
              </span>
              <span className="proposal__body">
                <span className="proposal__no">
                  {p.id.toUpperCase()}
                  <em>{p.en}</em>
                </span>
                <span className="proposal__name">{p.name}</span>
                <span className="proposal__text">{p.text}</span>
                <span className="proposal__meta">
                  <span className="proposal__keywords">
                    {p.keywords.map((k) => (
                      <span key={k}>{k}</span>
                    ))}
                  </span>
                  <span className="proposal__colors" aria-hidden="true">
                    {p.colors.map((c) => (
                      <span key={c} style={{ background: c }} />
                    ))}
                  </span>
                </span>
                <span className="proposal__go">この案を見る</span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <p className="chooser__note">確認用のモックサイトです。検索エンジンには表示されず、実際のご注文・決済も行われません。</p>
    </main>
  )
}
