// src/services/servicioService.ts
import axiosInstance from './axiosInstance'
import { authService } from './authService'

export interface Servicio {
    id_servicio: number
    id_negocio: number
    nombre: string
    descripcion: string
    precio: string
    duracion: number
    foto: string | null
    created_at: string
    updated_at: string
    deleted_at: string | null
}

interface ServicioResponse {
    message: string
    data: Servicio
}

export const servicioService = {
    async listar(): Promise<Servicio[]> {
        try {
            const negocioData = authService.getNegocio()
            const idNegocio = negocioData?.negocio?.id ?? negocioData?.id ?? null

            if (!idNegocio) return []

            const response = await axiosInstance.get<{ message: string; data: Servicio[] }>(
                `/servicios/${idNegocio}`
            )

            return response.data.data ?? []
        } catch (error) {
            console.error('[servicioService] Error al listar servicios:', error)
            return []
        }
    },

    async agregarConFoto(
        nombre: string,
        descripcion: string,
        precio: number,
        duracion: number | null,
        foto: File | null
    ): Promise<Servicio | null> {
        try {
            const negocioData = authService.getNegocio()
            const idNegocio = negocioData?.negocio?.id ?? negocioData?.id ?? null
            if (!idNegocio) return null

            // 1️⃣ Crear el servicio primero (sin foto)
            const response = await axiosInstance.post<ServicioResponse>(`/servicios/${idNegocio}`, {
                nombre,
                descripcion,
                precio,
                duracion,
            })

            const servicioCreado = response.data.data
            if (!servicioCreado) return null

            // 2️⃣ Subir la foto si existe
            if (foto) {
                const formData = new FormData()
                formData.append('foto', foto)

                const fotoResponse = await axiosInstance.post<{ message: string; foto_url: string }>(
                    `/servicios/${servicioCreado.id_servicio}/foto`,
                    formData,
                    {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    }
                )

                if (fotoResponse.data?.foto_url) {
                    servicioCreado.foto = fotoResponse.data.foto_url
                }
            }

            return servicioCreado
        } catch (error) {
            console.error('[servicioService] Error al agregar servicio con foto:', error)
            return null
        }
    },
    async editarConFoto(
        id: number,
        nombre: string,
        descripcion: string,
        precio: number,
        duracion: number | null,
        foto: File | null
    ): Promise<Servicio | null> {
        try {
            // 1️⃣ Actualizar datos generales
            const response = await axiosInstance.put<ServicioResponse>(`/servicios/${id}`, {
                nombre,
                descripcion,
                precio,
                duracion,
            })
            const servicioActualizado = response.data.data
            if (!servicioActualizado) return null

            // 2️⃣ Subir foto si existe
            if (foto) {
                const formData = new FormData()
                formData.append('foto', foto)

                const fotoResponse = await axiosInstance.post<{ message: string; foto_url: string }>(
                    `/servicios/${id}/foto`,
                    formData,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                )

                if (fotoResponse.data?.foto_url) {
                    servicioActualizado.foto = fotoResponse.data.foto_url
                }
            }

            return servicioActualizado
        } catch (error) {
            console.error('[servicioService] Error al editar servicio con foto:', error)
            return null
        }
    },
    async eliminar(id_servicio: number): Promise<boolean> {
        try {
            await axiosInstance.delete(`/servicios/${id_servicio}`)
            return true
        } catch (error: any) {
            console.error('[servicioService] Error al eliminar servicio:', error)
            if (error.response?.data?.message) {
                alert(error.response.data.message)
            }
            return false
        }
    }

}
