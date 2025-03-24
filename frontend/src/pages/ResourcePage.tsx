"use client"

import type React from "react"
import { useParams, Link } from "react-router-dom"
import {
  ArrowLeft,
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

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"

// Dados estáticos para recursos
const staticResources = {
  "1": {
    id: "1",
    title: "Fundamentos de Aprendizado de Máquina",
    type: "Resumo",
    subject: "Ciência da Computação",
    author: "Maria Silva",
    date: "15 Mar 2025",
    downloads: 128,
    views: 342,
    likes: 47,
    comments: 8,
    description:
      "Este material apresenta os conceitos fundamentais de aprendizado de máquina, incluindo algoritmos supervisionados e não supervisionados, técnicas de validação cruzada, e implementações práticas usando Python e bibliotecas como scikit-learn e TensorFlow. Ideal para estudantes de graduação em Ciência da Computação, Engenharia ou áreas correlatas que desejam iniciar seus estudos em IA.",
    institution: "Universidade Federal de São Paulo",
    pages: 45,
    fileSize: "2.4 MB",
    fileType: "PDF",
    keywords: ["machine learning", "inteligência artificial", "algoritmos", "python", "data science"],
  },
  "2": {
    id: "2",
    title: "Arquitetura Sustentável: TCC de Planejamento Urbano",
    type: "TCC",
    subject: "Arquitetura",
    author: "João Santos",
    date: "10 Mar 2025",
    downloads: 85,
    views: 210,
    likes: 23,
    comments: 5,
    description:
      "Este TCC explora abordagens inovadoras para o planejamento urbano sustentável, com foco em edificações de baixo impacto ambiental e integração com espaços verdes. O trabalho inclui estudos de caso de cidades brasileiras e internacionais, análises comparativas de diferentes metodologias de construção sustentável, e propostas de implementação para centros urbanos em desenvolvimento.",
    institution: "Universidade de São Paulo",
    pages: 120,
    fileSize: "8.7 MB",
    fileType: "PDF",
    keywords: ["arquitetura sustentável", "planejamento urbano", "construção verde", "sustentabilidade", "urbanismo"],
  },
}

const ResourcePage: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  if (!id || !staticResources[id as keyof typeof staticResources]) {
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
            <h1 className="text-2xl font-bold mb-4">Recurso não encontrado</h1>
            <p className="text-gray-500 mb-4">O recurso que você está procurando não existe ou foi removido.</p>
            <Button asChild>
              <Link to="/">Voltar para a página inicial</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const resource = staticResources[id as keyof typeof staticResources]

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
                      {resource.type}
                    </Badge>
                    <Badge variant="outline">{resource.subject}</Badge>
                  </div>
                  <h1 className="text-2xl font-bold">{resource.title}</h1>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User className="h-4 w-4" />
                    <span>{resource.author}</span>
                    <span className="mx-1">•</span>
                    <Calendar className="h-4 w-4" />
                    <span>{resource.date}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <Download className="mr-2 h-4 w-4" />
                    Baixar
                  </Button>
                  <Button variant="outline">
                    <Bookmark className="mr-2 h-4 w-4" />
                    Salvar
                  </Button>
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
                  <ThumbsUp className="h-4 w-4" />
                  <span>{resource.likes} curtidas</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{resource.comments} comentários</span>
                </div>
              </div>

              <Separator className="my-6" />

              <Tabs defaultValue="about">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="about">Sobre</TabsTrigger>
                  <TabsTrigger value="preview">Visualização</TabsTrigger>
                  <TabsTrigger value="comments">Comentários</TabsTrigger>
                </TabsList>
                <TabsContent value="about" className="space-y-6 pt-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Descrição</h3>
                    <p className="text-gray-700">{resource.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Palavras-chave</h3>
                    <div className="flex flex-wrap gap-2">
                      {resource.keywords.map((keyword, index) => (
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
                          <span>{resource.fileType}</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-500">Páginas:</span>
                          <span>{resource.pages}</span>
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
                      <p className="text-gray-700">{resource.institution}</p>
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
                    <Button className="mt-6 bg-orange-500 hover:bg-orange-600">
                      <Download className="mr-2 h-4 w-4" />
                      Baixar Documento Completo
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="comments" className="space-y-6 pt-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Comentários ({resource.comments})</h3>

                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <Avatar>
                          <AvatarFallback>RP</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium">Rafael Pereira</span>
                              <span className="text-gray-500 text-sm ml-2">• 2 dias atrás</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <ThumbsUp className="h-3 w-3" />
                              <span>5</span>
                            </div>
                          </div>
                          <p className="text-gray-700">
                            Material excelente! Muito bem estruturado e com explicações claras. Ajudou bastante nos meus
                            estudos.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Avatar>
                          <AvatarFallback>LC</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium">Luiza Costa</span>
                              <span className="text-gray-500 text-sm ml-2">• 5 dias atrás</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <ThumbsUp className="h-3 w-3" />
                              <span>3</span>
                            </div>
                          </div>
                          <p className="text-gray-700">
                            Gostei muito do conteúdo, mas senti falta de alguns exemplos práticos. De qualquer forma, é
                            um ótimo material de referência.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <h4 className="text-sm font-medium mb-2">Adicionar um comentário</h4>
                      <div className="space-y-4">
                        <Textarea placeholder="Escreva seu comentário aqui..." className="min-h-[100px]" />
                        <Button className="bg-orange-500 hover:bg-orange-600">Publicar Comentário</Button>
                      </div>
                    </div>
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
                    {resource.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{resource.author}</h4>
                  <p className="text-sm text-gray-500">{resource.institution}</p>
                  <Button variant="link" className="text-orange-600 p-0 h-auto text-sm">
                    Ver perfil
                  </Button>
                </div>
              </div>
              <Separator />
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
              <Button variant="outline" className="w-full">
                Seguir Autor
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
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
              <Button variant="link" className="text-orange-600 p-0 h-auto text-sm w-fit">
                Ver mais recursos relacionados
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-medium">Avaliações</h3>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold">4.7</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs w-8">5 ★</span>
                    <Progress value={75} className="h-2" />
                    <span className="text-xs">75%</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs w-8">4 ★</span>
                    <Progress value={20} className="h-2" />
                    <span className="text-xs">20%</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs w-8">3 ★</span>
                    <Progress value={5} className="h-2" />
                    <span className="text-xs">5%</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs w-8">2 ★</span>
                    <Progress value={0} className="h-2" />
                    <span className="text-xs">0%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs w-8">1 ★</span>
                    <Progress value={0} className="h-2" />
                    <span className="text-xs">0%</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Avaliar este recurso
              </Button>
            </CardContent>
          </Card>

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
    </div>
  )
}

export default ResourcePage

