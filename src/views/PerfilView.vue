<!-- src/views/PerfilView.vue -->
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Mi Perfil</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Información del Usuario</ion-card-title>
        </ion-card-header>

        <ion-card-content class="ion-text-center">
          <!-- Foto de perfil -->
<ion-avatar class="mx-auto mb-4" style="width: 120px; height: 120px;">
  <img :src="fotoActual" alt="Foto de perfil" />
</ion-avatar>

<ion-button expand="block" color="medium" @click="selectPhoto">
  <ion-icon name="camera-outline" slot="start"></ion-icon>
  Cambiar foto
</ion-button>
<input ref="fileInput" type="file" accept="image/*" hidden @change="actualizarFoto" />

          <!-- Información personal -->
          <ion-item>
            <ion-label position="floating">Nombre</ion-label>
            <ion-input v-model="user.name"></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="floating">Correo</ion-label>
            <ion-input v-model="user.email"></ion-input>
          </ion-item>

          <ion-button expand="block" color="primary" @click="actualizarInfo" :disabled="loading">
            <ion-spinner v-if="loading" name="crescent" />
            <span v-else>Actualizar Información</span>
          </ion-button>

          <ion-button expand="block" fill="outline" color="secondary" @click="togglePasswordSection">
            <ion-icon name="lock-closed-outline" slot="start"></ion-icon>
            Cambiar Contraseña
          </ion-button>

          <!-- Sección de contraseña -->
          <div v-if="mostrarPassword" class="mt-3">
            <ion-item>
              <ion-label position="floating">Contraseña actual</ion-label>
              <ion-input type="password" v-model="currentPassword"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">Nueva contraseña</ion-label>
              <ion-input type="password" v-model="newPassword"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">Confirmar nueva contraseña</ion-label>
              <ion-input type="password" v-model="confirmPassword"></ion-input>
            </ion-item>

            <ion-button expand="block" color="success" @click="actualizarPassword" :disabled="loadingPassword">
              <ion-spinner v-if="loadingPassword" name="crescent" />
              <span v-else>Guardar nueva contraseña</span>
            </ion-button>
          </div>
        </ion-card-content>
      </ion-card>

      <!-- Toast -->
      <ion-toast
        :is-open="!!toast"
        :message="toast"
        duration="2500"
        color="medium"
        @didDismiss="toast = ''"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonButton, IonInput, IonItem, IonLabel, IonAvatar,
  IonIcon, IonToast, IonSpinner
} from '@ionic/vue';
import { ref } from 'vue';
import axios from 'axios';
import { authService } from '@/services/authService';

const user = ref(authService.getUser());
const token = authService.getToken();
const API_URL = 'https://api-servi-net.onrender.com/api';
const defaultPhoto = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
const fotoActual = ref(user.value?.profile_photo_url || defaultPhoto);

const toast = ref('');
const loading = ref(false);
const loadingPassword = ref(false);
const mostrarPassword = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

const selectPhoto = () => {
  fileInput.value?.click();
};

// ✅ Actualizar información personal
const actualizarInfo = async () => {
  loading.value = true;
  try {
    const res = await axios.put<any>(`${API_URL}/profile/update-info`, {
      name: user.value?.name,
      email: user.value?.email,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.value = res.data.message;
  } catch (error: any) {
    toast.value = error.response?.data?.message || 'Error al actualizar información';
  } finally {
    loading.value = false;
  }
};

// ✅ Actualizar foto de perfil
const actualizarFoto = async (event: any) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('profile_photo_url', file); // 👈 nombre correcto según backend

  try {
    const res = await axios.post<any>(`${API_URL}/profile/update-photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    // ✅ Actualizamos foto visible y el usuario guardado localmente
    fotoActual.value = res.data.profile_photo_url;
    user.value = { ...user.value, profile_photo_url: res.data.profile_photo_url };

    // ✅ Guardamos el nuevo usuario en el localStorage a través del authService
    authService.saveUser(user.value);

    toast.value = res.data.message;
  } catch (error: any) {
    toast.value = error.response?.data?.message || 'Error al actualizar foto';
  }
};


// ✅ Actualizar contraseña
const actualizarPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    toast.value = 'Las contraseñas no coinciden';
    return;
  }

  loadingPassword.value = true;
  try {
    const res = await axios.put<any>(`${API_URL}/password-update`, {
      current_password: currentPassword.value,
      password: newPassword.value,
      password_confirmation: confirmPassword.value,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.value = res.data.message;
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
  } catch (error: any) {
    toast.value = error.response?.data?.message || 'Error al actualizar contraseña';
  } finally {
    loadingPassword.value = false;
  }
};

const togglePasswordSection = () => {
  mostrarPassword.value = !mostrarPassword.value;
};
</script>

<style scoped>
ion-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.error-text {
  color: #f44336;
  text-align: center;
}
</style>
