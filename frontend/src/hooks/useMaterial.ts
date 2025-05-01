"use client"

import {useEffect, useState} from "react"
import materialService from "../services/materialService"
import type {Material} from "../types/material"

interface UsematerialsOptions {
  page?: number
  limit?: number
  type?: string
  subject?: string
  search?: string
}

interface UsematerialsResult {
  materials: Material[]
  isLoading: boolean
  error: string | null
  total: number
  pages: number
  fetchmaterials: (options?: UsematerialsOptions) => Promise<void>
}

export const usematerials = (initialOptions?: UsematerialsOptions): UsematerialsResult => {
  const [materials, setmaterials] = useState<Material[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState<number>(0)
  const [pages, setPages] = useState<number>(0)

  const fetchmaterials = async (options?: UsematerialsOptions) => {
    try {
      setIsLoading(true)
      setError(null)

      const { materials: data, total: totalCount, pages: totalPages } = await materialService.getMaterials(options)

      setmaterials(data)
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
    fetchmaterials(initialOptions)
  }, [])

  return { materials, isLoading, error, total, pages, fetchmaterials }
}

interface UsematerialResult {
  material: Material | null
  isLoading: boolean
  error: string | null
  fetchmaterial: () => Promise<void>
}

export const usematerial = (id: string): UsematerialResult => {
  const [material, setmaterial] = useState<Material | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchmaterial = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const data = await materialService.getmaterialById(id)
      setmaterial(data)
    } catch (err) {
      console.error("Erro ao buscar recurso:", err)
      setError("Não foi possível carregar os detalhes deste recurso.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchmaterial()
  }, [id])

  return { material, isLoading, error, fetchmaterial }
}

export default usematerials

