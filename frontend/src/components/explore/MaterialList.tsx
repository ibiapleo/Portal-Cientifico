import type React from "react"
import { Link } from "react-router-dom"
import {
  Bookmark,
  Calendar,
  Download,
  FileText,
  GraduationCap,
  BookOpen,
  Layers,
  Lightbulb,
  ThumbsUp,
  User,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Material } from "../../types/material"

interface MaterialListProps {
  materials: Material[]
}

const MaterialList: React.FC<MaterialListProps> = ({ materials }) => {
  // Helper function to get the appropriate icon based on material type
  const getMaterialIcon = (type: string) => {
    switch (type) {
      case "ARTICLE":
        return <FileText className="h-5 w-5 text-orange-500" />
      case "THESIS":
        return <GraduationCap className="h-5 w-5 text-orange-500" />
      case "NOTES":
        return <BookOpen className="h-5 w-5 text-orange-500" />
      case "PRESENTATION":
        return <Layers className="h-5 w-5 text-orange-500" />
      case "EXERCISE":
        return <Lightbulb className="h-5 w-5 text-orange-500" />
      default:
        return <FileText className="h-5 w-5 text-orange-500" />
    }
  }

  // Helper function to get the display name for material type
  const getMaterialTypeName = (type: string) => {
    switch (type) {
      case "ARTICLE":
        return "Artigo"
      case "THESIS":
        return "TCC"
      case "NOTES":
        return "Resumo"
      case "PRESENTATION":
        return "Apresentação"
      case "EXERCISE":
        return "Exercício"
      default:
        return type
    }
  }

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("pt-BR")
    } catch (e) {
      return dateString
    }
  }

  return (
    <div className="space-y-4">
      {materials.map((material) => (
        <Card key={material.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              {/* Left side - Material type icon */}
              <div className="rounded-lg bg-orange-50 p-3 flex-shrink-0">{getMaterialIcon(material.type)}</div>

              {/* Middle - Main content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 mb-1">
                  <Badge variant="outline" className="bg-orange-50 text-orange-700">
                    {getMaterialTypeName(material.type)}
                  </Badge>
                  <Badge variant="outline">{material.area || material.subject}</Badge>
                </div>

                <h3 className="font-medium text-lg mb-1 line-clamp-1">
                  <Link to={`/material/${material.id}`} className="hover:text-orange-600 transition-colors">
                    {material.title}
                  </Link>
                </h3>

                <p className="text-gray-600 text-sm line-clamp-2 mb-2">{material.description}</p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    <span>{material.author}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(material.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Download className="h-3.5 w-3.5" />
                    <span>{material.totalDownload || 0} downloads</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-3.5 w-3.5" />
                    <span>{material.likeCount || 0} curtidas</span>
                  </div>

                  {material.averageRating !== undefined && (
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span>{material.averageRating?.toFixed(1) || "N/A"}</span>
                    </div>
                  )}
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
