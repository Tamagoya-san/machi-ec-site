import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { CartProvider } from './lib/cart'
import { Cart } from './pages/Cart'
import { Checkout } from './pages/Checkout'
import { Contact } from './pages/Contact'
import { Home } from './pages/Home'
import { Guide, Legal, Privacy, Terms } from './pages/InfoPages'
import { Journal } from './pages/Journal'
import { NotFound } from './pages/NotFound'
import { OrderComplete } from './pages/OrderComplete'
import { ProductDetail } from './pages/ProductDetail'
import { Shop } from './pages/Shop'
import { Story } from './pages/Story'

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
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
