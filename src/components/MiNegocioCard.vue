<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Mi Negocio</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Estado null: mostrar botón para solicitar negocio -->
      <ion-button v-if="estado === 'null'" @click="openModal">
        Solicitar negocio
      </ion-button>

      <!-- Modal para solicitar negocio -->
      <IonModal :is-open="showModal" @did-dismiss="closeModal">
        <SolicitarNegocioModal
          @solicitud-enviada="onSolicitudEnviada"
          :is-open="showModal"
          :on-close="closeModal"
        />
      </IonModal>

      <!-- Estado pendiente -->
      <div v-if="estado === 'pendiente'">
        <p>Tu solicitud está pendiente de aprobación</p>
      </div>

      <!-- Estado rechazado -->
      <div v-else-if="estado === 'rechazado'">
        <p>Tu solicitud fue rechazada</p>
        <ion-button @click="openModal">Volver a solicitar</ion-button>
      </div>

      <!-- Estado aprobado -->
      <div v-else-if="estado === 'aprobado'">
        <!-- Aquí luego irá el dashboard del negocio -->
        <p>Negocio aprobado (dashboard pendiente)</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import SolicitarNegocioModal from './SolicitarNegocioModal.vue'
import { Negocio } from '@/services/negocioService'

export default {
  name: 'MiNegocioView',
  components: { SolicitarNegocioModal },
  setup() {
    const showModal = ref(false)
    const estado = ref<'null' | 'pendiente' | 'aprobado' | 'rechazado'>('null')
    const negocioPendiente = ref<Negocio | null>(null)

    const openModal = () => { showModal.value = true }
    const closeModal = () => { showModal.value = false }

    // Leer del localStorage al montar
    onMounted(() => {
      const negocioGuardado = localStorage.getItem('negocio_solicitud')
      if (negocioGuardado) {
        const negocio: Negocio = JSON.parse(negocioGuardado)
        estado.value = negocio.estado || 'pendiente'
        negocioPendiente.value = negocio
      }
    })

    // Cuando se envía la solicitud
    const onSolicitudEnviada = (negocio: Negocio) => {
      localStorage.setItem('negocio_solicitud', JSON.stringify(negocio))
      estado.value = negocio.estado || 'pendiente'
      negocioPendiente.value = negocio
      closeModal()
    }

    return { showModal, openModal, closeModal, estado, onSolicitudEnviada }
  },
}
</script>
