import type { ComponentType } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ScrollToTop } from './components/Shell'
import { CartProvider } from './lib/cart'
import { Cart } from './pages/Cart'
import { Checkout } from './pages/Checkout'
import { Contact } from './pages/Contact'
import { Guide, Legal, Privacy, Terms } from './pages/InfoPages'
import { Journal } from './pages/Journal'
import { NotFound } from './pages/NotFound'
import { OrderComplete } from './pages/OrderComplete'
import { ProductDetail } from './pages/ProductDetail'
import { Shop } from './pages/Shop'
import { Story } from './pages/Story'

interface Props {
  basename: string
  Layout: ComponentType
  Home: ComponentType
}

/** ルーティングとカートは両デザイン案で共通。見た目に関わる Layout と Home だけを差し替える。 */
export function AppShell({ basename, Layout, Home }: Props) {
  return (
    <BrowserRouter basename={basename}>
      <CartProvider>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="shop/:id" element={<ProductDetail />} />
            <Route path="story" element={<Story />} />
            <Route path="journal" element={<Journal />} />
            <Route path="contact" element={<Contact />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="complete" element={<OrderComplete />} />
            <Route path="guide" element={<Guide />} />
            <Route path="legal" element={<Legal />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}
