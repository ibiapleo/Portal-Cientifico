"use client"

import type React from "react"
import {Search} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"

interface SearchBarProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  onSearch: () => void
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, onSearch }) => {
  return (
    <div className="relative mb-8">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSearch()
        }}
        className="flex w-full items-center space-x-2"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Pesquisar por título, autor, palavras-chave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
          Pesquisar
        </Button>
      </form>
    </div>
  )
}

export default SearchBar
