import Header from "../../Layouts/Header";
import React from "react";
import "./cart.css";

const Cart = () => {
  const navLinks = [
    { label: "Contacto", href: "/contact" },
    { label: "Home", href: "/home" },
    { label: "Menu", href: "/menu" },
  ];

  // Datos de ejemplo del carrito
  const cartItems = [
    { id: 1, name: "Producto 1", quantity: 2, price: 100 },
    { id: 2, name: "Producto 2", quantity: 1, price: 200 },
    { id: 3, name: "Producto 3", quantity: 3, price: 150 },
  ];

  return (
    <>
      <div className="header-container">
        <Header links={navLinks} />
      </div>

      <div className="cart-container">
        <h2 className="cart-title">Carrito de Compras</h2>

        <table className="cart-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>${item.price}</td>
                <td>${item.quantity * item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="pay-button">Pagar</button>
      </div>
    </>
  );
};

export default Cart;
