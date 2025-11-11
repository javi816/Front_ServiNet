<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="tertiary">
        <ion-buttons slot="start">
          <!-- auto-hide="false" asegura que el botón aparezca aunque el menu esté oculto condicionalmente -->
          <ion-menu-button auto-hide="false"></ion-menu-button>
        </ion-buttons>
        <ion-title>Inicio</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="center-content">
        <!-- Mostrar datos del usuario -->
        <ion-card v-if="user">
          <ion-card-header>
            <ion-card-title>¡Bienvenido!</ion-card-title>
            <ion-card-subtitle>{{ user.name }}</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p><strong>Rol:</strong> {{ user.role || 'usuario' }}</p>
          </ion-card-content>
        </ion-card>

        <!-- Botón para ir al Dashboard (solo si es admin) -->
        <ion-button v-if="isAdmin" expand="block" router-link="/dashboard" color="primary">
          Ir al Dashboard (Solo Admin)
        </ion-button>

        <!-- Si NO es admin, mostrar mensaje -->
        <ion-card v-else>
          <ion-card-content>
            <p>No tienes acceso al Dashboard (solo para administradores)</p>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { authService, currentUser } from '@/services/authService';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonButton, IonCard, IonCardHeader,
  IonCardTitle, IonCardSubtitle, IonCardContent
} from '@ionic/vue';

const router = useRouter();
const user = computed(() => currentUser.value);
const isAdmin = computed(() => user.value?.role === 'admin');

</script>

<style scoped>
ion-page {
  --background: #0d1117;
  display: flex;
  flex-direction: column;
  height: 100%;
}

ion-title {
  font-size: 1.4rem;
}

ion-content {
  --background: #0d1117;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
}

ion-card {
  background: #161b22;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  border: 1px solid #21262d;
  width: 90%;
  max-width: 400px;
  color: #fff;
  text-align: center;
  margin-top: 25px;
}

ion-card-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #ffffff;
}

ion-card-subtitle {
  color: #90caf9;
  font-size: 0.9rem;
}

ion-card-content p {
  color: #ccc;
  margin: 5px 0;
  font-size: 0.95rem;
}

ion-button {
  --background: #2372b8;
  --background-hover: #42a5f5;
  --color: #000000;
  --border-radius: 10px;
  font-weight: 600;
  width: 100%;
  max-width: 400px;
}

ion-card p {
  color: #aaa;
  margin: 10px 0;
}

@media (min-width: 768px) {
  .center-content{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  ion-title {
    font-size: 1.8rem;
  }

  ion-content {
    justify-content: center;
    padding: 40px 0;
  }

  ion-card {
    max-width: 520px;
    padding: 25px;
    margin-top: 0;
  }

  ion-card-title {
    font-size: 1.6rem;
  }

  ion-card-subtitle {
    font-size: 1rem;
  }

  ion-card-content p {
    font-size: 1rem;
  }

  ion-button {
    font-size: 1rem;
    --border-radius: 12px;
  }
}
</style>
