<template>
    <ion-page>
        <ion-header>
            <ion-toolbar color="tertiary">
                <ion-title>Mi Negocio</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
            <!-- Cargando -->
            <ion-spinner v-if="loading" name="crescent" />

            <!-- Sin negocio -->
            <ion-button v-else-if="!negocio" @click="isModalOpen = true" expand="block" color="primary">
                Solicitar Negocio
            </ion-button>

            <!-- Negocio pendiente o rechazado -->
            <ion-card v-else-if="negocio.estado !== 'aprobado'">
                <ion-card-header>
                    <ion-card-title>{{ negocio.nombre }}</ion-card-title>
                    <ion-card-subtitle>Estado: {{ negocio.estado }}</ion-card-subtitle>
                    <ion-card-subtitle>
                        {{ rol === 'admin' ? 'Panel de Administración' : 'Panel de Empleado' }}
                    </ion-card-subtitle>
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

                        <!-- Botón para agregar servicio solo para admin -->
                        <ion-button expand="block" color="secondary" @click="openAgregarServicioModal">
                            Agregar Servicio
                        </ion-button>
                    </template>

                    <template v-else-if="rol === 'empleado'">
                        <p>Podrás ver tus tareas o servicios asignados.</p>
                    </template>
                </ion-card-content>
            </ion-card>

            <!-- Servicios del negocio -->
            <div class="servicios-container" v-if="servicios.length">
                <ServicioCard v-for="servicio in servicios" :key="servicio.id_servicio" :servicio="servicio"
                    @editar="openEditarServicioModal" @eliminar="eliminarServicio" @agendar="agendarServicio" />
            </div>

            <ion-text v-else class="ion-text-center">
                <p>No hay servicios registrados.</p>
            </ion-text>

            <!-- Modal para solicitar negocio -->
            <SolicitarNegocioModal :is-open="isModalOpen" @close="isModalOpen = false"
                @solicitud-enviada="handleSolicitudEnviada" />

            <!-- Modal para agregar/editar servicio -->
            <AgregarServicioModal :is-open="isAgregarServicioModalOpen" :servicio="servicioSeleccionado"
                @close="closeServicioModal" @servicio-agregado="handleServicioAgregado" />
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { negocioService, Negocio } from '@/services/negocioService'
import { servicioService, type Servicio } from '@/services/servicioService'
import ServicioCard from '@/components/ServicioCard.vue'
import SolicitarNegocioModal from '@/components/SolicitarNegocioModal.vue'
import AgregarServicioModal from '@/components/AgregarServicioModal.vue'
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonSpinner,
    IonText,
} from '@ionic/vue'

const negocio = ref<Negocio | null>(null)
const rol = ref<string | null>(null)
const loading = ref(true)
const isModalOpen = ref(false)
const isAgregarServicioModalOpen = ref(false)
const servicios = ref<Servicio[]>([])
const cargandoServicios = ref(false)

// Modal editar/agregar
const servicioSeleccionado = ref<Servicio | undefined>(undefined)

const openAgregarServicioModal = () => {
    servicioSeleccionado.value = undefined
    isAgregarServicioModalOpen.value = true
}

const openEditarServicioModal = (servicio: Servicio) => {
    servicioSeleccionado.value = servicio
    isAgregarServicioModalOpen.value = true
}

const closeServicioModal = () => {
    isAgregarServicioModalOpen.value = false
    servicioSeleccionado.value = undefined
}

const handleServicioAgregado = (servicio: Servicio) => {
    const index = servicios.value.findIndex(s => s.id_servicio === servicio.id_servicio)
    if (index >= 0) {
        // Actualiza servicio existente
        servicios.value[index] = servicio
    } else {
        // Agrega nuevo servicio
        servicios.value.push(servicio)
    }
    closeServicioModal()
}

const handleSolicitudEnviada = async () => {
    await fetchMiNegocio()
    await cargarServicios()
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

const cargarServicios = async () => {
    try {
        cargandoServicios.value = true
        const lista = await servicioService.listar()
        servicios.value = Array.isArray(lista) ? lista : []
    } catch (e) {
        servicios.value = []
        console.error(e)
    } finally {
        cargandoServicios.value = false
    }
}
const eliminarServicio = async (servicio: Servicio) => {
    const confirmDelete = window.confirm(`¿Deseas eliminar el servicio "${servicio.nombre}"?`)
    if (!confirmDelete) return

    const exito = await servicioService.eliminar(servicio.id_servicio)
    if (exito) {
        // Eliminar del array local para que se actualice la UI
        servicios.value = servicios.value.filter(s => s.id_servicio !== servicio.id_servicio)
    }
}


// Handlers de los eventos de ServicioCard
const editarServicio = (servicio: Servicio) => openEditarServicioModal(servicio)
const agendarServicio = (servicio: Servicio) => console.log('Agendar cita:', servicio)

onMounted(async () => {
    await fetchMiNegocio()
    await cargarServicios()
})
</script>

<style scoped>
ion-content {
  --background: #0d1117;
  color: #e6edf3;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}



ion-title {
  font-weight: 600;
}

/* Spinner centrado */
ion-spinner {
  display: block;
  margin: 60px auto;
  color: #58a6ff;
}

/* Tarjeta */
ion-card {
  width: 90%;
  max-width: 420px;
  background: #161b22;
  border-radius: 16px;
  border: 1px solid #30363d;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  color: #e6edf3;
}

ion-card-header {
  border-bottom: 1px solid #21262d;
}

ion-card-title {
  color: #e6edf3;
  font-weight: 600;
  font-size: 1.2rem;
}

ion-card-subtitle {
  color: #8b949e;
}

/* Botones */
ion-button {
  --border-radius: 10px;
  font-weight: 500;
  text-transform: none;
  margin-top: 20px;
}

ion-button[color="primary"] {
  --background: #238636;
  --background-hover: #2ea043;
  --background-activated: #2ea043;
}

p {
  color: #e6edf3;
  text-align: center;
  line-height: 1.5;
}

strong {
  color: #58a6ff;
}
</style>
