import api from "./api"
import type { Comment, AddCommentData } from "../types/comment"

const commentService = {
    async getComments(materialId: string): Promise<Comment[]> {
        const response = await api.get(`/v1/materials/${materialId}/comments`)
        return response.data
    },

    async addComment({ materialId, content }: AddCommentData): Promise<Comment> {
        const response = await api.post(`/v1/materials/${materialId}/comments`, {
            content,
        })
        return response.data
    },

    async toggleCommentLike(materialId: string, commentId: string): Promise<void> {
        await api.post(`/v1/materials/${materialId}/comments/${commentId}/like`)
    },
}

export default commentService
