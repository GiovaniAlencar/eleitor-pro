import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import MobileNav from './components/Layout/MobileNav';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import NovaLideranca from './pages/lideranca/NovaLideranca';
import EditarLideranca from './pages/lideranca/EditarLideranca';
import ListaLiderancas from './pages/lideranca/ListaLiderancas';
import DetalheLideranca from './pages/lideranca/DetalheLideranca';
import ListaEleitores from './pages/eleitores/ListaEleitores';
import NovoEleitor from './pages/eleitores/NovoEleitor';
import EditarEleitor from './pages/eleitores/EditarEleitor';
import Configuracoes from './pages/configuracoes/Configuracoes';
import EditarPerfil from './pages/configuracoes/EditarPerfil';
import MudarSenha from './pages/configuracoes/MudarSenha';
import MapaEleitoral from './pages/MapaEleitoral';
import { useAuth } from './hooks/useAuth';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <div className="min-h-screen bg-gray-50">
                  <Header onMenuClick={() => setIsSidebarOpen(true)} />
                  <Sidebar
                    isOpen={isSidebarOpen}
                    isCollapsed={isSidebarCollapsed}
                    onCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    onClose={() => setIsSidebarOpen(false)}
                  />
                  <main className={`transition-all duration-300 pb-16 lg:pb-0 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'} pt-16`}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/lideranca/novo" element={<NovaLideranca />} />
                      <Route path="/lideranca/editar/:id" element={<EditarLideranca />} />
                      <Route path="/lideranca" element={<ListaLiderancas />} />
                      <Route path="/lideranca/:id" element={<DetalheLideranca />} />
                      <Route path="/eleitores" element={<ListaEleitores />} />
                      <Route path="/eleitores/novo" element={<NovoEleitor />} />
                      <Route path="/eleitores/editar/:id" element={<EditarEleitor />} />
                      <Route path="/configuracoes" element={<Configuracoes />} />
                      <Route path="/configuracoes/editar-perfil" element={<EditarPerfil />} />
                      <Route path="/configuracoes/mudar-senha" element={<MudarSenha />} />
                      <Route path="/mapa" element={<MapaEleitoral />} />
                    </Routes>
                  </main>
                  <MobileNav onMenuClick={() => setIsSidebarOpen(true)} />
                </div>
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}