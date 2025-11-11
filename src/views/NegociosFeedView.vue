<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="tertiary">
        <ion-buttons slot="start">
          <!-- auto-hide="false" asegura que el botón aparezca aunque el menu esté oculto condicionalmente -->
          <ion-menu-button auto-hide="false"></ion-menu-button>
        </ion-buttons>
        <ion-title>Negocios</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="center-container">

        <ion-spinner v-if="loading" />

        <ion-label v-else-if="negocios.length === 0">
          No hay negocios aprobados para mostrar
        </ion-label>

        <!-- 🔹 Grilla responsiva -->
        <div v-else class="negocios-grid">
          <NegocioCardComponent v-for="negocio in negocios" :key="negocio.id" :negocio="negocio" class="negocio-card" />
        </div>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { negocioService, type Negocio } from '@/services/negocioService'
import NegocioCardComponent from '@/components/NegocioCardComponent.vue'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSpinner, IonLabel, IonButtons } from '@ionic/vue'

const negocios = ref<Negocio[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    negocios.value = await negocioService.getFeed()
  } catch (error) {
    console.error('Error al cargar negocios:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
ion-content {
  --background: #0d1117;
  padding: 16px;
  color: #e6edf3;
}

ion-title {
  font-size: 1.4rem;
}

ion-card {
  background: #161b22;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  border: 1px solid #21262d;
}

ion-card-header {
  text-align: center;
  border-bottom: 1px solid #21262d;
}

ion-card-title {
  font-weight: 600;
  color: #e6edf3;
  font-size: 1.2rem;
}

/* 🔹 Contenedor principal */
.center-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

/* 🔹 Grilla responsiva */
.negocios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  /* columnas automáticas que se adaptan */
  gap: 16px;
  width: 100%;
  max-width: 1200px;
}

/* 🔹 Tarjeta individual */
.negocio-card {
  width: 100%;
}
</style>
