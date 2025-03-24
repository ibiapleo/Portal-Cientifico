"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import {
  Download,
  BookOpen,
  ThumbsUp,
  MessageSquare,
  Bookmark,
  Flag,
  Calendar,
  User,
  FileText,
  Clock,
  Eye,
} from "lucide-react"
import resourceService from "../../services/resourceService"
import type { Resource } from "../../types/resource"
import useAuth from "../../hooks/useAuth"

const ResourceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated, user } = useAuth()
  const [resource, setResource] = useState<Resource | null>(null)
  const [activeTab, setActiveTab] = useState<"about" | "preview" | "comments">("about")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState<string>("")
  const [isLiked, setIsLiked] = useState<boolean>(false)
  const [likeCount, setLikeCount] = useState<number>(0)

  useEffect(() => {
    const fetchResource = async () => {
      if (!id) return

      try {
        setIsLoading(true)
        const data = await resourceService.getResourceById(id)
        setResource(data)
        setLikeCount(data.likes)

        // Buscar comentários
        const commentsData = await resourceService.getComments(id)
        setComments(commentsData)
      } catch (err) {
        console.error("Erro ao buscar recurso:", err)
        setError("Não foi possível carregar os detalhes deste recurso.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchResource()
  }, [id])

  const handleDownload = async () => {
    if (!id || !resource) return

    try {
      const blob = await resourceService.downloadResource(id)

      // Criar URL para download
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = resource.title + "." + resource.fileType.toLowerCase()
      document.body.appendChild(a)
      a.click()

      // Limpar
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error("Erro ao baixar recurso:", err)
      setError("Não foi possível baixar este recurso.")
    }
  }

  const handleLike = async () => {
    if (!id || !isAuthenticated) return

    try {
      const { likes } = await resourceService.likeResource(id)
      setLikeCount(likes)
      setIsLiked(true)
    } catch (err) {
      console.error("Erro ao curtir recurso:", err)
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!id || !isAuthenticated || !newComment.trim()) return

    try {
      await resourceService.addComment(id, newComment)

      // Atualizar comentários
      const commentsData = await resourceService.getComments(id)
      setComments(commentsData)
      setNewComment("")
    } catch (err) {
      console.error("Erro ao adicionar comentário:", err)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-10 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (error || !resource) {
    return (
      <div className="container py-10">
        <div className="p-6 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          <h2 className="text-lg font-medium mb-2">Erro</h2>
          <p>{error || "Recurso não encontrado."}</p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-700"
          >
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-700">
          <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar para a página inicial
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700">
                      {resource.type}
                    </span>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium">
                      {resource.subject}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold">{resource.title}</h1>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User className="h-4 w-4" />
                    <span>{resource.author}</span>
                    <span className="mx-1">•</span>
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(resource.createdAt).toLocaleDateString("pt-BR")}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 h-9 px-4 py-2"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Baixar
                  </button>
                  <button className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 h-9 px-4 py-2">
                    <Bookmark className="mr-2 h-4 w-4" />
                    Salvar
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-6 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{resource.views} visualizações</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  <span>{resource.downloads} downloads</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp
                    className={`h-4 w-4 ${isLiked ? "text-orange-500" : ""}`}
                    onClick={handleLike}
                    style={{ cursor: isAuthenticated ? "pointer" : "default" }}
                  />
                  <span>{likeCount} curtidas</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{comments.length} comentários</span>
                </div>
              </div>

              <div className="my-6 border-t border-gray-200"></div>

              <div>
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      onClick={() => setActiveTab("about")}
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "about"
                          ? "border-orange-500 text-orange-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Sobre
                    </button>
                    <button
                      onClick={() => setActiveTab("preview")}
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "preview"
                          ? "border-orange-500 text-orange-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Visualização
                    </button>
                    <button
                      onClick={() => setActiveTab("comments")}
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "comments"
                          ? "border-orange-500 text-orange-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Comentários
                    </button>
                  </nav>
                </div>

                {activeTab === "about" && (
                  <div className="space-y-6 pt-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Descrição</h3>
                      <p className="text-gray-700">{resource.description}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Palavras-chave</h3>
                      <div className="flex flex-wrap gap-2">
                        {resource.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium"
                          >
                            {keyword}
                          </span>
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
                            <span>{resource.fileType}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-500">Páginas:</span>
                            <span>{resource.pages || "N/A"}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Download className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-500">Tamanho:</span>
                            <span>{resource.fileSize}</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">Instituição</h3>
                        <p className="text-gray-700">{resource.institution || "Não informada"}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "preview" && (
                  <div className="pt-4">
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
                      <button
                        onClick={handleDownload}
                        className="mt-6 inline-flex items-center justify-center rounded-md text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 h-9 px-4 py-2"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Baixar Documento Completo
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "comments" && (
                  <div className="space-y-6 pt-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Comentários ({comments.length})</h3>

                      {comments.length > 0 ? (
                        <div className="space-y-4">
                          {comments.map((comment, index) => (
                            <div key={index} className="flex gap-4">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-medium">
                                {comment.author.charAt(0)}
                              </div>
                              <div className="space-y-1 flex-1">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className="font-medium">{comment.author}</span>
                                    <span className="text-gray-500 text-sm ml-2">
                                      • {new Date(comment.createdAt).toLocaleDateString("pt-BR")}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <ThumbsUp className="h-3 w-3" />
                                    <span>{comment.likes || 0}</span>
                                  </div>
                                </div>
                                <p className="text-gray-700">{comment.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
                      )}

                      {isAuthenticated ? (
                        <div className="pt-4">
                          <h4 className="text-sm font-medium mb-2">Adicionar um comentário</h4>
                          <form onSubmit={handleAddComment} className="space-y-4">
                            <textarea
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Escreva seu comentário aqui..."
                              className="w-full px-3 py-2 border rounded-lg min-h-[100px] focus:outline-none focus:ring-2 focus:ring-orange-500"
                              required
                            />
                            <button
                              type="submit"
                              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 h-9 px-4 py-2"
                            >
                              Publicar Comentário
                            </button>
                          </form>
                        </div>
                      ) : (
                        <div className="pt-4 p-4 bg-gray-50 rounded-lg text-center">
                          <p className="text-gray-700 mb-2">Faça login para adicionar um comentário</p>
                          <Link
                            to="/login"
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 h-9 px-4 py-2"
                          >
                            Entrar
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-medium">Sobre o Autor</h3>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-medium text-xl">
                  {resource.author.charAt(0)}
                </div>
                <div>
                  <h4 className="font-medium">{resource.author}</h4>
                  <p className="text-sm text-gray-500">{resource.institution || "Instituição não informada"}</p>
                  <button className="text-orange-600 text-sm hover:underline">Ver perfil</button>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4 mt-4"></div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Estatísticas do Autor</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex flex-col">
                    <span className="text-gray-500">Recursos</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500">Downloads</span>
                    <span className="font-medium">1.2k</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500">Seguidores</span>
                    <span className="font-medium">87</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500">Avaliação</span>
                    <span className="font-medium">4.8/5</span>
                  </div>
                </div>
              </div>
              <button className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 h-9 px-4 py-2">
                Seguir Autor
              </button>
            </div>
          </div>

          <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-medium">Recursos Relacionados</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="rounded-md bg-orange-100 p-2 h-fit">
                    <FileText className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm line-clamp-2">Introdução à Ciência de Dados com Python</h4>
                    <p className="text-xs text-gray-500">Maria Silva • 230 downloads</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="rounded-md bg-orange-100 p-2 h-fit">
                    <BookOpen className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm line-clamp-2">
                      Algoritmos de Deep Learning: Uma Abordagem Prática
                    </h4>
                    <p className="text-xs text-gray-500">Carlos Mendes • 185 downloads</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="rounded-md bg-orange-100 p-2 h-fit">
                    <FileText className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm line-clamp-2">
                      Processamento de Linguagem Natural para Iniciantes
                    </h4>
                    <p className="text-xs text-gray-500">Ana Oliveira • 142 downloads</p>
                  </div>
                </div>
              </div>
              <button className="text-orange-600 text-sm hover:underline">Ver mais recursos relacionados</button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
            <div className="text-sm">
              <p>Encontrou algum problema?</p>
              <p className="text-gray-500">Reporte conteúdo inadequado</p>
            </div>
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium text-orange-600 hover:bg-orange-100 h-8 px-3 py-1">
              <Flag className="h-4 w-4 mr-2" />
              Reportar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResourceDetails

