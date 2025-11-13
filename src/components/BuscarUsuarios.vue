<template>
    <div class="buscar-usuarios">
        <ion-item>
            <ion-label position="stacked">Buscar usuario</ion-label>
            <ion-input v-model="query" placeholder="Escribe el nombre o correo"></ion-input>
        </ion-item>

        <ion-button expand="block" @click="buscarUsuarios" :disabled="!query">
            Buscar
        </ion-button>

        <ion-list v-if="usuarios.length">
            <ion-item v-for="usuario in usuarios" :key="usuario.id" button @click="$emit('seleccionado', usuario)">
                <ion-avatar slot="start">
                    <img :src="usuario.profile_photo_url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'" />
                </ion-avatar>
                <ion-label>
                    <h2>{{ usuario.name }}</h2>
                    <p>{{ usuario.email }}</p>
                </ion-label>
            </ion-item>
        </ion-list>

        <ion-text v-else-if="buscado && !usuarios.length" color="medium">
            No se encontraron usuarios.
        </ion-text>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IonItem, IonLabel, IonInput, IonButton, IonList, IonAvatar, IonText } from '@ionic/vue'
import axiosInstance from '@/services/axiosInstance'



const query = ref('')
const usuarios = ref<any[]>([])
const buscado = ref(false)

const buscarUsuarios = async () => {
    try {
        const response = await axiosInstance.post('citas/buscar/usuarios', {
            query: query.value,
        })
        usuarios.value = response.data || []
    } catch (error) {
        console.error('Error al buscar usuarios:', error)
        usuarios.value = []
    } finally {
        buscado.value = true
    }
}
</script>

<style scoped>
.buscar-usuarios {
    margin-top: 1rem;
}
</style>
