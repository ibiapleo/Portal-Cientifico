import type React from "react"
import {Link, useNavigate} from "react-router-dom"
import {ArrowLeft} from "lucide-react"

import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import RegisterForm from "../components/auth/RegisterForm"

const RegisterPage: React.FC = () => {
  const navigate = useNavigate()

  const handleRegisterSuccess = () => {
    navigate("/login")
  }

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen py-10 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-700">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Voltar para a página inicial
          </Link>
        </div>

        <Card className="w-full rounded-xl shadow-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
            <CardDescription>Cadastre-se para compartilhar e acessar materiais científicos</CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm onSuccess={handleRegisterSuccess} />
          </CardContent>
          <CardFooter className="text-center">
            <div className="text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-orange-600 hover:underline">
                Entrar
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default RegisterPage

