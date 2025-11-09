<template>
    <ion-card class="servicio-card">
        <ion-icon name="close-circle" class="icon-delete" color="danger"
                @click="$emit('eliminar', servicio)"  />

        <ion-thumbnail class="servicio-img">
            <img v-if="!servicio.foto || servicio.foto.trim() === ''" src="/sin-imagen.svg" alt="imagen por defecto" />
            <img v-else :src="servicio.foto" alt="imagen del servicio" />
        </ion-thumbnail>

        <ion-card-header>
            <ion-card-title>{{ servicio.nombre }}</ion-card-title>
        </ion-card-header>

        <ion-card-content>
            <p>{{ servicio.descripcion }}</p>
            <p><strong>Precio:</strong> ${{ servicio.precio }}</p>
            <div class="acciones">
                <ion-button color="primary" size="small" @click="$emit('editar', servicio)">
                    <ion-icon name="create-outline" slot="start"></ion-icon>
                    Editar
                </ion-button>

                <ion-button color="medium" size="small" @click="$emit('agendar', servicio)">
                    <ion-icon name="calendar-outline" slot="start"></ion-icon>
                    Cita
                </ion-button>
            </div>
        </ion-card-content>
    </ion-card>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import {
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonButton, IonIcon, IonThumbnail
} from '@ionic/vue'
import type { Servicio } from '@/services/servicioService'

defineProps<{
    servicio: Servicio
}>()
</script>

<style scoped>
.servicio-card {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 16px;
}

.icon-delete {
    position: absolute;
    top: 8px;
    right: 8px;
    font-size: 22px;
    cursor: pointer;
    z-index: 2;
}

.servicio-img {
    width: 100%;
    height: 180px;
    overflow: hidden;
}

.servicio-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.acciones {
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
}
</style>
