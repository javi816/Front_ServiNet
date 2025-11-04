<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Iniciar Sesión</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
            <form @submit.prevent="handleLogin">
                <!-- Campo Email -->
                <ion-item>
                    <ion-label position="floating">Email</ion-label>
                    <ion-input v-model="email" type="email" required></ion-input>
                </ion-item>

                <!-- Campo Contraseña -->
                <ion-item>
                    <ion-label position="floating">Contraseña</ion-label>
                    <ion-input v-model="password" type="password" required></ion-input>
                </ion-item>

                <!-- Mensaje de error -->
                <ion-text color="danger" v-if="errorMessage">
                    <p>{{ errorMessage }}</p>
                </ion-text>

                <!-- Botón de Login -->
                <ion-button expand="block" type="submit" :disabled="loading" class="ion-margin-top">
                    {{ loading ? "Cargando..." : "Iniciar Sesión" }}
                </ion-button>

                <!-- Link a registro (si aplica) -->
                <ion-button expand="block" fill="clear" router-link="/register">
                    ¿No tienes cuenta? Regístrate
                </ion-button>
            </form>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { authService } from "@/services/authService";

import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonText,
} from "@ionic/vue";

const router = useRouter();

// Campos reactivos
const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");

// Función principal de login
const handleLogin = async () => {
    errorMessage.value = "";
    loading.value = true;

    try {
        const user = await authService.login(email.value, password.value);
        console.log("Usuario autenticado:", user);
        router.push("/home");
    } catch (error: any) {
        console.error("Error en login:", error);
        errorMessage.value =
            error.response?.data?.message ||
            "Credenciales incorrectas o error de conexión.";
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
ion-text p {
    padding: 10px;
    margin-top: 10px;
}
</style>
