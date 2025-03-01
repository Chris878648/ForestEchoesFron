import React from "react";
import "./registerPage.css";
import logo from "../../Images/logo.png";
import register from "../../Images/register.png";

const RegisterPage = () => {
  return (
    <div className="register-container">
      <div className="register-image">
        <img src={register} alt="Plant" />
      </div>
      <div className="register-form">
        <img src={logo} alt="Logo" className="register-logo" />
        <form>
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-input"
          />
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
          />
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-input"
          />
          <button type="submit" className="register-button">
            REGISTER
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;