<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
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
