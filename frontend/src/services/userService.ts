import type { UserProfile, PasswordChangeRequest } from "@/types/user"
import api from "./api"
import type { PageResponse } from "@/types/pagination"

const userService = {
  // Buscar perfil do usuário logado
  async getCurrentUserProfile(): Promise<UserProfile> {
    const response = await api.get("/users/me")
    return response.data
  },

  // Buscar perfil de outro usuário
  async getUserProfile(userId: string): Promise<UserProfile> {
    const response = await api.get(`/users/${userId}`)
    return response.data
  },

  // Atualizar perfil do usuário
  async updateUserProfile(userData: Partial<UserProfile>): Promise<UserProfile> {
    const response = await api.put("/users/me", userData)
    return response.data
  },


  // Alterar senha
  async changePassword(passwordData: PasswordChangeRequest): Promise<void> {
    await api.post("/users/change-password", passwordData)
  },

  // Buscar seguidores do usuário
  async getUserFollowers(userId: string): Promise<UserProfile[]> {
    const response = await api.get(`/users/${userId}/followers`)
    return response.data
  },

  // Buscar quem o usuário segue
  // async getUserFollowing(userId: string): Promise<UserProfile[]> {
  //   const response = await api.get(`/users/${userId}/following`)
  //   return response.data
  // },

  // Seguir/deixar de seguir usuário
  // async followUser(targetUserId: string): Promise<boolean> {
  //   const response = await api.post(`/users/${targetUserId}/follow`)
  //   return response.data.following
  // },

  // Buscar materiais salvos pelo usuário
  async getSavedMaterials(page = 0, size = 10): Promise<PageResponse<any>> {
    const response = await api.get("/users/me/saved-materials", {
      params: {
        page,
        size,
        sort: "savedAt,desc",
      },
    })
    return response.data
  },

  // Buscar materiais de um usuário específico
  async getUserMaterialsByIdPaginated(userId: string, page = 0, size = 10): Promise<PageResponse<any>> {
    const response = await api.get(`/users/${userId}/materials`, {
      params: {
        page,
        size,
        sort: "createdAt,desc",
      },
    })
    return response.data
  },

  // Buscar estatísticas do usuário
  async getUserStats(userId: string): Promise<any> {
    const response = await api.get(`/users/${userId}/stats`)
    return response.data
  },

  // Verificar se o usuário atual segue outro usuário
  async checkFollowStatus(targetUserId: string): Promise<boolean> {
    const response = await api.get(`/users/${targetUserId}/follow-status`)
    return response.data.following
  },

  // Atualizar imagem de capa
  async updateCoverImage(formData: FormData): Promise<UserProfile> {
    const response = await api.put("/users/me/cover-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },
  
}

export default userService
