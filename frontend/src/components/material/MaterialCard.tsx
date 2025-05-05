import type React from "react"
import {Link} from "react-router-dom"
import {Clock, Download} from "lucide-react"
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import type {Material} from "../../types/material"
import {formatDate, getMaterialIcon, getMaterialTypeName} from "../../utils/material-helpers"

interface MaterialCardProps {
  material: Material;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material }) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4 pb-0 flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-orange-50 text-orange-700 hover:bg-orange-100">
            {getMaterialTypeName(material.type)}
          </Badge>
          <Badge variant="outline">{material.area}</Badge>
        </div>
        <div className="rounded-full bg-orange-50 p-2">{getMaterialIcon(material.type)}</div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-medium line-clamp-2 min-h-[48px]">{material.title}</h3>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <span>Por {material.author}</span>
        </div>
        <div className="mt-1 flex items-center text-sm text-gray-500">
          <Clock className="mr-1 h-4 w-4" />
          <span>{formatDate(material.createdAt)}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <Download className="mr-1 h-4 w-4" />
          <span>{material.totalDownload}</span>
          {material.averageRating != null && (
            <>
              <span className="mx-2">•</span>
              <span className="text-yellow-500">★</span>
              <span className="ml-1">{material.averageRating?.toFixed(1)|| "N/A"} </span>
            </>
          )}
        </div>
        <Button size="sm" variant="ghost" className="text-orange-600 hover:bg-orange-50 hover:text-orange-700" asChild>
          <Link to={`/material/${material.id}`}>Ver Detalhes</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default MaterialCard
