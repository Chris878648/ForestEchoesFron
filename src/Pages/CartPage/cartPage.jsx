import Header from "../../Layouts/Header";
import React, { useEffect, useState } from "react";
import Modal from "react-modal"; // Importar react-modal
import "./cart.css";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import {
  getCartItems,
  increaseCartItemQuantity,
  decreaseCartItemQuantity,
  deleteCartItem,
  createPaymentIntent,
  confirmPayment,
} from "../../services/userService";

const stripePromise = loadStripe("pk_test_51R8CTCBGUhEyaGYFM8rb871RmBZLFbaQu4mWPup4UCMKssSMijfBZY2EMnbLBlqMQy5B9IBre6fnotBZVwiuWjDy00VfwZJkK1");

Modal.setAppElement("#root"); // Configurar el elemento raíz para accesibilidad

const Cart = () => {
  const navLinks = [
    { label: "Contacto", href: "/contact" },
    { label: "Home", href: "/home" },
    { label: "Menu", href: "/menu" },
  ];

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal

  const CheckoutForm = ({ cartItems, totalAmount }) => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e) => {
      e.preventDefault();

      const userId = localStorage.getItem("userId");

      if (!userId) {
        toast.error("No se encontró el ID del usuario. Por favor, inicia sesión.");
        return;
      }

      try {
        const { clientSecret } = await createPaymentIntent(userId, cartItems, totalAmount);

        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        });

        if (result.error) {
          console.error("Error al confirmar el pago:", result.error);
          toast.error("Error al procesar el pago.");
        } else if (result.paymentIntent.status === "succeeded") {
          await confirmPayment(result.paymentIntent.id);
          toast.success("Pago realizado con éxito.");
          setCartItems([]); // Vaciar el carrito después del pago
          setIsModalOpen(false); // Cerrar el modal
        }
      } catch (error) {
        console.error("Error al procesar el pago:", error);
        toast.error("Error al procesar el pago.");
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <CardElement />
        <button type="submit" disabled={!stripe}>
          Pagar ${totalAmount.toFixed(2)}
        </button>
      </form>
    );
  };

  useEffect(() => {
    const fetchCartItemsData = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setError("No se encontró el ID del usuario. Por favor, inicia sesión.");
        setLoading(false);
        return;
      }

      try {
        const data = await getCartItems(userId);
        setCartItems(data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los productos del carrito:", error);
        setError("No se pudieron cargar los productos del carrito.");
        setLoading(false);
      }
    };

    fetchCartItemsData();
  }, []);

  const increaseQuantity = async (productId) => {
    const userId = localStorage.getItem("userId");

    try {
      // Aumentar la cantidad usando el servicio
      await increaseCartItemQuantity(userId, productId);
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } catch (error) {
      console.error("Error al aumentar la cantidad:", error);
      toast.error("Error al aumentar la cantidad.");
    }
  };

  const decreaseQuantity = async (productId, currentQuantity) => {
    if (currentQuantity <= 1) {
      toast.error("La cantidad no puede ser menor a 1.");
      return;
    }

    const userId = localStorage.getItem("userId");

    try {
      // Disminuir la cantidad usando el servicio
      await decreaseCartItemQuantity(userId, productId);
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    } catch (error) {
      console.error("Error al disminuir la cantidad:", error);
      toast.error("Error al disminuir la cantidad.");
    }
  };

  const deleteProduct = async (productId) => {
    const userId = localStorage.getItem("userId");

    try {
      // Eliminar el producto del carrito usando el servicio
      await deleteCartItem(userId, productId);
      toast.success("Producto eliminado del carrito.");
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.productId !== productId)
      );
    } catch (error) {
      console.error("Error al eliminar el producto del carrito:", error);
      toast.error("Error al eliminar el producto del carrito.");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.quantity * (item.price || 0), 0);
  };

  const totalAmount = calculateTotal();

  return (
    <>
      <div className="header-container">
        <Header links={navLinks} />
      </div>

      <div className="cart-container">
        <h2 className="cart-title">Carrito de Compras</h2>

        {loading && <p>Cargando productos...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
          <>
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name || "Producto sin nombre"}</td>
                    <td>
                      <button
                        className="decrease-button"
                        onClick={() => decreaseQuantity(item.productId, item.quantity)}
                      >
                        -
                      </button>
                      {item.quantity}
                      <button
                        className="increase-button"
                        onClick={() => increaseQuantity(item.productId)}
                      >
                        +
                      </button>
                    </td>
                    <td>${item.price || 0}</td>
                    <td>${(item.quantity * (item.price || 0)).toFixed(2)}</td>
                    <td>
                      <button
                        className="delete-button"
                        onClick={() => deleteProduct(item.productId)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="cart-total">
            </div>
            <button className="open-modal-button" onClick={() => setIsModalOpen(true)}>
              Realizar Pago ${totalAmount.toFixed(2)}
            </button>
          </>
        )}

        {!loading && !error && cartItems.length === 0 && (
          <p className="empty-cart-message">Tu carrito está vacío.</p>
        )}
      </div>

      {/* Modal para el formulario de pago */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Realizar Pago</h2>
        <Elements stripe={stripePromise}>
          <CheckoutForm cartItems={cartItems} totalAmount={totalAmount} />
        </Elements>
        <button className="close-modal-button" onClick={() => setIsModalOpen(false)}>
          Cerrar
        </button>
      </Modal>
    </>
  );
};

export default Cart;