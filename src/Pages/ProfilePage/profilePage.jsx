import Header from "../../Layouts/Header";
import React, { useState, useEffect } from "react";
import "./profile.css";
import contactPlantImg from "../../Images/profilePlant.jpg";  
import { FaUserCircle } from 'react-icons/fa'; 
import { toast } from "react-toastify";
import { getUserById, updateUserPassword } from "../../services/userService";

const Perfil = () => {
  const navLinks = [
    { label: "Home", href: "/home" },
  ];

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      try {
        const data = await getUserById(userId);
        setFormData({
          username: data.username,
          email: data.email,
          password: ''
        });
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error al obtener los datos del usuario");
      }
    };

    fetchUserData();
  }, []);

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
      await updateUserPassword(userId, formData.password);
      toast.success("Contraseña actualizada con éxito");
      setFormData(prevState => ({
        ...prevState,
        password: ''
      }));
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al actualizar la contraseña");
    }
  };

  return (
    <div className="profile-container">
      <Header links={navLinks} />

      <div className="profile-form-container">
        <div className="profile-image">
          <img src={contactPlantImg} alt="Planta de perfil" />
        </div>

        <div className="profile-form-container-inner">
          <div className="profile-form">
            <h2>
              <FaUserCircle size={60} style={{ marginRight: '10px' }} />
            </h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled
              />

              <label htmlFor="email">Correo</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
              />

              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <input
                type="submit"
                value="Guardar"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;