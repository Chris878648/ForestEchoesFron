import React, { useState } from "react";
import { toast } from "react-toastify";
import emailjs from "emailjs-com";
import { updatePassword } from "../../services/userService";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [step, setStep] = useState(1); // Controla el paso actual
  const [newPassword, setNewPassword] = useState("");

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleChangeCode = (e) => {
    setVerificationCode(e.target.value);
  };

  const handleChangePassword = (e) => {
    setNewPassword(e.target.value);
  };

  const generateVerificationCode = () => {
    const characters = "0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();

    const code = generateVerificationCode();
    setGeneratedCode(code);

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

      toast.success("Código de verificación enviado. Revisa tu correo.");
      setStep(2); // Pasar al paso 2
    } catch (error) {
      console.error("Error al enviar el correo de recuperación:", error);
      toast.error("Error al enviar el correo de recuperación.");
    }
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();

    if (verificationCode === generatedCode) {
      toast.success("Código verificado correctamente.");
      setStep(3); // Pasar al paso 3
    } else {
      toast.error("El código de verificación es incorrecto.");
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    try {
      // Llamar al servicio para actualizar la contraseña
      await updatePassword(email, newPassword);

      toast.success("Contraseña actualizada correctamente.");
      setStep(1); // Reiniciar el flujo
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error);
      toast.error("Error al actualizar la contraseña.");
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Recuperar Contraseña</h2>

      {step === 1 && (
        <form onSubmit={handleSendEmail}>
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            className="input-field"
            value={email}
            onChange={handleChangeEmail}
          />
          <button type="submit" className="submit-button">
            Enviar Código
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyCode}>
          <label htmlFor="verificationCode">Código de Verificación</label>
          <input
            type="text"
            id="verificationCode"
            name="verificationCode"
            className="input-field"
            value={verificationCode}
            onChange={handleChangeCode}
          />
          <button type="submit" className="submit-button">
            Verificar Código
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleUpdatePassword}>
          <label htmlFor="newPassword">Nueva Contraseña</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            className="input-field"
            value={newPassword}
            onChange={handleChangePassword}
          />
          <button type="submit" className="submit-button">
            Actualizar Contraseña
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
