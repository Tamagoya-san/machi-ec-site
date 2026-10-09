import '@fontsource/zen-maru-gothic/400.css'
import '@fontsource/zen-maru-gothic/500.css'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import '@fontsource/klee-one/600.css'
import '@fontsource/mrs-saint-delafield/400.css'
import '../../styles/base.css'
import './cloud.css'
import { AppShell } from '../../AppShell'
import { Home } from './Home'
import { Layout } from './Layout'

export default function CloudApp() {
  return <AppShell basename="/a" Layout={Layout} Home={Home} />
}
