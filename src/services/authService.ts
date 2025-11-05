// authService.ts
import axios from 'axios';
import { ref } from 'vue';
import router from '@/router';
import { negocioService } from '@/services/negocioService'; // 👈 Importa el negocioService

const API_URL = 'https://api-servi-net.onrender.com/api';

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface LoginResponse {
    access_token: string;
    token_type: string;
    user: User;
}

// Estado reactivo del usuario
export const currentUser = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'));

export const authService = {
    async login(email: string, password: string) {
        const response = await axios.post<LoginResponse>(`${API_URL}/login`, {
            email,
            password,
        });

        const token = response.data.access_token;
        const user = response.data.user;

        // Guardar en localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Actualizar estado reactivo
        currentUser.value = user;

        // Intentar obtener el negocio del usuario (si tiene)
        try {
            const negocio = await negocioService.getMiNegocio();
            if (negocio) {
                localStorage.setItem('negocio', JSON.stringify(negocio));
            } else {
                localStorage.removeItem('negocio');
            }
        } catch (error) {
            console.warn('Error al obtener el negocio del usuario:', error);
            localStorage.removeItem('negocio');
        }

        return user;
    },

    async logout() {
        const token = this.getToken();
        try {
            await axios.post(`${API_URL}/logout`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }

        // Limpiar todo
        localStorage.clear();
        currentUser.value = null;

        // Redirigir al login
        router.push({ name: 'Login' });
    },

    getToken() {
        return localStorage.getItem('token');
    },

    getUser() {
        return currentUser.value;
    },

    // 👇 Nuevo helper para acceder al negocio guardado
    getNegocio() {
        const stored = localStorage.getItem('negocio');
        return stored ? JSON.parse(stored) : null;
    },
};
