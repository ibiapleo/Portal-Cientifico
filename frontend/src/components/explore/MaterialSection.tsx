import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Material } from "../../types/material"
import MaterialGrid from "./MaterialGrid"
import MaterialList from "./MaterialList"

interface MaterialSectionProps {
  title: string
  description: string
  materials: Material[]
  icon: React.ReactNode
  isLoading: boolean
  onViewMore: () => void
  viewMode?: "grid" | "list" // Add viewMode prop
}

const MaterialSection: React.FC<MaterialSectionProps> = ({
  title,
  description,
  materials,
  icon,
  isLoading,
  onViewMore,
  viewMode = "grid", // Default to grid if not provided
}) => {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        <Button variant="link" className="text-orange-600" onClick={onViewMore}>
          Ver mais
        </Button>
      </div>
      <p className="text-gray-500 mb-4">{description}</p>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between mb-3">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
        </div>
      ) : (
        // Render either grid or list based on viewMode
        viewMode === "grid" ? (
          <MaterialGrid materials={materials} />
        ) : (
          <MaterialList materials={materials} />
        )
      )}
    </div>
  )
}

export default MaterialSection
