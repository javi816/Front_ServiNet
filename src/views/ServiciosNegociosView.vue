<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Servicios del negocio</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content>
            <ion-refresher slot="fixed" @ionRefresh="onRefresher">
                <ion-refresher-content></ion-refresher-content>
            </ion-refresher>

            <ion-list v-if="servicios.length">
                <ion-item v-for="servicio in servicios" :key="servicio.id_servicio">
                    <ion-thumbnail slot="start">
                        <img v-if="!servicio.foto || servicio.foto.trim() === ''" src="/sin-imagen.svg"
                            alt="imagen por defecto" />
                        <img v-else :src="servicio.foto" alt="imagen del servicio" />
                    </ion-thumbnail>

                    <ion-label>
                        <h2>{{ servicio.nombre }}</h2>
                        <p>{{ servicio.descripcion }}</p>
                        <p><strong>Precio:</strong> ${{ servicio.precio }}</p>
                    </ion-label>

                    <!-- Botón para solicitar cita -->
                    <ion-button slot="end" color="primary" @click="solicitarCita(servicio)">
                        Solicitar cita
                    </ion-button>
                </ion-item>
            </ion-list>

            <ion-text v-else class="ion-text-center">
                <p>No hay servicios registrados.</p>
            </ion-text>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonThumbnail,
    IonRefresher, IonRefresherContent, IonText, IonButton
} from '@ionic/vue'
import { ref, onMounted } from 'vue'
import { servicioService, type Servicio } from '@/services/servicioService'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const servicios = ref<Servicio[]>([])
const cargando = ref(false)
const id_negocio = ref(route.params.id_negocio) // obtiene el ID del negocio desde la URL

const cargarServicios = async () => {
    try {
        cargando.value = true
        const lista = await servicioService.listarPorNegocio(id_negocio.value) // usa el ID del negocio
        servicios.value = Array.isArray(lista) ? lista : []
    } catch (e) {
        servicios.value = []
    } finally {
        cargando.value = false
    }
}

const onRefresher = async (event: any) => {
    await cargarServicios()
    event.detail?.complete()
}

// Redirige a la vista de citas
const solicitarCita = (servicio: Servicio) => {
    router.push({
        name: 'citas-usuario',
        query: { id_servicio: servicio.id_servicio }
    })
}

onMounted(cargarServicios)
</script>

<style scoped>
ion-thumbnail img {
    object-fit: cover;
    width: 64px;
    height: 64px;
    border-radius: 8px;
}
</style>
