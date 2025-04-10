"use client"

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import type { RegisterData } from "../../types/auth"

interface RegisterFormProps {
  onSuccess?: () => void
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<RegisterData & { confirmPassword: string }>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { register } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validação básica
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    if (!acceptTerms) {
      setError("Você precisa aceitar os termos e condições")
      return
    }

    setIsLoading(true)

    try {
      const userData: RegisterData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }

      const result = await register(userData)

      if (result.success) {
        if (onSuccess) onSuccess()
      } else {
        setError(result.error || "Erro ao criar conta")
      }
    } catch (err) {
      setError("Ocorreu um erro ao criar sua conta. Tente novamente.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>}

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Nome Completo
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="João"
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="seu@email.com"
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <p className="text-xs text-gray-500">A senha deve ter pelo menos 8 caracteres, incluindo letras e números</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium">
          Confirmar Senha
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="flex items-start space-x-2">
        <input
          id="terms"
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          className="mt-1 rounded text-orange-500 focus:ring-orange-500"
        />
        <div className="grid gap-1.5 leading-none">
          <label htmlFor="terms" className="text-sm font-medium leading-none">
            Aceito os termos e condições
          </label>
          <p className="text-xs text-gray-500">
            Concordo com os{" "}
            <Link to="/termos" className="text-orange-600 hover:underline">
              Termos de Serviço
            </Link>{" "}
            e{" "}
            <Link to="/privacidade" className="text-orange-600 hover:underline">
              Política de Privacidade
            </Link>
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors disabled:opacity-70"
      >
        {isLoading ? "Criando conta..." : "Criar Conta"}
      </button>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">ou cadastre-se com</span>
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
  )
}

export default RegisterForm

