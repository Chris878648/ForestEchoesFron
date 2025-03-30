import api from "./api";

export const register = async (username, email, password) => {
  try {
    const response = await api.post("/register", { username, email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkUserExists = async (username, email) => {
  try {
    const response = await api.post("/check-user", { username, email });
    return response.data; 
  } catch (error) {
    throw error;
  }
};

export const login = async (username, password) => {
  try {
    const response = await api.post("/login", { username, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post("/logout");
    return response.data;
  } catch (error) {
    throw error;
  }
};
