import type React from "react"
import {Outlet} from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"

const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
