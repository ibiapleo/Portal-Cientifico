"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Eye,
  FileText,
  MessageSquare,
  Pencil,
  Plus,
  ThumbsUp,
  Trash2,
  Upload,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "react-toastify"
import materialService from "@/services/materialService"
import type { Material } from "@/types/material"

interface UserUploadsProps {
  userId: string
  isOwnProfile: boolean
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalElements: number
  size: number
}

const UserUploads: React.FC<UserUploadsProps> = ({ userId, isOwnProfile }) => {
  const [materials, setMaterials] = useState<Material[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [materialToDelete, setMaterialToDelete] = useState<string | null>(null)

  // Paginação
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    size: 10,
  })

  // Buscar recursos do usuário com paginação
  const fetchUserMaterials = async (page = 0, size = 10) => {
    try {
      setIsLoading(true)
      const response = isOwnProfile
        ? await materialService.getUserMaterialsPaginated(page, size)
        : await materialService.getUserMaterialsByIdPaginated(userId, page, size)

      setMaterials(response.content)
      setPagination({
        currentPage: response.number,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
        size: response.size,
      })
    } catch (err) {
      console.error("Erro ao buscar recursos do usuário:", err)
      setError("Não foi possível carregar os uploads. Tente novamente mais tarde.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUserMaterials()
  }, [userId, isOwnProfile])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchUserMaterials(newPage, pagination.size)
    }
  }

  const handlePageSizeChange = (newSize: string) => {
    const size = Number.parseInt(newSize)
    fetchUserMaterials(0, size)
  }

  const handleDeleteMaterial = (materialId: string) => {
    setMaterialToDelete(materialId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!materialToDelete) return

    try {
      await materialService.deleteMaterial(materialToDelete)
      // Recarregar a página atual após exclusão
      fetchUserMaterials(pagination.currentPage, pagination.size)
      toast.success("Material excluído com sucesso!")
    } catch (err) {
      console.error("Erro ao excluir recurso:", err)
      toast.error("Não foi possível excluir o material. Tente novamente.")
    } finally {
      setDeleteDialogOpen(false)
      setMaterialToDelete(null)
    }
  }

  const getFileIcon = (type: string) => {
    if (type.toLowerCase().includes("artigo") || type.toLowerCase().includes("tcc")) {
      return <FileText className="h-6 w-6 text-orange-500" />
    } else {
      return <FileText className="h-6 w-6 text-orange-500" />
    }
  }

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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{isOwnProfile ? "Meus Uploads" : "Uploads"}</h2>
          {isOwnProfile && (
            <Button className="bg-orange-500 hover:bg-orange-600" asChild>
              <Link to="/upload">
                <Plus className="mr-2 h-4 w-4" />
                Novo Upload
              </Link>
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
        ) : materials.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <h3 className="text-lg font-medium">Nenhum upload encontrado</h3>
            <p className="text-gray-500 mb-4">
              {isOwnProfile
                ? "Você ainda não compartilhou nenhum material"
                : "Este usuário ainda não compartilhou nenhum material"}
            </p>
            {isOwnProfile && (
              <Button className="bg-orange-500 hover:bg-orange-600" asChild>
                <Link to="/upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Enviar Material
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {materials.map((material) => (
                <div key={material.id} className="flex border rounded-lg overflow-hidden">
                  <div className="w-16 bg-orange-50 flex items-center justify-center">{getFileIcon(material.type)}</div>
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
                          <span>Enviado em {formatDate(material.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/material/${material.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Link>
                        </Button>
                        {isOwnProfile && (
                          <>
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/edit-material/${material.id}`}>
                                <Pencil className="h-4 w-4 mr-1" />
                                Editar
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                              onClick={() => handleDeleteMaterial(material.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Excluir
                            </Button>
                          </>
                        )}
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
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{material.commentCount || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginação */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-500">
                Mostrando {materials.length} de {pagination.totalElements} resultados
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center mr-4">
                  <span className="text-sm mr-2">Itens por página:</span>
                  <Select value={pagination.size.toString()} onValueChange={handlePageSizeChange}>
                    <SelectTrigger className="w-[80px]">
                      <SelectValue placeholder={pagination.size.toString()} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(0)}
                    disabled={pagination.currentPage === 0}
                    className="h-8 w-8"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 0}
                    className="h-8 w-8 ml-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <span className="mx-2 text-sm">
                    Página {pagination.currentPage + 1} de {pagination.totalPages}
                  </span>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages - 1}
                    className="h-8 w-8 mr-1"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(pagination.totalPages - 1)}
                    disabled={pagination.currentPage === pagination.totalPages - 1}
                    className="h-8 w-8"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>

      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este material? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 text-white hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

export default UserUploads
