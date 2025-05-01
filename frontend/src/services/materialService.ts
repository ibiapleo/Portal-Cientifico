import api from "./api"
import type {Material, MaterialResponseDTO, MaterialSearchParams} from "../types/material"
import type {CommentRequestDTO, CommentResponseDTO} from "../types/comment"
import type {RatingRequestDTO, RatingResponseDTO} from "../types/ratings"
import {PageResponse} from "@/types/pagination"

const materialService = {
  // Buscar todos os recursos com paginação e filtros
  async getMaterials(params?: MaterialSearchParams): Promise<PageResponse<Material>> {
    // Filtrar os parâmetros para remover os que são null, undefined ou vazios
    const filteredParams = Object.fromEntries(
      Object.entries(params || {}).filter(([_, value]) => value != null && value !== "")
    );
    const response = await api.get("/materials", { params: filteredParams });
    return response.data;
  },

  // Buscar um recurso específico pelo ID
  async getMaterialById(id: string): Promise<Material> {
    const response = await api.get(`/materials/${id}`)
    return response.data
  },

  // Buscar recursos do usuário logado com paginação
  async getUserMaterialsPaginated(page = 0, size = 10): Promise<PageResponse<Material>> {
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
  async uploadMaterial(formData: FormData): Promise<MaterialResponseDTO> {
    const response = await api.post("/materials", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  // Baixar um recurso
  async downloadMaterial(id: string): Promise<Blob> {
    const response = await api.get(`/materials/${id}/download`, {
      responseType: "blob",
    })
    return response.data
  },

  // Buscar recursos recomendados para o usuário
  async getRecommendedMaterials(page = 0, size = 8): Promise<PageResponse<Material>> {
    const response = await api.get("/materials/recommended", {
      params: {
        page,
        size,
      },
    })
    return response.data
  },

  // Buscar recursos em alta (mais populares)
  async getTrendingMaterials(page = 0, size = 8): Promise<PageResponse<Material>> {
    const response = await api.get("/materials/trending", {
      params: {
        page,
        size,
      },
    })
    return response.data
  },

  // Buscar recursos recentes
  async getRecentMaterials(page = 0, size = 8): Promise<PageResponse<Material>> {
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

  // Curtir/Descurtir material
  async toggleMaterialLike(materialId: string): Promise<boolean> {
    const response = await api.post(`/materials/${materialId}/like`)
    return response.data
  },

  // Curtir/Descurtir comentário
  async toggleCommentLike(materialId: string, commentId: number): Promise<boolean> {
    const response = await api.post(`/materials/${materialId}/comments/${commentId}/like`)
    return response.data
  },

  // Adicionar comentário
  async addComment(materialId: string, content: string): Promise<CommentResponseDTO> {
    const response = await api.post<CommentResponseDTO>(
      `/materials/${materialId}/comments`, 
      { content } as CommentRequestDTO
    )
    return response.data
  },

  // Buscar comentários paginados
  async getComments(materialId: string, page = 0, size = 10): Promise<PageResponse<CommentResponseDTO>> {
    const response = await api.get<PageResponse<CommentResponseDTO>>(
      `/materials/${materialId}/comments`,
      { params: { page, size } }
    )
    return response.data
  },

  async deleteMaterial(id: string): Promise<void> {
    await api.delete(`/materials/${id}`)
  },

  async rateMaterial(materialId: string, value: number): Promise<RatingResponseDTO> {
    const response = await api.post(`/materials/${materialId}/rate`, { value });
    return response.data;
  },

  async getRatingStats(materialId: string): Promise<RatingResponseDTO> {
    const response = await api.get(`/materials/${materialId}/ratings`);
    return response.data;
  },

  // // Salvar um recurso para o usuário
  // async saveMaterial(id: string): Promise<void> {
  //   await api.post(`/materials/${id}/save`)
  // },

  // // Adicionar comentário a um recurso
  // async addComment(id: string, comment: string): Promise<any> {
  //   const response = await api.post(`/materials/${id}/comments`, { text: comment })
  //   return response.data
  // },

  // async deleteMaterial(id: string): Promise<void> {
  //   await api.delete(`/materials/${id}`)
  // },

  // // Atualizar um recurso
  // async updateMaterial(id: string, formData: FormData): Promise<MaterialResponseDTO> {
  //   const response = await api.put(`/materials/${id}`, formData, {
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //   })
  //   return response.data
  // },

  // // Buscar estatísticas do autor
  // async getAuthorStats(authorName: string): Promise<any> {
  //   const response = await api.get(`/authors/${encodeURIComponent(authorName)}/stats`)
  //   return response.data
  // },
}

export default materialService
