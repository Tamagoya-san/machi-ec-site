import { StrictMode, type ComponentType } from 'react'
import { createRoot } from 'react-dom/client'

// 先頭のパスでデザイン案を切り替える。読み込むのは選ばれた案の JS / CSS / フォントだけ。
const designs: Record<string, { load: () => Promise<{ default: ComponentType }>; themeColor: string }> = {
  a: { load: () => import('./themes/cloud'), themeColor: '#a6c8e6' },
  b: { load: () => import('./themes/retro'), themeColor: '#f4ebd9' },
}

const key = window.location.pathname.split('/')[1] ?? ''
const design = Object.hasOwn(designs, key) ? designs[key] : null
const load = design ? design.load() : import('./chooser/Chooser')

if (design) document.querySelector('meta[name="theme-color"]')?.setAttribute('content', design.themeColor)
else if (window.location.pathname !== '/') window.history.replaceState(null, '', '/')

load.then(({ default: App }) => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
