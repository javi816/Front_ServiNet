<template>
  <ion-page>
    <ion-header translucent>
      <ion-toolbar color="primary">
        <ion-title>Servicios</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- BOTÓN AGREGAR -->
      <ion-button expand="block" color="success" @click="openModal()">
        <ion-icon name="add-circle-outline" slot="start"></ion-icon>
        Agregar servicio
      </ion-button>

      <!-- LISTA DE SERVICIOS -->
      <div v-if="loading" class="text-center mt-8">
        <ion-spinner name="crescent"></ion-spinner>
      </div>

      <div v-else-if="servicios.length === 0" class="text-center text-gray-500 mt-6">
        No hay servicios registrados.
      </div>

      <div v-else class="grid grid-cols-1 gap-4 mt-4">
        <ion-card
          v-for="servicio in servicios"
          :key="servicio.id"
          class="servicio-card"
          @click="openModal(servicio)"
        >
          <img
            v-if="servicio.foto"
            :src="servicio.foto"
            alt="Foto servicio"
            class="servicio-img"
          />

          <ion-card-header>
            <ion-card-title class="text-lg font-bold">
              {{ servicio.nombre }}
            </ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <p class="descripcion">{{ servicio.descripcion || 'Sin descripción' }}</p>
            <p class="precio">💵 ${{ servicio.precio }}</p>
            <p v-if="servicio.duracion" class="duracion">⏱ {{ servicio.duracion }} min</p>

            <ion-button
              color="danger"
              fill="outline"
              size="small"
              class="boton-eliminar"
              @click.stop="confirmDelete(servicio.id)"
            >
              <ion-icon slot="start" name="trash-outline"></ion-icon>
              Eliminar
            </ion-button>
          </ion-card-content>
        </ion-card>
      </div>

      <!-- MODAL FORMULARIO -->
      <ion-modal :is-open="showModal" @didDismiss="closeModal">
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>{{ editingServicio ? 'Editar servicio' : 'Nuevo servicio' }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeModal">Cerrar</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <form @submit.prevent="saveServicio">
            <ion-item>
              <ion-label position="floating">Nombre</ion-label>
              <ion-input v-model="form.nombre" required></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="floating">Descripción</ion-label>
              <ion-textarea v-model="form.descripcion"></ion-textarea>
            </ion-item>

            <ion-item>
              <ion-label position="floating">Precio ($)</ion-label>
              <ion-input type="number" v-model.number="form.precio" required></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="floating">Duración (minutos)</ion-label>
              <ion-input type="number" v-model.number="form.duracion"></ion-input>
            </ion-item>

            <div class="foto-container">
              <label class="foto-label">Foto del servicio:</label>
              <input type="file" accept="image/*" @change="handleImage" />
              <img v-if="preview" :src="preview" class="preview-img" />
            </div>

            <ion-button expand="block" type="submit" color="primary" class="mt-4">
              <ion-icon name="save-outline" slot="start"></ion-icon>
              {{ editingServicio ? 'Actualizar' : 'Guardar' }}
            </ion-button>
          </form>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonInput,
  IonTextarea,
  IonLabel,
  IonModal,
  IonSpinner,
  IonButtons,
  alertController,
} from "@ionic/vue";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useServicios, Servicio } from "@/services/servicios";

const route = useRoute();
const id_negocio = Number(route.params.id_negocio);

const { servicios, getServicios, createServicio, updateServicio, deleteServicio } = useServicios();

const loading = ref(true);
const showModal = ref(false);
const editingServicio = ref<Servicio | null>(null);
const form = ref<any>({
  nombre: "",
  descripcion: "",
  precio: 0,
  duracion: 0,
  foto: null,
});
const preview = ref<string | null>(null);

// Cargar servicios
const fetchServicios = async () => {
  loading.value = true;
  try {
    await getServicios(id_negocio);
  } catch (e) {
    console.error("Error al obtener servicios:", e);
  } finally {
    loading.value = false;
  }
};

// Abrir modal para nuevo o editar
const openModal = (servicio: Servicio | null = null) => {
  if (servicio) {
    editingServicio.value = servicio;
    form.value = { ...servicio };
    preview.value = servicio.foto || null;
  } else {
    editingServicio.value = null;
    form.value = { nombre: "", descripcion: "", precio: 0, duracion: 0, foto: null };
    preview.value = null;
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

// Manejo de imagen
const handleImage = (event: any) => {
  const file = event.target.files[0];
  if (file) {
    form.value.foto = file;
    preview.value = URL.createObjectURL(file);
  }
};

// Guardar o actualizar servicio
const saveServicio = async () => {
  const formData = new FormData();
  formData.append("nombre", form.value.nombre);
  formData.append("descripcion", form.value.descripcion || "");
  formData.append("precio", form.value.precio.toString());
  formData.append("duracion", (form.value.duracion || 0).toString());

  if (form.value.foto instanceof File) {
    formData.append("foto", form.value.foto);
  }

  try {
    if (editingServicio.value) {
      await updateServicio(editingServicio.value.id, formData);
    } else {
      await createServicio(id_negocio, formData);
    }
    await fetchServicios();
    closeModal();
  } catch (e) {
    console.error("Error al guardar servicio:", e);
  }
};

// Confirmar eliminación
const confirmDelete = async (id: number) => {
  const alert = await alertController.create({
    header: "Confirmar",
    message: "¿Deseas eliminar este servicio?",
    buttons: [
      { text: "Cancelar", role: "cancel" },
      {
        text: "Eliminar",
        handler: async () => {
          try {
            await deleteServicio(id);
            servicios.value = servicios.value.filter((s) => s.id !== id);
          } catch (e) {
            console.error("Error al eliminar servicio:", e);
          }
        },
      },
    ],
  });
  await alert.present();
};

onMounted(fetchServicios);
</script>

<style scoped>
.servicio-card {
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s;
}
.servicio-card:hover {
  transform: scale(1.02);
}
.servicio-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}
.descripcion {
  font-size: 14px;
  color: #444;
  margin-bottom: 5px;
}
.precio {
  font-weight: bold;
  color: #1e90ff;
}
.duracion {
  color: #777;
  font-size: 13px;
}
.boton-eliminar {
  margin-top: 8px;
}
.foto-container {
  margin-top: 15px;
}
.preview-img {
  margin-top: 10px;
  border-radius: 10px;
  width: 100%;
  max-height: 200px;
  object-fit: cover;
}
</style>
