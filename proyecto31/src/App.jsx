// src/App.jsx
import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import Encabezado from './components/Encabezado'
import ListaProductos from './components/ListaProductos'
import DetalleProducto from './components/DetalleProducto'
import Checkout from './components/Checkout'
import Pie from './components/Pie'
import "./App.css"

// (Optional) If you have logic for loading products globally, you could do it here
function App() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])

  // Example: load products once on mount
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err))
  }, [])

  // Helper to add items to cart
  const handleAddToCart = (product, quantity) => {
    setCart(prev => {
      const existing = prev.find(item => item.product._id === product._id)
      if (existing) {
        // Update quantity
        return prev.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        // Add new item
        return [...prev, { product, quantity }]
      }
    })
  }

  // Helper to clear cart
  const handleClearCart = () => setCart([])

  return (
    <div>
      <Encabezado cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />

      <Routes>
        <Route
          path="/"
          element={
            <ListaProductos
              products={products}
            />
          }
        />
        <Route
          path="/producto/:id"
          element={
            <DetalleProducto
              onAddToCart={handleAddToCart}
            />
          }
        />
        <Route
          path="/checkout"
          element={
            <Checkout
              cart={cart}
              onClearCart={handleClearCart}
            />
          }
        />
      </Routes>

      <Pie />
    </div>
  )
}

export default App
