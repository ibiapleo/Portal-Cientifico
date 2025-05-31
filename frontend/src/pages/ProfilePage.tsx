"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

import ProfileSidebar from "@/components/profile/ProfileSidebar"
import ProfileHeader from "@/components/profile/ProfileHeader"
import UserUploads from "@/components/profile/UserUploads"
import UserSaved from "@/components/profile/UserSaved"
import UserSettings from "@/components/profile/UserSettings"
import UserFollowers from "@/components/profile/UserFollowers"
import UserStats from "@/components/profile/UserStats"
import UserAbout from "@/components/profile/UserAbout"

import useAuth from "../hooks/useAuth"
import userService from "../services/userService"
import { getMockUserProfile } from "../utils/mock-data"
import type { UserProfile } from "../types/user"

const ProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const { userId } = useParams<{ userId: string }>()
  const { user, isAuthenticated } = useAuth()

  const [profileUser, setProfileUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("uploads")

  const isOwnProfile = !userId || (user && userId === user.id)

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        if (isOwnProfile) {
          if (!isAuthenticated) {
            navigate("/login", { state: { from: "/profile" } })
            return
          }

          try {
            const profileData = await userService.getCurrentUserProfile()
            setProfileUser(profileData)
          } catch (error) {
            console.error("Erro ao buscar perfil do usuário:", error)
            setProfileUser(getMockUserProfile(true))
          }
        } else {
          try {
            const profileData = await userService.getUserProfile(userId!)
            setProfileUser(profileData)
          } catch (error) {
            console.error("Erro ao buscar perfil de outro usuário:", error)
            setProfileUser(getMockUserProfile(false, userId))
          }
        }
      } catch (err) {
        console.error("Erro ao buscar dados do perfil:", err)
        setError("Não foi possível carregar os dados do perfil. Tente novamente mais tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfileData()
  }, [userId, isAuthenticated, navigate, isOwnProfile, user])

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (error || !profileUser) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 text-red-600 mb-4">
            <AlertCircle className="h-5 w-5" />
            <h1 className="text-xl font-bold">Erro ao carregar perfil</h1>
          </div>
          <p className="text-gray-500 mb-4">{error || "Não foi possível encontrar o perfil solicitado."}</p>
          <Button asChild>
            <Link to="/">Voltar para a página inicial</Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      {/* Cabeçalho do perfil - visível para todos */}
      <ProfileHeader user={profileUser} isOwnProfile={isOwnProfile} />

      <div className="grid gap-6 lg:grid-cols-4 mt-6">
        {/* Sidebar com informações do usuário */}
        <div className="lg:col-span-1">
          <ProfileSidebar
            user={profileUser}
            isOwnProfile={isOwnProfile}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* Conteúdo principal */}
        <div className="lg:col-span-3">
          {isOwnProfile ? (
            // Tabs para o próprio perfil
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="uploads">Meus Uploads</TabsTrigger>
                <TabsTrigger value="saved">Salvos</TabsTrigger>
                <TabsTrigger value="settings">Configurações</TabsTrigger>
              </TabsList>

              <TabsContent value="uploads" className="mt-6">
                <UserUploads userId={profileUser.id} isOwnProfile={true} />
              </TabsContent>

              <TabsContent value="saved" className="mt-6">
                <UserSaved />
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <UserSettings user={profileUser} />
              </TabsContent>
            </Tabs>
          ) : (
            // Tabs para perfil de outro usuário
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="uploads">Uploads</TabsTrigger>
                <TabsTrigger value="about">Sobre</TabsTrigger>
                <TabsTrigger value="followers">Seguidores</TabsTrigger>
              </TabsList>

              <TabsContent value="uploads" className="mt-6">
                <UserUploads userId={profileUser.id} isOwnProfile={false} />
              </TabsContent>

              <TabsContent value="about" className="mt-6">
                <UserAbout user={profileUser} />
              </TabsContent>

              <TabsContent value="followers" className="mt-6">
                <UserFollowers userId={profileUser.id} />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>

      {/* Estatísticas do usuário - visível para todos */}
      <div className="mt-8">
        <UserStats user={profileUser} />
      </div>
    </div>
  )
}

export default ProfilePage
