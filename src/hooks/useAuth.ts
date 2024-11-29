import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { notificationService } from '../services/notification.service';
import { User } from '../types/api';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await authService.getProfile();
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

  const login = async (email: string, password: string) => {
    try {
      const { user } = await authService.login(email, password);
      setUser(user);
      notificationService.success('Login realizado com sucesso');
      navigate('/');
    } catch (error) {
      notificationService.error('Email ou senha inválidos');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      navigate('/login');
      notificationService.success('Logout realizado com sucesso');
    } catch (error) {
      notificationService.error('Erro ao realizar logout');
    }
  };

  const register = async (data: { name: string; email: string; password: string }) => {
    try {
      await authService.register(data);
      notificationService.success('Cadastro realizado com sucesso');
      navigate('/login');
    } catch (error) {
      notificationService.error('Erro ao realizar cadastro');
      throw error;
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    register
  };
}