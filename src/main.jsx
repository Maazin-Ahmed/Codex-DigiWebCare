import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { CartProvider } from './cart/CartContext.jsx'
import { CatalogProvider } from './services/CatalogContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <CatalogProvider>
        <App />
      </CatalogProvider>
    </CartProvider>
  </StrictMode>,
)
