"use client"

import type React from "react"
import {FileText} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Link} from "react-router-dom"

interface EmptyStateProps {
  type: "search" | "recommended" | "login"
  onClearFilters?: () => void
}

const EmptyState: React.FC<EmptyStateProps> = ({ type, onClearFilters }) => {
  if (type === "search") {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium">Nenhum resultado encontrado</h3>
        <p className="text-gray-500 mb-4">Tente ajustar seus filtros ou usar termos de busca diferentes</p>
        <Button variant="outline" onClick={onClearFilters}>
          Limpar Filtros
        </Button>
      </div>
    )
  }

  if (type === "recommended") {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium">Ainda não temos recomendações para você</h3>
        <p className="text-gray-500 mb-4">
          Continue explorando e interagindo com conteúdos para recebermos mais informações sobre seus interesses
        </p>
        <Button className="bg-orange-500 hover:bg-orange-600" asChild>
          <Link to="/">Explorar Conteúdos</Link>
        </Button>
      </div>
    )
  }

  if (type === "login") {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium">Faça login para ver recomendações personalizadas</h3>
        <p className="text-gray-500 mb-4">
          Crie uma conta ou faça login para receber recomendações baseadas nos seus interesses
        </p>
        <Button className="bg-orange-500 hover:bg-orange-600" asChild>
          <Link to="/login">Entrar</Link>
        </Button>
      </div>
    )
  }

  return null
}

export default EmptyState
