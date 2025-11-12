<template>
  <ion-card>
    <ion-img :src="servicio.foto || defaultImage"></ion-img>
    <ion-card-header>
      <ion-card-title>{{ servicio.nombre }}</ion-card-title>
      <ion-card-subtitle>{{ servicio.descripcion }}</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
      <p>Precio: ${{ servicio.precio }}</p>
      <ion-button
        expand="block"
        color="primary"
        @click="solicitarCita(servicio.id)"
      >
        Solicitar cita
      </ion-button>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps<{
  servicio: {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    foto?: string | null;
  };
}>();

const defaultImage = "/sin-imagen.svg";

const solicitarCita = (id: number) => {
  router.push(`/citas-usuario/${id}`);
};
</script>
