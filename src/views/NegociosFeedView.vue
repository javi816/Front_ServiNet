<template>
    <ion-page>
        <ion-header>
            <ion-toolbar color="tertiary">
                <ion-title>Negocios</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
            <ion-spinner v-if="loading" />

            <ion-label v-else-if="negocios.length === 0">
                No hay negocios aprobados para mostrar
            </ion-label>

            <ion-list v-else>
                <NegocioCardComponent v-for="negocio in negocios" :key="negocio.id" :negocio="negocio" />
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { negocioService, type Negocio } from '@/services/negocioService'
import NegocioCardComponent from '@/components/NegocioCardComponent.vue'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSpinner, IonList, IonLabel } from '@ionic/vue'

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
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  color: #e6edf3;
}

ion-title {
  font-size: 1.4rem;
}

ion-list{
    background: #161b22;
}

ion-card {
  width: 90%;
  max-width: 400px;
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


.mt-3 {
  margin-top: 1rem;
}

.error-text {
  color: #f85149;
  text-align: center;
  margin-top: 8px;
}

ion-toast {
  --background: #161b22;
  --color: #e6edf3;
  border: 1px solid #30363d;
  border-radius: 10px;
}
</style>