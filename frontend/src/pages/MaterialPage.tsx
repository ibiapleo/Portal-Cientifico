"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  AlertCircle,
  ArrowLeft,
  Bookmark,
  BookOpen,
  Calendar,
  Clock,
  Download,
  Edit,
  Eye,
  FileText,
  Flag,
  MessageSquare,
  MoreVertical,
  Share2,
  ThumbsUp,
  Trash2,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import materialService from "../services/materialService"
import useAuth from "../hooks/useAuth"
import type { Material } from "../types/material"
import { debounce } from "lodash-es"
import type { CommentResponseDTO } from "@/types/comment"
import authService from "@/services/authService"
import type { RatingResponseDTO } from "@/types/rating"

const MaterialPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [material, setMaterial] = useState<Material | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"about" | "preview" | "comments">("about")
  const [comments, setComments] = useState<CommentResponseDTO[]>([])
  const [newComment, setNewComment] = useState<string>("")
  const [isLiked, setIsLiked] = useState<boolean>(false)
  const [likeCount, setLikeCount] = useState<number>(0)
  const [relatedMaterials, setRelatedMaterials] = useState<unknown[]>([])
  const [authorStats, setAuthorStats] = useState<unknown>({
    materials: 0,
    downloads: 0,
    followers: 0,
    rating: 0,
  })
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [isLoadingComments, setIsLoadingComments] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isFollowingAuthor, setIsFollowingAuthor] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isAuthor, setIsAuthor] = useState(false)
  const [rating, setRating] = useState<RatingResponseDTO | null>(null)
  const { materialId } = useParams<{ materialId: string }>()

  useEffect(() => {
    const fetchMaterialData = async () => {
      if (!id) return

      try {
        setIsLoading(true)
        setError(null)

        // Buscar detalhes do recurso
        const materialData = await materialService.getMaterialById(id)
        setMaterial(materialData)
        if (user && materialData.authorId === user.id) {
          setIsAuthor(true)
        } else {
          setIsAuthor(false)
        }

        const loadComments = async () => {
          if (!id) return
          setIsLoadingComments(true)
          try {
            const commentsResponse = await materialService.getComments(id, currentPage, 10)
            setComments(commentsResponse.content)
            setTotalPages(commentsResponse.totalPages)
          } finally {
            setIsLoadingComments(false)
          }
        }
        loadComments()

        setIsLiked(materialData.liked)
        setLikeCount(materialData.likeCount || 0)

        if (isAuthenticated) {
          try {
            //const savedStatus = await materialService.checkSavedStatus(id)
            setIsSaved(true)
          } catch (err) {
            console.error("Erro ao verificar status de salvamento:", err)
          }
        }

        if (isAuthenticated && materialData.authorId !== user?.id) {
          try {
            const followStatus = await authService.checkFollowStatus(materialData.authorId)
            setIsFollowingAuthor(followStatus)
          } catch (err) {
            console.error("Erro ao verificar status de seguir:", err)
          }
        }

        // Buscar recursos relacionados
        try {
          const relatedData = await materialService.getRecommendedMaterials()
          const firstThreeItems = relatedData.content.slice(0, 3)
          setRelatedMaterials(firstThreeItems)
        } catch (err) {
          console.error("Erro ao buscar recursos relacionados:", err)
        }

        // Buscar estatísticas do autor
        try {
          //const authorData = await materialService.getAuthorStats(materialData.userId)
          setAuthorStats({
            materials: 12,
            downloads: 1200,
            followers: 87,
            rating: 4.8,
          })
        } catch (err) {
          console.error("Erro ao buscar estatísticas do autor:", err)
          setAuthorStats({
            materials: 12,
            downloads: 1200,
            followers: 87,
            rating: 4.8,
          })
        }
      } catch (err) {
        console.error("Erro ao buscar recurso:", err)
        setError("Não foi possível carregar os detalhes deste recurso.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMaterialData()
  }, [id, currentPage, isAuthenticated, user])

  const handleLike = debounce(async () => {
    if (!id || !isAuthenticated) {
      if (!isAuthenticated) {
        toast.info("Faça login para curtir este recurso")
      }
      return
    }
    try {
      const liked = await materialService.toggleMaterialLike(id)
      setIsLiked(liked)
      setLikeCount((prev) => (liked ? prev + 1 : prev - 1))
    } catch (err) {
      console.error("Erro ao curtir recurso:", err)
      toast.error("Não foi possível curtir este recurso.")
    }
  }, 500)

  // Função de Adicionar Comentário
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !id) return
    try {
      const newCommentData = await materialService.addComment(id, newComment)
      setComments((prev) => [...prev, newCommentData])
      setNewComment("")
      toast.success("Comentário publicado com sucesso!")
      setCurrentPage(0) // Volta para a primeira página
      const newResponse = await materialService.getComments(id, 0, 10)
      setComments(newResponse.content)
      setTotalPages(newResponse.totalPages)
    } catch (err) {
      console.error("Erro ao adicionar comentário:", err)
      toast.error("Não foi possível publicar seu comentário.")
    }
  }

  // Função de Like em Comentário com debounce
  const handleCommentLike = debounce(async (commentId: number) => {
    if (!id || !isAuthenticated) {
      toast.info("Faça login para curtir comentários")
      return
    }

    try {
      const liked = await materialService.toggleCommentLike(id, commentId)
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId ? { ...comment, likes: liked ? comment.likes + 1 : comment.likes - 1 } : comment,
        ),
      )
    } catch (err) {
      console.error("Erro ao curtir comentário:", err)
      toast.error("Não foi possível curtir este comentário.")
    }
  }, 500)

  const handleDownload = async () => {
    if (!id || !material) return

    try {
      const response = await materialService.downloadMaterial(id)
      const downloadUrl = response.url
      const fileName = response.fileName

      const a = document.createElement("a")
      a.href = downloadUrl
      a.download = fileName
      a.target = "_blank"
      document.body.appendChild(a)
      a.click()

      document.body.removeChild(a)

      toast.success("Download iniciado com sucesso!")
    } catch (err) {
      console.error("Erro ao baixar recurso:", err)
      toast.error("Não foi possível baixar este recurso.")
    }
  }

  const handleSaveMaterial = async () => {
    if (!id || !isAuthenticated) {
      if (!isAuthenticated) {
        toast.info("Faça login para salvar este recurso")
      }
      return
    }

    try {
      //await materialService.saveMaterial(id)
      setIsSaved(!isSaved)
      toast.success(isSaved ? "Recurso removido dos salvos" : "Recurso salvo com sucesso!")
    } catch (err) {
      console.error("Erro ao salvar recurso:", err)
      toast.error("Não foi possível salvar este recurso.")
    }
  }

  const handleFollowAuthor = async () => {
    if (!material?.authorId || !isAuthenticated) {
      if (!isAuthenticated) {
        toast.info("Faça login para seguir este autor")
      }
      return
    }

    try {
      const isNowFollowing = await authService.toggleFollowAuthor(material.authorId)
      setIsFollowingAuthor(isNowFollowing)
      toast.success(isNowFollowing ? "Agora você segue este autor" : "Você deixou de seguir este autor")
    } catch (err) {
      console.error("Erro ao seguir autor:", err)
      toast.error("Não foi possível seguir este autor.")
    }
  }

  const handleEditMaterial = () => {
    if (!id) return
    navigate(`/edit-material/${id}`)
  }

  const handleDeleteMaterial = async () => {
    if (!id) return
    try {
      await materialService.deleteMaterial(id)
      toast.success("Material excluído com sucesso!")
      navigate("/my-materials")
    } catch (err) {
      console.error("Erro ao excluir material:", err)
      toast.error("Não foi possível excluir este material.")
    }
  }

  const handleShareMaterial = () => {
    if (navigator.share) {
      navigator
        .share({
          title: material?.title || "Material educacional",
          text: `Confira este material: ${material?.title}`,
          url: window.location.href,
        })
        .catch((err) => console.error("Erro ao compartilhar:", err))
    } else {
      // Fallback para copiar link
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copiado para a área de transferência!")
    }
  }

  const handleStarClick = async (star: number) => {
    if (!isAuthenticated || !id) {
      if (!isAuthenticated) toast.info("Faça login para avaliar este material")
      return
    }
  
    if (material && material.userRating !== false) {
      toast.info(
        `Você já avaliou este material`
      )
      return
    }
  
    try {
      // Atualização otimista
      const currentTotal = material?.totalRatings || 0
      const currentSum = (material?.averageRating || 0) * currentTotal
      const estimatedNewAverage = (currentSum + star) / (currentTotal + 1)
  
      setMaterial((prev) =>
        prev
          ? {
              ...prev,
              userRating: false,
              averageRating: estimatedNewAverage,
              totalRatings: currentTotal + 1,
            }
          : null
      )
  
      // Chamada API
      const response = await materialService.rateMaterial(id, star) // Response direto com o nº da avaliação
      const userRatingValue = response.value;
      // Atualização final com o valor confirmado pela API
      setMaterial((prev) => 
        prev ? { ...prev, userRating: userRatingValue } : null
      );
      
      toast.success("Avaliação enviada com sucesso!")
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error)
      toast.error("Falha ao enviar avaliação")
  
      // Rollback em caso de erro
      setMaterial((prev) =>
        prev
          ? {
              ...prev,
              userRating: false,
              averageRating: material?.averageRating || 0,
              totalRatings: material?.totalRatings || 0,
            }
          : null
      )
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("pt-BR")
    } catch (e) {
      return dateString
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (error || !material) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-700">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Voltar para a página inicial
          </Link>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-600 mb-4">
              <AlertCircle className="h-5 w-5" />
              <h1 className="text-2xl font-bold">Recurso não encontrado</h1>
            </div>
            <p className="text-gray-500 mb-4">
              {error || "O recurso que você está procurando não existe ou foi removido."}
            </p>
            <Button asChild>
              <Link to="/">Voltar para a página inicial</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-700">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Voltar para a página inicial
        </Link>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="outline" className="bg-orange-50 text-orange-700">
                      {material.type}
                    </Badge>
                    <Badge variant="outline">{material.area}</Badge>
                  </div>
                  <h1 className="text-2xl font-bold">{material.title}</h1>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User className="h-4 w-4" />
                    <span>{material.author}</span>
                    <span className="mx-1">•</span>
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(material.createdAt)}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  {isAuthor ? (
                    <>
                      <Button variant="outline" onClick={handleEditMaterial}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={handleShareMaterial}>
                            <Share2 className="mr-2 h-4 w-4" />
                            Compartilhar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setIsDeleteDialogOpen(true)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  ) : (
                    // Ações para visitantes
                    <>
                      <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" />
                        Baixar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleSaveMaterial}
                        className={isSaved ? "bg-orange-50 text-orange-700 border-orange-200" : ""}
                      >
                        <Bookmark className={`mr-2 h-4 w-4 ${isSaved ? "fill-orange-500" : ""}`} />
                        {isSaved ? "Salvo" : "Salvar"}
                      </Button>
                      <Button variant="outline" onClick={handleShareMaterial}>
                        <Share2 className="h-4 w-4" />
                        <span className="sr-only md:not-sr-only md:ml-2">Compartilhar</span>
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-6 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{material.totalView || 0} visualizações</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  <span>{material.totalDownload || 0} downloads</span>
                </div>
                <div
                  className={`flex items-center gap-1 ${!isAuthor ? "cursor-pointer" : ""}`}
                  onClick={!isAuthor ? handleLike : undefined}
                >
                  <ThumbsUp className={`h-4 w-4 ${isLiked ? "text-orange-500" : ""}`} />
                  <span>{likeCount} curtidas</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{comments.length} comentários</span>
                </div>
              </div>

              <Separator className="my-6" />

              <Tabs defaultValue="about" value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="about">Sobre</TabsTrigger>
                  <TabsTrigger value="preview">Visualização</TabsTrigger>
                  <TabsTrigger value="comments">Comentários</TabsTrigger>
                </TabsList>
                <TabsContent value="about" className="space-y-6 pt-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Descrição</h3>
                    <p className="text-gray-700">{material.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Palavras-chave</h3>
                    <div className="flex flex-wrap gap-2">
                      {material.keywords &&
                        material.keywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="bg-orange-50">
                            {keyword}
                          </Badge>
                        ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Detalhes do Arquivo</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-500">Tipo:</span>
                          <span>{material.fileType}</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-500">Páginas:</span>
                          <span>{material.pages || "N/A"}</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Download className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-500">Tamanho:</span>
                          <span>{material.fileSize}</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Instituição</h3>
                      <p className="text-gray-700">{material.institution || "Não informada"}</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="preview" className="pt-4">
                  <div className="border rounded-lg p-6 bg-gray-50 flex flex-col items-center justify-center min-h-[400px]">
                    <BookOpen className="h-16 w-16 text-orange-300 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Visualização do Documento</h3>
                    <p className="text-gray-500 text-center mb-4">
                      Visualize as primeiras páginas do documento antes de baixá-lo
                    </p>
                    <div className="w-full max-w-md bg-white border rounded-lg p-4 shadow-sm">
                      <div className="h-40 bg-orange-50 rounded flex items-center justify-center mb-4">
                        <p className="text-orange-400 font-medium">Prévia do documento</p>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-100 rounded-full w-full"></div>
                        <div className="h-4 bg-gray-100 rounded-full w-3/4"></div>
                        <div className="h-4 bg-gray-100 rounded-full w-5/6"></div>
                        <div className="h-4 bg-gray-100 rounded-full w-2/3"></div>
                      </div>
                    </div>
                    {!isAuthor && (
                      <Button className="mt-6 bg-orange-500 hover:bg-orange-600" onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" />
                        Baixar Documento Completo
                      </Button>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="comments" className="space-y-6 pt-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Comentários ({material.commentCount})</h3>
                    {isLoadingComments ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
                      </div>
                    ) : comments.length > 0 ? (
                      <div className="space-y-4">
                        {comments.map((comment, index) => (
                          <div key={index} className="flex gap-4">
                            <Avatar>
                              <AvatarFallback>{comment.author?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="font-medium">{comment.author}</span>
                                  <span className="text-gray-500 text-sm ml-2">• {formatDate(comment.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  <ThumbsUp className="h-3 w-3" onClick={() => handleCommentLike(comment.id)} />
                                  <span>{comment.likes || 0}</span>
                                </div>
                              </div>
                              <p className="text-gray-700">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                        {totalPages > 1 && (
                          <div className="flex justify-center gap-2 mt-6">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={currentPage === 0}
                              onClick={() => setCurrentPage((prev) => prev - 1)}
                            >
                              Anterior
                            </Button>
                            <span className="flex items-center px-4 text-sm text-gray-600">
                              Página {currentPage + 1} de {totalPages}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={currentPage >= totalPages - 1}
                              onClick={() => setCurrentPage((prev) => prev + 1)}
                            >
                              Próxima
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
                      </div>
                    )}

                    {isAuthenticated ? (
                      <form onSubmit={handleAddComment} className="pt-4">
                        <h4 className="text-sm font-medium mb-2">Adicionar um comentário</h4>
                        <div className="space-y-4">
                          <Textarea
                            placeholder="Escreva seu comentário aqui..."
                            className="min-h-[100px]"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                          />
                          <Button
                            type="submit"
                            className="bg-orange-500 hover:bg-orange-600"
                            disabled={!newComment.trim()}
                          >
                            Publicar Comentário
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="pt-4 p-4 bg-gray-50 rounded-lg text-center">
                        <p className="text-gray-700 mb-2">Faça login para adicionar um comentário</p>
                        <Button asChild className="bg-orange-500 hover:bg-orange-600">
                          <Link to="/login">Entrar</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-medium">Sobre o Autor</h3>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback>
                    {material.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{material.author}</h4>
                  <p className="text-sm text-gray-500">{material.institution || "Instituição não informada"}</p>
                  <Button variant="link" className="text-orange-600 p-0 h-auto text-sm" asChild>
                    <Link to={`/profile/${encodeURIComponent(material.authorId)}`}>Ver perfil</Link>
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Estatísticas do Autor</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex flex-col">
                    <span className="text-gray-500">Recursos</span>
                    <span className="font-medium">{authorStats.materials}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500">Downloads</span>
                    <span className="font-medium">
                      {authorStats.downloads >= 1000
                        ? `${(authorStats.downloads / 1000).toFixed(1)}k`
                        : authorStats.downloads}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500">Seguidores</span>
                    <span className="font-medium">{authorStats.followers}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500">Avaliação</span>
                    <span className="font-medium">{authorStats.rating}/5</span>
                  </div>
                </div>
              </div>
              {!isAuthor && (
                <Button
                  variant="outline"
                  className={`w-full ${isFollowingAuthor ? "bg-orange-50 text-orange-700 border-orange-200" : ""}`}
                  onClick={handleFollowAuthor}
                  disabled={!isAuthenticated}
                >
                  {isFollowingAuthor ? "Seguindo" : "Seguir Autor"}
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-medium">Recursos Relacionados</h3>
              {relatedMaterials.length > 0 ? (
                <div className="space-y-4">
                  {relatedMaterials.map((related, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="rounded-md bg-orange-100 p-2 h-fit">
                        {related.type.toLowerCase().includes("resumo") ? (
                          <BookOpen className="h-5 w-5 text-orange-600" />
                        ) : (
                          <FileText className="h-5 w-5 text-orange-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm line-clamp-2">
                          <Link to={`/material/${related.id}`} className="hover:text-orange-600">
                            {related.title}
                          </Link>
                        </h4>
                        <p className="text-xs text-gray-500">
                          {related.author} • {related.downloads} downloads
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Nenhum recurso relacionado encontrado.</p>
                </div>
              )}
              <Button variant="link" className="text-orange-600 p-0 h-auto text-sm w-fit" asChild>
                <Link to={`/explore?subject=${encodeURIComponent(material.subject)}`}>
                  Ver mais recursos relacionados
                </Link>
              </Button>
            </CardContent>
          </Card>

          {!isAuthor && (
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  {/* Average Rating Display */}
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-orange-500">
                      {material.averageRating ? material.averageRating.toFixed(1) : "0.0"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {material.totalRatings
                        ? `${material.totalRatings} ${material.totalRatings === 1 ? "avaliação" : "avaliações"}`
                        : "Sem avaliações"}
                    </div>
                  </div>

                  {/* Verificação se o usuário já avaliou usando material.userRating */}
                  {material.userRating !== false ? (
                    <div className="w-full">
                      {/* Exibição das estrelas (não interativas) */}
                      <div className="flex items-center justify-center gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isStarFilled = star <= Math.round(material.averageRating || 0)
                          const isUserRating = typeof material.userRating === "number" && star <= material.userRating

                          return (
                            <span
                              key={star}
                              className={`text-2xl ${
                                isStarFilled
                                  ? isUserRating
                                    ? "text-amber-500" // Destaque para a avaliação do usuário
                                    : "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              title={`Média: ${material.averageRating?.toFixed(1)}`}
                              aria-label={`${star} ${star === 1 ? "estrela" : "estrelas"}`}
                            >
                              ★
                            </span>
                          )
                        })}
                      </div>

                      {/* Mensagem de confirmação */}
                      <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 text-center w-full mb-3 shadow-sm">
                        <p className="text-sm font-medium text-orange-700">
                          Você avaliou este material!
                        </p>
                        <p className="text-xs text-orange-600 mt-1">Obrigado pelo seu feedback</p>
                      </div>

                      {/* Rating Distribution */}
                      {material.distribution && material.totalRatings > 0 && (
                        <div className="space-y-1 text-sm mt-3 w-full">
                          <h4 className="text-sm font-medium mb-2">Distribuição de avaliações</h4>
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center gap-2">
                              <span className="w-3">{rating}</span>
                              <Progress
                                value={
                                  material.distribution[rating]
                                    ? (material.distribution[rating] / material.totalRatings) * 100
                                    : 0
                                }
                                className={`h-2 flex-1 ${rating === (typeof material.userRating === "number" ? material.userRating : -1) ? "bg-amber-500" : ""}`}
                              />
                              <span className="w-8 text-right text-gray-500">{material.distribution[rating] || 0}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Usuário não avaliou ainda - Mostrar card interativo */
                    <div className="w-full">
                      {/* Estrelas interativas para avaliação */}
                      <div className="flex items-center justify-center gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isStarFilled = star <= Math.round(material.averageRating || 0)

                          return (
                            <button
                              key={star}
                              onClick={() => handleStarClick(star)}
                              disabled={!isAuthenticated}
                              className={`text-2xl transition-all duration-300 ${
                                !isAuthenticated ? "cursor-not-allowed opacity-90" : "cursor-pointer hover:scale-110"
                              } ${isStarFilled ? "text-yellow-400" : "text-gray-300"}`}
                              title={
                                !isAuthenticated
                                  ? "Faça login para avaliar"
                                  : `Avaliar com ${star} ${star === 1 ? "estrela" : "estrelas"}`
                              }
                              aria-label={!isAuthenticated ? "Faça login para avaliar" : `Avaliar com ${star} estrelas`}
                            >
                              ★
                            </button>
                          )
                        })}
                      </div>

                      {/* Mensagem de instrução ou botão de login */}
                      {isAuthenticated ? (
                        <p className="text-sm text-center text-gray-600 mb-3">
                          Clique nas estrelas para avaliar este material
                        </p>
                      ) : (
                        <Button asChild size="sm" className="bg-orange-500 hover:bg-orange-600 w-full mb-3">
                          <Link to="/login">Entrar para avaliar</Link>
                        </Button>
                      )}

                      {/* Rating Distribution */}
                      {material.distribution && material.totalRatings > 0 && (
                        <div className="space-y-1 text-sm mt-3 w-full">
                          <h4 className="text-sm font-medium mb-2">Distribuição de avaliações</h4>
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center gap-2">
                              <span className="w-3">{rating}</span>
                              <Progress
                                value={
                                  material.distribution[rating]
                                    ? (material.distribution[rating] / material.totalRatings) * 100
                                    : 0
                                }
                                className="h-2 flex-1"
                              />
                              <span className="w-8 text-right text-gray-500">{material.distribution[rating] || 0}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
            <div className="text-sm">
              <p>Encontrou algum problema?</p>
              <p className="text-gray-500">Reporte conteúdo inadequado</p>
            </div>
            <Button variant="ghost" size="sm" className="text-orange-600 hover:bg-orange-100">
              <Flag className="h-4 w-4 mr-2" />
              Reportar
            </Button>
          </div>
        </div>
      </div>

      {/* Diálogo de confirmação para exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir material</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este material? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMaterial} className="bg-red-600 text-white hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default MaterialPage
