<!-- src/views/EmpleadoList.vue -->
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="tertiary">
        <ion-buttons slot="start">
            <!-- auto-hide="false" asegura que el botón aparezca aunque el menu esté oculto condicionalmente -->
            <ion-menu-button auto-hide="false"></ion-menu-button>
        </ion-buttons>
        <ion-title>Gestión de Empleados</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="!idNegocio" class="text-center">
        <ion-label color="medium">
          No tienes un negocio asociado a tu cuenta.
        </ion-label>
      </div>

      <div v-else>
        <!-- 🔍 Buscar usuarios disponibles -->
        <ion-item>
          <ion-input
            v-model="query"
            placeholder="Buscar usuario por nombre o email"
          ></ion-input>
          <ion-button @click="buscarUsuarios" expand="block">Buscar</ion-button>
        </ion-item>

        <!-- Mensaje si no hay resultados de búsqueda -->
        <div v-if="busquedaRealizada && usuariosDisponibles.length === 0" class="ion-text-center ion-margin-top">
          <ion-label color="medium">No se encontraron usuarios disponibles.</ion-label>
        </div>

        <!-- Resultados de búsqueda -->
        <ion-list v-if="usuariosDisponibles.length">
          <ion-list-header>
            <ion-label>Usuarios disponibles</ion-label>
          </ion-list-header>
          <ion-item
            v-for="usuario in usuariosDisponibles"
            :key="usuario.id"
          >
            <ion-label>
              <h2>{{ usuario.name }}</h2>
              <p>{{ usuario.email }}</p>
            </ion-label>
            <ion-button color="success" @click="abrirModal(usuario)">Agregar</ion-button>
          </ion-item>
        </ion-list>

        <!-- Lista de empleados actuales -->
        <ion-list v-if="empleados.length">
          <ion-list-header>
            <ion-label>Empleados actuales</ion-label>
          </ion-list-header>
          <ion-item
            v-for="empleado in empleados"
            :key="empleado.id_empleado"
          >
            <ion-label>
              <h2>{{ empleado.nombre }}</h2>
              <p>{{ empleado.email }} - {{ empleado.especialidad }}</p>
            </ion-label>
            <ion-button color="danger" @click="confirmarEliminacion(empleado.id_empleado)">
              Eliminar
            </ion-button>
          </ion-item>
        </ion-list>

        <!-- Mensaje si no hay empleados -->
        <div v-if="!empleados.length && empleadosCargados" class="ion-text-center ion-margin-top">
          <ion-label color="medium">No hay empleados registrados en este negocio.</ion-label>
        </div>
      </div>

      <!-- Modal para agregar empleado -->
      <EmpleadoModalComponent
        :is-open="isModalOpen"
        :usuario="selectedUsuario"
        @close="isModalOpen = false"
        @empleadoAgregado="onEmpleadoAgregado"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonList,
  IonListHeader,
  IonLabel,
  IonButtons,

} from "@ionic/vue";
import empleadoService from "@/services/empleadoService";
import EmpleadoModalComponent from "@/components/EmpleadoModalComponent.vue";
import { authService } from "@/services/authService";

const negocio = authService.getNegocio();
const idNegocio = negocio?.negocio?.id ?? null;

const empleados = ref<any[]>([]);
const empleadosCargados = ref(false);
const usuariosDisponibles = ref<any[]>([]);
const query = ref("");
const busquedaRealizada = ref(false);
const isModalOpen = ref(false);
const selectedUsuario = ref<any | null>(null);

const cargarEmpleados = async () => {
  if (!idNegocio) return;
  try {
    const data = await empleadoService.listarEmpleados(idNegocio);
    empleados.value = data.empleados;
  } catch (error) {
    console.error("Error al cargar empleados:", error);
  } finally {
    empleadosCargados.value = true;
  }
};

const buscarUsuarios = async () => {
  if (!idNegocio || !query.value.trim()) return;
  try {
    const data = await empleadoService.buscarUsuariosDisponibles(idNegocio, query.value);
    usuariosDisponibles.value = data;
    busquedaRealizada.value = true;
  } catch (error) {
    console.error("Error al buscar usuarios:", error);
  }
};

const abrirModal = (usuario: any) => {
  selectedUsuario.value = usuario;
  isModalOpen.value = true;
};

const confirmarEliminacion = async (idEmpleado: number) => {
  const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este empleado?");
  if (confirmar) {
    await eliminarEmpleado(idEmpleado);
  }
};

const eliminarEmpleado = async (idEmpleado: number) => {
  if (!idNegocio) return;
  try {
    await empleadoService.eliminarEmpleado(idNegocio, idEmpleado);
    empleados.value = empleados.value.filter((e) => e.id_empleado !== idEmpleado);
  } catch (error) {
    console.error("Error al eliminar empleado:", error);
  }
};

const onEmpleadoAgregado = (empleado: any) => {
  empleados.value.push(empleado);

  // 🔹 Eliminar de los resultados de búsqueda al usuario agregado
  usuariosDisponibles.value = usuariosDisponibles.value.filter(
    (u) => u.id !== empleado.id_usuario
  );
};

onMounted(cargarEmpleados);
</script>

<style scoped>
ion-page {
  --background: #0d1117;
  color: #ffffff;
}

ion-header {
  --background: #0d1117;
  border-bottom: 1px solid #2c2c2c;
}

ion-toolbar {
  --color: #ffffff;
  --background: #0d1117;
  text-align: center;
}

ion-title {
  font-size: 1.3rem;
  font-weight: 600;
}

ion-content {
  --background: #0d1117;
  padding: 20px;
}

ion-item {
  --background: rgba(40, 40, 40, 0.9);
  border-radius: 12px;
  margin-bottom: 10px;
}

ion-input {
  color: #ffffff;
}

ion-label {
  color: #bdbdbd;
}

ion-list-header {
  color: #90caf9;
  font-weight: 600;
  margin-top: 15px;
}

ion-list {
  background: transparent;
}

ion-button {
  --border-radius: 10px;
  font-weight: 600;
  margin-left: 8px;
}

ion-button[color="success"] {
  --background: #2e7d32;
  --background-hover: #43a047;
}

ion-button[color="danger"] {
  --background: #c62828;
  --background-hover: #e53935;
}

ion-label[color="medium"] {
  color: #aaa !important;
}

.text-center {
  text-align: center;
  margin-top: 20px;
  color: #bdbdbd;
}
</style>

