"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { BookOpen, Clock, FileText, GraduationCap, Layers, Lightbulb, Sparkles, TrendingUp } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import useAuth from "../hooks/useAuth"
import { toast } from "react-toastify"
import type { Material } from "../types/material"
import materialService from "../services/materialService"
import type { PageResponse } from "../types/pagination"

// Componentes
import SearchBar from "../components/explore/SearchBar"
import TrendingTopics from "../components/explore/TrendingTopics"
import MaterialGrid from "../components/explore/MaterialGrid"
import MaterialList from "../components/explore/MaterialList"
import MaterialSection from "../components/explore/MaterialSection"
import FilterPanel from "../components/explore/FilterPanel"
import ActiveFilters from "../components/explore/ActiveFilters"
import ViewToggle from "../components/explore/ViewToggle"
import EmptyState from "../components/explore/EmptyState"
import Pagination from "../components/common/Pagination"

// Dados estáticos para tipos de recursos e áreas de conhecimento
const materialTypes = [
  { id: "ARTICLE", label: "Artigos", icon: <FileText className="h-4 w-4" /> },
  { id: "THESIS", label: "TCCs", icon: <GraduationCap className="h-4 w-4" /> },
  { id: "NOTES", label: "Resumos", icon: <BookOpen className="h-4 w-4" /> },
  { id: "PRESENTATION", label: "Apresentações", icon: <Layers className="h-4 w-4" /> },
  { id: "EXERCISE", label: "Exercícios", icon: <Lightbulb className="h-4 w-4" /> },
]

const knowledgeAreas = [
  { id: "COMPUTER_SCIENCE", label: "Ciência da Computação" },
  { id: "ENGINEERING", label: "Engenharia" },
  { id: "MEDICINE", label: "Medicina" },
  { id: "BUSINESS", label: "Administração" },
  { id: "LAW", label: "Direito" },
  { id: "PSYCHOLOGY", label: "Psicologia" },
  { id: "EDUCATION", label: "Educação" },
  { id: "ARTS", label: "Artes" },
  { id: "OTHER", label: "Outras" },
]

const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { isAuthenticated } = useAuth()

  // Estados para recursos
  const [isLoading, setIsLoading] = useState(true)
  const [materials, setMaterials] = useState<Material[]>([])
  const [recommendedMaterials, setRecommendedMaterials] = useState<Material[]>([])
  const [trendingMaterials, setTrendingMaterials] = useState<Material[]>([])
  const [recentMaterials, setRecentMaterials] = useState<Material[]>([])
  const [trendingTopics, setTrendingTopics] = useState<string[]>([])

  // Estados para paginação
  const [pagination, setPagination] = useState<{
    currentPage: number
    totalPages: number
    totalElements: number
    size: number
  }>({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    size: 12,
  })

  // Estados para visualização
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeTab, setActiveTab] = useState("all")

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<[number, number]>([0, 5]) // 0-5 anos
  const [minDownloads, setMinDownloads] = useState(0)
  const [onlyFreeMaterials, setOnlyFreeMaterials] = useState(false)
  const [sortBy, setSortBy] = useState("relevance")
  const [filtersVisible, setFiltersVisible] = useState(false)

  // Inicializar filtros a partir da URL
  useEffect(() => {
    const query = searchParams.get("q") || ""
    const type = searchParams.get("type") || ""
    const area = searchParams.get("area") || ""
    const sort = searchParams.get("sort") || "relevance"
    const page = Number.parseInt(searchParams.get("page") || "0", 10)
    const size = Number.parseInt(searchParams.get("size") || "12", 10)
    const view = searchParams.get("view") || "grid"

    setSearchTerm(query)
    if (type) setSelectedTypes(type.split(","))
    if (area) setSelectedAreas(area.split(","))
    setSortBy(sort)
    setViewMode(view as "grid" | "list")
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
      size: size,
    }))

    // Definir a aba ativa com base nos parâmetros
    if (searchParams.get("tab")) {
      setActiveTab(searchParams.get("tab") || "all")
    }
  }, [searchParams])

  // Carregar tópicos em alta
  useEffect(() => {
    const fetchTrendingTopics = async () => {
      try {
        const topics = await materialService.getTrendingTopics()
        setTrendingTopics(topics)
      } catch (error) {
        console.error("Erro ao buscar tópicos em alta:", error)
        // Fallback para tópicos estáticos em caso de erro
        setTrendingTopics([
          "Inteligência Artificial",
          "Sustentabilidade",
          "Blockchain",
          "Saúde Mental",
          "Energias Renováveis",
          "Direito Digital",
          "Neurociência",
          "Economia Circular",
        ])
      }
    }

    fetchTrendingTopics()
  }, [])

  // Carregar recursos com base nos filtros
  useEffect(() => {
    const fetchMaterials = async () => {
      setIsLoading(true)
      try {
        // Preparar parâmetros de busca
        const params = {
          page: pagination.currentPage,
          size: pagination.size,
          search: searchTerm,
          type: selectedTypes.length > 0 ? selectedTypes.join(",") : undefined,
          area: selectedAreas.length > 0 ? selectedAreas.join(",") : undefined,
          sort: sortBy === "relevance" ? undefined : sortBy,
          dateRange: dateRange[1],
          minDownloads: minDownloads > 0 ? minDownloads : undefined,
          onlyFree: onlyFreeMaterials || undefined,
        }

        // Buscar recursos filtrados
        const response = await materialService.getMaterials(params)
        setMaterials(response.content)
        setPagination({
          currentPage: response.number,
          totalPages: response.totalPages,
          totalElements: response.totalElements,
          size: response.size,
        })
      } catch (error) {
        console.error("Erro ao buscar recursos:", error)
        toast.error("Não foi possível carregar os recursos. Tente novamente mais tarde.")
        setMaterials([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchMaterials()
  }, [
    searchTerm,
    selectedTypes,
    selectedAreas,
    sortBy,
    dateRange,
    minDownloads,
    onlyFreeMaterials,
    pagination.currentPage,
    pagination.size,
  ])

  // Carregar recursos recomendados, em alta e recentes
  useEffect(() => {
    const fetchCategorizedMaterials = async () => {
      if (activeTab !== "all" || searchTerm || selectedTypes.length > 0 || selectedAreas.length > 0) {
        return // Não carregar se estiver em outra aba ou com filtros ativos
      }

      try {
        // Carregar recursos recomendados se o usuário estiver autenticado
        if (isAuthenticated) {
          const recommendedResponse = await materialService.getRecommendedMaterials()
          setRecommendedMaterials(recommendedResponse.content)
        }

        // Carregar recursos em alta
        const trendingResponse = await materialService.getTrendingMaterials()
        setTrendingMaterials(trendingResponse.content)

        // Carregar recursos recentes
        const recentResponse = await materialService.getRecentMaterials()
        setRecentMaterials(recentResponse.content)
      } catch (error) {
        console.error("Erro ao carregar recursos categorizados:", error)
        toast.error("Não foi possível carregar alguns recursos. Tente novamente mais tarde.")
      }
    }

    fetchCategorizedMaterials()
  }, [activeTab, isAuthenticated, searchTerm, selectedTypes, selectedAreas])

  // Carregar recursos específicos para cada aba
  useEffect(() => {
    const fetchTabMaterials = async () => {
      if (activeTab === "all") return // Já tratado em outro useEffect

      setIsLoading(true)
      try {
        let response: PageResponse<Material>

        switch (activeTab) {
          case "recommended":
            if (isAuthenticated) {
              response = await materialService.getRecommendedMaterials(pagination.currentPage, pagination.size)
              setMaterials(response.content)
              setPagination({
                currentPage: response.number,
                totalPages: response.totalPages,
                totalElements: response.totalElements,
                size: response.size,
              })
            }
            break
          case "trending":
            response = await materialService.getTrendingMaterials(pagination.currentPage, pagination.size)
            setMaterials(response.content)
            setPagination({
              currentPage: response.number,
              totalPages: response.totalPages,
              totalElements: response.totalElements,
              size: response.size,
            })
            break
          case "recent":
            response = await materialService.getRecentMaterials(pagination.currentPage, pagination.size)
            setMaterials(response.content)
            setPagination({
              currentPage: response.number,
              totalPages: response.totalPages,
              totalElements: response.totalElements,
              size: response.size,
            })
            break
        }
      } catch (error) {
        console.error(`Erro ao carregar recursos da aba ${activeTab}:`, error)
        toast.error("Não foi possível carregar os recursos. Tente novamente mais tarde.")
        setMaterials([])
      } finally {
        setIsLoading(false)
      }
    }

    if (activeTab !== "all") {
      fetchTabMaterials()
    }
  }, [activeTab, pagination.currentPage, pagination.size, isAuthenticated])

  // Aplicar filtros e atualizar URL
  const applyFilters = () => {
    const params = new URLSearchParams()

    if (searchTerm) params.set("q", searchTerm)
    if (selectedTypes.length > 0) params.set("type", selectedTypes.join(","))
    if (selectedAreas.length > 0) params.set("area", selectedAreas.join(","))
    if (sortBy !== "relevance") params.set("sort", sortBy)
    params.set("tab", activeTab)
    params.set("page", "0") // Resetar para a primeira página ao aplicar filtros
    params.set("size", pagination.size.toString())
    params.set("view", viewMode) // Save view mode in URL

    setSearchParams(params)
    setFiltersVisible(false)
    setPagination((prev) => ({ ...prev, currentPage: 0 })) // Resetar página ao aplicar filtros
  }

  // Limpar todos os filtros
  const clearFilters = () => {
    setSearchTerm("")
    setSelectedTypes([])
    setSelectedAreas([])
    setDateRange([0, 5])
    setMinDownloads(0)
    setOnlyFreeMaterials(false)
    setSortBy("relevance")

    const params = new URLSearchParams()
    params.set("tab", activeTab)
    params.set("page", "0")
    params.set("size", pagination.size.toString())
    params.set("view", viewMode) // Keep view mode when clearing filters
    setSearchParams(params)
    setPagination((prev) => ({ ...prev, currentPage: 0 }))
  }

  // Alternar seleção de tipo
  const toggleType = (typeId: string) => {
    setSelectedTypes((prev) => (prev.includes(typeId) ? prev.filter((id) => id !== typeId) : [...prev, typeId]))
  }

  // Alternar seleção de área
  const toggleArea = (areaId: string) => {
    setSelectedAreas((prev) => (prev.includes(areaId) ? prev.filter((id) => id !== areaId) : [...prev, areaId]))
  }

  // Remover um tipo específico
  const removeType = (typeId: string) => {
    setSelectedTypes((prev) => prev.filter((id) => id !== typeId))
    const params = new URLSearchParams(searchParams)
    const updatedTypes = selectedTypes.filter((id) => id !== typeId)
    if (updatedTypes.length > 0) {
      params.set("type", updatedTypes.join(","))
    } else {
      params.delete("type")
    }
    params.set("page", "0")
    setSearchParams(params)
    setPagination((prev) => ({ ...prev, currentPage: 0 }))
  }

  // Remover uma área específica
  const removeArea = (areaId: string) => {
    setSelectedAreas((prev) => prev.filter((id) => id !== areaId))
    const params = new URLSearchParams(searchParams)
    const updatedAreas = selectedAreas.filter((id) => id !== areaId)
    if (updatedAreas.length > 0) {
      params.set("area", updatedAreas.join(","))
    } else {
      params.delete("area")
    }
    params.set("page", "0")
    setSearchParams(params)
    setPagination((prev) => ({ ...prev, currentPage: 0 }))
  }

  // Limpar termo de busca
  const clearSearchTerm = () => {
    setSearchTerm("")
    const params = new URLSearchParams(searchParams)
    params.delete("q")
    params.set("page", "0")
    setSearchParams(params)
    setPagination((prev) => ({ ...prev, currentPage: 0 }))
  }

  // Resetar ordenação
  const resetSortBy = () => {
    setSortBy("relevance")
    const params = new URLSearchParams(searchParams)
    params.delete("sort")
    params.set("page", "0")
    setSearchParams(params)
    setPagination((prev) => ({ ...prev, currentPage: 0 }))
  }

  // Lidar com clique em tópico
  const handleTopicClick = (topic: string) => {
    setSearchTerm(topic)
    const params = new URLSearchParams()
    params.set("q", topic)
    params.set("tab", "all")
    params.set("page", "0")
    params.set("size", pagination.size.toString())
    params.set("view", viewMode) // Keep view mode when clicking on topic
    setSearchParams(params)
    setPagination((prev) => ({ ...prev, currentPage: 0 }))
  }

  // Lidar com mudança de página
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", newPage.toString())
    setSearchParams(params)
    setPagination((prev) => ({ ...prev, currentPage: newPage }))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Lidar com mudança de tamanho de página
  const handlePageSizeChange = (newSize: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("size", newSize.toString())
    params.set("page", "0")
    setSearchParams(params)
    setPagination((prev) => ({ ...prev, size: newSize, currentPage: 0 }))
  }

  // Handle view mode change
  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode)
    const params = new URLSearchParams(searchParams)
    params.set("view", mode)
    setSearchParams(params)
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Explorar Recursos</h1>
          <p className="text-gray-500 mt-1">
            Descubra materiais acadêmicos de alta qualidade compartilhados pela comunidade
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ViewToggle viewMode={viewMode} setViewMode={handleViewModeChange} />

          <FilterPanel
            selectedTypes={selectedTypes}
            selectedAreas={selectedAreas}
            dateRange={dateRange}
            onlyFreeMaterials={onlyFreeMaterials}
            sortBy={sortBy}
            materialTypes={materialTypes}
            knowledgeAreas={knowledgeAreas}
            toggleType={toggleType}
            toggleArea={toggleArea}
            setDateRange={setDateRange}
            setOnlyFreeMaterials={setOnlyFreeMaterials}
            setSortBy={setSortBy}
            applyFilters={applyFilters}
            clearFilters={clearFilters}
            filtersVisible={filtersVisible}
            setFiltersVisible={setFiltersVisible}
          />
        </div>
      </div>

      {/* Barra de pesquisa */}
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={applyFilters} />

      {/* Tópicos em alta */}
      <TrendingTopics topics={trendingTopics} onTopicClick={handleTopicClick} />

      {/* Abas de conteúdo */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto lg:inline-flex">
          <TabsTrigger
            value="all"
            onClick={() => {
              const params = new URLSearchParams(searchParams)
              params.set("tab", "all")
              params.set("page", "0")
              setSearchParams(params)
              setPagination((prev) => ({ ...prev, currentPage: 0 }))
            }}
          >
            Todos
          </TabsTrigger>
          <TabsTrigger
            value="recommended"
            onClick={() => {
              const params = new URLSearchParams(searchParams)
              params.set("tab", "recommended")
              params.set("page", "0")
              setSearchParams(params)
              setPagination((prev) => ({ ...prev, currentPage: 0 }))
            }}
          >
            Recomendados
          </TabsTrigger>
          <TabsTrigger
            value="trending"
            onClick={() => {
              const params = new URLSearchParams(searchParams)
              params.set("tab", "trending")
              params.set("page", "0")
              setSearchParams(params)
              setPagination((prev) => ({ ...prev, currentPage: 0 }))
            }}
          >
            Em Alta
          </TabsTrigger>
          <TabsTrigger
            value="recent"
            onClick={() => {
              const params = new URLSearchParams(searchParams)
              params.set("tab", "recent")
              params.set("page", "0")
              setSearchParams(params)
              setPagination((prev) => ({ ...prev, currentPage: 0 }))
            }}
          >
            Recentes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {searchTerm || selectedTypes.length > 0 || selectedAreas.length > 0 ? (
            <div className="mb-4">
              <ActiveFilters
                searchTerm={searchTerm}
                selectedTypes={selectedTypes}
                selectedAreas={selectedAreas}
                sortBy={sortBy}
                materialTypes={materialTypes}
                knowledgeAreas={knowledgeAreas}
                clearSearchTerm={clearSearchTerm}
                removeType={removeType}
                removeArea={removeArea}
                resetSortBy={resetSortBy}
                clearAllFilters={clearFilters}
              />

              {isLoading ? (
                <div className="space-y-4">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Card key={i}>
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <Skeleton className="h-16 w-16 rounded-full flex-shrink-0" />
                            <div className="flex-1">
                              <Skeleton className="h-6 w-1/3 mb-2" />
                              <Skeleton className="h-4 w-full mb-2" />
                              <Skeleton className="h-4 w-2/3" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : materials.length > 0 ? (
                <>
                  {viewMode === "grid" ? (
                    <MaterialGrid materials={materials} />
                  ) : (
                    <MaterialList materials={materials} />
                  )}

                  {/* Paginação */}
                  {pagination.totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                        totalItems={pagination.totalElements}
                        pageSize={pagination.size}
                        onPageSizeChange={handlePageSizeChange}
                      />
                    </div>
                  )}
                </>
              ) : (
                <EmptyState type="search" onClearFilters={clearFilters} />
              )}
            </div>
          ) : (
            <>
              {isAuthenticated && recommendedMaterials.length > 0 && (
                <MaterialSection
                  title="Recomendados para Você"
                  description="Conteúdos selecionados com base nos seus interesses e histórico"
                  materials={recommendedMaterials}
                  icon={<Sparkles className="h-5 w-5 text-orange-500" />}
                  isLoading={isLoading}
                  viewMode={viewMode}
                  onViewMore={() => {
                    const params = new URLSearchParams()
                    params.set("tab", "recommended")
                    params.set("page", "0")
                    params.set("view", viewMode)
                    setSearchParams(params)
                    setActiveTab("recommended")
                  }}
                />
              )}

              {trendingMaterials.length > 0 && (
                <MaterialSection
                  title="Em Alta"
                  description="Os materiais mais populares e bem avaliados da plataforma"
                  materials={trendingMaterials}
                  icon={<TrendingUp className="h-5 w-5 text-orange-500" />}
                  isLoading={isLoading}
                  viewMode={viewMode}
                  onViewMore={() => {
                    const params = new URLSearchParams()
                    params.set("tab", "trending")
                    params.set("page", "0")
                    params.set("view", viewMode)
                    setSearchParams(params)
                    setActiveTab("trending")
                  }}
                />
              )}

              {recentMaterials.length > 0 && (
                <MaterialSection
                  title="Adicionados Recentemente"
                  description="Descubra os últimos materiais compartilhados pela comunidade"
                  materials={recentMaterials}
                  icon={<Clock className="h-5 w-5 text-orange-500" />}
                  isLoading={isLoading}
                  viewMode={viewMode}
                  onViewMore={() => {
                    const params = new URLSearchParams()
                    params.set("tab", "recent")
                    params.set("page", "0")
                    params.set("view", viewMode)
                    setSearchParams(params)
                    setActiveTab("recent")
                  }}
                />
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="recommended" className="mt-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-4">Recomendados para Você</h2>
            {!isAuthenticated ? (
              <EmptyState type="login" />
            ) : isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex justify-between mb-3">
                          <Skeleton className="h-6 w-20" />
                          <Skeleton className="h-10 w-10 rounded-full" />
                        </div>
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-6 w-3/4 mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3" />
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : materials.length > 0 ? (
              <>
                {viewMode === "grid" ? <MaterialGrid materials={materials} /> : <MaterialList materials={materials} />}

                {/* Paginação */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChange}
                      totalItems={pagination.totalElements}
                      pageSize={pagination.size}
                      onPageSizeChange={handlePageSizeChange}
                    />
                  </div>
                )}
              </>
            ) : (
              <EmptyState type="recommended" />
            )}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="mt-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-4">Em Alta</h2>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex justify-between mb-3">
                          <Skeleton className="h-6 w-20" />
                          <Skeleton className="h-10 w-10 rounded-full" />
                        </div>
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-6 w-3/4 mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3" />
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : materials.length > 0 ? (
              <>
                {viewMode === "grid" ? <MaterialGrid materials={materials} /> : <MaterialList materials={materials} />}

                {/* Paginação */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChange}
                      totalItems={pagination.totalElements}
                      pageSize={pagination.size}
                      onPageSizeChange={handlePageSizeChange}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium">Nenhum recurso encontrado</h3>
                <p className="text-gray-500 mb-4">Não há recursos em alta no momento</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="mt-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-4">Adicionados Recentemente</h2>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex justify-between mb-3">
                          <Skeleton className="h-6 w-20" />
                          <Skeleton className="h-10 w-10 rounded-full" />
                        </div>
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-6 w-3/4 mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3" />
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : materials.length > 0 ? (
              <>
                {viewMode === "grid" ? <MaterialGrid materials={materials} /> : <MaterialList materials={materials} />}

                {/* Paginação */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChange}
                      totalItems={pagination.totalElements}
                      pageSize={pagination.size}
                      onPageSizeChange={handlePageSizeChange}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium">Nenhum recurso encontrado</h3>
                <p className="text-gray-500 mb-4">Não há recursos recentes no momento</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ExplorePage
