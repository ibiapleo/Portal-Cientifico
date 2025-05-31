import type React from "react"
import { Award, BookOpen, Calendar, FileText, MapPin, School, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import type { UserProfile } from "@/types/user"

interface UserAboutProps {
  user: UserProfile
}

const UserAbout: React.FC<UserAboutProps> = ({ user }) => {
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        {/* Biografia */}
        <div>
          <h3 className="text-lg font-medium mb-3">Sobre</h3>
          <p className="text-gray-700">{user.bio || "Este usuário ainda não adicionou uma biografia."}</p>
        </div>

        <Separator />

        {/* Informações pessoais */}
        <div>
          <h3 className="text-lg font-medium mb-3">Informações</h3>
          <div className="space-y-3">
            {user.institution && (
              <div className="flex items-center gap-2">
                <School className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-500">Instituição</p>
                  <p>{user.institution}</p>
                </div>
              </div>
            )}

            {user.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-500">Localização</p>
                  <p>{user.location}</p>
                </div>
              </div>
            )}

            {user.joinDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-500">Membro desde</p>
                  <p>{new Date(user.joinDate).toLocaleDateString("pt-BR", { year: "numeric", month: "long" })}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Áreas de interesse */}
        {user.interests && user.interests.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="text-lg font-medium mb-3">Áreas de interesse</h3>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary" className="bg-orange-50">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Estatísticas */}
        <Separator />
        <div>
          <h3 className="text-lg font-medium mb-3">Estatísticas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <FileText className="h-6 w-6 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{user.stats?.totalUploads || 0}</p>
              <p className="text-sm text-gray-500">Uploads</p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <BookOpen className="h-6 w-6 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{user.stats?.totalDownloads || 0}</p>
              <p className="text-sm text-gray-500">Downloads</p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <User className="h-6 w-6 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{user.stats?.followers || 0}</p>
              <p className="text-sm text-gray-500">Seguidores</p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <Award className="h-6 w-6 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{user.stats?.rating || 0}</p>
              <p className="text-sm text-gray-500">Avaliação</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default UserAbout
