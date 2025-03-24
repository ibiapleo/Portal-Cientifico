"use client"

import { useState, useEffect } from "react"
import resourceService from "../services/resourceService"
import type { Resource } from "../types/resource"

interface UseResourcesOptions {
  page?: number
  limit?: number
  type?: string
  subject?: string
  search?: string
}

interface UseResourcesResult {
  resources: Resource[]
  isLoading: boolean
  error: string | null
  total: number
  pages: number
  fetchResources: (options?: UseResourcesOptions) => Promise<void>
}

export const useResources = (initialOptions?: UseResourcesOptions): UseResourcesResult => {
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState<number>(0)
  const [pages, setPages] = useState<number>(0)

  const fetchResources = async (options?: UseResourcesOptions) => {
    try {
      setIsLoading(true)
      setError(null)

      const { resources: data, total: totalCount, pages: totalPages } = await resourceService.getResources(options)

      setResources(data)
      setTotal(totalCount)
      setPages(totalPages)
    } catch (err) {
      console.error("Erro ao buscar recursos:", err)
      setError("Não foi possível carregar os recursos. Tente novamente mais tarde.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchResources(initialOptions)
  }, [])

  return { resources, isLoading, error, total, pages, fetchResources }
}

interface UseResourceResult {
  resource: Resource | null
  isLoading: boolean
  error: string | null
  fetchResource: () => Promise<void>
}

export const useResource = (id: string): UseResourceResult => {
  const [resource, setResource] = useState<Resource | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchResource = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const data = await resourceService.getResourceById(id)
      setResource(data)
    } catch (err) {
      console.error("Erro ao buscar recurso:", err)
      setError("Não foi possível carregar os detalhes deste recurso.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchResource()
  }, [id])

  return { resource, isLoading, error, fetchResource }
}

export default useResources

