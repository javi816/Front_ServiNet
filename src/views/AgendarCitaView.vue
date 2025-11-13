<template>
    <ion-card>
        <ion-card-header>
            <ion-card-title>Citas Aprobadas</ion-card-title>
        </ion-card-header>

        <ion-card-content>
            <ion-list v-if="citas.length">
                <ion-item v-for="cita in citas" :key="cita.id">
                    <ion-label>
                        <h2>{{ cita.servicio?.nombre }}</h2>
                        <p>
                            {{ cita.fecha }} — {{ cita.hora_inicio }} <br />
                        </p>
                    </ion-label>

                    <ion-button size="small" fill="outline" color="primary" @click="abrirModal(cita)">
                        Editar
                    </ion-button>

                    <ion-button size="small" fill="outline" color="danger" @click="cancelarCita(cita)">
                        Cancelar
                    </ion-button>
                </ion-item>
            </ion-list>

            <ion-text v-else color="medium">No hay citas aprobadas.</ion-text>
        </ion-card-content>

        <!-- Modal Editar -->
        <ion-modal :is-open="modalOpen" @did-dismiss="cerrarModal">
            <ion-header>
                <ion-toolbar>
                    <ion-title>Editar Cita</ion-title>
                    <ion-buttons slot="end">
                        <ion-button @click="cerrarModal">Cerrar</ion-button>
                    </ion-buttons>
                </ion-toolbar>
            </ion-header>

            <ion-content class="ion-padding">
                <ion-item>
                    <ion-label position="stacked">Fecha</ion-label>
                    <ion-datetime v-model="modalData.fecha" display-format="YYYY-MM-DD"
                        presentation="date"></ion-datetime>
                </ion-item>

                <ion-item>
                    <ion-label position="stacked">Hora de inicio</ion-label>
                    <ion-datetime v-model="modalData.hora_inicio" display-format="HH:mm"
                        presentation="time"></ion-datetime>
                </ion-item>

                <ion-button expand="block" color="success" @click="guardarCambios">
                    Guardar cambios
                </ion-button>
            </ion-content>
        </ion-modal>
    </ion-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axiosInstance from '@/services/axiosInstance'
import { citasService, type Cita } from '@/services/citasService'
import {
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonContent,
    IonDatetime,
    IonText
} from '@ionic/vue'

const citas = ref<Cita[]>([])
const modalOpen = ref(false)
const modalData = ref<any>({
    id: 0,
    id_empleado: 0,
    id_servicio: 0,
    id_negocio: 0,
    fecha: '',
    hora_inicio: ''
})

const cargarCitas = async () => {
    try {
        citas.value = await citasService.getCitasAprobadas()
    } catch (error) {
        console.error('Error al cargar citas:', error)
    }
}

onMounted(cargarCitas)

const abrirModal = (cita: any) => {
    modalData.value = {
        id: cita.id,
        id_empleado: cita.usuario_negocio.id,
        id_servicio: cita.servicio.id,
        id_negocio: cita.id_negocio, // 🔹 Usamos id_negocio directamente
        fecha: cita.fecha,
        hora_inicio: cita.hora_inicio
    }
    modalOpen.value = true
}

const cerrarModal = () => (modalOpen.value = false)

const guardarCambios = async () => {
    try {
        const id = modalData.value.id

        // Normalizamos la hora a formato HH:mm
        let horaInicio = modalData.value.hora_inicio
        if (horaInicio.includes('T')) {
            // formato ISO => "YYYY-MM-DDTHH:MM:SS"
            horaInicio = horaInicio.split('T')[1].substring(0, 5)
        } else if (horaInicio.length === 8) {
            // formato "HH:MM:SS"
            horaInicio = horaInicio.substring(0, 5)
        }

        const datos = {
            id_empleado: modalData.value.id_empleado,
            id_servicio: modalData.value.id_servicio,
            id_negocio: modalData.value.id_negocio,
            fecha: modalData.value.fecha.split('T')[0], // YYYY-MM-DD
            hora_inicio: horaInicio
        }

        console.log('🟡 Enviando datos:', datos)

        const res = await axiosInstance.patch(`/citas/${id}/posponer`, datos)
        console.log('✅ Respuesta:', res.data)

        alert('Cita actualizada correctamente')
        modalOpen.value = false
        await cargarCitas()
    } catch (error: any) {
        console.error('❌ Error:', error.response?.data || error)
        alert(error.response?.data?.mensaje || 'Error al actualizar la cita')
    }
}

const cancelarCita = async (cita: Cita) => {
    if (!confirm('¿Deseas cancelar esta cita?')) return
    try {
        await axiosInstance.delete(`/citas/${cita.id}/cancelar`)
        alert('Cita cancelada correctamente')
        await cargarCitas()
    } catch (error: any) {
        console.error(error)
        alert(error.response?.data?.mensaje || 'Error al cancelar la cita')
    }
}
</script>

<style scoped>
ion-datetime {
    margin-top: 10px;
}
</style>
