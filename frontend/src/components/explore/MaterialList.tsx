import type React from "react"
import {Link} from "react-router-dom"
import {Bookmark, Clock, Download} from "lucide-react"
import {Card, CardContent} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Avatar, AvatarFallback} from "@/components/ui/avatar"
import type {Material} from "../../types/material"
import {formatDate, getMaterialIcon, getMaterialTypeName} from "../../utils/material-helpers"

interface MaterialListProps {
  materials: Material[]
}

const MaterialList: React.FC<MaterialListProps> = ({ materials }) => {
  return (
    <div className="space-y-4">
      {materials.map((material) => (
        <Card key={material.id} className="mb-4 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-orange-50 p-3 flex-shrink-0">{getMaterialIcon(material.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 mb-1">
                  <Badge variant="outline" className="bg-orange-50 text-orange-700">
                    {getMaterialTypeName(material.type)}
                  </Badge>
                  <Badge variant="outline">{material.subject}</Badge>
                </div>
                <h3 className="font-medium text-lg truncate">{material.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mt-1">{material.description}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Avatar className="h-5 w-5 mr-1">
                      <AvatarFallback className="text-xs">
                        {material.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span>{material.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{formatDate(material.createdAt)}</span>
                  </div>
                  <div className="flex items-center">
                    <Download className="h-4 w-4 mr-1" />
                    <span>{material.totalDownload}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span>{material.averageRating?.toFixed(1) || "N/A"}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600" asChild>
                  <Link to={`/material/${material.id}`}>Ver Detalhes</Link>
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

export default MaterialList
