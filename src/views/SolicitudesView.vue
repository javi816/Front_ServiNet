<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Solicitudes de Negocios</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
            <ion-spinner v-if="loading" />
            <p v-if="!loading && solicitudes.length === 0">No hay solicitudes pendientes.</p>

            <SolicitudCard v-for="solicitud in solicitudes" :key="solicitud.usuario_negocio.id" :solicitud="solicitud"
                @actualizado="cargarSolicitudes" />
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Solicitud, solicitudesService } from '@/services/solicitudesService';
import SolicitudCard from '@/components/SolicitudCard.vue';

const solicitudes = ref<Solicitud[]>([]);
const loading = ref(true);

const cargarSolicitudes = async () => {
    loading.value = true;
    try {
        solicitudes.value = await solicitudesService.listarSolicitudes();
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    cargarSolicitudes();
});
</script>
