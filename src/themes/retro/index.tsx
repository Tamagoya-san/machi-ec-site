import '@fontsource/dela-gothic-one/400.css'
import '@fontsource/zen-kaku-gothic-new/400.css'
import '@fontsource/zen-kaku-gothic-new/500.css'
import '@fontsource/zen-kaku-gothic-new/700.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import '../../styles/base.css'
import './retro.css'
import { AppShell } from '../../AppShell'
import { Home } from './Home'
import { Layout } from './Layout'

export default function RetroApp() {
  return <AppShell basename="/b" Layout={Layout} Home={Home} />
}
