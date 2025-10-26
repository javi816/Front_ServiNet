<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Prueba API</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <ion-button @click="probarApi">Probar Endpoint</ion-button>

            <div v-if="mensaje">
                <strong>Mensaje de la API:</strong> {{ mensaje }}
            </div>

            <div v-if="error" style="color: red">
                <strong>Error:</strong> {{ error }}
            </div>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { api, token, loadSession } from "../services/auth";

interface PruebaResponse {
    mensaje: string;
}

export default defineComponent({
    name: "PruebaPage",
    setup() {
        const mensaje = ref<string>("");
        const error = ref<string>("");

        const probarApi = async () => {
            try {
                await loadSession(); // asegura que el token esté cargado
                const res = await api.get<PruebaResponse>("/prueba", {
                    headers: {
                        Authorization: token.value ? `Bearer ${token.value}` : "",
                        Accept: "application/json",
                    },
                });
                mensaje.value = res.data.mensaje;
                error.value = "";
            } catch (err: any) {
                console.error("Error al llamar /prueba:", err);
                error.value = "No se pudo conectar con la API";
            }
        };

        return { mensaje, error, probarApi };
    },
});
</script>
