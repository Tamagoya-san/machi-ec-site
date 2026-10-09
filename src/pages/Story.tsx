import { Link } from 'react-router-dom'
import { PageHead, SectionHead } from '../components/Heads'
import { Photo } from '../components/Photo'
import { INSTAGRAM_ROOM_URL, INSTAGRAM_URL } from '../lib/site'

const timeline = [
  { year: '—2016', title: '台湾で観光を学ぶ', text: '大学・大学院の7年間、観光事業管理を専攻。いつか旅を案内する人になりたいと思っていました。' },
  { year: '2017', title: '東京へ', text: 'スーツケースひとつで来日。言葉も習慣も、毎日が小さな発見の連続でした。' },
  { year: '2020', title: '「Machi說故事」をはじめる', text: 'ガイドの夢が遠のいたコロナ禍に、日本の文化や歴史をオンラインで語りはじめました。' },
  { year: '2026', title: '東京生活、9年目', text: 'モデル・会社員・クリエイターとして、日本と台湾をつなぐ発信を続けています。' },
]

const promises = [
  { title: '自分で確かめたものだけ', text: 'Machi自身が使い、食べ、気に入ったものだけを並べます。' },
  { title: 'つくり手と直接', text: '台湾の小さな工房やお店と直接やりとりし、適正な価格で仕入れます。' },
  { title: 'ひとつずつ手で包む', text: '発送はすべて手作業。短いメッセージカードを添えてお届けします。' },
]

export function Story() {
  return (
    <>
      <PageHead label="Machiのこと" title="台湾で生まれて、東京で暮らす。" />

      <section className="profile wrap">
        <Photo name="profile" alt="Machiのポートレート" caption="Photo — ご本人写真に差し替え" className="profile__photo" />
        <div className="profile__body">
          <p className="label">Profile</p>
          <h2 className="profile__name">
            Machi まち<span lang="zh-Hant">鄭羽婷</span>
          </h2>
          <p className="profile__role">モデル・会社員・クリエイター</p>
          <p>
            台湾で観光を学び、2017年に来日。「Machi說故事（Machiが語る物語）」として、日本の文化や歴史、旅の小さな発見を台湾のみなさんに届けてきました。
          </p>
          <p>
            このお店は、その反対側の物語です。わたしが育った台湾の味や手しごと、東京で生まれたオリジナルアイテムを、ひとつずつ選んでお届けします。
          </p>
          <div className="profile__links">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="arrow-link arrow-link--out">
              @machihistory
            </a>
            <a href={INSTAGRAM_ROOM_URL} target="_blank" rel="noopener noreferrer" className="arrow-link arrow-link--out">
              @machiroomhere
            </a>
          </div>
        </div>
      </section>

      <section className="section wrap">
        <SectionHead no="01" title="これまで" />
        <ol className="timeline">
          {timeline.map((t) => (
            <li key={t.title} className="timeline__row">
              <span className="timeline__year num">{t.year}</span>
              <span className="timeline__title">{t.title}</span>
              <span className="timeline__text">{t.text}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="section wrap">
        <SectionHead no="02" title="お店の約束" />
        <ol className="promises">
          {promises.map((p, i) => (
            <li key={p.title}>
              <span className="num">{`0${i + 1}`}</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ol>
        <Link to="/shop" className="btn">
          商品をみる
        </Link>
      </section>
    </>
  )
}
