import type React from "react"
import {useEffect, useState} from "react"
import {Link} from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import type {LoginCredentials} from "../../types/auth"
import {toast} from 'react-toastify'; // Importe o toast

interface LoginFormProps {
  onSuccess?: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  })
  const [rememberMe, setRememberMe] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { login } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await login(credentials)
      if (result.success) {
        toast.success('Login bem-sucedido!', {
          position: 'top-right', 
          autoClose: 5000,
        });

        if (onSuccess) onSuccess();
      } else {
        setError(result.error || "Erro ao fazer login");
      }
    } catch (err) {
      setError("Ocorreu um erro ao fazer login. Tente novamente.");
      console.error(err);
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: 'top-right',
        autoClose: 5000,
      });
    }
  }, [error]);
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>}

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={credentials.email}
            onChange={handleChange}
            placeholder="seu@email.com"
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium">
              Senha
            </label>
            <Link to="/recuperar-senha" className="text-xs text-orange-600 hover:underline">
              Esqueceu sua senha?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            id="remember"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="rounded text-orange-500 focus:ring-orange-500"
          />
          <label htmlFor="remember" className="text-sm font-normal">
            Lembrar de mim
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors disabled:opacity-70"
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">ou continue com</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button type="button" className="py-2 px-4 border rounded-lg hover:bg-gray-50">
            Google
          </button>
          <button type="button" className="py-2 px-4 border rounded-lg hover:bg-gray-50">
            Facebook
          </button>
          <button type="button" className="py-2 px-4 border rounded-lg hover:bg-gray-50">
            Apple
          </button>
        </div>
      </form>
    </>
  )
}

export default LoginForm
