"use client"

import type React from "react"
import { Link } from "react-router-dom"
import { FileText, Bookmark, Settings, LogOut, User, Users, Mail, Github, Linkedin, Twitter } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import useAuth from "@/hooks/useAuth"
import type { UserProfile } from "@/types/user"

interface ProfileSidebarProps {
  user: UserProfile
  isOwnProfile: boolean
  activeTab: string
  onTabChange: (tab: string) => void
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ user, isOwnProfile, activeTab, onTabChange }) => {
  const { logout } = useAuth()

  return (
    <Card>
      <CardContent className="p-6">
        {/* Bio */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Sobre</h3>
          <p className="text-sm">{user.bio || "Nenhuma biografia adicionada."}</p>
        </div>

        <Separator className="my-4" />

        {/* Navegação */}
        <div className="space-y-1">
          {isOwnProfile ? (
            // Navegação para o próprio perfil
            <>
              <button
                onClick={() => onTabChange("uploads")}
                className={`w-full flex items-center p-2 rounded-md text-sm ${
                  activeTab === "uploads" ? "bg-orange-50 text-orange-600" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FileText className="h-4 w-4 mr-2" />
                Meus Uploads
              </button>
              <button
                onClick={() => onTabChange("saved")}
                className={`w-full flex items-center p-2 rounded-md text-sm ${
                  activeTab === "saved" ? "bg-orange-50 text-orange-600" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Bookmark className="h-4 w-4 mr-2" />
                Salvos
              </button>
              <button
                onClick={() => onTabChange("settings")}
                className={`w-full flex items-center p-2 rounded-md text-sm ${
                  activeTab === "settings" ? "bg-orange-50 text-orange-600" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </button>
              <button
                onClick={logout}
                className="w-full flex items-center p-2 rounded-md text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </button>
            </>
          ) : (
            // Navegação para perfil de outro usuário
            <>
              <button
                onClick={() => onTabChange("uploads")}
                className={`w-full flex items-center p-2 rounded-md text-sm ${
                  activeTab === "uploads" ? "bg-orange-50 text-orange-600" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FileText className="h-4 w-4 mr-2" />
                Uploads
              </button>
              <button
                onClick={() => onTabChange("about")}
                className={`w-full flex items-center p-2 rounded-md text-sm ${
                  activeTab === "about" ? "bg-orange-50 text-orange-600" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <User className="h-4 w-4 mr-2" />
                Sobre
              </button>
              <button
                onClick={() => onTabChange("followers")}
                className={`w-full flex items-center p-2 rounded-md text-sm ${
                  activeTab === "followers" ? "bg-orange-50 text-orange-600" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Users className="h-4 w-4 mr-2" />
                Seguidores
              </button>
            </>
          )}
        </div>

        <Separator className="my-4" />

        {/* Contato e redes sociais */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-500">Contato</h3>

          {user.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-gray-500" />
              <a href={`mailto:${user.email}`} className="text-orange-600 hover:underline">
                {user.email}
              </a>
            </div>
          )}

          {/* Redes sociais */}
          <div className="flex gap-2 mt-2">
            {user.socialLinks?.github && (
              <a
                href={user.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
            )}

            {user.socialLinks?.linkedin && (
              <a
                href={user.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            )}

            {user.socialLinks?.twitter && (
              <a
                href={user.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        {/* Áreas de interesse */}
        {user.interests && user.interests.length > 0 && (
          <>
            <Separator className="my-4" />
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Áreas de interesse</h3>
              <div className="flex flex-wrap gap-1">
                {user.interests.map((interest, index) => (
                  <Link
                    key={index}
                    to={`/explore?topic=${encodeURIComponent(interest)}`}
                    className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded-full hover:bg-orange-100"
                  >
                    {interest}
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default ProfileSidebar
