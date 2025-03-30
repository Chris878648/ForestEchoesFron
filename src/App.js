import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Cart from "./Pages/CartPage/cartPage";
import Contact from "./Pages/ContactPage/contactPage";
import Error from "./Pages/ErrorPage/errorPage";
import HomePage from "./Pages/HomePage/homepage";
import LoginPage from "./Pages/LoginPage/loginPage";
import Profile from "./Pages/ProfilePage/profilePage";
import RegisterPage from "./Pages/RegisterPage/registerPage";
import ForgotPasswordPage from './Pages/LoginPage/forgotPasswordPage';


import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/*" element={<Error />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}

export default App;
