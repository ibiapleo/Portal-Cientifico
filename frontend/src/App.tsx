import type React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import PrivateRoute from "./components/auth/PrivateRoute"
import Layout from "./components/layout/Layout"

// Páginas
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import MaterialPage from "./pages/MaterialPage"
import UploadPage from "./pages/UploadPage"
import ProfilePage from "./pages/ProfilePage"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
      <ToastContainer />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<RegisterPage />} />

          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="material/:id" element={<MaterialPage />} />
            <Route path="explore" element={<HomePage />} />

            <Route element={<PrivateRoute />}>
              <Route path="upload" element={<UploadPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<ProfilePage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

