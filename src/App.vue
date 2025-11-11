<template>
  <ion-app>
    <!-- Menu: se renderiza solo si showMenu es true -->
    <ion-menu content-id="main-content" v-if="showMenu">
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Menú</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
          <ion-button shape="round" fill="clear" expand="block" router-link="/negocios-feed">Negocios</ion-button>
          <ion-button shape="round" fill="clear" expand="block" router-link="/mi-negocio">Mi Negocio</ion-button>
          <ion-button shape="round" fill="clear" expand="block"  @click="handleLogout">Cerrar Sesion</ion-button>
      </ion-content>
    </ion-menu>

    <!-- Contenido principal: el id debe ser EXACTAMENTE main-content -->
    <ion-router-outlet id="main-content" />
  </ion-app>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { authService, currentUser } from "./services/authService";
import { useRoute, useRouter } from "vue-router";
import {
  IonApp,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonRouterOutlet,
  IonButton
} from "@ionic/vue";

const route = useRoute();
const router = useRouter();
const handleLogout = async () => {
  await authService.logout();
};

/*
  Ajusta aquí las rutas donde NO quieres el menú.
  Si tus rutas son '/login' y '/register' eso funciona.
  Si tus rutas son '/auth/login' o usan name, cámbialo.
*/
const hiddenPaths = ["/login", "/register"];
const showMenu = computed(() => !hiddenPaths.includes(route.path));

const goLogin = () => {
  // ejemplo simple de "logout" que lleva al login
  router.push("/login");
};
</script>

<style scoped>
ion-menu { --width: 300px; }
</style>
