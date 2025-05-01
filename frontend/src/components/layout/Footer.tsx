import type React from "react"
import {Link} from "react-router-dom"
import {GraduationCap} from "lucide-react"

const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4 md:ml-10">
          <GraduationCap className="h-6 w-6 text-orange-500" />
          <span className="text-xl font-bold">Portal Científico</span>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-sm mx-auto md:mx-0">
          <Link to="#" className="hover:text-orange-500 transition-colors">
            Termos
          </Link>
          <Link to="#" className="hover:text-orange-500 transition-colors">
            Privacidade
          </Link>
          <Link to="#" className="hover:text-orange-500 transition-colors">
            Diretrizes
          </Link>
          <Link to="#" className="hover:text-orange-500 transition-colors">
            Suporte
          </Link>
          <Link to="#" className="hover:text-orange-500 transition-colors">
            Contato
          </Link>
        </div>
        <div className="text-sm text-gray-500 text-center mr:text-right">© 2025 Portal Científico. Todos os direitos reservados.</div>
      </div>
    </footer>
  )
}

export default Footer

