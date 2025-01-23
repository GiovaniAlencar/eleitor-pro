import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';

import React from 'react'; // Importação necessária para usar JSX
import ReactDOM from 'react-dom'; // Para renderizar componentes (se for necessário)


// Layout Components
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import MobileNav from './components/Layout/MobileNav';

// Auth Pages
import Login from './pages/auth/Login';
import MultiStepRegister from './pages/auth/MultiStepRegister';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Main Pages
import Home from './pages/Home';
import Usuarios from './pages/Usuarios.tsx';
import ListaLiderancas from './pages/lideranca/ListaLiderancas';
import NovaLideranca from './pages/lideranca/NovaLideranca';
import EditarLideranca from './pages/lideranca/EditarLideranca';
import DetalheLideranca from './pages/lideranca/DetalheLideranca';
import ListaEleitores from './pages/eleitores/ListaEleitores';
import NovoEleitor from './pages/eleitores/NovoEleitor';
import EditarEleitor from './pages/eleitores/EditarEleitor';
import DetalheEleitor from './pages/eleitores/DetalheEleitor';
import MapaEleitoral from './pages/MapaEleitoral';
import Configuracoes from './pages/configuracoes/Configuracoes';
import EditarPerfil from './pages/configuracoes/EditarPerfil';
import MudarSenha from './pages/configuracoes/MudarSenha';

// Hooks
import { useAuth } from './hooks/useAuth';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (

    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<MultiStepRegister />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <div className="min-h-screen bg-gray-50">
                  <Header onMenuClick={() => setIsSidebarOpen((prevState) => !prevState)} />
                  <Sidebar
                    isOpen={isSidebarOpen}
                    isCollapsed={isSidebarCollapsed}
                    onCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    onClose={() => setIsSidebarOpen(false)}
                  />
                  <main className={`transition-all duration-300 pb-16 lg:pb-0 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'} pt-16`}>
                    <Routes>
                      {/* Dashboard */}
                      <Route path="/" element={<Home />} />

                      {/* Lideranças */}
                      <Route path="/usuarios" element={<Usuarios />} />

                      {/* Lideranças */}
                      <Route path="/lideranca" element={<ListaLiderancas />} />
                      <Route path="/lideranca/novo" element={<NovaLideranca />} />
                      <Route path="/lideranca/editar/:id" element={<EditarLideranca />} />
                      <Route path="/lideranca/:id" element={<DetalheLideranca />} />

                      {/* Eleitores */}
                      <Route path="/eleitores" element={<ListaEleitores />} />
                      <Route path="/eleitores/novo" element={<NovoEleitor />} />
                      <Route path="/eleitores/editar/:id" element={<EditarEleitor />} />
                      <Route path="/voter/:id" element={<DetalheEleitor />} />

                      {/* Mapa */}
                      <Route path="/mapa" element={<MapaEleitoral />} />

                      {/* Configurações */}
                      <Route path="/configuracoes" element={<Configuracoes />} />
                      <Route path="/configuracoes/editar-perfil" element={<EditarPerfil />} />
                      <Route path="/configuracoes/mudar-Senha" element={<MudarSenha />} />

                      {/* Fallback */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                  <MobileNav onMenuClick={() => setIsSidebarOpen((prevState) => !prevState)} />
                </div>
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>

  );
}