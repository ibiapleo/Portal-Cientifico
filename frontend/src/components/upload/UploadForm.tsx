"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Upload, FileUp, File, X } from "lucide-react"
import resourceService from "../../services/resourceService"
import type { UploadFormData } from "../../types/resource"

const UploadForm: React.FC = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<UploadFormData>({
    title: "",
    type: "",
    subject: "",
    description: "",
    keywords: "",
    file: null,
  })

  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null)
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Verificar tamanho do arquivo (50MB = 52428800 bytes)
      if (file.size > 52428800) {
        setError("O arquivo excede o tamanho máximo de 50MB.")
        return
      }

      // Verificar tipo de arquivo
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ]
      if (!allowedTypes.includes(file.type)) {
        setError("Tipo de arquivo não suportado. Por favor, envie um PDF, DOC, DOCX, PPT ou PPTX.")
        return
      }

      setFormData((prev) => ({ ...prev, file }))
      setUploadedFile({
        name: file.name,
        size: formatFileSize(file.size),
      })
      setError("")

      // Simular upload para demonstração
      simulateUpload()
    }
  }

  const simulateUpload = () => {
    setUploadProgress(0)
    setIsUploading(false)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / 1048576).toFixed(1) + " MB"
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const file = e.dataTransfer.files?.[0]
    if (file) {
      // Verificações de arquivo
      if (file.size > 52428800) {
        setError("O arquivo excede o tamanho máximo de 50MB.")
        return
      }

      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ]
      if (!allowedTypes.includes(file.type)) {
        setError("Tipo de arquivo não suportado. Por favor, envie um PDF, DOC, DOCX, PPT ou PPTX.")
        return
      }

      setFormData((prev) => ({ ...prev, file }))
      setUploadedFile({
        name: file.name,
        size: formatFileSize(file.size),
      })
      setError("")

      // Simular upload para demonstração
      simulateUpload()
    }
  }

  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, file: null }))
    setUploadedFile(null)
    setUploadProgress(0)
    setIsUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validações
    if (!formData.title.trim()) {
      setError("O título é obrigatório.")
      return
    }

    if (!formData.type) {
      setError("Selecione o tipo de material.")
      return
    }

    if (!formData.subject) {
      setError("Selecione a disciplina/área.")
      return
    }

    if (!formData.file) {
      setError("Selecione um arquivo para upload.")
      return
    }

    if (!acceptTerms) {
      setError("Você precisa aceitar os termos e condições.")
      return
    }

    try {
      // Criar o objeto MaterialRequestDTO
      const materialRequestDTO = {
        title: formData.title,
        description: formData.description || "",
        type: formData.type.toUpperCase(), // Convertendo para enum TypeMaterial
        area: formData.subject.toUpperCase(), // Convertendo para enum Area
        keywords: formData.keywords ? formData.keywords.split(",").map((k) => k.trim()) : [],
      }

      // Criar FormData para envio multipart
      const uploadData = new FormData()

      // Adicionar o MaterialRequestDTO como parte JSON
      uploadData.append(
        "materialRequestDTO",
        new Blob([JSON.stringify(materialRequestDTO)], { type: "application/json" }),
      )

      // Adicionar o arquivo como parte separada
      if (formData.file) {
        uploadData.append("file", formData.file)
      }

      setIsUploading(true)
      const response = await resourceService.uploadResource(uploadData)
      setIsUploading(false)

      navigate(`/resource/${response.id}`)
    } catch (err: any) {
      setIsUploading(false)
      setError(err.response?.data?.message || "Erro ao enviar o material. Tente novamente.")
      console.error(err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>}

      <div className="space-y-2">
        <label htmlFor="upload-area" className="block text-sm font-medium">
          Arquivo
        </label>
        <div
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-orange-50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-2">
            <FileUp className="h-10 w-10 text-orange-500" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Clique para selecionar ou arraste seu arquivo aqui</p>
              <p className="text-xs text-gray-500">Suporta PDF, DOC, DOCX, PPT, PPTX até 50MB</p>
            </div>
            <input
              ref={fileInputRef}
              id="upload-area"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.ppt,.pptx"
            />
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 h-9 px-4 py-2 mt-2"
            >
              <Upload className="mr-2 h-4 w-4" />
              Selecionar Arquivo
            </button>
          </div>
        </div>
      </div>

      {uploadedFile && (
        <div className="border rounded-lg p-4 bg-orange-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <File className="h-5 w-5 text-orange-600" />
              <span className="font-medium">{uploadedFile.name}</span>
              <span className="text-xs text-gray-500">({uploadedFile.size})</span>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="inline-flex items-center justify-center rounded-md text-gray-500 hover:text-red-500 h-8 w-8"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remover</span>
            </button>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
          </div>
          <p className="text-xs text-right mt-1 text-gray-500">
            {isUploading ? `Enviando... ${uploadProgress}%` : "Upload completo"}
          </p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium">
            Título
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Digite o título do seu material"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="author" className="block text-sm font-medium">
            Autor
          </label>
          <input
            id="author"
            name="author"
            type="text"
            placeholder="Seu nome ou dos autores"
            disabled
            value="Preenchido automaticamente"
            className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-500"
          />
          <p className="text-xs text-gray-500">Será usado seu nome de usuário</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="type" className="block text-sm font-medium">
            Tipo de Material
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="" disabled>
              Selecione o tipo
            </option>
            <option value="ARTICLE">Artigo</option>
            <option value="IMAGE">Imagem</option>
            <option value="TCC">TCC</option>
            <option value="NOTES">Resumo</option>
            <option value="PRESENTATION">Apresentação</option>
            <option value="EXERCISE">Lista de Exercícios</option>
            <option value="OTHER">Outro</option>
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="subject" className="block text-sm font-medium">
            Disciplina/Área
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="" disabled>
              Selecione a área
            </option>
            <option value="COMPUTER_SCIENCE">Ciência da Computação</option>
            <option value="ENGINEERING">Engenharia</option>
            <option value="MEDICINE">Medicina</option>
            <option value="BUSINESS">Administração</option>
            <option value="LAW">Direito</option>
            <option value="PSYCHOLOGY">Psicologia</option>
            <option value="EDUCATION">Educação</option>
            <option value="ARTS">Artes</option>
            <option value="OTHER">Outra</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium">
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descreva brevemente o conteúdo do seu material"
          className="w-full px-3 py-2 border rounded-lg min-h-[120px] focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="keywords" className="block text-sm font-medium">
          Palavras-chave
        </label>
        <input
          id="keywords"
          name="keywords"
          type="text"
          value={formData.keywords}
          onChange={handleChange}
          placeholder="Separe as palavras-chave por vírgulas (ex: inteligência artificial, machine learning)"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <p className="text-xs text-gray-500">
          Adicione palavras-chave para ajudar outros estudantes a encontrarem seu material
        </p>
      </div>

      <div className="flex items-start space-x-2">
        <input
          id="terms"
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          className="mt-1 rounded text-orange-500 focus:ring-orange-500"
        />
        <div className="grid gap-1.5 leading-none">
          <label htmlFor="terms" className="text-sm font-medium leading-none">
            Aceito os termos e condições
          </label>
          <p className="text-xs text-gray-500">
            Confirmo que tenho os direitos necessários para compartilhar este material e concordo com os{" "}
            <a href="#" className="text-orange-600 hover:underline">
              termos de uso
            </a>{" "}
            da plataforma.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 h-10 px-4 py-2 w-full sm:w-auto"
        >
          <Upload className="mr-2 h-4 w-4" />
          Enviar Material
        </button>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 h-10 px-4 py-2 w-full sm:w-auto"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default UploadForm
