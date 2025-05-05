import type React from "react"
import { Award, BookOpen, Download, FileText, ThumbsUp, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { UserProfile } from "@/types/user"

interface UserStatsProps {
  user: UserProfile
}

const UserStats: React.FC<UserStatsProps> = ({ user }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">Estatísticas</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="flex flex-col items-center p-4 bg-orange-50 rounded-lg">
            <FileText className="h-8 w-8 text-orange-500 mb-2" />
            <span className="text-2xl font-bold">{user.stats?.totalUploads || 0}</span>
            <span className="text-sm text-gray-500">Uploads</span>
          </div>

          <div className="flex flex-col items-center p-4 bg-orange-50 rounded-lg">
            <Download className="h-8 w-8 text-orange-500 mb-2" />
            <span className="text-2xl font-bold">{user.stats?.totalDownloads || 0}</span>
            <span className="text-sm text-gray-500">Downloads</span>
          </div>

          <div className="flex flex-col items-center p-4 bg-orange-50 rounded-lg">
            <ThumbsUp className="h-8 w-8 text-orange-500 mb-2" />
            <span className="text-2xl font-bold">{user.stats?.totalLikes || 0}</span>
            <span className="text-sm text-gray-500">Curtidas</span>
          </div>

          <div className="flex flex-col items-center p-4 bg-orange-50 rounded-lg">
            <User className="h-8 w-8 text-orange-500 mb-2" />
            <span className="text-2xl font-bold">{user.stats?.followers || 0}</span>
            <span className="text-sm text-gray-500">Seguidores</span>
          </div>

          <div className="flex flex-col items-center p-4 bg-orange-50 rounded-lg">
            <BookOpen className="h-8 w-8 text-orange-500 mb-2" />
            <span className="text-2xl font-bold">{user.stats?.following || 0}</span>
            <span className="text-sm text-gray-500">Seguindo</span>
          </div>

          <div className="flex flex-col items-center p-4 bg-orange-50 rounded-lg">
            <Award className="h-8 w-8 text-orange-500 mb-2" />
            <span className="text-2xl font-bold">{user.stats?.rating || 0}</span>
            <span className="text-sm text-gray-500">Avaliação</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default UserStats
