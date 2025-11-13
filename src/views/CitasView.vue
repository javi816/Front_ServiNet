<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Gestión de Citas</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
            <div v-if="!ready">
                <ion-text color="medium">Cargando...</ion-text>
            </div>

            <div v-else>
                <!-- Segment solo para empleados/admin con negocio -->
                <ion-segment v-if="!esCliente" v-model="segment">
                    <ion-segment-button value="pendientes">
                        Citas
                    </ion-segment-button>
                </ion-segment>

                <!-- Pendientes solo si empleado/admin -->
                <div v-if="segment === 'pendientes' && !esCliente" class="ion-margin-top">
                    <CitasPendientesComponent />
                </div>

                <!-- Aprobadas/enviadas siempre -->
                <div class="ion-margin-top">
                    <CitasAprobadasComponent :es-cliente="esCliente" />
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonText
} from '@ionic/vue'
import CitasPendientesComponent from '@/components/CitasPendientesComponent.vue'
import CitasAprobadasComponent from '@/components/citasAprobadasComponent.vue'
import { authService } from '@/services/authService'
import { negocioService } from '@/services/negocioService'

const segment = ref<'pendientes' | 'aprobadas'>('pendientes')
const esCliente = ref(true)
const user = ref(authService.getUser())
const ready = ref(false)

onMounted(async () => {
    try {
        const negocioData = await negocioService.getMiNegocio()
        const tieneNegocio = !!negocioData.negocio
        const rol = negocioData.rol || user.value?.role

        esCliente.value = rol === 'usuario' || !tieneNegocio
    } catch (error) {
        console.error('Error obteniendo negocio:', error)
        esCliente.value = true
    } finally {
        ready.value = true
    }
})
</script>
