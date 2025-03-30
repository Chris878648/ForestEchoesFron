import Header from "../../Layouts/Header";
import React, { useState } from "react";
import "./contact.css";
import contactPlantImg from "../../Images/contactPlant.png";
import { toast } from "react-toastify";
import { sendContactMessage } from "../../services/userService"; // Importar el servicio

const Contacto = () => {
  const navLinks = [
    { label: "Carrito", href: "/cart" },
    { label: "Home", href: "/home" },
    { label: "Menu", href: "/menu" },
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    try {
      // Usar el servicio sendContactMessage
      await sendContactMessage(formData.name, formData.email, formData.message, userId);
      toast.success("Mensaje enviado con éxito");
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al enviar el mensaje");
    }
  };

  return (
    <div className="contact-container">
      <Header links={navLinks} />

      <div className="hero1-image">
      </div>

      <div className="contact-form-container">
        <div className="contact-form">
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="message">Mensaje</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>

            <input
              type="submit"
              value="Enviar"
            />
          </form>
        </div>

        <div className="contact-image">
          <img src={contactPlantImg} alt="Planta de contacto" />
        </div>
      </div>
    </div>
  );
};

export default Contacto;