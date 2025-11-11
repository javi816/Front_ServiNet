<template>
    <ion-page>
        <ion-header>
            <ion-toolbar color="tertiary">
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

<style scoped>
ion-content {
  --background: #0d1117;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  color: #e6edf3;
}

ion-title {
  font-size: 1.4rem;
}

ion-list{
    background: #161b22;
}

ion-card {
  width: 90%;
  max-width: 400px;
  background: #161b22;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  border: 1px solid #21262d;
}

ion-card-header {
  text-align: center;
  border-bottom: 1px solid #21262d;
}

ion-card-title {
  font-weight: 600;
  color: #e6edf3;
  font-size: 1.2rem;
}


.mt-3 {
  margin-top: 1rem;
}

.error-text {
  color: #f85149;
  text-align: center;
  margin-top: 8px;
}

ion-toast {
  --background: #161b22;
  --color: #e6edf3;
  border: 1px solid #30363d;
  border-radius: 10px;
}
</style>