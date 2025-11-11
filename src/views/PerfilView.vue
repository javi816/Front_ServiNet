<!-- src/views/PerfilView.vue -->
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="tertiary">
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
            <ion-input v-model="user!.name"></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="floating">Correo</ion-label>
            <ion-input v-model="user!.email"></ion-input>
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
      name: user.value!.name,
      email: user.value!.email,
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
  if (!file || !user.value) return;

  const formData = new FormData();
  formData.append('profile_photo_url', file);

  try {
    const res = await axios.post<any>(`${API_URL}/profile/update-photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    // ✅ Actualizamos foto visible y el usuario guardado localmente
    fotoActual.value = res.data.profile_photo_url;
    user.value = { ...user.value, profile_photo_url: res.data.profile_photo_url } as typeof user.value;

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

/* ✅ Centrar avatar */
ion-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

ion-avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #30363d;
  overflow: hidden;
  margin: 12px auto 16px auto;
  transition: transform 0.2s;
}

ion-avatar:hover {
  transform: scale(1.05);
}

/* ✅ Separación entre label e input */
ion-item {
  --background: transparent;
  --color: #e6edf3;
  border: 1px solid #30363d;
  border-radius: 10px;
  margin-top: 12px;
  --highlight-color-focused: #58a6ff;
}

ion-label {
  color: #8b949e;
  margin-bottom: 4px;
}

ion-input {
  color: #e6edf3;
  margin-top: 15px;
}

ion-button {
  margin-top: 16px;
  border-radius: 10px;
  font-weight: 500;
  text-transform: none;
}

ion-button[color="primary"] {
  --background: #238636;
  --background-activated: #2ea043;
  --background-hover: #2ea043;
  color: #fff;
}

ion-button[color="secondary"] {
  --border-color: #58a6ff;
  color: #58a6ff;
}

ion-button[color="success"] {
  --background: #1f6feb;
  --background-activated: #316dca;
  color: #fff;
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

