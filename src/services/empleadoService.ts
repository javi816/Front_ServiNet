// src/services/empleadoService.ts
import axiosInstance from "./axiosInstance";

export default {
  // 🔹 Listar empleados de un negocio
  async listarEmpleados(id_negocio: number) {
    const response = await axiosInstance.get(`/negocios/${id_negocio}/empleados`);
    return response.data as any;
  },

  // 🔹 Buscar usuarios disponibles para agregar
  async buscarUsuariosDisponibles(id_negocio: number, query: string) {
    const response = await axiosInstance.get(`/negocios/${id_negocio}/empleados/buscar`, {
      params: { query },
    });
    return (response.data as any).usuario;
  },

  // 🔹 Agregar un empleado
  async agregarEmpleado(id_negocio: number, data: any) {
    const response = await axiosInstance.post(`/negocios/${id_negocio}/empleados`, data);
    return response.data as any;
  },

  // 🔹 Eliminar empleado
  async eliminarEmpleado(id_negocio: number, id_empleado: number) {
    const response = await axiosInstance.delete(`/negocios/${id_negocio}/empleados/${id_empleado}`);
    return response.data as any;
  },
};

// Opcional: definición del tipo Empleado si lo necesitas en componentes
export interface Empleado {
  id_empleado: number;
  nombre: string;
  email: string;
  telefono?: string;
  especialidad?: string;
}
