<template>
    <ion-card>
        <ion-card-header>
            <ion-card-title>{{ solicitud.negocio.nombre }}</ion-card-title>
            <ion-card-subtitle>{{ solicitud.usuario.name }} ({{ solicitud.usuario.email }})</ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
            <p><strong>Descripción:</strong> {{ solicitud.negocio.descripcion }}</p> <!-- 🔹 Nuevo campo -->
            <p><strong>Dirección:</strong> {{ solicitud.negocio.direccion }}</p>
            <p><strong>Teléfono:</strong> {{ solicitud.negocio.telefono }}</p>
            <p><strong>Correo:</strong> {{ solicitud.negocio.correo }}</p>

            <ion-button color="success" @click="aprobar">Aprobar</ion-button>
            <ion-button color="danger" @click="rechazar">Rechazar</ion-button>
        </ion-card-content>
    </ion-card>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { Solicitud } from '@/services/solicitudesService';
import { solicitudesService } from '@/services/solicitudesService';

const props = defineProps<{
    solicitud: Solicitud
}>();

const emit = defineEmits<{
    (e: 'actualizado'): void
}>();

const aprobar = async () => {
    await solicitudesService.aprobarSolicitud(props.solicitud.usuario_negocio.id, true);
    emit('actualizado');
};

const rechazar = async () => {
    await solicitudesService.aprobarSolicitud(props.solicitud.usuario_negocio.id, false);
    emit('actualizado');
};
</script>
