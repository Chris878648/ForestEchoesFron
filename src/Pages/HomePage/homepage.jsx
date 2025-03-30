import React, { useEffect, useState } from "react";
import Header from "../../Layouts/Header";
import Footer from "../../Layouts/Footer";
import "./home.css";
import cactusImg from "../../Images/cactus.png";
import floresImg from "../../Images/flores.png";
import plantaImg from "../../Images/planta.png";
import { toast } from "react-toastify";
import { getProducts, addToCart } from "../../services/userService"; 

const Home = () => {
  const navLinks = [
    { label: "Contacto", href: "/contact" },
    { label: "Carrito", href: "/cart" },
    { label: "Menu", href: "" },
  ];

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        setLoading(true);
        // Usar el servicio getProducts
        const data = await getProducts();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
      }
    };

    fetchProductsData();
  }, []);

  const handleAddToCart = async (productId, price, name) => {
    const userId = localStorage.getItem("userId"); // Obtener el userId del localStorage

    if (!userId) {
      toast.error("No se encontró el ID del usuario. Por favor, inicia sesión.");
      return;
    }

    try {
      // Usar el servicio addToCart
      await addToCart(userId, productId, price, name, 1);
      toast.success("Producto añadido al carrito");
    } catch (error) {
      console.error("Error al añadir al carrito:", error);
      toast.error("Error al añadir al carrito");
    }
  };

  return (
    <div className="home-container">
      <Header links={navLinks} />

      <div className="hero-image">
        <h1 className="hero-text">FOREST ECHOES</h1>
      </div>

      <div className="gallery">
        <div className="gallery-item">
          <img src={cactusImg} alt="Cactus" />
          <p>CACTUS</p>
        </div>
        <div className="gallery-item">
          <img src={floresImg} alt="Flores" />
          <p>FLORES</p>
        </div>
        <div className="gallery-item">
          <img src={plantaImg} alt="Plantas" />
          <p>PLANTAS</p>
        </div>
      </div>

      <div className="product-line">
        <h2 className="product-line-title">Nuestra Línea de Productos</h2>
        <div className="product-line-divider"></div>

        {loading && <p>Cargando productos...</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="product-list">
          {products.map((product) => (
            <div key={product.id} className="product-item">
              <img
                src={`/ImageProducts/${product.imageUrl}`}
                alt={product.name}
                onError={(e) => {
                  e.target.src = "/ImageProducts/placeholder.jpg";
                  e.target.onerror = null;
                }}
              />
              <h3>{product.name}</h3>
              <p>{product.description?.substring(0, 50)}...</p>
              <p>${product.price?.toFixed(2) || "0.00"}</p>
              <button
                className="add-to-cart-button"
                onClick={() => handleAddToCart(product.id, product.price, product.name)}
              >
                Añadir al carrito
              </button>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;