"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { AlertCircle, Bookmark, Download, Eye, FileText, ThumbsUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import materialService from "@/services/materialService"
import type { Material } from "@/types/material"

const UserSaved: React.FC = () => {
  const [savedMaterials, setSavedMaterials] = useState<Material[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSavedMaterials = async () => {
      try {
        setIsLoading(true)
        const response = await materialService.getSavedMaterials()
        setSavedMaterials(response.content || [])
      } catch (err) {
        console.error("Erro ao buscar materiais salvos:", err)
        setError("Não foi possível carregar seus materiais salvos. Tente novamente mais tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSavedMaterials()
  }, [])

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("pt-BR")
    } catch (e) {
      return dateString
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-6">Recursos Salvos</h2>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
        ) : savedMaterials.length === 0 ? (
          <div className="text-center py-8">
            <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <h3 className="text-lg font-medium">Nenhum recurso salvo</h3>
            <p className="text-gray-500 mb-4">Você ainda não salvou nenhum material</p>
            <Button className="bg-orange-500 hover:bg-orange-600" asChild>
              <Link to="/explore">Explorar Recursos</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {savedMaterials.map((material) => (
              <div key={material.id} className="flex border rounded-lg overflow-hidden">
                <div className="w-16 bg-orange-50 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-orange-500" />
                </div>
                <div className="flex-1 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap gap-2 mb-1">
                        <Badge variant="outline" className="bg-orange-50 text-orange-700">
                          {material.type}
                        </Badge>
                        <Badge variant="outline">{material.area}</Badge>
                      </div>
                      <h3 className="font-medium">{material.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <span>
                          Por {material.author} • Salvo em {formatDate(material.savedAt || material.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/material/${material.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{material.totalView || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      <span>{material.totalDownload || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{material.likeCount || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default UserSaved
