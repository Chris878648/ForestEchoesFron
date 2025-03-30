import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../Images/logo.png";
import "../Pages/HomePage/home.css";
import { toast } from "react-toastify";
import { logout } from "../services/authService"; 

const Header = ({ links }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("token"); 
      toast.success("Sesión cerrada con éxito");
      navigate("/"); 
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("No tienes autorización para cerrar sesión");
      } else {
        console.error("Error:", error);
        toast.error("Error al cerrar sesión");
      }
    }
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
                  <a className="dropdown-item" onClick={handleLogout}>
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