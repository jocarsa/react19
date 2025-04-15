// frontend/src/components/Checkout.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Checkout({ cart, onClearCart }) {
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleConfirmar = () => {
    if (cart.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }
    // Enviar la orden al backend
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cart.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
      }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("¡Gracias por tu compra!");
        onClearCart(); // Limpia el carrito
      })
      .catch((err) => console.error(err));
  };

  return (
    <section>
      <h2>Pagar</h2>
      <div id="checkout-items">
        {cart.length === 0 ? (
          <p>Tu carrito está vacío.</p>
        ) : (
          <>
            <ul>
              {cart.map((item) => (
                <li key={item.product._id}>
                  {item.product.name} - {item.quantity} x $
                  {item.product.price.toFixed(2)} = $
                  {(item.product.price * item.quantity).toFixed(2)}
                </li>
              ))}
            </ul>
            <div className="checkout-total">Total: ${total.toFixed(2)}</div>
          </>
        )}
      </div>
      <button onClick={handleConfirmar}>Confirmar Orden</button>
      <button onClick={() => navigate('/')}>Seguir Comprando</button>
    </section>
  );
}

export default Checkout;
