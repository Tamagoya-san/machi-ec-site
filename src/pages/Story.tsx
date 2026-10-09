import { Link } from 'react-router-dom'
import { Bubbles, PageHero, SectionTitle } from '../components/Decor'
import { INSTAGRAM_ROOM_URL, INSTAGRAM_URL } from '../lib/site'

const timeline = [
  { year: '台湾', title: '観光を学んだ7年間', text: '大学・大学院で観光事業管理を専攻。いつか「旅を案内する人」になりたいと思っていました。' },
  { year: '2017', title: '東京へ', text: 'スーツケースひとつで来日。言葉も文化も、毎日が小さな発見の連続でした。' },
  { year: '2020', title: '「Machi說故事」スタート', text: 'ガイドの夢が遠のいたコロナ禍。オンラインで日本の文化や歴史を語りはじめました。' },
  { year: '2026', title: '東京生活9年目', text: 'モデル・会社員・クリエイターとして、日本と台湾をつなぐ発信を続けています。' },
]

export function Story() {
  return (
    <>
      <PageHero en="Story" ja="Machiのこと" lead="台湾出身・東京在住。日本と台湾を、物語でつなぐ。" />

      <section className="profile">
        <div className="profile__photo">
          <div className="profile__frame">
            <Bubbles count={5} />
            <span>Photo</span>
            <small>ご本人写真に差し替え</small>
          </div>
        </div>
        <div className="profile__body">
          <p className="profile__en">Machi まち</p>
          <h2 className="profile__name">
            鄭羽婷 <span lang="zh-Hant">Machi</span>
          </h2>
          <p className="profile__role">モデル・会社員・クリエイター</p>
          <p className="profile__text">
            台湾で観光を学び、2017年に来日。「Machi說故事（Machiが語る物語）」として、
            日本の文化・歴史・旅の小さな発見を、台湾のみなさんへ届けてきました。
          </p>
          <p className="profile__text">
            このお店では、その反対側の物語を。わたしが育った台湾の味や手しごと、
            そして東京で生まれたオリジナルアイテムを、ひとつずつ選んでお届けします。
          </p>
          <div className="profile__links">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="button button--ghost">
              @machihistory
            </a>
            <a href={INSTAGRAM_ROOM_URL} target="_blank" rel="noopener noreferrer" className="button button--ghost">
              @machiroomhere 生活帳
            </a>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <SectionTitle en="Timeline" ja="これまでの歩み" zh="一路走來" />
        <ol className="timeline">
          {timeline.map((t) => (
            <li key={t.title} className="timeline__item">
              <p className="timeline__year">{t.year}</p>
              <div>
                <h3 className="timeline__title">{t.title}</h3>
                <p className="timeline__text">{t.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="section">
        <SectionTitle en="Promise" ja="お店の約束" zh="小店的約定" />
        <div className="promise-grid">
          <div className="promise">
            <p className="promise__num">01</p>
            <h3>物語のあるものだけ</h3>
            <p>Machi自身が使い、食べ、出会ったものだけを選んでいます。</p>
          </div>
          <div className="promise">
            <p className="promise__num">02</p>
            <h3>台湾のつくり手と</h3>
            <p>現地の小さな工房やお店と直接やりとりし、適正な取引を大切にします。</p>
          </div>
          <div className="promise">
            <p className="promise__num">03</p>
            <h3>ていねいにお届け</h3>
            <p>ひとつずつ手で包み、Machiからのメッセージカードを添えてお送りします。</p>
          </div>
        </div>
        <div className="section__more">
          <Link to="/shop" className="button button--primary">
            商品を見る
          </Link>
        </div>
      </section>
    </>
  )
}
