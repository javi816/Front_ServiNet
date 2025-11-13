<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Agendar Cita</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
            <p>idNegocio: {{ idNegocio }}</p>
            <p>idServicio: {{ idServicio }}</p>

            <!-- Fecha y hora -->
            <ion-item>
                <ion-label position="stacked">Fecha</ion-label>
                <ion-input type="date" v-model="fecha"></ion-input>
            </ion-item>

            <ion-item>
                <ion-label position="stacked">Hora</ion-label>
                <ion-input type="time" v-model="hora"></ion-input>
            </ion-item>

            <!-- 🔹 Buscar empleados (cuando rol está vacío, o sea cliente) -->
            <div v-if="rol === ''">
                <BuscarEmpleados
                    :idNegocio="idNegocio"
                    :idServicio="idServicio"
                    :fecha="fecha"
                    :hora="hora"
                    @seleccionado="empleadoSeleccionado = $event"
                />
            </div>

            <!-- 🔹 Si es empleado, elegir tipo de cliente -->
            <div v-else>
                <ion-segment v-model="tipoCliente">
                    <ion-segment-button value="registrado">Registrado</ion-segment-button>
                    <ion-segment-button value="invitado">Invitado</ion-segment-button>
                </ion-segment>

                <div v-if="tipoCliente === 'registrado'">
                    <BuscarUsuarios @seleccionado="usuarioSeleccionado = $event" />
                </div>

                <div v-else>
                    <ion-item>
                        <ion-label position="stacked">Nombre del cliente (invitado)</ion-label>
                        <ion-input v-model="nombreInvitado"></ion-input>
                    </ion-item>
                </div>
            </div>

            <ion-button expand="block" color="success" @click="guardarCita">
                Agendar Cita
            </ion-button>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonLabel, IonInput, IonButton, IonSegment, IonSegmentButton
} from '@ionic/vue'
import { negocioService } from '@/services/negocioService'
import BuscarEmpleados from '@/components/BuscarEmpleados.vue'
import BuscarUsuarios from '@/components/BuscarUsuarios.vue'
import axiosInstance from '@/services/axiosInstance'

// Ruta y params
const route = useRoute()
const idNegocio = ref<number | null>(null)
const idServicio = ref<number | null>(null)

onMounted(() => {
    idNegocio.value = Number(route.params.id_negocio)
    idServicio.value = Number(route.params.id_servicio)
})

// Rol e id del empleado (si aplica)
const rol = negocioService.getRol() || ''
const idEmpleado = negocioService.getIdEmpleado()

// Formulario
const fecha = ref('')
const hora = ref('')
const tipoCliente = ref<'registrado' | 'invitado'>('registrado')
const empleadoSeleccionado = ref<any>(null)
const usuarioSeleccionado = ref<any>(null)
const nombreInvitado = ref('')

// Guardar cita
const guardarCita = async () => {
    if (!idNegocio.value || !idServicio.value) {
        alert('ID de negocio o servicio inválido')
        return
    }

    if (!fecha.value || !hora.value) {
        alert('Debes seleccionar fecha y hora')
        return
    }

    if (rol === '' && !empleadoSeleccionado.value) {
        alert('Debes seleccionar un empleado disponible')
        return
    }

    if (rol !== '' && tipoCliente.value === 'registrado' && !usuarioSeleccionado.value) {
        alert('Debes seleccionar un usuario registrado')
        return
    }

    try {
        const payload: any = {
            id_negocio: idNegocio.value,
            id_servicio: idServicio.value,
            fecha: fecha.value,
            hora_inicio: hora.value,
        }

        if (rol === '') {
            // Cliente agenda → necesita id_empleado del seleccionado
            payload.id_empleado = empleadoSeleccionado.value?.id_usuario_negocio
        } else {
            // Empleado agenda
            payload.id_empleado = idEmpleado
            if (tipoCliente.value === 'registrado') {
                payload.id_usuario = usuarioSeleccionado.value?.id
            } else {
                payload.nombre_cliente = nombreInvitado.value || null
            }
        }

        console.log('Payload a enviar:', payload)
        await axiosInstance.post('/citas/solicitar', payload)
        alert('Cita agendada correctamente ✅')
    } catch (error: any) {
        console.error('Error al agendar cita:', error)
        alert('Error al agendar la cita ❌')
    }
}
</script>
