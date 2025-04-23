"use client"

import type React from "react"
import {useEffect, useRef, useState} from "react"
import {useNavigate} from "react-router-dom"
import {File, FileUp, Upload, X} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"
import {Checkbox} from "@/components/ui/checkbox"
import {toast} from "react-toastify"
import materialService from "@/services/materialService"

// Enums que correspondem ao backend
enum TypeMaterial {
  ARTICLE = "ARTICLE",
  THESIS = "THESIS",
  NOTES = "NOTES",
  PRESENTATION = "PRESENTATION",
  EXERCISE = "EXERCISE",
  OTHER = "OTHER",
}

enum Area {
  COMPUTER_SCIENCE = "COMPUTER_SCIENCE",
  ENGINEERING = "ENGINEERING",
  MEDICINE = "MEDICINE",
  BUSINESS = "BUSINESS",
  LAW = "LAW",
  PSYCHOLOGY = "PSYCHOLOGY",
  EDUCATION = "EDUCATION",
  ARTS = "ARTS",
  OTHER = "OTHER",
}

// Interface atualizada para corresponder ao backend
interface MaterialRequestDTO {
  title: string
  description: string
  type: TypeMaterial
  area: Area
  keywords: []
}

const UploadForm: React.FC = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<MaterialRequestDTO>({
    title: "",
    description: "",
    type: TypeMaterial.ARTICLE,
    area: Area.COMPUTER_SCIENCE,
    keywords: []
  })

  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null)
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    setIsUploading(false)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    setFormData((prev) => ({
      ...prev,
      [name]: name === "keywords" ? value.split(",").map((keyword) => keyword.trim()) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.size > 52428800) {
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
      if (!allowedTypes.includes(selectedFile.type)) {
        setError("Tipo de arquivo não suportado. Por favor, envie um PDF, DOC, DOCX, PPT ou PPTX.")
        return
      }

      setFile(selectedFile)
      setUploadedFile({
        name: selectedFile.name,
        size: formatFileSize(selectedFile.size),
      })
      setError("")

      simulateUpload()
    }
  }

  const simulateUpload = () => {
    setUploadProgress(0)
    setIsUploading(true)

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

    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      if (droppedFile.size > 52428800) {
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
      if (!allowedTypes.includes(droppedFile.type)) {
        setError("Tipo de arquivo não suportado. Por favor, envie um PDF, DOC, DOCX, PPT ou PPTX.")
        return
      }

      setFile(droppedFile)
      setUploadedFile({
        name: droppedFile.name,
        size: formatFileSize(droppedFile.size),
      })
      setError("")

      // Simular upload para demonstração
      simulateUpload()
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
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

    if (!file) {
      setError("Selecione um arquivo para upload.")
      return
    }

    if (!acceptTerms) {
      setError("Você precisa aceitar os termos e condições.")
      return
    }

    try {
      const uploadData = new FormData()

      const materialRequestDTO = new Blob([JSON.stringify(formData)], { type: "application/json" })
      uploadData.append("materialRequestDTO", materialRequestDTO)

      uploadData.append("file", file)

      setIsUploading(true)

      const response = await materialService.uploadMaterial(uploadData)
      setIsUploading(false)
      toast.success("Material enviado com sucesso!")
      //navigate(`/material/${response.id}`)
    } catch (err: any) {
      setIsUploading(false)
      const errorMessage = err.response?.data?.message || "Erro ao enviar o material. Tente novamente."
      setError(errorMessage)
      toast.error(errorMessage)
      console.error(err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>}

      <div className="space-y-2">
        <Label htmlFor="upload-area">Arquivo</Label>
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
            <Button
              type="button"
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 mt-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Selecionar Arquivo
            </Button>
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
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-red-500"
              onClick={handleRemoveFile}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remover</span>
            </Button>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
          </div>
          <p className="text-xs text-right mt-1 text-gray-500">
            {isUploading ? `Enviando... ${uploadProgress}%` : "Upload completo"}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
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

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="type">Tipo de Material</Label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value={TypeMaterial.ARTICLE}>Artigo</option>
            <option value={TypeMaterial.THESIS}>TCC</option>
            <option value={TypeMaterial.NOTES}>Resumo</option>
            <option value={TypeMaterial.PRESENTATION}>Apresentação</option>
            <option value={TypeMaterial.EXERCISE}>Lista de Exercícios</option>
            <option value={TypeMaterial.OTHER}>Outros</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="area">Área</Label>
          <select
            id="area"
            name="area"
            value={formData.area}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value={Area.COMPUTER_SCIENCE}>Ciência da Computação</option>
            <option value={Area.ENGINEERING}>Engenharia</option>
            <option value={Area.MEDICINE}>Medicina</option>
            <option value={Area.BUSINESS}>Administração</option>
            <option value={Area.LAW}>Direito</option>
            <option value={Area.PSYCHOLOGY}>Psicologia</option>
            <option value={Area.EDUCATION}>Educação</option>
            <option value={Area.ARTS}>Artes</option>
            <option value={Area.OTHER}>Outra</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
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
        <Label htmlFor="keywords">Palavras-chave</Label>
        <input
          id="keywords"
          name="keywords"
          type="text"
          value={formData.keywords.join(", ")} // Converte array para string
          onChange={handleChange}
          placeholder="Separe as palavras-chave por vírgulas (ex: inteligência artificial, machine learning)"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <p className="text-xs text-gray-500">
          Adicione palavras-chave para ajudar outros estudantes a encontrarem seu material
        </p>
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox id="terms" checked={acceptTerms} onCheckedChange={(checked) => setAcceptTerms(checked === true)} />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
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
        <Button type="submit" disabled={isUploading} className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600">
          {isUploading ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              Enviando...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Enviar Material
            </>
          )}
        </Button>
        <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => navigate("/")}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}

export default UploadForm

