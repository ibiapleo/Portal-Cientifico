"use client"

import type React from "react"
import { useState } from "react"
import { Edit, MapPin, Calendar, Briefcase, ExternalLink, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "react-toastify"
import userService from "@/services/userService"
import type { UserProfile } from "@/types/user"

interface ProfileHeaderProps {
  user: UserProfile
  isOwnProfile: boolean
  onProfileUpdate?: () => void
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, isOwnProfile, onProfileUpdate }) => {
  const [editCoverOpen, setEditCoverOpen] = useState(false)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith("image/")) {
        toast.error("Por favor, selecione uma imagem válida")
        return
      }

      // Validar tamanho do arquivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("A imagem deve ter no máximo 5MB")
        return
      }

      setCoverFile(file)

      // Criar preview da imagem
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCoverUpload = async () => {
    if (!coverFile) return

    try {
      setIsSubmitting(true)

      // Criar FormData para envio multipart/form-data
      const formData = new FormData()
      formData.append("coverImage", coverFile)

      // Enviar para o servidor
      try {
        await userService.updateCoverImage(formData)
        toast.success("Imagem de capa atualizada com sucesso!")

        // Atualizar a página ou recarregar os dados do usuário
        if (onProfileUpdate) {
          onProfileUpdate()
        }

        // Fechar o modal
        setEditCoverOpen(false)
        setCoverFile(null)
        setCoverPreview(null)
      } catch (error) {
        console.error("Erro ao atualizar imagem de capa:", error)
        toast.error("Não foi possível atualizar a imagem de capa")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Card className="overflow-hidden">
        {/* Banner de capa */}
        <div
          className="h-48 bg-gradient-to-r from-orange-400 to-orange-600 relative"
          style={{
            backgroundImage:
              coverPreview || user.coverImageUrl ? `url(${coverPreview || user.coverImageUrl})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {isOwnProfile && (
            <Button
              size="sm"
              variant="outline"
              className="absolute top-4 right-4 bg-white/80 hover:bg-white"
              onClick={() => setEditCoverOpen(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar capa
            </Button>
          )}
        </div>

        <CardContent className="p-6 relative">
          {/* Foto de perfil */}
          <div className="absolute -top-16 left-6 border-4 border-white rounded-full bg-white">
            {user.profilePictureUrl ? (
              <img
                src={user.profilePictureUrl || "/placeholder.svg"}
                alt={`${user.name} profile`}
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-4xl">
                {user.name?.charAt(0) || "U"}
              </div>
            )}
          </div>

          {/* Informações do perfil */}
          <div className="mt-16 md:mt-0 md:ml-36 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                {user.verified && <Badge className="bg-blue-500">Verificado</Badge>}
                {user.role && <Badge variant="outline">{user.role}</Badge>}
              </div>

              <p className="text-gray-500 mt-1">{user.headline || "Estudante"}</p>

              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-gray-500">
                {user.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{user.location}</span>
                  </div>
                )}

                {user.institution && (
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    <span>{user.institution}</span>
                  </div>
                )}

                {user.joinDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Membro desde{" "}
                      {new Date(user.joinDate).toLocaleDateString("pt-BR", { year: "numeric", month: "long" })}
                    </span>
                  </div>
                )}

                {user.website && (
                  <div className="flex items-center gap-1">
                    <ExternalLink className="h-4 w-4" />
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:underline"
                    >
                      {user.website.replace(/^https?:\/\/(www\.)?/, "")}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal para editar imagem de capa */}
      <Dialog open={editCoverOpen} onOpenChange={setEditCoverOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar imagem de capa</DialogTitle>
            <DialogDescription>Escolha uma nova imagem para sua capa de perfil</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {coverPreview ? (
              <div className="relative">
                <img
                  src={coverPreview || "/placeholder.svg"}
                  alt="Preview da capa"
                  className="w-full h-40 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCoverFile(null)
                    setCoverPreview(null)
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  aria-label="Remover imagem"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-2">Arraste e solte uma imagem ou clique para selecionar</p>
                <p className="text-xs text-gray-400">PNG, JPG ou GIF (máx. 5MB)</p>
              </div>
            )}

            <input type="file" id="cover-image" accept="image/*" onChange={handleCoverFileChange} className="hidden" />

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => document.getElementById("cover-image")?.click()}
            >
              Selecionar imagem
            </Button>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditCoverOpen(false)
                setCoverFile(null)
                setCoverPreview(null)
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCoverUpload}
              disabled={!coverFile || isSubmitting}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </div>
              ) : (
                "Salvar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ProfileHeader
