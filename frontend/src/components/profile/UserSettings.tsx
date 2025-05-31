"use client"

import type React from "react"
import { useState } from "react"
import { toast } from "react-toastify"
import { Camera, Save } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import userService from "@/services/userService"
import type { UserProfile } from "@/types/user"

interface UserSettingsProps {
  user: UserProfile
}

const UserSettings: React.FC<UserSettingsProps> = ({ user }) => {
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    institution: user.institution || "",
    location: user.location || "",
    bio: user.bio || "",
    headline: user.headline || "",
    website: user.website || "",
    github: user.socialLinks?.github || "",
    linkedin: user.socialLinks?.linkedin || "",
    twitter: user.socialLinks?.twitter || "",
    interests: user.interests?.join(", ") || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    emailNotifications: user.preferences?.emailNotifications || false,
    publicProfile: user.preferences?.publicProfile || true,
  })

  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [profilePreview, setProfilePreview] = useState<string | null>(user.profilePictureUrl || null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      setProfilePicture(file)

      // Criar preview da imagem
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validar senhas se estiver alterando
      if (formData.newPassword) {
        if (!formData.currentPassword) {
          toast.error("Informe sua senha atual para alterá-la")
          setIsSubmitting(false)
          return
        }

        if (formData.newPassword !== formData.confirmPassword) {
          toast.error("As senhas não coincidem")
          setIsSubmitting(false)
          return
        }
      }

      // Preparar dados para envio
      const userData = {
        name: formData.name,
        institution: formData.institution,
        location: formData.location,
        bio: formData.bio,
        headline: formData.headline,
        website: formData.website,
        socialLinks: {
          github: formData.github,
          linkedin: formData.linkedin,
          twitter: formData.twitter,
        },
        interests: formData.interests
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        preferences: {
          emailNotifications: formData.emailNotifications,
          publicProfile: formData.publicProfile,
        },
      }

      // Criar FormData para envio multipart/form-data se houver imagem
      if (profilePicture) {
        const formDataToSend = new FormData()
        formDataToSend.append("user", JSON.stringify(userData))
        formDataToSend.append("profilePicture", profilePicture)

        await userService.updateUserProfileWithImage(formDataToSend)
      } else {
        await userService.updateUserProfile(userData)
      }

      // Se estiver alterando senha
      if (formData.newPassword && formData.currentPassword) {
        await userService.changePassword({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        })
      }

      toast.success("Perfil atualizado com sucesso!")
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err)
      toast.error("Não foi possível atualizar seu perfil. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-6">Configurações da Conta</h2>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="account">Conta</TabsTrigger>
            <TabsTrigger value="preferences">Preferências</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="profile" className="space-y-6">
              {/* Foto de perfil */}
              <div className="flex flex-col items-center space-y-3">
                <div className="relative">
                  {profilePreview ? (
                    <img
                      src={profilePreview || "/placeholder.svg"}
                      alt="Preview da foto de perfil"
                      className="w-32 h-32 rounded-full object-cover border-2 border-orange-200"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 font-bold text-4xl">
                      {user.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <label
                    htmlFor="profile-picture"
                    className="absolute bottom-0 right-0 bg-orange-500 text-white rounded-full p-2 cursor-pointer hover:bg-orange-600"
                  >
                    <Camera className="h-5 w-5" />
                  </label>
                  <input
                    type="file"
                    id="profile-picture"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-gray-500">Clique no ícone para alterar sua foto de perfil</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium">
                      Nome Completo
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="headline" className="block text-sm font-medium">
                      Título Profissional
                    </label>
                    <input
                      id="headline"
                      name="headline"
                      type="text"
                      value={formData.headline}
                      onChange={handleChange}
                      placeholder="Ex: Estudante de Engenharia, Professor de Física"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="institution" className="block text-sm font-medium">
                      Instituição
                    </label>
                    <input
                      id="institution"
                      name="institution"
                      type="text"
                      value={formData.institution}
                      onChange={handleChange}
                      placeholder="Sua universidade ou instituição"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="location" className="block text-sm font-medium">
                      Localização
                    </label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Cidade, Estado"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="bio" className="block text-sm font-medium">
                    Biografia
                  </label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Conte um pouco sobre você..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="interests" className="block text-sm font-medium">
                    Áreas de Interesse
                  </label>
                  <input
                    id="interests"
                    name="interests"
                    type="text"
                    value={formData.interests}
                    onChange={handleChange}
                    placeholder="Separe por vírgulas: Física, Matemática, Programação"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <p className="text-xs text-gray-500">Separe os interesses por vírgulas</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="account" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50"
                    disabled
                  />
                  <p className="text-xs text-gray-500">O email não pode ser alterado</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="website" className="block text-sm font-medium">
                    Website
                  </label>
                  <input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://seusite.com"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <Separator className="my-4" />

                <h3 className="text-lg font-medium">Redes Sociais</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="github" className="block text-sm font-medium">
                      GitHub
                    </label>
                    <input
                      id="github"
                      name="github"
                      type="url"
                      value={formData.github}
                      onChange={handleChange}
                      placeholder="https://github.com/username"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="linkedin" className="block text-sm font-medium">
                      LinkedIn
                    </label>
                    <input
                      id="linkedin"
                      name="linkedin"
                      type="url"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="twitter" className="block text-sm font-medium">
                      Twitter
                    </label>
                    <input
                      id="twitter"
                      name="twitter"
                      type="url"
                      value={formData.twitter}
                      onChange={handleChange}
                      placeholder="https://twitter.com/username"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                <h3 className="text-lg font-medium">Alterar Senha</h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="currentPassword" className="block text-sm font-medium">
                      Senha Atual
                    </label>
                    <input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="newPassword" className="block text-sm font-medium">
                      Nova Senha
                    </label>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium">
                      Confirmar Nova Senha
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Notificações por Email</Label>
                    <p className="text-sm text-gray-500">
                      Receba notificações sobre comentários, curtidas e novos seguidores
                    </p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={formData.emailNotifications}
                    onCheckedChange={(checked) => handleSwitchChange("emailNotifications", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="publicProfile">Perfil Público</Label>
                    <p className="text-sm text-gray-500">Permitir que outros usuários vejam seu perfil e uploads</p>
                  </div>
                  <Switch
                    id="publicProfile"
                    checked={formData.publicProfile}
                    onCheckedChange={(checked) => handleSwitchChange("publicProfile", checked)}
                  />
                </div>
              </div>
            </TabsContent>

            <div className="flex justify-end space-x-4 mt-6">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Salvando...
                  </div>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default UserSettings
