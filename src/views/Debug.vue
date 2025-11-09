<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Depuración</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- TOKEN -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Token guardado</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p style="word-break: break-all;">{{ token }}</p>
        </ion-card-content>
      </ion-card>

      <!-- USUARIO -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Usuario guardado</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <pre>{{ user }}</pre>

          <!-- ✅ Mostrar imagen si existe -->
          <div style="text-align:center; margin-top:10px;">
            <img
              :src="user?.profile_photo_url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'"
              alt="Foto de perfil"
              style="width:120px; height:120px; border-radius:50%; object-fit:cover; border:2px solid #ccc;"
            />
          </div>
        </ion-card-content>
      </ion-card>

      <!-- NEGOCIO -->
      <ion-card v-if="negocio">
        <ion-card-header>
          <ion-card-title>Negocio guardado</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <pre>{{ negocio }}</pre>
        </ion-card-content>
      </ion-card>

      <ion-card v-else>
        <ion-card-header>
          <ion-card-title>Negocio</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p>No hay negocio guardado.</p>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { authService } from '@/services/authService'
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, 
  IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent 
} from '@ionic/vue'

const token = ref<string | null>(null)
const user = ref<any>(null)
const negocio = ref<any>(null)

onMounted(() => {
  token.value = authService.getToken()
  user.value = authService.getUser()
  negocio.value = authService.getNegocio()
})
</script>
