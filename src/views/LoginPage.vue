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

                <!-- Campo Password -->
                <ion-item>
                    <ion-label position="floating">Contraseña</ion-label>
                    <ion-input v-model="password" type="password" required></ion-input>
                </ion-item>

                <!-- Mostrar error si hay -->
                <ion-text color="danger" v-if="errorMessage">
                    <p>{{ errorMessage }}</p>
                </ion-text>

                <!-- Botón de Login -->
                <ion-button expand="block" type="submit" :disabled="loading" class="ion-margin-top">
                    {{ loading ? "Cargando..." : "Iniciar Sesión" }}
                </ion-button>

                <!-- Link a Register -->
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
import { login } from "../services/auth";
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

// ==============================================================
// Variables reactivas
// ==============================================================
const router = useRouter();
const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");

// ==============================================================
// Función para hacer login
// ==============================================================
const handleLogin = async () => {
    // Limpiar errores anteriores
    errorMessage.value = "";
    loading.value = true;

    try {
        // Llamamos la función login del servicio auth.ts
        await login(email.value, password.value);

        // Si todo sale bien, redirigimos al home
        router.push("/home");
    } catch (error: any) {
        // Si hay error, lo mostramos
        console.error("Error en login:", error);
        errorMessage.value =
            error.response?.data?.message || "Error al iniciar sesión";
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