"use client"

import type React from "react"
import { Link, useLocation } from "react-router-dom"
import { GraduationCap, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import useAuth from "../../hooks/useAuth"

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth()
  const location = useLocation()

  return (
    <header className="sticky top-0 z-10 border-b bg-background w-full">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-orange-500" />
          <Link to="/" className="text-xl font-bold">
            Portal Científico
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${
              location.pathname === "/" ? "text-orange-500" : "hover:text-orange-500"
            }`}
          >
            Início
          </Link>
          <Link
            to="/explore"
            className={`text-sm font-medium transition-colors ${
              location.pathname === "/explore" ? "text-orange-500" : "hover:text-orange-500"
            }`}
          >
            Explorar
          </Link>
          <Link
            to="/upload"
            className={`text-sm font-medium transition-colors ${
              location.pathname === "/upload" ? "text-orange-500" : "hover:text-orange-500"
            }`}
          >
            Enviar Material
          </Link>
          {isAuthenticated && (
            <Link
              to="/profile"
              className={`text-sm font-medium transition-colors ${
                location.pathname === "/profile" || location.pathname === "/my-upload"
                  ? "text-orange-500"
                  : "hover:text-orange-500"
              }`}
            >
              Meus Uploads
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" className="hidden md:flex" asChild>
                <Link to="/profile">Meu Perfil</Link>
              </Button>
              <Button size="sm" variant="destructive" onClick={logout} className="hidden md:flex">
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" className="hidden md:flex" asChild>
                <Link to="/login">Entrar</Link>
              </Button>
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 hidden md:flex" asChild>
                <Link to="/cadastro">Cadastrar</Link>
              </Button>
            </>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                <Link to="/" className="text-sm font-medium hover:text-orange-500 transition-colors">
                  Início
                </Link>
                <Link to="/explore" className="text-sm font-medium hover:text-orange-500 transition-colors">
                  Explorar
                </Link>
                <Link to="/upload" className="text-sm font-medium hover:text-orange-500 transition-colors">
                  Enviar Material
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" className="text-sm font-medium hover:text-orange-500 transition-colors">
                      Meu Perfil
                    </Link>
                    <Button variant="destructive" onClick={logout}>
                      Sair
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" asChild>
                      <Link to="/login">Entrar</Link>
                    </Button>
                    <Button className="bg-orange-500 hover:bg-orange-600" asChild>
                      <Link to="/cadastro">Cadastrar</Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default Header
