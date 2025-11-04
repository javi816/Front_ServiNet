<template>
    <ion-card @click="onClick">
        <ion-img :src="negocio.foto || defaultImage"></ion-img>
        <ion-card-header>
            <ion-card-title>{{ negocio.nombre }}</ion-card-title>
            <ion-card-subtitle>{{ negocio.direccion }}</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
            <p>Teléfono: {{ negocio.telefono }}</p>
            <p>Correo: {{ negocio.correo }}</p>
            <p>Registrado: {{ formattedDate }}</p>
        </ion-card-content>
    </ion-card>
</template>

<script setup lang="ts">
import { computed } from "vue";


interface Negocio {
    id: number;
    nombre: string;
    direccion: string;
    telefono: string;
    correo: string;
    foto?: string | null;
    created_at: string;
}

const props = defineProps<{
    negocio: Negocio;
}>();

const defaultImage = "/assets/default-business.png";

const onClick = () => {
    console.log("Negocio clickeado:", props.negocio.id);
};

const formattedDate = computed(() => {
    return new Date(props.negocio.created_at).toLocaleDateString();
});

</script>
<script lang="ts">
export default {};
</script>

<style scoped>
ion-card {
    cursor: pointer;
    margin-bottom: 16px;
}

ion-img {
    height: 200px;
    object-fit: cover;
}
</style>