import {BookOpen, FileText, GraduationCap, Layers, Lightbulb} from "lucide-react"

export const getResourceIcon = (type: string) => {
  switch (type) {
    case "ARTICLE":
      return <FileText className="h-6 w-6 text-orange-500" />
    case "THESIS":
      return <GraduationCap className="h-6 w-6 text-orange-500" />
    case "NOTES":
      return <BookOpen className="h-6 w-6 text-orange-500" />
    case "PRESENTATION":
      return <Layers className="h-6 w-6 text-orange-500" />
    case "EXERCISE":
      return <Lightbulb className="h-6 w-6 text-orange-500" />
    default:
      return <FileText className="h-6 w-6 text-orange-500" />
  }
}

export const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString("pt-BR")
  } catch (e) {
    return dateString
  }
}

export const getResourceTypeName = (type: string) => {
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
      return "Exercícios"
    default:
      return type
  }
}
