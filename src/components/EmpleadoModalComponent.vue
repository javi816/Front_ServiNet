<!-- src/components/EmpleadoModalComponent.vue -->
<template>
  <ion-modal :is-open="isOpen" @didDismiss="closeModal">
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Agregar Empleado</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="usuario">
        <!-- Mostrar información del usuario seleccionado -->
        <ion-item lines="none">
          <ion-label>
            <h2>{{ usuario.name }}</h2>
            <p>{{ usuario.email }}</p>
            <p v-if="usuario.telefono"><strong>Teléfono:</strong> {{ usuario.telefono }}</p>
          </ion-label>
        </ion-item>

        <!-- Formulario: solo pide especialidad -->
        <form @submit.prevent="agregarEmpleado">
          <ion-item>
            <ion-label position="stacked">Especialidad</ion-label>
            <ion-input
              v-model="especialidad"
              type="text"
              required
              placeholder="Ej: Barbería, Uñas, Spa"
            ></ion-input>
          </ion-item>

          <div class="ion-text-center ion-margin-top">
            <ion-button type="submit" expand="block">Guardar</ion-button>
            <ion-button color="medium" expand="block" @click="closeModal">Cancelar</ion-button>
          </div>
        </form>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
} from "@ionic/vue";
import empleadoService from "@/services/empleadoService";
import { authService } from "@/services/authService";

const props = defineProps({
  isOpen: Boolean,
  usuario: Object, // Usuario seleccionado recibido desde la vista
});
const emit = defineEmits(["close", "empleadoAgregado"]);

const especialidad = ref("");

const closeModal = () => emit("close");

const agregarEmpleado = async () => {
  try {
    const negocio = authService.getNegocio();
    const idNegocio = negocio?.negocio?.id ?? null;

    if (!idNegocio || !props.usuario) {
      console.error("Faltan datos de negocio o usuario.");
      return;
    }

    const data = {
      id_usuario: props.usuario.id,
      especialidad: especialidad.value,
    };

    const response = await empleadoService.agregarEmpleado(idNegocio, data);
    emit("empleadoAgregado", response.empleado);
    closeModal();
  } catch (error) {
    console.error("Error al agregar empleado:", error);
  }
};
</script>
