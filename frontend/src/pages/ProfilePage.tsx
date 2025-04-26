"use client"

import type React from "react"
import {useEffect, useState} from "react"
import {Link, useNavigate} from "react-router-dom"
import {
    AlertCircle,
    Bookmark,
    BookOpen,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Download,
    Eye,
    FileText,
    LogOut,
    MessageSquare,
    Pencil,
    Plus,
    Settings,
    ThumbsUp,
    Trash2,
    Upload,
} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {Separator} from "@/components/ui/separator"
import {Badge} from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {toast} from "react-toastify"
import useAuth from "../hooks/useAuth"
import resourceService from "../services/resourceService"
import type {Resource} from "../types/resource"

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalElements: number
  size: number
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<"uploads" | "saved" | "settings">("uploads")
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [resourceToDelete, setResourceToDelete] = useState<string | null>(null)

  // Paginação
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    size: 10,
  })

  // Buscar recursos do usuário com paginação
  const fetchUserResources = async (page = 0, size = 10) => {
    try {
      setIsLoading(true)
      const response = await resourceService.getUserResourcesPaginated(page, size)
      setResources(response.content)
      setPagination({
        currentPage: response.number,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
        size: response.size,
      })
    } catch (err) {
      console.error("Erro ao buscar recursos do usuário:", err)
      setError("Não foi possível carregar seus uploads. Tente novamente mais tarde.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Redirecionar se não estiver autenticado
    if (!isAuthenticated) {
      navigate("/login")
      return
    }

    // Carregar recursos do usuário
    fetchUserResources()
  }, [isAuthenticated, navigate])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchUserResources(newPage, pagination.size)
    }
  }

  const handlePageSizeChange = (newSize: string) => {
    const size = Number.parseInt(newSize)
    fetchUserResources(0, size)
  }

  const handleDeleteResource = (resourceId: string) => {
    setResourceToDelete(resourceId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!resourceToDelete) return

    try {
      await resourceService.deleteResource(resourceToDelete)
      // Recarregar a página atual após exclusão
      fetchUserResources(pagination.currentPage, pagination.size)
      toast.success("Material excluído com sucesso!")
    } catch (err) {
      console.error("Erro ao excluir recurso:", err)
      toast.error("Não foi possível excluir o material. Tente novamente.")
    } finally {
      setDeleteDialogOpen(false)
      setResourceToDelete(null)
    }
  }

  const getFileIcon = (type: string) => {
    if (type.toLowerCase().includes("artigo") || type.toLowerCase().includes("tcc")) {
      return <FileText className="h-6 w-6 text-orange-500" />
    } else {
      return <BookOpen className="h-6 w-6 text-orange-500" />
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("pt-BR")
    } catch (e) {
      return dateString
    }
  }

  if (!isAuthenticated) {
    return null // Não renderiza nada enquanto verifica autenticação
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-2xl mb-4">
                {user?.name?.charAt(0) || "U"}
              </div>
              <h2 className="text-xl font-bold">{user?.name || "Usuário"}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <p className="text-sm text-gray-500 mt-1">{user?.institution || "Instituição não informada"}</p>

              <div className="w-full mt-6 space-y-2">
                <button
                  onClick={() => setActiveTab("uploads")}
                  className={`w-full flex items-center p-2 rounded-md text-sm ${
                    activeTab === "uploads" ? "bg-orange-50 text-orange-600" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Meus Uploads
                </button>
                <button
                  onClick={() => setActiveTab("saved")}
                  className={`w-full flex items-center p-2 rounded-md text-sm ${
                    activeTab === "saved" ? "bg-orange-50 text-orange-600" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  Salvos
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center p-2 rounded-md text-sm ${
                    activeTab === "settings" ? "bg-orange-50 text-orange-600" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center p-2 rounded-md text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo principal */}
        <div className="lg:col-span-3">
          {/* Tab: Meus Uploads */}
          {activeTab === "uploads" && (
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Meus Uploads</h2>
                  <Button className="bg-orange-500 hover:bg-orange-600" asChild>
                    <Link to="/upload">
                      <Plus className="mr-2 h-4 w-4" />
                      Novo Upload
                    </Link>
                  </Button>
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
                ) : resources.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <h3 className="text-lg font-medium">Nenhum upload encontrado</h3>
                    <p className="text-gray-500 mb-4">Você ainda não compartilhou nenhum material</p>
                    <Button className="bg-orange-500 hover:bg-orange-600" asChild>
                      <Link to="/upload">
                        <Upload className="mr-2 h-4 w-4" />
                        Enviar Material
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {resources.map((resource) => (
                        <div key={resource.id} className="flex border rounded-lg overflow-hidden">
                          <div className="w-16 bg-orange-50 flex items-center justify-center">
                            {getFileIcon(resource.type)}
                          </div>
                          <div className="flex-1 p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div>
                                <div className="flex flex-wrap gap-2 mb-1">
                                  <Badge variant="outline" className="bg-orange-50 text-orange-700">
                                    {resource.type}
                                  </Badge>
                                  <Badge variant="outline">{resource.area}</Badge>
                                </div>
                                <h3 className="font-medium">{resource.title}</h3>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                  <span>Enviado em {formatDate(resource.createdAt)}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" asChild>
                                  <Link to={`/resource/${resource.id}`}>
                                    <Eye className="h-4 w-4 mr-1" />
                                    Ver
                                  </Link>
                                </Button>
                                <Button variant="outline" size="sm" asChild>
                                  <Link to={`/edit-resource/${resource.id}`}>
                                    <Pencil className="h-4 w-4 mr-1" />
                                    Editar
                                  </Link>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                  onClick={() => handleDeleteResource(resource.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Excluir
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                <span>{resource.totalView|| 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Download className="h-4 w-4" />
                                <span>{resource.totalDownload || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <ThumbsUp className="h-4 w-4" />
                                <span>{resource.likeCount || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>{resource.commentCount || 0}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Paginação */}
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-sm text-gray-500">
                        Mostrando {resources.length} de {pagination.totalElements} resultados
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
            </Card>
          )}

          {/* Tab: Salvos */}
          {activeTab === "saved" && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6">Recursos Salvos</h2>

                <div className="text-center py-8">
                  <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <h3 className="text-lg font-medium">Nenhum recurso salvo</h3>
                  <p className="text-gray-500 mb-4">Você ainda não salvou nenhum material</p>
                  <Button className="bg-orange-500 hover:bg-orange-600" asChild>
                    <Link to="/">Explorar Recursos</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tab: Configurações */}
          {activeTab === "settings" && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6">Configurações da Conta</h2>

                <form className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Informações Pessoais</h3>

                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium">
                        Nome Completo
                      </label>
                      <input
                        id="name"
                        type="text"
                        defaultValue={user?.name || ""}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        defaultValue={user?.email || ""}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="institution" className="block text-sm font-medium">
                        Instituição
                      </label>
                      <input
                        id="institution"
                        type="text"
                        defaultValue={user?.institution || ""}
                        placeholder="Sua universidade ou instituição"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Alterar Senha</h3>

                    <div className="space-y-2">
                      <label htmlFor="currentPassword" className="block text-sm font-medium">
                        Senha Atual
                      </label>
                      <input
                        id="currentPassword"
                        type="password"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="newPassword" className="block text-sm font-medium">
                        Nova Senha
                      </label>
                      <input
                        id="newPassword"
                        type="password"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="confirmPassword" className="block text-sm font-medium">
                        Confirmar Nova Senha
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                    <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                      Salvar Alterações
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este material? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProfilePage
