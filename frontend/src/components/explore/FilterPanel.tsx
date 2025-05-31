"use client"

import type React from "react"
import {Filter} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {Separator} from "@/components/ui/separator"
import {Slider} from "@/components/ui/slider"
import {Switch} from "@/components/ui/switch"
import {Label} from "@/components/ui/label"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Checkbox} from "@/components/ui/checkbox"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

interface MaterialType {
  id: string
  label: string
  icon: React.ReactNode
}

interface KnowledgeArea {
  id: string
  label: string
}

interface FilterPanelProps {
  selectedTypes: string[]
  selectedAreas: string[]
  dateRange: [number, number]
  onlyFreeMaterials: boolean
  sortBy: string
  materialTypes: MaterialType[]
  knowledgeAreas: KnowledgeArea[]
  toggleType: (typeId: string) => void
  toggleArea: (areaId: string) => void
  setDateRange: (range: [number, number]) => void
  setOnlyFreeMaterials: (value: boolean) => void
  setSortBy: (value: string) => void
  applyFilters: () => void
  clearFilters: () => void
  filtersVisible: boolean
  setFiltersVisible: (visible: boolean) => void
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedTypes,
  selectedAreas,
  dateRange,
  onlyFreeMaterials,
  sortBy,
  materialTypes,
  knowledgeAreas,
  toggleType,
  toggleArea,
  setDateRange,
  setOnlyFreeMaterials,
  setSortBy,
  applyFilters,
  clearFilters,
  filtersVisible,
  setFiltersVisible,
}) => {
  return (
    <Sheet open={filtersVisible} onOpenChange={setFiltersVisible}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtros
          {(selectedTypes.length > 0 || selectedAreas.length > 0) && (
            <Badge className="ml-1 bg-orange-500">{selectedTypes.length + selectedAreas.length}</Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-[35%] overflow-y-auto rounded-l-lg  px-6">
        <SheetHeader>
          <SheetTitle>Filtros de Busca</SheetTitle>
          <SheetDescription>Refine sua busca para encontrar exatamente o que precisa</SheetDescription>
        </SheetHeader>

        <div className="py-10">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-3">Tipo de Material</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {materialTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant="outline"
                    className={`justify-start px-3 py-2 h-auto text-sm rounded-md ${
                      selectedTypes.includes(type.id) ? "bg-orange-50 text-orange-700 border-orange-200" : ""
                    }`}
                    onClick={() => toggleType(type.id)}
                  >
                    {type.icon}
                    <span className="ml-2 truncate">{type.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-3">Área de Conhecimento</h3>
              <ScrollArea className="h-[200px] pr-4 rounded-md">
                <div className="space-y-3">
                  {knowledgeAreas.map((area) => (
                    <div key={area.id} className="flex items-center space-x-2 py-1">
                      <Checkbox
                        id={`area-${area.id}`}
                        checked={selectedAreas.includes(area.id)}
                        onCheckedChange={() => toggleArea(area.id)}
                        className="text-orange-500 focus:ring-orange-500 rounded"
                      />
                      <Label htmlFor={`area-${area.id}`} className="text-sm font-normal cursor-pointer">
                        {area.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">Data de Publicação</h3>
                <span className="text-xs text-gray-500">
                  Últimos {dateRange[1]} {dateRange[1] === 1 ? "ano" : "anos"}
                </span>
              </div>
              <Slider
                value={dateRange}
                min={0}
                max={10}
                step={1}
                onValueChange={setDateRange}
                className="mb-6 rounded-full"
              />
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-3">Ordenar por</h3>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevância</SelectItem>
                  <SelectItem value="recent">Mais recentes</SelectItem>
                  <SelectItem value="downloads">Mais baixados</SelectItem>
                  <SelectItem value="rating">Melhor avaliados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch id="free-materials" checked={onlyFreeMaterials} onCheckedChange={setOnlyFreeMaterials} />
                <Label htmlFor="free-materials">Apenas recursos gratuitos</Label>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={clearFilters} className="w-full sm:w-auto">
            Limpar Filtros
          </Button>
          <SheetClose asChild>
            <Button onClick={applyFilters} className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600">
              Aplicar Filtros
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default FilterPanel
