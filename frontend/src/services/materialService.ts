import api from "./api"
import type { Material } from "../types/material"

const materialService = {

  async uploadMaterial(data: FormData): Promise<Material> {
    const response = await api.post("/v1/materials", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },
}

export default materialService

