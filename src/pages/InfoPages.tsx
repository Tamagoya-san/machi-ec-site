import type { ReactNode } from 'react'
import { PageHero } from '../components/Decor'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '../lib/cart'
import { formatYen } from '../lib/format'

function Doc({ en, ja, children }: { en: string; ja: string; children: ReactNode }) {
  return (
    <>
      <PageHero en={en} ja={ja} />
      <section className="section section--tight">
        <div className="doc">
          {children}
          <p className="doc__mock">※ 本ページの記載内容はモック用のダミーです。公開前に正式な内容へ差し替えてください。</p>
        </div>
      </section>
    </>
  )
}

export function Legal() {
  const rows: [string, string][] = [
    ['販売事業者', '（事業者名）'],
    ['運営統括責任者', '（責任者名）'],
    ['所在地', '請求があった場合に遅滞なく開示いたします'],
    ['電話番号', '請求があった場合に遅滞なく開示いたします'],
    ['メールアドレス', 'shop@example.com'],
    ['販売価格', '各商品ページに税込価格で表示'],
    ['商品代金以外の必要料金', `送料 ${formatYen(SHIPPING_FEE)}（${formatYen(FREE_SHIPPING_THRESHOLD)}以上のご注文で無料）、コンビニ払い手数料`],
    ['お支払い方法', 'クレジットカード、PayPay、コンビニ払い'],
    ['お支払い時期', 'クレジットカード：ご注文時／コンビニ払い：ご注文から3日以内'],
    ['商品の引渡し時期', 'ご注文確定後、2〜5営業日以内に発送'],
    ['返品・交換', '商品到着後7日以内、未使用・未開封に限り承ります（食品を除く）'],
  ]
  return (
    <Doc en="Legal" ja="特定商取引法に基づく表記">
      <dl className="doc__table">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </Doc>
  )
}

export function Privacy() {
  return (
    <Doc en="Privacy" ja="プライバシーポリシー">
      <h2>1. 取得する情報</h2>
      <p>氏名、住所、電話番号、メールアドレス、注文履歴など、商品のお届けに必要な情報を取得します。</p>
      <h2>2. 利用目的</h2>
      <p>商品の発送、お問い合わせへの対応、サービス改善のために利用し、それ以外の目的では利用しません。</p>
      <h2>3. クレジットカード情報</h2>
      <p>カード情報は決済代行会社が管理し、当ショップのサーバーでは保持しません（カード情報非保持化）。</p>
      <h2>4. 安全管理措置</h2>
      <p>通信の暗号化（TLS）、アクセス権限の最小化、ログの監視などにより、個人情報を適切に管理します。</p>
      <h2>5. 第三者提供</h2>
      <p>法令に基づく場合を除き、ご本人の同意なく第三者へ提供することはありません。</p>
      <h2>6. 開示・訂正・削除</h2>
      <p>ご本人からの請求に応じ、保有する個人情報の開示・訂正・削除に対応します。</p>
    </Doc>
  )
}

export function Terms() {
  return (
    <Doc en="Terms" ja="利用規約">
      <h2>第1条（適用）</h2>
      <p>本規約は、Machi Story Shop（以下「当ショップ」）の利用に関する条件を定めるものです。</p>
      <h2>第2条（注文の成立）</h2>
      <p>当ショップからの注文確認メールの送信をもって、売買契約が成立するものとします。</p>
      <h2>第3条（禁止事項）</h2>
      <p>不正アクセス、転売目的での大量購入、他の利用者への迷惑行為を禁止します。</p>
      <h2>第4条（免責）</h2>
      <p>天災・配送事故など当ショップの責に帰さない事由による損害について、責任を負いません。</p>
    </Doc>
  )
}

export function Guide() {
  return (
    <Doc en="Guide" ja="ご利用ガイド">
      <h2>送料について</h2>
      <p>
        全国一律 {formatYen(SHIPPING_FEE)}。{formatYen(FREE_SHIPPING_THRESHOLD)}（税込）以上のご注文で送料無料です。
      </p>
      <h2>お届けについて</h2>
      <p>ご注文確定後、2〜5営業日以内に発送します。台湾からの直送品は7〜14日ほどお時間をいただきます。</p>
      <h2>ギフト包装</h2>
      <p>ご注文時の備考欄にご記入いただくと、無料でギフト包装いたします。</p>
      <h2>海外発送（台湾向け）</h2>
      <p>台湾への発送も準備中です。開始時期はInstagramでお知らせします。</p>
    </Doc>
  )
}
