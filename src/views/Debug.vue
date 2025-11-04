<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Depuración</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
            <ion-card>
                <ion-card-header>
                    <ion-card-title>Token guardado</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                    <p style="word-break: break-all;">{{ token }}</p>
                </ion-card-content>
            </ion-card>

            <ion-card>
                <ion-card-header>
                    <ion-card-title>Usuario guardado</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                    <pre>{{ user }}</pre>
                </ion-card-content>
            </ion-card>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { authService } from '@/services/authService'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/vue'

const token = ref<string | null>(null)
const user = ref<any>(null)

onMounted(() => {
    token.value = authService.getToken()
    user.value = authService.getUser()
})
</script>
