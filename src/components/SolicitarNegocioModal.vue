<template>
  <ion-modal :is-open="isOpen" @did-dismiss="closeModal">
    <ion-header>
      <ion-toolbar color="tertiary">
        <ion-title>Solicitar Negocio</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">Cerrar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="center-container">
        <form @submit.prevent="handleSubmit">
          <p>Ingresa los datos de tu negocio</p>

          <!-- Nombre -->
          <ion-input
            label="Nombre del negocio"
            label-placement="floating"
            fill="outline"
            v-model="nombre"
            required
          ></ion-input>

          <!-- Descripción -->
          <ion-textarea
            label="Descripción"
            label-placement="floating"
            fill="outline"
            auto-grow
            v-model="descripcion"
            required
          ></ion-textarea>

          <!-- Dirección -->
          <ion-input
            label="Dirección"
            label-placement="floating"
            fill="outline"
            v-model="direccion"
            required
          ></ion-input>

          <!-- Teléfono -->
          <ion-input
            label="Teléfono"
            label-placement="floating"
            fill="outline"
            type="tel"
            v-model="telefono"
            required
          ></ion-input>

          <!-- Correo -->
          <ion-input
            label="Correo electrónico"
            label-placement="floating"
            fill="outline"
            type="email"
            v-model="correo"
            required
          ></ion-input>

          <!-- Foto -->
          <ion-input
            label="Foto (URL opcional)"
            label-placement="floating"
            fill="outline"
            v-model="foto"
          ></ion-input>

          <!-- Error -->
          <ion-text color="danger" v-if="errorMessage">
            <p>{{ errorMessage }}</p>
          </ion-text>

          <!-- Botón principal -->
          <ion-button expand="block" type="submit" :disabled="loading" class="ion-margin-top">
            {{ loading ? 'Enviando...' : 'Enviar Solicitud' }}
          </ion-button>
        </form>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { negocioService, type NegocioSolicitud } from '@/services/negocioService'
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonInput,
  IonTextarea,
  IonText,
} from '@ionic/vue'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'solicitud-enviada', negocio: any): void
}>()

const nombre = ref('')
const descripcion = ref('') // 🔹 Nuevo campo
const direccion = ref('')
const telefono = ref('')
const correo = ref('')
const foto = ref('')
const loading = ref(false)
const errorMessage = ref('')

const closeModal = () => emit('close')

const handleSubmit = async () => {
  errorMessage.value = ''
  loading.value = true

  try {
    const solicitud: NegocioSolicitud = {
      nombre: nombre.value,
      descripcion: descripcion.value, // 🔹 Se envía también
      direccion: direccion.value,
      telefono: telefono.value,
      correo: correo.value,
      foto: foto.value || undefined,
    }

    const response = await negocioService.solicitarNegocio(solicitud)
    emit('solicitud-enviada', response.negocio)
    closeModal()
  } catch (error: any) {
    errorMessage.value = error.message || 'Error al enviar la solicitud'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
ion-content {
  --background: #0d1117;
}

p {
  color: white;
  font-size: x-large;
}

.center-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2%;
  box-sizing: border-box;
  gap: 2vh;
}

form {
  background: #161b22;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  border: 1px solid #21262d;
  padding: 35px 25px;
  width: 100%;
  max-width: 400px;
  text-align: center;
}

ion-input,
ion-textarea {
  --background: #0d1117;
  --color: #ffffff;
  --placeholder-color: #999;
  --border-color: #30363d;
  --highlight-color-focused: #4da3ff;
  margin-bottom: 16px;
}

ion-text p {
  margin-top: 8px;
  color: #ff6b6b;
}

ion-button {
  margin-top: 12px;
}
</style>
