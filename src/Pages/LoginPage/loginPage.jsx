import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './loginPage.css';
import logo from '../../Images/logo.png';
import loginImg from '../../Images/login.png';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import { login } from '../../services/authService'; 

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); 
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(formData.username, formData.password);
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("userId", data.userId);
      toast.success("Inicio de sesión exitoso");
      navigate('/home'); 
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Credenciales incorrectas");
      } else {
        console.error("Error:", error);
        toast.error("Error al iniciar sesión");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-image">
        <img src={loginImg} alt="Plant" />
      </div>
      <div className="login-form">
        <img src={logo} alt="Logo" className="logo" />
        <form onSubmit={handleLogin}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            className="input-field"
            value={formData.username}
            onChange={handleChange}
          />
          <label htmlFor="password">Password</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"} 
              id="password"
              name="password"
              className="input-field"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="password-toggle-button"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />} 
            </button>
          </div>
          <button type="submit" className="login-button">LOGIN</button>
        </form>
        <a className="register-link" onClick={handleRegister}>Register</a>
        <a className="register-link" onClick={() => navigate('/forgot-password')}>
          ¿Olvidaste tu contraseña?
        </a>
      </div>
    </div>
  );
};

export default LoginPage;