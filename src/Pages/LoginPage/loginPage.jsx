import React from 'react';
import { useNavigate } from 'react-router-dom';
import './loginPage.css';
import logo from '../../Images/logo.png';
import login from '../../Images/login.png';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/home');
  }

  return (
    <div className="login-container">
      <div className="login-image">
        <img src={login} alt="Plant" />
      </div>
      <div className="login-form">
        <img src={logo} alt="Logo" className="logo" />
        <form>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" className="input-field" />
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" className="input-field" />
          <button className="login-button" onClick={handleLogin}>LOGIN</button>
        </form>
        <a href className="register-link" onClick={handleRegister}>Register</a>
      </div>
    </div>
  );
};

export default LoginPage;