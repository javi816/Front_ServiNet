import { ref } from 'vue';
import { api } from '@/services/auth';

// 🔹 Interfaces y tipos
export interface Servicio {
  id: number;
  id_negocio: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  duracion?: number;
  foto?: string;
}

interface ApiResponse<T> {
  message: string;
  data: T;
}

// 🔹 Reactive state
export const servicios = ref<Servicio[]>([]);

export const useServicios = () => {
  // 🟢 Listar servicios de un negocio
  const getServicios = async (id_negocio: number) => {
    try {
      const res = await api.get<ApiResponse<Servicio[]>>(`/servicios/${id_negocio}`);
      servicios.value = res.data.data || [];
      return servicios.value;
    } catch (error) {
      console.error('Error al cargar servicios:', error);
      servicios.value = [];
      return [];
    }
  };

  // ➕ Crear un nuevo servicio (con imagen opcional)
  const createServicio = async (id_negocio: number, formData: FormData) => {
    try {
      const res = await api.post<ApiResponse<Servicio>>(`/servicios/${id_negocio}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data.data;
    } catch (error: any) {
      console.error('Error al crear servicio:', error.response?.data || error);
      throw error;
    }
  };

  // ✏️ Actualizar un servicio
  const updateServicio = async (id: number, formData: FormData) => {
    try {
      const res = await api.put<ApiResponse<Servicio>>(`/servicios/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data.data;
    } catch (error: any) {
      console.error('Error al actualizar servicio:', error.response?.data || error);
      throw error;
    }
  };

  // ❌ Eliminar un servicio
  const deleteServicio = async (id: number) => {
    try {
      await api.delete(`/servicios/${id}`);
    } catch (error: any) {
      console.error('Error al eliminar servicio:', error.response?.data || error);
      throw error;
    }
  };

  return {
    servicios,
    getServicios,
    createServicio,
    updateServicio,
    deleteServicio
  };
};
