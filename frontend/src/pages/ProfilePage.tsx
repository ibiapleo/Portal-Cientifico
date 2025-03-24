"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import {
  Settings,
  FileText,
  LogOut,
  Bookmark,
  Upload,
  BookOpen,
  Eye,
  Download,
  ThumbsUp,
  MessageSquare,
} from "lucide-react"
import Layout from "../components/layout/Layout"
import useAuth from "../hooks/useAuth"
import useResources from "../hooks/useResource"

const ProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { resources, isLoading, error } = useResources({ page: 1, limit: 4 })
  const [activeTab, setActiveTab] = useState<"uploads" | "saved" | "settings">("uploads")

  useEffect(() => {
    // Redirecionar se não estiver autenticado
    if (!user) {
      navigate("/login")
    }
  }, [user, navigate])

  if (!user) {
    return null // Não renderiza nada enquanto verifica autenticação
  }

  return (
    <Layout>
      <div className="container py-10">
        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
              <div className="p-6 flex flex-col items-center text-center">
                <div className="h-24 w-24 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-2xl mb-4">
                  {user.firstName.charAt(0)}
                  {user.lastName.charAt(0)}
                </div>
                <h2 className="text-xl font-bold">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-sm text-gray-500 mt-1">{user.institution || "Instituição não informada"}</p>

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
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {activeTab === "uploads" && (
              <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">Meus Uploads</h2>

                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                    </div>
                  ) : error ? (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                      <p>{error}</p>
                    </div>
                  ) : resources.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <h3 className="text-lg font-medium">Nenhum upload encontrado</h3>
                      <p className="text-gray-500 mb-4">Você ainda não compartilhou nenhum material</p>
                      <Link
                        to="/upload"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 h-9 px-4 py-2"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Enviar Material
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {resources.map((resource) => (
                        <div key={resource.id} className="flex border rounded-lg overflow-hidden">
                          <div className="w-16 bg-orange-50 flex items-center justify-center">
                            {resource.type.toLowerCase().includes("article") ||
                            resource.type.toLowerCase().includes("thesis") ? (
                              <FileText className="h-6 w-6 text-orange-500" />
                            ) : (
                              <BookOpen className="h-6 w-6 text-orange-500" />
                            )}
                          </div>
                          <div className="flex-1 p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium">{resource.title}</h3>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                  <span>{resource.type}</span>
                                  <span className="mx-2">•</span>
                                  <span>{new Date(resource.createdAt).toLocaleDateString("pt-BR")}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Link
                                  to={`/resource/${resource.id}`}
                                  className="inline-flex items-center justify-center rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 h-8 px-3 border"
                                >
                                  Ver
                                </Link>
                                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 h-8 px-3 border">
                                  Editar
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                <span>{resource.views}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Download className="h-4 w-4" />
                                <span>{resource.downloads}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <ThumbsUp className="h-4 w-4" />
                                <span>{resource.likes}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>{resource.comments}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="flex justify-center mt-6">
                        <Link
                          to="/my-uploads"
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-orange-200 text-orange-600 hover:bg-orange-50 h-9 px-4 py-2"
                        >
                          Ver Todos os Uploads
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "saved" && (
              <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">Recursos Salvos</h2>

                  <div className="text-center py-8">
                    <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <h3 className="text-lg font-medium">Nenhum recurso salvo</h3>
                    <p className="text-gray-500 mb-4">Você ainda não salvou nenhum material</p>
                    <Link
                      to="/"
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 h-9 px-4 py-2"
                    >
                      Explorar Recursos
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-6">Configurações da Conta</h2>

                  <form className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Informações Pessoais</h3>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label htmlFor="firstName" className="block text-sm font-medium">
                            Nome
                          </label>
                          <input
                            id="firstName"
                            type="text"
                            defaultValue={user.firstName}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="lastName" className="block text-sm font-medium">
                            Sobrenome
                          </label>
                          <input
                            id="lastName"
                            type="text"
                            defaultValue={user.lastName}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium">
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          defaultValue={user.email}
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
                          defaultValue={user.institution || ""}
                          placeholder="Sua universidade ou instituição"
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>

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
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 h-9 px-4 py-2"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 h-9 px-4 py-2"
                      >
                        Salvar Alterações
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ProfilePage

