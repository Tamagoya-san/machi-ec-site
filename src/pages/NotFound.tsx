import { Link } from 'react-router-dom'
import { PageHero } from '../components/Decor'

export function NotFound() {
  return (
    <>
      <PageHero en="404" ja="ページが見つかりません" lead="お探しのページは雲のむこうへ行ってしまったようです。" />
      <div className="section section--center">
        <Link to="/" className="button button--primary">
          トップへ戻る
        </Link>
      </div>
    </>
  )
}
