import React, { useState } from "react";
import "./registerPage.css";
import logo from "../../Images/logo.png";
import registerImg from "../../Images/register.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import emailjs from "emailjs-com"; 
import { register } from "../../services/authService";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    verificationCode: "", 
  });

  const [showPassword, setShowPassword] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(""); 
  const [step, setStep] = useState(1);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const generateVerificationCode = () => {
    const characters = "0123456789";
    let code = "";
    for (let i = 0; i < 5; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };

  const sendVerificationEmail = async (email, code) => {
    try {
      const templateParams = {
        user_email: email,
        verification_code: code,
      };

      await emailjs.send(
        "service_rzxc9pt", 
        "template_8vrbqrp", 
        templateParams,
        "TC1lJ4XPQq3ErLHs2" 
      );

      toast.success("Correo de verificación enviado.");
    } catch (error) {
      console.error("Error al enviar el correo de verificación:", error);
      toast.error("Error al enviar el correo de verificación.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const code = generateVerificationCode();
    setGeneratedCode(code);

    await sendVerificationEmail(formData.email, code);

    toast.info("Por favor, verifica tu correo electrónico.");
    setStep(2);
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (generatedCode === formData.verificationCode) {
      toast.success("Correo verificado con éxito.");
      await handleRegister(); 
    } else {
      toast.error("El código de verificación es incorrecto.");
    }
  };

  const handleRegister = async () => {
    try {
      await register(formData.username, formData.email, formData.password);
      toast.success("Usuario registrado con éxito");
      navigate("/"); 
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message || "Username o email ya existen");
      } else {
        console.error("Error:", error);
        toast.error("Error al registrar el usuario");
      }
    }
  };

  return (
    <div className="register-container">
      <button className="back-button" onClick={() => navigate("/")}>
        <FaArrowLeft />
      </button>

      <div className="register-image">
        <img src={registerImg} alt="Plant" />
      </div>
      <div className="register-form">
        <img src={logo} alt="Logo" className="register-logo" />
        {step === 1 && (
          <form onSubmit={handleSubmit}>
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-input"
              value={formData.username}
              onChange={handleChange}
            />
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
            />
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="form-input"
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
            <button type="submit" className="register-button">
                Registrar
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyCode}>
            <label htmlFor="verificationCode" className="form-label">
              Código de Verificación
            </label>
            <input
              type="text"
              id="verificationCode"
              name="verificationCode"
              className="form-input"
              value={formData.verificationCode}
              onChange={handleChange}
            />
            <button type="submit" className="register-button">
              Verificar Código
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;