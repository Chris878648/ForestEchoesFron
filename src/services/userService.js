import api from "./api";

// Usuarios
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserPassword = async (userId, password) => {
  try {
    const response = await api.put(`/user/${userId}/password`, { password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePassword = async (email, newPassword) => {
  try {
    const response = await api.post("/update-password", { email, newPassword });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Productos
export const getProducts = async () => {
  try {
    const response = await api.get("/products");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Carrito
export const addToCart = async (userId, productId, price, name, quantity) => {
  try {
    const response = await api.post("/cart", {
      userId,
      productId,
      price,
      name,
      quantity,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCartItems = async (userId) => {
  try {
    const response = await api.post("/cart-user", { userId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const increaseCartItemQuantity = async (userId, productId) => {
  try {
    const response = await api.post("/cart/increase", { userId, productId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const decreaseCartItemQuantity = async (userId, productId) => {
  try {
    const response = await api.post("/cart/decrease", { userId, productId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCartItem = async (userId, productId) => {
  try {
    const response = await api.post("/cart/delete", { userId, productId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Pagos
export const createPaymentIntent = async (userId, cartItems, totalAmount) => {
  try {
    const response = await api.post("/create-payment", {
      userId,
      cartItems,
      totalAmount,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const confirmPayment = async (paymentIntentId) => {
  try {
    const response = await api.post("/confirm-payment", { paymentIntentId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Mensajes de contacto
export const sendContactMessage = async (name, email, message, userId) => {
    try {
      const response = await api.post(
        "/contact",
        { name, email, message },
        {
          headers: {
            "user-id": userId, 
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };