import axiosInstance from '@/services/axiosInstance'

export interface Cita {
    id: number
    fecha: string
    hora_inicio: string
    hora_fin: string
    estado: string
    usuario?: {
        id: number
        name: string
        email: string
        profile_photo_url?: string
    }
    servicio?: {
        id: number
        nombre: string
        descripcion: string
    }
    negocio?: {
        id: number
        nombre: string
    }
}

export const citasService = {
    async getCitasAprobadas(): Promise<Cita[]> {
        const response = await axiosInstance.get<Cita[]>('/citas/aprobadas')
        return response.data
    },

    async getCitasAprobadasUsuario(): Promise<Cita[]> {
        const response = await axiosInstance.get<Cita[]>('/citas/aprobadas/usuario')
        return response.data
    },

    async responderCita(id: number, estado: 'aceptada' | 'rechazada') {
        const response = await axiosInstance.patch<{ mensaje: string; data: Cita }>(
            `/citas/${id}/responder`,
            { estado }
        )
        return response.data
    },

    async getPendientes(): Promise<Cita[]> {
        const response = await axiosInstance.get<{
            mensaje: string
            data: Cita[]
        }>('/citas/pendientes')

        return response.data.data // accedemos a .data que contiene el array
    }
}
