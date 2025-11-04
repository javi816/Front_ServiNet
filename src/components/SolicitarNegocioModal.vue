<template>
    <ion-modal :is-open="isOpen" @did-dismiss="closeModal">
        <ion-header>
            <ion-toolbar>
                <ion-title>Solicitar Negocio</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="closeModal">Cerrar</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
            <form @submit.prevent="handleSubmit">
                <ion-item>
                    <ion-label position="floating">Nombre</ion-label>
                    <ion-input v-model="nombre" required></ion-input>
                </ion-item>

                <ion-item>
                    <ion-label position="floating">Dirección</ion-label>
                    <ion-input v-model="direccion" required></ion-input>
                </ion-item>

                <ion-item>
                    <ion-label position="floating">Teléfono</ion-label>
                    <ion-input v-model="telefono" required></ion-input>
                </ion-item>

                <ion-item>
                    <ion-label position="floating">Correo</ion-label>
                    <ion-input v-model="correo" type="email" required></ion-input>
                </ion-item>

                <ion-item>
                    <ion-label position="floating">Foto (URL)</ion-label>
                    <ion-input v-model="foto"></ion-input>
                </ion-item>

                <ion-text color="danger" v-if="errorMessage">
                    <p>{{ errorMessage }}</p>
                </ion-text>

                <ion-button expand="block" type="submit" :disabled="loading" class="ion-margin-top">
                    {{ loading ? "Enviando..." : "Enviar Solicitud" }}
                </ion-button>
            </form>
        </ion-content>
    </ion-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { negocioService, NegocioSolicitud } from '@/services/negocioService'
import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonButton, IonCard, IonCardHeader, IonCardTitle,
    IonCardSubtitle, IonCardContent, IonModal, IonItem, IonLabel, IonInput, IonText
} from '@ionic/vue'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{
    (e: 'close'): void
    (e: 'solicitud-enviada', negocio: any): void
}>()

const nombre = ref('')
const direccion = ref('')
const telefono = ref('')
const correo = ref('')
const foto = ref('')
const loading = ref(false)
const errorMessage = ref('')

const closeModal = () => {
    emit('close')
}

const handleSubmit = async () => {
    errorMessage.value = ''
    loading.value = true

    try {
        const solicitud: NegocioSolicitud = {
            nombre: nombre.value,
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
ion-text p {
    padding: 10px;
    margin-top: 10px;
}
</style>
