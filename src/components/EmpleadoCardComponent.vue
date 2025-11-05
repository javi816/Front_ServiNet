<!-- src/components/EmpleadoCardComponent.vue -->
<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>{{ empleado.nombre }}</ion-card-title>
      <ion-card-subtitle>{{ empleado.especialidad || 'Sin especialidad' }}</ion-card-subtitle>
    </ion-card-header>

    <ion-card-content>
      <p><strong>Email:</strong> {{ empleado.email }}</p>
      <p v-if="empleado.telefono"><strong>Teléfono:</strong> {{ empleado.telefono }}</p>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { Empleado } from '@/services/empleadoService';

defineProps<{
  empleado: Empleado;
}>();
</script>
