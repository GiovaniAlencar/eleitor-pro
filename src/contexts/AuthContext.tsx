import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/api';
import { authService } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  impersonate: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Carrega o usuário atual ao inicializar o contexto
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await authService.getProfile(); // Supondo que getProfile retorna os dados do usuário logado
          setUser(userData);
        }
      } catch (error) {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Função de login
  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password); // Login via authService
    setUser(response.user); // Define o usuário após o login
    localStorage.setItem('token', response.token); // Armazena o token no localStorage

    // Verifica se o perfil do usuário está completo
    if (!response.user.whatsapp || !response.user.city || !response.user.address) {
      navigate('/configuracoes/editar-perfil'); // Redireciona para a edição do perfil
    } else {
      navigate('/'); // Redireciona para a página inicial ou dashboard
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      await authService.logout(); // Chama o serviço de logout
    } finally {
      localStorage.removeItem('token'); // Remove o token do localStorage
      setUser(null); // Limpa o estado do usuário
      navigate('/login'); // Redireciona para a página de login
    }
  };

  // Função de impersonação
  const impersonate = async (userId: string) => {
    try {
      const { token } = await authService.impersonate(userId); // Chama o serviço de impersonação
      localStorage.setItem('token', token); // Armazena o token do usuário que está sendo impersonado
      const userData = await authService.getProfile(); // Carrega os dados do usuário após a impersonação
      setUser(userData); // Atualiza o estado com os dados do novo usuário
      navigate('/'); // Redireciona para a página inicial ou dashboard do novo usuário
      window.location.reload();
    } catch (error) {
      console.error('Falha ao tentar fazer login como outro usuário', error); // Caso ocorra um erro
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, impersonate }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
