<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Mi Negocio</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
            <!-- Cargando -->
            <ion-spinner v-if="loading" name="crescent" />

            <!-- Sin negocio -->
            <ion-button v-else-if="!negocio" @click="openModal" expand="block" color="primary">
                Solicitar Negocio
            </ion-button>

            <!-- Negocio pendiente o rechazado -->
            <ion-card v-else-if="negocio.estado !== 'aprobado'">
                <ion-card-header>
                    <ion-card-title>{{ negocio.nombre }}</ion-card-title>
                    <ion-card-subtitle>Estado: {{ negocio.estado }}</ion-card-subtitle>
                </ion-card-header>
                <ion-card-content>
                    <p>
                        Tu solicitud está <strong>{{ negocio.estado }}</strong>.
                        Te notificaremos cuando sea aprobada.
                    </p>
                </ion-card-content>
            </ion-card>

            <!-- Negocio aprobado -->
            <ion-card v-else>
                <ion-card-header>
                    <ion-card-title>{{ negocio.nombre }}</ion-card-title>
                    <ion-card-subtitle>
                        {{ rol === 'admin' ? 'Panel de Administración' : 'Panel de Empleado' }}
                    </ion-card-subtitle>
                </ion-card-header>
                <ion-card-content>
                    <template v-if="rol === 'admin'">
                        <p>Aquí podrás administrar servicios, empleados y solicitudes.</p>
                    </template>

                    <template v-else-if="rol === 'empleado'">
                        <p>Podrás ver tus tareas o servicios asignados.</p>
                    </template>
                </ion-card-content>
            </ion-card>

            <!-- Modal para solicitar negocio -->
            <SolicitarNegocioModal :is-open="isModalOpen" @close="isModalOpen = false"
                @solicitud-enviada="handleSolicitudEnviada" />
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { negocioService, Negocio } from '@/services/negocioService'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonSpinner } from '@ionic/vue'
import SolicitarNegocioModal from '@/components/SolicitarNegocioModal.vue'

const negocio = ref<Negocio | null>(null)
const rol = ref<string | null>(null)
const loading = ref(true)
const isModalOpen = ref(false)

const openModal = () => {
    isModalOpen.value = true
}

const handleSolicitudEnviada = async () => {
    await fetchMiNegocio()
    isModalOpen.value = false
}

const fetchMiNegocio = async () => {
    loading.value = true
    try {
        const data = await negocioService.getMiNegocio()
        negocio.value = data.negocio
        rol.value = data.rol || null
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchMiNegocio()
})
</script>
