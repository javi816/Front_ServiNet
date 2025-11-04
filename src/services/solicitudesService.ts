import axiosInstance from '@/services/axiosInstance'

export interface Usuario {
    id: number
    name: string
    email: string
    role?: string
}

export interface Negocio {
    id: number
    nombre: string
    direccion: string
    telefono: string
    correo: string
    foto: string | null
    estado?: 'pendiente' | 'aprobado' | 'rechazado'
    created_at: string
    updated_at: string
}

export interface Solicitud {
    usuario_negocio: {
        id: number
        id_usuario: number
        id_negocio: number
        rol: string
    }
    usuario: Usuario
    negocio: Negocio
}

export const solicitudesService = {
    // Obtener todas las solicitudes pendientes
    async listarSolicitudes(): Promise<Solicitud[]> {
        try {
            const response = await axiosInstance.get<Solicitud[]>('/negocios/solicitudes')
            return response.data
        } catch (error: any) {
            console.error('Error al listar solicitudes:', error)
            throw error
        }
    },

    // Aprobar o rechazar una solicitud
    async aprobarSolicitud(id_usuario_negocio: number, aprobar: boolean = true) {
        try {
            const response = await axiosInstance.post(`/negocios/aprobar/${id_usuario_negocio}`, {
                aprobar
            })
            return response.data
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message || 'Error al procesar la solicitud')
            } else {
                throw new Error('Error de conexión con el servidor')
            }
        }
    }
}
