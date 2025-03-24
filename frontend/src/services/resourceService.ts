import api from "./api"
import type { Resource } from "../types/resource"

const resourceService = {
  // Buscar todos os recursos com paginação e filtros
  async getResources(params?: {
    page?: number
    limit?: number
    type?: string
    subject?: string
    search?: string
  }): Promise<{ resources: Resource[]; total: number; pages: number }> {
    const response = await api.get("/resources", { params })
    return response.data
  },

  // Buscar um recurso específico pelo ID
  async getResourceById(id: string): Promise<Resource> {
    const response = await api.get(`/resources/${id}`)
    return response.data
  },

  // Buscar recursos do usuário logado
  async getUserResources(): Promise<Resource[]> {
    const response = await api.get("/resources/user")
    return response.data
  },

  // Fazer upload de um novo recurso
  async uploadResource(data: FormData): Promise<Resource> {
    const response = await api.post("/resources", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  // Baixar um recurso
  async downloadResource(id: string): Promise<Blob> {
    const response = await api.get(`/resources/${id}/download`, {
      responseType: "blob",
    })
    return response.data
  },

  // Curtir um recurso
  async likeResource(id: string): Promise<{ likes: number }> {
    const response = await api.post(`/resources/${id}/like`)
    return response.data
  },

  // Adicionar comentário a um recurso
  async addComment(id: string, comment: string): Promise<any> {
    const response = await api.post(`/resources/${id}/comments`, { comment })
    return response.data
  },

  // Buscar comentários de um recurso
  async getComments(id: string): Promise<any[]> {
    const response = await api.get(`/resources/${id}/comments`)
    return response.data
  },
}

export default resourceService

