"use client"

import type React from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {Skeleton} from "@/components/ui/skeleton"
import ResourceGrid from "./MaterialGrid"
import type {Resource} from "../../types/resource"

interface ResourceSectionProps {
  title: string
  description: string
  resources: Resource[]
  icon: React.ReactNode
  isLoading: boolean
  onViewMore?: () => void
}

const ResourceSection: React.FC<ResourceSectionProps> = ({
  title,
  description,
  resources,
  icon,
  isLoading,
  onViewMore,
}) => {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      <p className="text-gray-500 mb-6">{description}</p>

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
        <ResourceGrid resources={resources.slice(0, 8)} />
      )}

      {resources.length > 8 && onViewMore && (
        <div className="mt-4 text-center">
          <Button
            variant="outline"
            className="border-orange-200 text-orange-600 hover:bg-orange-50"
            onClick={onViewMore}
          >
            Ver Mais
          </Button>
        </div>
      )}
    </div>
  )
}

export default ResourceSection
