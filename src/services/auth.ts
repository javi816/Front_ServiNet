// src/services/auth.ts
import axios from 'axios';
import { ref } from 'vue';
import { Preferences } from '@capacitor/preferences';

// ==============================================================
// 1. CONFIGURACIÓN BÁSICA
// ==============================================================

const API_URL = 'https://api-servi-net.onrender.com/api';  

// Estas variables se comparten en TODA la app
// Son como variables globales pero reactivas (cuando cambien, Vue lo detecta)
export const user = ref<any>(null);   // Aquí guardamos los datos del usuario
export const token = ref<string | null>(null);  // Aquí guardamos el token

// ==============================================================
// 2. CONFIGURAR AXIOS (para hacer peticiones HTTP)
// ==============================================================

const api = axios.create({
    baseURL: API_URL,  // Para no escribir http://localhost:8000/api en cada petición
});

// Esto hace que TODAS las peticiones incluyan el token automáticamente
api.interceptors.request.use((config) => {
    if (token.value && config.headers) {
        // Agregamos el token al header (Laravel lo necesita así)
        config.headers.Authorization = `Bearer ${token.value}`;
    }
    return config;
});

// ==============================================================
// 3. FUNCIÓN: LOGIN
// ==============================================================

export const login = async (email: string, password: string) => {
    // Hacemos la petición a Laravel
    const response = await axios.post<{ token: string; user: any }>(`${API_URL}/login`, {
        email: email,
        password: password,
    });

    // Laravel nos devuelve: { token: "abc123", user: { id: 1, name: "Juan", ... } }
    const authToken = response.data.token;
    const userData = response.data.user;

    // Guardamos en las variables (memoria)
    token.value = authToken;
    user.value = userData;

    // Guardamos en el dispositivo (para que persista)
    await Preferences.set({ key: 'token', value: authToken });
    await Preferences.set({ key: 'user', value: JSON.stringify(userData) });
};

// ==============================================================
// 4. FUNCIÓN: REGISTER
// ==============================================================

export const register = async (name: string, email: string, password: string, passwordConfirm: string) => {
    // Hacemos la petición a Laravel
    const response = await axios.post<{ token: string; user: any }>(`${API_URL}/register`, {
        name: name,
        email: email,
        password: password,
        password_confirmation: passwordConfirm,
    });

    // Laravel nos devuelve lo mismo que en login
    const authToken = response.data.token;
    const userData = response.data.user;

    // Guardamos igual que en login
    token.value = authToken;
    user.value = userData;

    await Preferences.set({ key: 'token', value: authToken });
    await Preferences.set({ key: 'user', value: JSON.stringify(userData) });
};

// ==============================================================
// 5. FUNCIÓN: LOGOUT
// ==============================================================

export const logout = async () => {
    try {
        // Le avisamos a Laravel que borre el token de su base de datos
        await api.post('/logout');
    } catch (error) {
        console.log('Error en logout:', error);
    }

    // Limpiamos TODO (memoria y dispositivo)
    token.value = null;
    user.value = null;
    await Preferences.remove({ key: 'token' });
    await Preferences.remove({ key: 'user' });
};

// ==============================================================
// 6. FUNCIÓN: CARGAR SESIÓN GUARDADA
// ==============================================================

export const loadSession = async () => {
    // Buscamos si hay token guardado en el dispositivo
    const savedToken = await Preferences.get({ key: 'token' });
    const savedUser = await Preferences.get({ key: 'user' });

    // Si encontramos token y usuario, los cargamos
    if (savedToken.value && savedUser.value) {
        token.value = savedToken.value as string;
        user.value = JSON.parse(savedUser.value);
    }
};

// ==============================================================
// 7. EXPORTAR AXIOS (por si necesitas hacer otras peticiones)
// ==============================================================

export { api };