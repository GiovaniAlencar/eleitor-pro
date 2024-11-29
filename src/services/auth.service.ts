import api from './api';
import { User } from '../types/api';

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post('/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      return { user, token };
    } catch (error) {
      throw new Error('Email ou senha inválidos');
    }
  },

  async register(data: RegisterData): Promise<void> {
    try {
      await api.post('/register', data);
    } catch (error) {
      throw new Error('Erro ao realizar cadastro. Verifique os dados informados');
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/logout');
      localStorage.removeItem('token');
    } catch (error) {
      throw new Error('Erro ao realizar logout');
    }
  },

  async getProfile(): Promise<User> {
    try {
      const response = await api.get('/me');
      return response.data;
    } catch (error) {
      throw new Error('Erro ao carregar perfil do usuário');
    }
  },

  async forgotPassword(email: string, recaptchaToken: string): Promise<void> {
    try {
      await api.post('/forgot-password', { email, recaptcha_token: recaptchaToken });
    } catch (error) {
      throw new Error('Erro ao enviar email de recuperação');
    }
  },

  async resetPassword(data: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Promise<void> {
    try {
      await api.post('/reset-password', data);
    } catch (error) {
      throw new Error('Erro ao redefinir senha');
    }
  }
};