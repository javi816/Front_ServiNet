import axiosInstance from '@/services/axiosInstance'

export interface Negocio {
    id: number
    nombre: string
    descripcion: string            // 🔹 Campo agregado
    direccion: string
    telefono: string
    correo: string
    foto: string | null
    estado?: 'pendiente' | 'aprobado' | 'rechazado'
    created_at: string
    updated_at: string
}

export interface NegocioSolicitud {
    nombre: string
    descripcion: string            // 🔹 Campo agregado
    direccion: string
    telefono: string
    correo: string
    foto?: string | null
}

export interface MiNegocioResponse {
    negocio: Negocio | null
    rol?: string
    id_empleado?: number | null
}

export const negocioService = {
    // Feed público de negocios aprobados
    async getFeed(): Promise<Negocio[]> {
        try {
            const response = await axiosInstance.get<{
                message: string
                data: { data: Negocio[] }
            }>('/negocios/feed')
            return response.data.data.data
        } catch (error: any) {
            console.error('Error al obtener feed de negocios:', error)
            throw error
        }
    },

    // Enviar solicitud para crear un negocio
    async solicitarNegocio(data: NegocioSolicitud) {
        try {
            const response = await axiosInstance.post<{
                message: string
                negocio: Negocio
            }>('/negocios/solicitar', data)

            return response.data
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message || 'Error al enviar la solicitud')
            } else {
                throw new Error('Error de conexión con el servidor')
            }
        }
    },

    // 🔹 Nuevo: obtener negocio asociado al usuario
    async getMiNegocio(): Promise<MiNegocioResponse> {
        try {
            const response = await axiosInstance.post<MiNegocioResponse>('/mi-negocio')
            console.log('Respuesta /mi-negocio:', response.data)
            const data = response.data

            // Guarda localmente para futuras cargas rápidas
            localStorage.setItem('negocio', JSON.stringify(data.negocio))
            localStorage.setItem('rol', data.rol || '')
            localStorage.setItem('id_empleado', data.id_empleado?.toString() || '')

            return data
        } catch (error: any) {
            console.warn('No se pudo obtener el negocio del usuario:', error)
            localStorage.removeItem('negocio')
            localStorage.removeItem('rol')
            localStorage.removeItem('id_empleado')

            return { negocio: null }
        }
    },

    // Obtener desde localStorage
    getNegocio() {
        const stored = localStorage.getItem('negocio')
        return stored ? JSON.parse(stored) : null
    },

    getRol() {
        return localStorage.getItem('rol') || null
    },
    getIdEmpleado() {
        const val = localStorage.getItem('id_empleado')
        return val ? parseInt(val) : null
    },

    clearNegocio() {
        localStorage.removeItem('negocio')
        localStorage.removeItem('rol')
        localStorage.removeItem('id_empleado')
    },
}
