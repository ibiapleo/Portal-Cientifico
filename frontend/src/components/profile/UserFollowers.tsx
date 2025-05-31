"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { AlertCircle, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import userService from "@/services/userService"
import type { UserProfile } from "@/types/user"

interface UserFollowersProps {
  userId: string
}

const UserFollowers: React.FC<UserFollowersProps> = ({ userId }) => {
  const [followers, setFollowers] = useState<UserProfile[]>([])
  const [following, setFollowing] = useState<UserProfile[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"followers" | "following">("followers")

  useEffect(() => {
    const fetchFollowData = async () => {
      try {
        setIsLoading(true)

        // Buscar seguidores
        const followersData = await userService.getUserFollowers(userId)
        setFollowers(followersData || [])

        // Buscar quem o usuário segue
        const followingData = await userService.getUserFollowing(userId)
        setFollowing(followingData || [])
      } catch (err) {
        console.error("Erro ao buscar dados de seguidores:", err)
        setError("Não foi possível carregar os dados de seguidores. Tente novamente mais tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchFollowData()
  }, [userId])

  const handleFollow = async (targetUserId: string) => {
    try {
      await userService.followUser(targetUserId)
      // Atualizar a lista após seguir/deixar de seguir
      const followersData = await userService.getUserFollowers(userId)
      setFollowers(followersData || [])
    } catch (err) {
      console.error("Erro ao seguir usuário:", err)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "followers" | "following")}>
          <TabsList className="mb-6">
            <TabsTrigger value="followers">Seguidores</TabsTrigger>
            <TabsTrigger value="following">Seguindo</TabsTrigger>
          </TabsList>

          <TabsContent value="followers">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <p>{error}</p>
              </div>
            ) : followers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <h3 className="text-lg font-medium">Nenhum seguidor</h3>
                <p className="text-gray-500">Este usuário ainda não tem seguidores</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {followers.map((follower) => (
                  <div key={follower.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Avatar className="h-12 w-12">
                      {follower.profilePictureUrl ? (
                        <img
                          src={follower.profilePictureUrl || "/placeholder.svg"}
                          alt={follower.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <AvatarFallback>{follower.name?.charAt(0) || "U"}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <Link to={`/profile/${follower.id}`} className="font-medium hover:text-orange-600">
                        {follower.name}
                      </Link>
                      <p className="text-sm text-gray-500 truncate">
                        {follower.headline || follower.institution || "Usuário"}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleFollow(follower.id)}>
                      {follower.isFollowing ? "Seguindo" : "Seguir"}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="following">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <p>{error}</p>
              </div>
            ) : following.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <h3 className="text-lg font-medium">Não segue ninguém</h3>
                <p className="text-gray-500">Este usuário ainda não segue ninguém</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {following.map((followedUser) => (
                  <div key={followedUser.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Avatar className="h-12 w-12">
                      {followedUser.profilePictureUrl ? (
                        <img
                          src={followedUser.profilePictureUrl || "/placeholder.svg"}
                          alt={followedUser.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <AvatarFallback>{followedUser.name?.charAt(0) || "U"}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <Link to={`/profile/${followedUser.id}`} className="font-medium hover:text-orange-600">
                        {followedUser.name}
                      </Link>
                      <p className="text-sm text-gray-500 truncate">
                        {followedUser.headline || followedUser.institution || "Usuário"}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleFollow(followedUser.id)}>
                      Seguindo
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default UserFollowers
