import React from "react";
import "./error.css";
import errorImage from "../../Images/errorPlant.png"; // Asegúrate de importar la imagen correctamente

const Error404 = () => {
  return (
    <div className="error-container">
      <div className="error-text">
        <h1>ERROR 404</h1>
        <p>Not Found</p>
      </div>
      <img src={errorImage} alt="Planta roja" className="error-image" />
    </div>
  );
};

export default Error404;
