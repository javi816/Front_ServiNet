// src/services/profileService.ts
import axios from "axios";
import { authService } from "./authService";

const API_URL = "https://api-servi-net.onrender.com/api";

export const profileService = {
  // 🔹 Actualizar información personal
  async updateInfo(name: string, email: string) {
    const token = authService.getToken();
    const response = await axios.put(
      `${API_URL}/profile/update-info`,
      { name, email },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // 🔹 Actualizar foto de perfil
  async updatePhoto(file: File) {
    const token = authService.getToken();
    const formData = new FormData();
    formData.append("profile_photo_url", file); // 👈 mismo nombre que usa el backend

    const response = await axios.post(`${API_URL}/profile/update-photo`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // 🔹 Actualizar contraseña
  async updatePassword(current_password: string, password: string, password_confirmation: string) {
    const token = authService.getToken();
    const response = await axios.put(
      `${API_URL}/password-update`,
      { current_password, password, password_confirmation },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },
};
