// Importar o componente UploadForm
import UploadForm from "../../src/components/upload/UploadForm"
import type React from "react"
import {Link} from "react-router-dom"
import {ArrowLeft} from "lucide-react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"

const UploadPage: React.FC = () => {
  return (
    <div className="container mx-auto max-w-4xl py-10 px-4">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-700">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Voltar para a página inicial
        </Link>
      </div>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Enviar Material de Estudo</CardTitle>
          <CardDescription>
            Compartilhe seu conhecimento com outros estudantes. Preencha os detalhes abaixo para enviar seu material.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Integrar o componente UploadForm aqui */}
          <UploadForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default UploadPage
