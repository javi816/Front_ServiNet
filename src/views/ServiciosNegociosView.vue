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

                    <ion-button slot="end" color="tertiary" @click="irAAgendar(servicio.id)">
                        Agendar
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
import { useRoute, useRouter } from 'vue-router'
import { servicioService, type Servicio } from '@/services/servicioService'

// Router y route
const router = useRouter()
const route = useRoute()

// Obtener id del negocio desde la URL
const id_negocio = ref<number | null>(null)

// Datos
const servicios = ref<Servicio[]>([])
const cargando = ref(false)

// Cargar servicios del negocio
const cargarServicios = async () => {
    try {
        cargando.value = true

        // Asegurar que tenemos el ID del negocio
        if (!route.params.id_negocio) {
            console.error('No se encontró id_negocio en la ruta.')
            servicios.value = []
            return
        }

        id_negocio.value = Number(route.params.id_negocio)
        console.log('Cargando servicios del negocio:', id_negocio.value)

        const lista = await servicioService.listarPorNegocio(id_negocio.value)
        servicios.value = Array.isArray(lista) ? lista : []
    } catch (e) {
        console.error('Error al cargar servicios:', e)
        servicios.value = []
    } finally {
        cargando.value = false
    }
}

const irAAgendar = (id_servicio: any) => {
    console.log('Datos recibidos en irAAgendar:', { id_negocio: id_negocio.value, id_servicio })

    if (!id_negocio.value) {
        console.error('No se encontró id_negocio.')
        return
    }

    if (!id_servicio) {
        console.error('No se recibió id_servicio.')
        return
    }

    console.log('Navegando a agendar cita con:', {
        id_negocio: id_negocio.value,
        id_servicio
    })

    router.push({
        name: 'AgendarCita',
        params: {
            id_negocio: id_negocio.value.toString(),
            id_servicio: id_servicio.toString()
        }
    })
}


// Refrescar lista
const onRefresher = async (event: any) => {
    await cargarServicios()
    event.detail?.complete()
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
