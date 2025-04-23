import type React from "react"
import { Link } from "react-router-dom"
import { Clock, Download } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Resource } from "../../types/resource"
import { getResourceIcon, formatDate, getResourceTypeName } from "../../utils/material-helpers"

interface ResourceGridProps {
  resources: Resource[]
}

const ResourceGrid: React.FC<ResourceGridProps> = ({ resources }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {resources.map((resource) => (
        <Card key={resource.id} className="overflow-hidden transition-all hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-orange-50 text-orange-700 hover:bg-orange-100">
                  {getResourceTypeName(resource.type)}
                </Badge>
                <Badge variant="outline">{resource.area}</Badge>
              </div>
              <div className="rounded-full bg-orange-50 p-2">{getResourceIcon(resource.type)}</div>
            </div>
            <h3 className="font-medium line-clamp-2 min-h-[48px]">{resource.title}</h3>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <Avatar className="h-5 w-5 mr-1">
                <AvatarFallback className="text-xs">
                  {resource.author ? resource.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("") : " "}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">{resource.author}</span>
            </div>
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <Clock className="mr-1 h-4 w-4" />
              <span>{formatDate(resource.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center text-sm text-gray-500">
                <Download className="mr-1 h-4 w-4" />
                <span>{resource.totalDownload}</span>
                <span className="mx-2">•</span>
                <span className="text-yellow-500">★</span>
                <span className="ml-1">{resource.rating || "N/A"}</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                asChild
              >
                <Link to={`/resource/${resource.id}`}>Ver detalhes</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default ResourceGrid
