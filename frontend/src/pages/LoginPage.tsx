import type React from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import LoginForm from "../components/auth/LoginForm"

const LoginPage: React.FC = () => {
  const navigate = useNavigate()

  const handleLoginSuccess = () => {
    navigate("/")
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
            <CardTitle className="text-2xl font-bold">Entrar</CardTitle>
            <CardDescription>Entre com sua conta para acessar o Portal Científico</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm onSuccess={handleLoginSuccess} />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 text-center">
            <div className="text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <Link to="/cadastro" className="text-orange-600 hover:underline">
                Cadastre-se
              </Link>
            </div>
            <div className="text-xs text-muted-foreground">
              Ao entrar, você concorda com nossos{" "}
              <Link to="#" className="text-orange-600 hover:underline">
                Termos de Serviço
              </Link>{" "}
              e{" "}
              <Link to="#" className="text-orange-600 hover:underline">
                Política de Privacidade
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage

