<template>
    <div class="ion-padding">
        <ion-item>
            <ion-label position="stacked">Fecha</ion-label>
            <ion-input v-model="fechaLocal" type="date" placeholder="Selecciona una fecha"></ion-input>
        </ion-item>

        <ion-button expand="block" class="ion-margin-top" @click="buscarEmpleados">
            Buscar empleados disponibles
        </ion-button>

        <ion-list v-if="buscado">
            <ion-item v-for="empleado in empleados" :key="empleado.id_usuario_negocio" button
                @click="$emit('seleccionado', empleado)">
                <ion-avatar slot="start" v-if="empleado.foto">
                    <img :src="empleado.foto" />
                </ion-avatar>
                <ion-label>
                    <h2>{{ empleado.nombre }}</h2>
                    <p>{{ empleado.telefono || 'Sin teléfono' }}</p>
                    <ion-text color="medium">{{ empleado.rol }}</ion-text>
                </ion-label>
            </ion-item>


            <ion-item v-if="empleados.length === 0">
                <ion-label color="medium">No hay empleados disponibles.</ion-label>
            </ion-item>
        </ion-list>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { IonButton, IonList, IonItem, IonAvatar, IonLabel, IonText, IonInput } from '@ionic/vue'
import axiosInstance from '@/services/axiosInstance'

// ✅ Props (no modificables directamente)
const props = defineProps<{
    idNegocio: number | null
    idServicio?: number | null
    fecha: string
    hora: string
}>()

// ✅ Copia local de fecha (para evitar el error)
const fechaLocal = ref(props.fecha)

// Mantener sincronización si el padre cambia la fecha
watch(() => props.fecha, nuevaFecha => {
    fechaLocal.value = nuevaFecha
})

// Variables reactivas
const empleados = ref<any[]>([])
const buscado = ref(false)

// 🔹 Función para buscar empleados disponibles
const buscarEmpleados = async () => {
    if (!fechaLocal.value || !props.hora) return

    try {
        const response = await axiosInstance.post('/citas/disponibilidad', {
            id_negocio: props.idNegocio,
            fecha: fechaLocal.value,
            hora: props.hora,
            id_servicio: props.idServicio || null
        })

        console.log('Respuesta completa:', response.data)

        // ✅ Aseguramos que sea el array correcto
        empleados.value = response.data.data || []
        console.log('Empleados encontrados:', empleados.value)
    } catch (error) {
        console.error('Error al buscar empleados:', error)
        empleados.value = []
    } finally {
        buscado.value = true
    }
}

// 🔹 Buscar automáticamente cuando cambie la fecha local o la hora
watch([fechaLocal, () => props.hora], () => {
    if (fechaLocal.value && props.hora) buscarEmpleados()
})
</script>
