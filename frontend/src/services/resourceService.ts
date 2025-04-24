import api from "./api"
import type {MaterialResponseDTO, Resource} from "../types/resource"

// Interface para a resposta paginada do Spring
interface PageResponse<T> {
  content: T[]
  pageable: {
    pageNumber: number
    pageSize: number
    sort: {
      empty: boolean
      sorted: boolean
      unsorted: boolean
    }
    offset: number
    unpaged: boolean
    paged: boolean
  }
  last: boolean
  totalElements: number
  totalPages: number
  size: number
  number: number
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
  first: boolean
  numberOfElements: number
  empty: boolean
}

// Interface para parâmetros de busca
export interface ResourceSearchParams {
  page?: number
  size?: number
  type?: string
  area?: string
  search?: string
  sort?: string
  dateRange?: number
  minDownloads?: number
}

const resourceService = {
  // Buscar todos os recursos com paginação e filtros
  async getResources(params?: ResourceSearchParams): Promise<PageResponse<Resource>> {
    const response = await api.get("/materials", { params })
    return response.data
  },

  // Buscar um recurso específico pelo ID
  async getResourceById(id: string): Promise<Resource> {
    const response = await api.get(`/materials/${id}`)
    return response.data
  },

  // Buscar recursos do usuário logado com paginação
  async getUserResourcesPaginated(page = 0, size = 10): Promise<PageResponse<Resource>> {
    const response = await api.get("/materials/me", {
      params: {
        page,
        size,
        sort: "createdAt,desc",
      },
    })
    return response.data
  },

  // Fazer upload de um novo recurso
  async uploadResource(formData: FormData): Promise<MaterialResponseDTO> {
    const response = await api.post("/materials", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  // Baixar um recurso
  async downloadResource(id: string): Promise<Blob> {
    const response = await api.get(`/materials/${id}/download`, {
      responseType: "blob",
    })
    return response.data
  },

  // Buscar recursos recomendados para o usuário
  async getRecommendedResources(page = 0, size = 8): Promise<PageResponse<Resource>> {
    const response = await api.get("/materials/recommended", {
      params: {
        page,
        size,
      },
    })
    return response.data
  },

  // Buscar recursos em alta (mais populares)
  async getTrendingResources(page = 0, size = 8): Promise<PageResponse<Resource>> {
    const response = await api.get("/materials/trending", {
      params: {
        page,
        size,
      },
    })
    return response.data
  },

  // Buscar recursos recentes
  async getRecentResources(page = 0, size = 8): Promise<PageResponse<Resource>> {
    const response = await api.get("/materials", {
      params: {
        page,
        size,
        sort: "createdAt,desc",
      },
    })
    return response.data
  },

  // Buscar tópicos em alta
  async getTrendingTopics(): Promise<string[]> {
    const response = await api.get("/materials/trending-topics")
    return response.data
  },

  // // Curtir um recurso
  // async likeResource(id: string): Promise<{ likes: number }> {
  //   const response = await api.post(`/materials/${id}/like`)
  //   return response.data
  // },

  // // Salvar um recurso para o usuário
  // async saveResource(id: string): Promise<void> {
  //   await api.post(`/materials/${id}/save`)
  // },

  // // Adicionar comentário a um recurso
  // async addComment(id: string, comment: string): Promise<any> {
  //   const response = await api.post(`/materials/${id}/comments`, { text: comment })
  //   return response.data
  // },

  // // Buscar comentários de um recurso
  // async getComments(id: string): Promise<any[]> {
  //   const response = await api.get(`/materials/${id}/comments`)
  //   return response.data
  // },

  // // Excluir um recurso
  // async deleteResource(id: string): Promise<void> {
  //   await api.delete(`/materials/${id}`)
  // },

  // // Atualizar um recurso
  // async updateResource(id: string, formData: FormData): Promise<MaterialResponseDTO> {
  //   const response = await api.put(`/materials/${id}`, formData, {
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //   })
  //   return response.data
  // },

  // // Buscar recursos relacionados
  // async getRelatedResources(id: string): Promise<Resource[]> {
  //   const response = await api.get(`/materials/${id}/related`)
  //   return response.data
  // },

  // // Buscar estatísticas do autor
  // async getAuthorStats(authorName: string): Promise<any> {
  //   const response = await api.get(`/authors/${encodeURIComponent(authorName)}/stats`)
  //   return response.data
  // },
}

export default resourceService
