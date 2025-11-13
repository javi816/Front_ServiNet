<template>
    <ion-card>
        <ion-card-header>
            <ion-card-title>Citas Pendientes</ion-card-title>
        </ion-card-header>

        <ion-card-content>
            <ion-list v-if="citas.length">
                <ion-item v-for="cita in citas" :key="cita.id">
                    <ion-label>
                        <h2>{{ cita.usuario?.name || 'Cliente desconocido' }}</h2>
                        <p>
                            {{ cita.servicio?.nombre }} -
                            {{ cita.fecha }} {{ cita.hora_inicio }} a {{ cita.hora_fin }}
                        </p>
                    </ion-label>

                    <ion-buttons slot="end">
                        <ion-button color="success" @click="responder(cita.id, 'aceptada')">
                            Aceptar
                        </ion-button>
                        <ion-button color="danger" @click="responder(cita.id, 'rechazada')">
                            Rechazar
                        </ion-button>
                    </ion-buttons>
                </ion-item>
            </ion-list>

            <ion-text v-else color="medium">
                No hay citas pendientes que responder.
            </ion-text>
        </ion-card-content>
    </ion-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { citasService, type Cita } from '@/services/citasService'
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, IonButton, IonButtons, IonText } from '@ionic/vue'

const citas = ref<Cita[]>([])
const loading = ref(false)

const cargarCitas = async () => {
    loading.value = true
    try {
        citas.value = await citasService.getPendientes()
    } catch (error) {
        console.error('Error cargando citas pendientes:', error)
    } finally {
        loading.value = false
    }
}

const responder = async (id: number, estado: 'aceptada' | 'rechazada') => {
    try {
        await citasService.responderCita(id, estado)
        citas.value = citas.value.filter(c => c.id !== id)
    } catch (error) {
        console.error('Error al responder cita:', error)
    }
}

onMounted(cargarCitas)
</script>
