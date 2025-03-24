import type React from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Upload, FileUp, File, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const UploadPage: React.FC = () => {
  return (
    <div className="container mx-auto max-w-4xl py-10 px-4">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-700">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Voltar para a página inicial
        </Link>
      </div>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Enviar Material de Estudo</CardTitle>
          <CardDescription>
            Compartilhe seu conhecimento com outros estudantes. Preencha os detalhes abaixo para enviar seu material.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="upload-area">Arquivo</Label>
            <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-orange-50 transition-colors">
              <div className="flex flex-col items-center gap-2">
                <FileUp className="h-10 w-10 text-orange-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Clique para selecionar ou arraste seu arquivo aqui</p>
                  <p className="text-xs text-gray-500">Suporta PDF, DOC, DOCX, PPT, PPTX até 50MB</p>
                </div>
                <Input id="upload-area" type="file" className="hidden" />
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600 mt-2">
                  <Upload className="mr-2 h-4 w-4" />
                  Selecionar Arquivo
                </Button>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-orange-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <File className="h-5 w-5 text-orange-600" />
                <span className="font-medium">TCC_Final_2025.pdf</span>
                <span className="text-xs text-gray-500">(2.4 MB)</span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-500">
                <X className="h-4 w-4" />
                <span className="sr-only">Remover</span>
              </Button>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
              <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: "100%" }}></div>
            </div>
            <p className="text-xs text-right mt-1 text-gray-500">Upload completo</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" placeholder="Digite o título do seu material" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Autor</Label>
              <Input id="author" placeholder="Seu nome ou dos autores" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Material</Label>
              <Select>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="article">Artigo</SelectItem>
                  <SelectItem value="thesis">TCC</SelectItem>
                  <SelectItem value="notes">Resumo</SelectItem>
                  <SelectItem value="presentation">Apresentação</SelectItem>
                  <SelectItem value="exercise">Lista de Exercícios</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Disciplina/Área</Label>
              <Select>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Selecione a área" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cs">Ciência da Computação</SelectItem>
                  <SelectItem value="engineering">Engenharia</SelectItem>
                  <SelectItem value="medicine">Medicina</SelectItem>
                  <SelectItem value="business">Administração</SelectItem>
                  <SelectItem value="law">Direito</SelectItem>
                  <SelectItem value="psychology">Psicologia</SelectItem>
                  <SelectItem value="education">Educação</SelectItem>
                  <SelectItem value="arts">Artes</SelectItem>
                  <SelectItem value="other">Outra</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva brevemente o conteúdo do seu material"
              className="min-h-[120px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Palavras-chave</Label>
            <Input
              id="keywords"
              placeholder="Separe as palavras-chave por vírgulas (ex: inteligência artificial, machine learning)"
            />
            <p className="text-xs text-gray-500">
              Adicione palavras-chave para ajudar outros estudantes a encontrarem seu material
            </p>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox id="terms" />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Aceito os termos e condições
              </label>
              <p className="text-xs text-gray-500">
                Confirmo que tenho os direitos necessários para compartilhar este material e concordo com os{" "}
                <Link to="#" className="text-orange-600 hover:underline">
                  termos de uso
                </Link>{" "}
                da plataforma.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4">
          <Button className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600">
            <Upload className="mr-2 h-4 w-4" />
            Enviar Material
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            Cancelar
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default UploadPage

