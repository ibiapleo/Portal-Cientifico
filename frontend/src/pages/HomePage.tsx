"use client"

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Search, Upload, BookOpen, FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import useAuth from "../hooks/useAuth"

// Dados estáticos para recursos
const staticResources = [
  {
    id: "1",
    title: "Fundamentos de Aprendizado de Máquina",
    type: "Resumo",
    subject: "Ciência da Computação",
    author: "Maria Silva",
    date: "15 Mar 2025",
    downloads: 128,
    icon: <BookOpen className="h-8 w-8 text-orange-500" />,
  },
  {
    id: "2",
    title: "Arquitetura Sustentável: TCC de Planejamento Urbano",
    type: "TCC",
    subject: "Arquitetura",
    author: "João Santos",
    date: "10 Mar 2025",
    downloads: 85,
    icon: <FileText className="h-8 w-8 text-orange-500" />,
  },
  {
    id: "3",
    title: "Avanços em Tecnologias de Energia Renovável",
    type: "Artigo",
    subject: "Engenharia",
    author: "Ana Costa",
    date: "8 Mar 2025",
    downloads: 210,
    icon: <FileText className="h-8 w-8 text-orange-500" />,
  },
  {
    id: "4",
    title: "Anotações de Laboratório de Química Orgânica",
    type: "Resumo",
    subject: "Química",
    author: "Pedro Oliveira",
    date: "5 Mar 2025",
    downloads: 156,
    icon: <BookOpen className="h-8 w-8 text-orange-500" />,
  },
  {
    id: "5",
    title: "Impacto Econômico das Moedas Digitais",
    type: "Artigo",
    subject: "Economia",
    author: "Carla Mendes",
    date: "3 Mar 2025",
    downloads: 92,
    icon: <FileText className="h-8 w-8 text-orange-500" />,
  },
  {
    id: "6",
    title: "Técnicas de Terapia Cognitivo-Comportamental",
    type: "Resumo",
    subject: "Psicologia",
    author: "Rafael Almeida",
    date: "28 Fev 2025",
    downloads: 178,
    icon: <BookOpen className="h-8 w-8 text-orange-500" />,
  },
  {
    id: "7",
    title: "Inteligência Artificial na Saúde",
    type: "TCC",
    subject: "Informática em Saúde",
    author: "Sofia Martins",
    date: "25 Fev 2025",
    downloads: 143,
    icon: <FileText className="h-8 w-8 text-orange-500" />,
  },
  {
    id: "8",
    title: "Estudos de Caso em Direito Empresarial Internacional",
    type: "Resumo",
    subject: "Direito",
    author: "Lucas Ferreira",
    date: "20 Fev 2025",
    downloads: 104,
    icon: <BookOpen className="h-8 w-8 text-orange-500" />,
  },
]

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedType, setSelectedType] = useState<string>("")
  const [resources] = useState(staticResources)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implementação futura: filtrar recursos com base no termo de pesquisa
    console.log("Pesquisando por:", searchTerm)
  }

  const handleTypeFilter = (type: string) => {
    setSelectedType(type === selectedType ? "" : type)
    // Implementação futura: filtrar recursos com base no tipo
    console.log("Filtrando por tipo:", type)
  }

  return (
    <>
      <section className="py-12 md:py-20 bg-gradient-to-b from-orange-50 to-white w-full">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Compartilhe Conhecimento, Potencialize o Aprendizado
                </h1>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Envie e descubra materiais de estudo, TCCs e artigos compartilhados por estudantes para estudantes.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button className="bg-orange-500 hover:bg-orange-600" asChild>
                  <Link to="/upload">
                    <Upload className="mr-2 h-4 w-4" />
                    Enviar Material
                  </Link>
                </Button>
                <Button variant="outline">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Explorar Recursos
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -left-4 -top-4 h-72 w-72 rounded-full bg-orange-100 blur-3xl opacity-70" />
                <div className="relative rounded-xl border bg-background p-6 shadow-sm">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">Encontre Materiais de Estudo</h3>
                      <p className="text-sm text-gray-500">
                        Pesquise por tópicos específicos, cursos ou tipos de documento
                      </p>
                    </div>
                    <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
                      <Input
                        type="search"
                        placeholder="Pesquisar recursos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <Button type="submit" size="icon" className="bg-orange-500 hover:bg-orange-600">
                        <Search className="h-4 w-4" />
                        <span className="sr-only">Pesquisar</span>
                      </Button>
                    </form>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className={`rounded-full ${selectedType === "cs" ? "bg-orange-50 text-orange-700 border-orange-200" : ""}`}
                        onClick={() => handleTypeFilter("cs")}
                      >
                        Ciência da Computação
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`rounded-full ${selectedType === "engineering" ? "bg-orange-50 text-orange-700 border-orange-200" : ""}`}
                        onClick={() => handleTypeFilter("engineering")}
                      >
                        Engenharia
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`rounded-full ${selectedType === "medicine" ? "bg-orange-50 text-orange-700 border-orange-200" : ""}`}
                        onClick={() => handleTypeFilter("medicine")}
                      >
                        Medicina
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`rounded-full ${selectedType === "business" ? "bg-orange-50 text-orange-700 border-orange-200" : ""}`}
                        onClick={() => handleTypeFilter("business")}
                      >
                        Administração
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 w-full">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Uploads Recentes</h2>
              <p className="text-gray-500">
                Descubra os materiais de estudo mais recentes compartilhados por estudantes
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className={!selectedType ? "bg-orange-50 text-orange-700" : ""}
                onClick={() => setSelectedType("")}
              >
                Todos
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={selectedType === "Artigo" ? "bg-orange-50 text-orange-700" : ""}
                onClick={() => handleTypeFilter("Artigo")}
              >
                Artigos
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={selectedType === "TCC" ? "bg-orange-50 text-orange-700" : ""}
                onClick={() => handleTypeFilter("TCC")}
              >
                TCCs
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={selectedType === "Resumo" ? "bg-orange-50 text-orange-700" : ""}
                onClick={() => handleTypeFilter("Resumo")}
              >
                Resumos
              </Button>
            </div>
          </div>

          <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {resources.map((resource) => (
              <Card key={resource.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="p-4 pb-0 flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 hover:bg-orange-100">
                      {resource.type}
                    </Badge>
                    <Badge variant="outline">{resource.subject}</Badge>
                  </div>
                  <div className="rounded-full bg-orange-50 p-2">{resource.icon}</div>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="font-medium line-clamp-2 min-h-[48px]">{resource.title}</h3>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span>Por {resource.author}</span>
                    <span className="mx-2">•</span>
                    <span>{resource.date}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Download className="mr-1 h-4 w-4" />
                    <span>{resource.downloads}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                    asChild
                  >
                    <Link to={`/resource/${resource.id}`}>Ver Detalhes</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
              Carregar Mais Recursos
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 bg-orange-50 w-full">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Como Funciona</h2>
              <div className="grid gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                    1
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Crie uma Conta</h3>
                    <p className="text-sm text-gray-500">
                      Cadastre-se gratuitamente e junte-se à nossa comunidade acadêmica
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                    2
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Envie Seus Materiais</h3>
                    <p className="text-sm text-gray-500">
                      Compartilhe seus resumos, TCCs ou artigos com a categorização adequada
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                    3
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Explore e Baixe</h3>
                    <p className="text-sm text-gray-500">
                      Encontre recursos que correspondam aos seus interesses e baixe-os para seus estudos
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                    4
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Interaja e Colabore</h3>
                    <p className="text-sm text-gray-500">
                      Comente nos recursos, conecte-se com colegas e colabore em projetos
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-4">
              <div className="rounded-xl border bg-background p-6 shadow-sm">
                <h3 className="text-xl font-bold">Junte-se à Nossa Comunidade</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Conecte-se com milhares de estudantes compartilhando conhecimento em diversas disciplinas
                </p>
                <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                  <div className="rounded-lg bg-orange-50 p-4">
                    <div className="text-2xl font-bold text-orange-600">10K+</div>
                    <div className="text-xs text-gray-500">Estudantes</div>
                  </div>
                  <div className="rounded-lg bg-orange-50 p-4">
                    <div className="text-2xl font-bold text-orange-600">25K+</div>
                    <div className="text-xs text-gray-500">Recursos</div>
                  </div>
                  <div className="rounded-lg bg-orange-50 p-4">
                    <div className="text-2xl font-bold text-orange-600">500+</div>
                    <div className="text-xs text-gray-500">Universidades</div>
                  </div>
                  <div className="rounded-lg bg-orange-50 p-4">
                    <div className="text-2xl font-bold text-orange-600">50+</div>
                    <div className="text-xs text-gray-500">Disciplinas</div>
                  </div>
                </div>
                <Button className="mt-6 w-full bg-orange-500 hover:bg-orange-600" asChild>
                  <Link to={isAuthenticated ? "/upload" : "/cadastro"}>Junte-se Agora</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage

