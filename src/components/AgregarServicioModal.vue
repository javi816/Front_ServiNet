<template>
  <ion-modal :is-open="isOpen" @did-dismiss="closeModal">
    <ion-header>
      <ion-toolbar color="tertiary">
        <ion-title>{{ servicio ? 'Editar Servicio' : 'Agregar Servicio' }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">Cerrar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="center-container">
        <form @submit.prevent="submitForm">
          <p>{{ servicio ? 'Editar Servicio' : 'Agregar Servicio' }}</p>

          <!-- Nombre -->
          <ion-input
            label="Nombre"
            label-placement="floating"
            fill="outline"
            type="text"
            v-model="nombre"
            required
          ></ion-input>

          <!-- Descripción -->
          <ion-textarea
            label="Descripción"
            label-placement="floating"
            fill="outline"
            v-model="descripcion"
          ></ion-textarea>

          <!-- Precio -->
          <ion-input
            label="Precio"
            label-placement="floating"
            fill="outline"
            type="number"
            v-model.number="precio"
            required
          ></ion-input>

          <!-- Duración -->
          <ion-input
            label="Duración (minutos)"
            label-placement="floating"
            fill="outline"
            type="number"
            v-model.number="duracion"
          ></ion-input>

          <!-- Foto -->
          <div class="file-section">
            <p>Foto</p>
            <input type="file" accept="image/*" @change="handleFileChange" />
          </div>

          <!-- Previsualización -->
          <div v-if="previewUrl" class="preview-container">
            <img :src="previewUrl" alt="Previsualización" />
          </div>

          <!-- Botón principal -->
          <ion-button expand="block" type="submit" :disabled="loading" class="ion-margin-top">
            {{ loading ? 'Guardando...' : servicio ? 'Actualizar Servicio' : 'Agregar Servicio' }}
          </ion-button>
        </form>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'
import { servicioService, type Servicio } from '@/services/servicioService'
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonInput,
  IonTextarea,
} from '@ionic/vue'

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

watch(
  () => props.servicio,
  (s) => {
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
  },
  { immediate: true }
)

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

const closeModal = () => emit('close')

const submitForm = async () => {
  if (!nombre.value || precio.value === null) return

  loading.value = true
  try {
    let servicio: Servicio | null = null

    if (props.servicio) {
      servicio = await servicioService.editarConFoto(
        props.servicio.id_servicio,
        nombre.value,
        descripcion.value,
        precio.value,
        duracion.value,
        foto.value
      )
    } else {
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
ion-content {
  --background: #0d1117;
}

p {
  color: white;
  font-size: x-large;
}

.center-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2%;
  box-sizing: border-box;
  gap: 2vh;
}

form {
  background: #161b22;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  border: 1px solid #21262d;
  padding: 35px 25px;
  width: 100%;
  max-width: 400px;
  text-align: center;
}

ion-input,
ion-textarea {
  --background: #0d1117;
  --color: #ffffff;
  --placeholder-color: #999;
  --border-color: #30363d;
  --highlight-color-focused: #4da3ff;
  margin-bottom: 16px;
}

.file-section {
  margin-top: 8px;
  text-align: left;
}

.file-section p {
  color: #ccc;
  margin-bottom: 6px;
  font-size: 0.95rem;
}

input[type="file"] {
  width: 100%;
  color: white;
}

.preview-container {
  margin-top: 12px;
}

.preview-container img {
  width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: 8px;
}

ion-button {
  margin-top: 12px;
}
</style>
