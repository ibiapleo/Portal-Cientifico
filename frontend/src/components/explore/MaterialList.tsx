import type React from "react"
import {Link} from "react-router-dom"
import {Bookmark, Clock, Download} from "lucide-react"
import {Card, CardContent} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Avatar, AvatarFallback} from "@/components/ui/avatar"
import type {Resource} from "../../types/resource"
import {formatDate, getResourceIcon, getResourceTypeName} from "../../utils/material-helpers"

interface ResourceListProps {
  resources: Resource[]
}

const ResourceList: React.FC<ResourceListProps> = ({ resources }) => {
  return (
    <div className="space-y-4">
      {resources.map((resource) => (
        <Card key={resource.id} className="mb-4 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-orange-50 p-3 flex-shrink-0">{getResourceIcon(resource.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 mb-1">
                  <Badge variant="outline" className="bg-orange-50 text-orange-700">
                    {getResourceTypeName(resource.type)}
                  </Badge>
                  <Badge variant="outline">{resource.subject}</Badge>
                </div>
                <h3 className="font-medium text-lg truncate">{resource.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mt-1">{resource.description}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Avatar className="h-5 w-5 mr-1">
                      <AvatarFallback className="text-xs">
                        {resource.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span>{resource.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{formatDate(resource.createdAt)}</span>
                  </div>
                  <div className="flex items-center">
                    <Download className="h-4 w-4 mr-1" />
                    <span>{resource.downloads}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span>{resource.rating || "N/A"}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600" asChild>
                  <Link to={`/resource/${resource.id}`}>Ver Detalhes</Link>
                </Button>
                <Button size="sm" variant="outline" className="flex items-center">
                  <Bookmark className="h-4 w-4 mr-1" />
                  Salvar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default ResourceList
