import Header from "../../Layouts/Header";
import Footer from "../../Layouts/Footer";
import React from "react";
import "./home.css";
import cactusImg from "../../Images/cactus.png";
import floresImg from "../../Images/flores.png";
import plantaImg from "../../Images/planta.png";

const Home = () => {
  const navLinks = [
    { label: "Contacto", href: "/contact" },
    { label: "Carrito", href: "/cart" },
    { label: "Menu", href: "/menu" },
    { label: "Error", href: "/error" },
  ];

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
      </div>

      <Footer />
    </div>
  );
};

export default Home;
