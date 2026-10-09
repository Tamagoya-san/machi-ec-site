import { Link } from 'react-router-dom'
import { PageHead } from '../components/Heads'

export function NotFound() {
  return (
    <>
      <PageHead label="404" title="ページが見つかりません" lead="URLが変わったか、ページが削除された可能性があります。" />
      <div className="wrap section--flush">
        <Link to="/" className="arrow-link">
          トップへ戻る
        </Link>
      </div>
    </>
  )
}
