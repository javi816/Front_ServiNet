<template>
  <ion-modal :is-open="isOpen" @didDismiss="closeModal">
    <ion-header>
      <ion-toolbar color="tertiary">
        <ion-title>Agregar Empleado</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">Cerrar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="center-container">
        <form v-if="usuario" @submit.prevent="agregarEmpleado">
          <p>Confirmar nuevo empleado</p>

          <!-- Información del usuario -->
          <div class="user-card">
            <h2>{{ usuario.name }}</h2>
            <p>{{ usuario.email }}</p>
            <p v-if="usuario.telefono"><strong>Teléfono:</strong> {{ usuario.telefono }}</p>
          </div>

          <!-- Rol -->
          <ion-item lines="none" class="ion-text-center">
            <ion-label>
              <strong>Rol en negocio:</strong>
              <p>{{ usuario.rol || 'Empleado' }}</p>
            </ion-label>
          </ion-item>

          <!-- Botones -->
          <ion-button expand="block" type="submit" class="ion-margin-top">
            Guardar
          </ion-button>
          <ion-button color="medium" expand="block" @click="closeModal">
            Cancelar
          </ion-button>
        </form>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonItem,
  IonLabel,
} from '@ionic/vue'
import { defineProps, defineEmits } from 'vue'
import empleadoService from '@/services/empleadoService'
import { authService } from '@/services/authService'

const props = defineProps({
  isOpen: Boolean,
  usuario: Object,
})
const emit = defineEmits(['close', 'empleadoAgregado'])

const closeModal = () => emit('close')

const agregarEmpleado = async () => {
  try {
    const negocio = authService.getNegocio()
    const idNegocio = negocio?.negocio?.id ?? null

    if (!idNegocio || !props.usuario) {
      console.error('Faltan datos de negocio o usuario.')
      return
    }

    const data = {
      id_usuario: props.usuario.id,
      especialidad: props.usuario.rol || 'empleado',
    }

    const response = await empleadoService.agregarEmpleado(idNegocio, data)
    emit('empleadoAgregado', response.empleado)
    closeModal()
  } catch (error) {
    console.error('Error al agregar empleado:', error)
  }
}
</script>

<style scoped>
ion-content {
  --background: #0d1117;
}

.center-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2%;
  box-sizing: border-box;
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

p {
  color: white;
  font-size: large;
}

.user-card {
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 20px;
  color: #fff;
}

.user-card h2 {
  margin: 0;
  color: #58a6ff;
  font-size: 1.3rem;
}

.user-card p {
  margin: 4px 0;
  color: #c9d1d9;
}

ion-item {
  --background: transparent;
  --color: #ffffff;
  margin-bottom: 10px;
}

ion-button {
  margin-top: 12px;
}
</style>
