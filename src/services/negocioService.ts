import axiosInstance from '@/services/axiosInstance'

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
export interface NegocioSolicitud {
    nombre: string
    direccion: string
    telefono: string
    correo: string
    foto?: string | null
}
export const negocioService = {
    // Obtener feed de negocios aprobados
    async getFeed(): Promise<Negocio[]> {
        try {
            const response = await axiosInstance.get<{
                message: string
                data: { data: Negocio[] }
            }>('/negocios/feed')

            // Retorna directamente la lista de negocios
            return response.data.data.data
        } catch (error: any) {
            console.error('Error al obtener feed de negocios:', error)
            throw error
        }
    },

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
}