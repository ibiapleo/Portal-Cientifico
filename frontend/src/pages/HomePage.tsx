"use client"

import type React from "react"
import {useEffect, useState} from "react"
import {Link, useNavigate} from "react-router-dom"
import {
    ArrowRight,
    ArrowUpRight,
    Bookmark,
    BookOpen,
    ChevronDown,
    Clock,
    FileText,
    GraduationCap,
    ImageIcon,
    ListChecks,
    Presentation,
    School,
    Search,
    Sparkles,
    Star,
    TrendingUp,
    Upload,
    Users,
} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Badge} from "@/components/ui/badge"
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card"
import {Skeleton} from "@/components/ui/skeleton"
import useAuth from "../hooks/useAuth"
import materialService from "../services/materialService"
import type {Material, MaterialSearchParams} from "../types/material"
import MaterialCard from "../components/material/MaterialCard"

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useState<MaterialSearchParams>({
    page: 0,
    size: 8,
    sort: "createdAt,desc",
  })
  const [hasMore, setHasMore] = useState(true)
  const [activeTab, setActiveTab] = useState("recentes")
  const [trendingTopics, setTrendingTopics] = useState<string[]>([])

  // Mapeamento de ícones para tipos de materiais
  const materialTypeIcons = {
    ARTICLE: <FileText className="h-5 w-5" />,
    IMAGE: <ImageIcon className="h-5 w-5" />,
    TCC: <GraduationCap className="h-5 w-5" />,
    NOTES: <BookOpen className="h-5 w-5" />,
    PRESENTATION: <Presentation className="h-5 w-5" />,
    EXERCISE: <ListChecks className="h-5 w-5" />,
    OTHER: <Sparkles className="h-5 w-5" />,
  }

  useEffect(() => {
    const fetchTrendingTopics = async () => {
      try {
        const topics = await materialService.getTrendingTopics()
        setTrendingTopics(topics)
      } catch (error) {
        console.error("Erro ao buscar tópicos em alta:", error)
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

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true)
        if (searchParams.page === 0) {
          setMaterials([])
        }
        const response = await materialService.getMaterials(searchParams)
        setMaterials((prev) =>
          searchParams.page === 0 ? response.content || [] : [...prev, ...(response.content || [])],
        )
        setHasMore(response.pageable.pageNumber < response.totalPages - 1)
      } catch (error) {
        console.error("Erro ao buscar materiais:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMaterials()
  }, [searchParams])

  // Função para navegar para a página de exploração com os parâmetros de busca
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // Construir os parâmetros de URL para a página de exploração
    const queryParams = new URLSearchParams()

    if (searchTerm) queryParams.set("q", searchTerm)
    queryParams.set("tab", "all")
    queryParams.set("page", "0")

    // Navegar para a página de exploração com os parâmetros
    navigate(`/explore?${queryParams.toString()}`)
  }

  const handleSortChange = (value: string) => {
    setSearchParams({
      ...searchParams,
      sort: value,
      page: 0,
    })

    // Update active tab based on sort
    if (value.includes("createdAt")) {
      setActiveTab("recentes")
    } else if (value.includes("totalDownload")) {
      setActiveTab("populares")
    } else if (value.includes("rating")) {
      setActiveTab("avaliados")
    }
  }

  const loadMore = () => {
    if (!loading && hasMore) {
      setSearchParams({
        ...searchParams,
        page: (searchParams.page || 0) + 1,
      })
    }
  }

  // Função para navegar para a página de exploração com um tópico específico
  const handleTopicClick = (topic: string) => {
    const queryParams = new URLSearchParams()
    queryParams.set("q", topic)
    queryParams.set("tab", "all")
    queryParams.set("page", "0")
    navigate(`/explore?${queryParams.toString()}`)
  }

  // Skeleton loader for materials
  const MaterialSkeleton = () => (
    <>
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="p-4 pb-2 space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </CardContent>
          <CardFooter className="p-4 pt-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-8 w-24 ml-auto" />
          </CardFooter>
        </Card>
      ))}
    </>
  )

  return (
    <>
      {/* Hero Section - Design minimalista e moderno */}
      <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
        {/* Elementos decorativos sutis */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute right-0 top-0 w-1/3 h-1/3 bg-orange-100 opacity-20 blur-3xl" />
          <div className="absolute left-0 bottom-0 w-1/4 h-1/4 bg-orange-200 opacity-10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
            <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-200 border-none">
              Plataforma Educacional
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-800 mb-4">
              Compartilhe Conhecimento
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Uma plataforma colaborativa de materiais de estudo criada por estudantes para estudantes.
            </p>

            {/* Barra de pesquisa centralizada e minimalista */}
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Pesquisar materiais de estudo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 py-6 bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500 text-base"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white transition-all px-6"
                >
                  Buscar
                </Button>
              </form>
            </div>

            {/* Tópicos em alta */}
            <div className="mt-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Tópicos em Alta</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {trendingTopics.map((topic, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer bg-white hover:bg-orange-50 transition-colors"
                    onClick={() => handleTopicClick(topic)}
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white shadow-md transition-all group"
                asChild
              >
                <Link to="/upload">
                  <Upload className="mr-2 h-5 w-5 group-hover:translate-y-[-2px] transition-transform" />
                  Enviar Material
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-orange-200 text-orange-700 hover:bg-orange-50 transition-all group"
                asChild
              >
                <Link to="/explore">
                  <BookOpen className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Explorar Recursos
                </Link>
              </Button>
            </div>
          </div>

          {/* Tipos de materiais */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4 max-w-4xl mx-auto mt-12">
            {[
              { type: "ARTICLE", label: "Artigos" },
              { type: "IMAGE", label: "Imagens" },
              { type: "TCC", label: "TCCs" },
              { type: "NOTES", label: "Resumos" },
              { type: "PRESENTATION", label: "Apresentações" },
              { type: "EXERCISE", label: "Exercícios" },
              { type: "OTHER", label: "Outros" },
            ].map((item) => (
              <Link
                key={item.type}
                to={`/explore?type=${item.type}`}
                className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-100 hover:border-orange-200 hover:shadow-sm transition-all text-center group"
              >
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mb-2 group-hover:bg-orange-100 transition-colors">
                  {materialTypeIcons[item.type as keyof typeof materialTypeIcons]}
                </div>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Materials Section - Design simplificado */}
      <section className="py-16 w-full bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Materiais Recentes</h2>
              <p className="text-gray-500">Descubra os recursos mais recentes compartilhados pela comunidade</p>
            </div>
            <Button
              variant="ghost"
              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 group"
              onClick={() => navigate("/explore")}
            >
              Ver todos
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value)
              if (value === "recentes") handleSortChange("createdAt,desc")
              if (value === "populares") handleSortChange("totalDownload,desc")
              if (value === "avaliados") handleSortChange("rating,desc")
            }}
            className="mb-8"
          >
            <TabsList className="bg-white border border-gray-100 p-1 w-full sm:w-auto">
              <TabsTrigger
                value="recentes"
                className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 flex-1 sm:flex-initial"
              >
                <Clock className="h-4 w-4 mr-2" />
                Recentes
              </TabsTrigger>
              <TabsTrigger
                value="populares"
                className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 flex-1 sm:flex-initial"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Populares
              </TabsTrigger>
              <TabsTrigger
                value="avaliados"
                className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 flex-1 sm:flex-initial"
              >
                <Star className="h-4 w-4 mr-2" />
                Mais Avaliados
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading && materials.length === 0 ? (
              <MaterialSkeleton />
            ) : materials.length > 0 ? (
              materials.map((material) => <MaterialCard key={material.id} material={material} />)
            ) : (
              <div className="col-span-full py-16 text-center">
                <div className="mx-auto w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-orange-300" />
                </div>
                <h3 className="text-xl font-medium mb-2">Nenhum material encontrado</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  Tente ajustar seus termos de pesquisa para encontrar o que procura.
                </p>
                <Button
                  variant="outline"
                  className="border-orange-200 text-orange-600 hover:bg-orange-50"
                  onClick={() => navigate("/explore")}
                >
                  Explorar todos os materiais
                </Button>
              </div>
            )}
          </div>

          {hasMore && (
            <div className="mt-10 flex justify-center">
              <Button
                variant="outline"
                size="lg"
                className="border-orange-200 text-orange-600 hover:bg-orange-50 group"
                onClick={loadMore}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600 mr-2"></div>
                    Carregando...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Carregar Mais
                    <ChevronDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
                  </div>
                )}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section - Design minimalista */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Como Funciona</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Compartilhe e acesse materiais acadêmicos em apenas alguns passos simples
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: 1,
                title: "Crie uma Conta",
                description: "Cadastre-se gratuitamente e junte-se à nossa comunidade acadêmica",
                icon: <Users className="h-8 w-8 text-orange-500" />,
              },
              {
                step: 2,
                title: "Envie Seus Materiais",
                description: "Compartilhe seus resumos, TCCs ou artigos com a categorização adequada",
                icon: <Upload className="h-8 w-8 text-orange-500" />,
              },
              {
                step: 3,
                title: "Explore e Baixe",
                description: "Encontre recursos que correspondam aos seus interesses e baixe-os para seus estudos",
                icon: <BookOpen className="h-8 w-8 text-orange-500" />,
              },
              {
                step: 4,
                title: "Interaja e Colabore",
                description: "Comente nos recursos, conecte-se com colegas e colabore em projetos",
                icon: <Sparkles className="h-8 w-8 text-orange-500" />,
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">
                  <span className="text-orange-500 mr-1">{item.step}.</span> {item.title}
                </h3>
                <p className="text-gray-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

  

      {/* Call to Action - Design minimalista */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-8 md:p-12 shadow-md">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-white space-y-4">
                <h2 className="text-3xl font-bold">Pronto para compartilhar seu conhecimento?</h2>
                <p className="text-orange-50 text-lg">
                  Faça parte da nossa comunidade e ajude outros estudantes a terem acesso a materiais de qualidade.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 group" asChild>
                    <Link to="/upload">
                      <Upload className="mr-2 h-5 w-5" />
                      Enviar Material
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-orange-600/50"
                    asChild
                  >
                    <Link to="/explore">
                      <Search className="mr-2 h-5 w-5" />
                      Explorar Conteúdo
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="hidden md:flex justify-end">
                <div className="grid grid-cols-2 gap-4 max-w-xs">
                  {[
                    { icon: <FileText className="h-6 w-6 text-orange-500" />, label: "Artigos" },
                    { icon: <GraduationCap className="h-6 w-6 text-orange-500" />, label: "TCCs" },
                    { icon: <BookOpen className="h-6 w-6 text-orange-500" />, label: "Resumos" },
                    { icon: <Presentation className="h-6 w-6 text-orange-500" />, label: "Apresentações" },
                  ].map((item, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
                        {item.icon}
                      </div>
                      <p className="text-white text-sm">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Áreas de Conhecimento - Seção minimalista */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">Áreas de Conhecimento</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Explore materiais de estudo em diversas áreas acadêmicas</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              { id: "COMPUTER_SCIENCE", label: "Ciência da Computação" },
              { id: "ENGINEERING", label: "Engenharia" },
              { id: "MEDICINE", label: "Medicina" },
              { id: "BUSINESS", label: "Administração" },
              { id: "LAW", label: "Direito" },
              { id: "PSYCHOLOGY", label: "Psicologia" },
              { id: "EDUCATION", label: "Educação" },
              { id: "ARTS", label: "Artes" },
              { id: "OTHER", label: "Outras Áreas" },
            ].map((area) => (
              <Link
                key={area.id}
                to={`/explore?area=${area.id}`}
                className="bg-white p-4 rounded-lg border border-gray-100 hover:border-orange-200 hover:shadow-sm transition-all text-center group flex flex-col items-center justify-center h-24"
              >
                <span className="font-medium group-hover:text-orange-600 transition-colors">{area.label}</span>
                <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage
