// src/services/authService.ts
import axios from 'axios';
import { ref } from 'vue';
import router from '@/router';
import { negocioService } from '@/services/negocioService';

const API_URL = 'https://api-servi-net.onrender.com/api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  profile_photo_url?: string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export const currentUser = ref<User | null>(
  JSON.parse(localStorage.getItem('user') || 'null')
);

export const authService = {
  // ✅ Guardar usuario formateado en localStorage
  saveUser(user: any) {
    const formattedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || 'usuario',
      profile_photo_url: user.profile_photo_url || null,
    };

    localStorage.setItem('user', JSON.stringify(formattedUser));
    currentUser.value = formattedUser;
  },

  // 🔹 REGISTRO
  async register(
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ) {
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/register`, {
        name,
        email,
        password,
        password_confirmation,
      });

      const token = response.data.access_token;
      const user = response.data.user;

      // Guardar token y usuario
      localStorage.setItem('token', token);
      this.saveUser(user);

      // Intentar obtener el negocio del usuario (si tiene)
      try {
        const negocioData = await negocioService.getMiNegocio();
        if (negocioData && negocioData.negocio) {
          localStorage.setItem('negocio', JSON.stringify(negocioData));
        }
      } catch (error) {
        console.warn('Error al obtener el negocio del usuario:', error);
      }

      return user;
    } catch (error: any) {
      console.error('Error en registro:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Error al registrarse' };
    }
  },

  // 🔹 LOGIN
  async login(email: string, password: string) {
    const response = await axios.post<AuthResponse>(`${API_URL}/login`, {
      email,
      password,
    });

    const token = response.data.access_token;
    const user = response.data.user;

    localStorage.setItem('token', token);
    this.saveUser(user);

    try {
      const negocioData = await negocioService.getMiNegocio();
      if (negocioData && negocioData.negocio) {
        localStorage.setItem('negocio', JSON.stringify(negocioData));
      } else {
        localStorage.removeItem('negocio');
      }
    } catch (error) {
      console.warn('Error al obtener el negocio del usuario:', error);
      localStorage.removeItem('negocio');
    }

    return user;
  },

  // 🔹 LOGOUT
  async logout() {
    const token = this.getToken();
    try {
      await axios.post(
        `${API_URL}/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }

    localStorage.clear();
    currentUser.value = null;
    router.push({ name: 'Login' });
  },

  // ✅ Obtener token del localStorage
  getToken() {
    return localStorage.getItem('token');
  },

  // ✅ Obtener usuario actual reactivo
  getUser() {
    return currentUser.value;
  },

  // ✅ Obtener negocio (si existe)
  getNegocio() {
    const stored = localStorage.getItem('negocio');
    return stored ? JSON.parse(stored) : null;
  },
};
