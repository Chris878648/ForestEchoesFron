import React, { useState } from "react";
import logo from "../Images/logo.png";
import "../Pages/HomePage/home.css";

const Header = ({ links }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <div className="header-left">
        <img src={logo} alt="Forest Echoes Logo" className="header-logo" />
      </div>

      <nav className="nav-container">
        {links.map((link, index) => (
          link.label === "Menu" ? (
            <div key={index} className="menu-container">
              <button className="menu-button" onClick={toggleMenu}>
                {link.label} ▼
              </button>
              {menuOpen && (
                <div className="dropdown-menu">
                  <a href="/profile" className="dropdown-item">Perfil</a>
                  <a href="/" className="dropdown-item" >
                    Cerrar sesión
                  </a>
                </div>
              )}
            </div>
          ) : (
            <a key={index} href={link.href} className="nav-link">
              {link.label}
            </a>
          )
        ))}
      </nav>
    </header>
  );
};

export default Header;
