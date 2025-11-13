<template>
    <ion-modal :is-open="isOpen" @did-dismiss="closeModal">
        <ion-header>
            <ion-toolbar>
                <ion-title>{{ servicio ? 'Editar Servicio' : 'Agregar Servicio' }}</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="closeModal">Cerrar</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
            <form @submit.prevent="submitForm">
                <ion-item>
                    <ion-label position="floating">Nombre</ion-label>
                    <ion-input v-model="nombre" required />
                </ion-item>

                <ion-item>
                    <ion-label position="floating">Descripción</ion-label>
                    <ion-textarea v-model="descripcion" />
                </ion-item>

                <ion-item>
                    <ion-label position="floating">Precio</ion-label>
                    <ion-input type="number" v-model.number="precio" required />
                </ion-item>

                <ion-item>
                    <ion-label position="floating">Duración (minutos)</ion-label>
                    <ion-input type="number" v-model.number="duracion" />
                </ion-item>

                <ion-item>
                    <ion-label>Foto</ion-label>
                    <input type="file" accept="image/*" @change="handleFileChange" />
                </ion-item>

                <ion-item v-if="previewUrl">
                    <img :src="previewUrl" alt="Previsualización"
                        style="width: 100%; max-height: 200px; object-fit: contain; border-radius: 8px;" />
                </ion-item>

                <ion-button expand="block" type="submit" :disabled="loading">
                    {{ loading ? 'Guardando...' : servicio ? 'Actualizar Servicio' : 'Agregar Servicio' }}
                </ion-button>
            </form>
        </ion-content>
    </ion-modal>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch, onMounted } from 'vue'
import { servicioService, type Servicio } from '@/services/servicioService'
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonItem, IonLabel, IonInput, IonTextarea } from '@ionic/vue'

const props = defineProps<{ isOpen: boolean; servicio?: Servicio }>()
const emit = defineEmits<{
    (e: 'close'): void
    (e: 'servicio-agregado', servicio: Servicio): void
}>()

const nombre = ref('')
const descripcion = ref('')
const precio = ref<number | null>(null)
const duracion = ref<number | null>(null)
const foto = ref<File | null>(null)
const loading = ref(false)
const previewUrl = ref<string | null>(null)

// Si hay un servicio, precargamos los datos
watch(() => props.servicio, (s) => {
    if (s) {
        nombre.value = s.nombre
        descripcion.value = s.descripcion ?? ''
        precio.value = Number(s.precio)
        duracion.value = s.duracion ?? null
        previewUrl.value = s.foto ?? null
    } else {
        nombre.value = ''
        descripcion.value = ''
        precio.value = null
        duracion.value = null
        previewUrl.value = null
        foto.value = null
    }
}, { immediate: true })

const handleFileChange = (event: Event) => {
    const files = (event.target as HTMLInputElement).files
    if (files && files.length > 0) {
        foto.value = files[0]
        const reader = new FileReader()
        reader.onload = (e) => {
            previewUrl.value = e.target?.result as string
        }
        reader.readAsDataURL(files[0])
    }
}

const closeModal = () => {
    emit('close')
}

const submitForm = async () => {
    if (!nombre.value || precio.value === null) return

    loading.value = true
    try {
        let servicio: Servicio | null = null

        if (props.servicio) {
            // Editar servicio existente
            servicio = await servicioService.editarConFoto(
                props.servicio.id,
                nombre.value,
                descripcion.value,
                precio.value,
                duracion.value,
                foto.value
            )
        } else {
            // Agregar nuevo servicio
            servicio = await servicioService.agregarConFoto(
                nombre.value,
                descripcion.value,
                precio.value,
                duracion.value,
                foto.value
            )
        }

        if (servicio) {
            emit('servicio-agregado', servicio)
            closeModal()
        }
    } catch (e) {
        console.error('Error al guardar servicio:', e)
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
ion-item input[type="file"] {
    margin-top: 8px;
}
</style>
