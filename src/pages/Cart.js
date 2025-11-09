// src/pages/Cart.js
import React, { useState, useEffect } from 'react';

export default function Cart() {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem('grotech_cart');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('grotech_cart', JSON.stringify(cart));
  }, [cart]);

  function removeItem(i) {
    const newCart = [...cart];
    newCart.splice(i, 1);
    setCart(newCart);
  }

  return (
    <section>
      <h2>Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <table className="cart-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Item Name</th>
              <th>Variant Code</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, idx) => (
              <tr key={idx}>
                <td>
                  {item.image ? (
                    <img src={item.image} alt={item.itemName} className="cart-img" />
                  ) : (
                    <div className="no-img">No image</div>
                  )}
                </td>
                <td>{item.itemName}</td>
                <td>{item.variant}</td>
                <td>{item.description}</td>
                <td>{item.qty}</td>
                <td>
                  <button className="outline" onClick={() => removeItem(idx)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
