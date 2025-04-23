"use client"

import type React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ResourceType {
  id: string
  label: string
}

interface KnowledgeArea {
  id: string
  label: string
}

interface ActiveFiltersProps {
  searchTerm: string
  selectedTypes: string[]
  selectedAreas: string[]
  sortBy: string
  resourceTypes: ResourceType[]
  knowledgeAreas: KnowledgeArea[]
  clearSearchTerm: () => void
  removeType: (typeId: string) => void
  removeArea: (areaId: string) => void
  resetSortBy: () => void
  clearAllFilters: () => void
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  searchTerm,
  selectedTypes,
  selectedAreas,
  sortBy,
  resourceTypes,
  knowledgeAreas,
  clearSearchTerm,
  removeType,
  removeArea,
  resetSortBy,
  clearAllFilters,
}) => {
  const hasActiveFilters = searchTerm || selectedTypes.length > 0 || selectedAreas.length > 0 || sortBy !== "relevance"

  if (!hasActiveFilters) return null

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Resultados da Busca</h2>
        <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-gray-500">
          <X className="h-4 w-4 mr-1" />
          Limpar filtros
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {searchTerm && (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 border-none">
            Termo: {searchTerm}
            <button className="ml-1 hover:text-orange-900" onClick={clearSearchTerm}>
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}

        {selectedTypes.map((type) => {
          const typeObj = resourceTypes.find((t) => t.id === type)
          return (
            <Badge key={type} className="bg-orange-100 text-orange-800 hover:bg-orange-200 border-none">
              Tipo: {typeObj?.label || type}
              <button className="ml-1 hover:text-orange-900" onClick={() => removeType(type)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )
        })}

        {selectedAreas.map((area) => {
          const areaObj = knowledgeAreas.find((a) => a.id === area)
          return (
            <Badge key={area} className="bg-orange-100 text-orange-800 hover:bg-orange-200 border-none">
              Área: {areaObj?.label || area}
              <button className="ml-1 hover:text-orange-900" onClick={() => removeArea(area)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )
        })}

        {sortBy !== "relevance" && (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 border-none">
            Ordenado por:{" "}
            {sortBy === "recent"
              ? "Mais recentes"
              : sortBy === "downloads"
                ? "Mais baixados"
                : sortBy === "rating"
                  ? "Melhor avaliados"
                  : "Relevância"}
            <button className="ml-1 hover:text-orange-900" onClick={resetSortBy}>
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
      </div>
    </div>
  )
}

export default ActiveFilters
