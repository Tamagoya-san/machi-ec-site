import Link from 'next/link'
import { creators, places } from '@/content'
import { getI18n } from '@/i18n/server'
import { BrandMark } from './BrandMark'

export async function Footer() {
  const { d, t, to } = await getI18n()
  const livePlaces = places.filter((place) => place.status === 'live')

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <div className="footer__brand">
            <BrandMark />
            <p className="footer__tagline">{d.footer.tagline}</p>
          </div>

          <div className="footer__cols">
            <div className="footer__col">
              <h3>Explore</h3>
              <ul>
                <li>
                  <Link href={to('/map')}>{d.nav.map}</Link>
                </li>
                <li>
                  <Link href={to('/creators')}>{d.nav.creators}</Link>
                </li>
                <li>
                  <Link href={to('/try-on')}>{d.nav.tryOn}</Link>
                </li>
              </ul>
            </div>
            <div className="footer__col">
              <h3>Makers &amp; Places</h3>
              <ul>
                {creators.map((creator) => (
                  <li key={creator.slug}>
                    <Link href={to(`/creators/${creator.slug}`)}>{creator.name}</Link>
                  </li>
                ))}
                {livePlaces.map((place) => (
                  <li key={place.slug}>
                    <Link href={to(`/places/${place.slug}`)}>{t(place.name)}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="footer__col">
              <h3>About</h3>
              <ul>
                <li>
                  <Link href={to('/about')}>{d.nav.about}</Link>
                </li>
                <li>
                  <Link href={to('/guide')}>{d.footer.guide}</Link>
                </li>
                <li>
                  <a href="https://www.instagram.com/machihistory/" target="_blank" rel="noopener noreferrer">
                    Instagram @machihistory
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>{d.footer.notice}</p>
          <small>© Machi Atlas</small>
        </div>
      </div>
    </footer>
  )
}
