<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Mi Negocio</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
            <!-- Sin solicitud: botón para abrir modal -->
            <ion-button v-if="!negocio" @click="openModal" expand="block" color="primary">
                Solicitar Negocio
            </ion-button>

            <!-- Pendiente o rechazado -->
            <ion-card v-else-if="negocio.estado !== 'aprobado'">
                <ion-card-header>
                    <ion-card-title>{{ negocio.nombre }}</ion-card-title>
                    <ion-card-subtitle>Estado: {{ negocio.estado }}</ion-card-subtitle>
                </ion-card-header>
                <ion-card-content>
                    <p>Tu solicitud está {{ negocio.estado }}.</p>
                </ion-card-content>
            </ion-card>

            <!-- Aprobado: dashboard (vacío por ahora) -->
            <ion-card v-else>
                <ion-card-header>
                    <ion-card-title>{{ negocio.nombre }}</ion-card-title>
                    <ion-card-subtitle>Dashboard de tu negocio</ion-card-subtitle>
                </ion-card-header>
                <ion-card-content>
                    <p>Aquí irá la administración de servicios, empleados, etc.</p>
                </ion-card-content>
            </ion-card>

            <!-- Modal -->
            <SolicitarNegocioModal :is-open="isModalOpen" @close="isModalOpen = false"
                @solicitud-enviada="handleSolicitudEnviada" />
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { negocioService, Negocio } from '@/services/negocioService'
import SolicitarNegocioModal from '@/components/SolicitarNegocioModal.vue'

const negocio = ref<Negocio | null>(null)
const isModalOpen = ref(false)

const openModal = () => {
    isModalOpen.value = true
}

const handleSolicitudEnviada = (nuevoNegocio: Negocio) => {
    negocio.value = nuevoNegocio
}
</script>
