import api from './api';
import { User } from '../types/api';

interface LoginResponse {
  user: User;
  token: string;
}

interface ImpersonateResponse {
  token: string;
}

export const authService = {
  // Função de login
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post('/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token); // Armazena o token no localStorage
      return { user, token }; // Retorna o usuário e o token
    } catch (error) {
      // Trata erro de login, incluindo falha de rede ou dados inválidos
      throw new Error('Email ou Senha inválidos');
    }
  },

  // Função de impersonação
  async impersonate(userId: string): Promise<ImpersonateResponse> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token de autenticação não encontrado');
    }

    try {
      const response = await api.post(`/impersonate/${userId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`, // Cabeçalho de autorização
        },
      });
      return response.data; // Retorna o token de impersonação
      window.location.reload();
    } catch (error) {
      // Erro ao tentar fazer impersonação
      throw new Error('Falha ao tentar fazer login como outro usuário');
    }
  },

  // Função de registro
  async register(data: FormData): Promise<void> {
    try {
      await api.post('/register', data, {
        headers: {
          'Content-Type': 'multipart/form-data', // Define o tipo do conteúdo como multipart
        },
      });
    } catch (error) {
      // Erro ao tentar registrar usuário
      throw new Error('Erro ao realizar o cadastro');
    }
  },

  // Função de logout
  async logout(): Promise<void> {
    try {
      await api.post('/logout'); // Chama o endpoint de logout
      localStorage.removeItem('token'); // Remove o token do localStorage
    } catch (error) {
      // Erro ao tentar realizar logout
      throw new Error('Erro ao realizar logout');
    }
  },

  // Função para carregar o perfil do usuário
  async getProfile(): Promise<User> {
    try {
      const response = await api.get('/me'); // Retorna os dados do perfil do usuário
      return response.data; // Retorna o perfil do usuário
    } catch (error) {
      // Erro ao tentar obter o perfil do usuário
      throw new Error('Erro ao carregar perfil do usuário');
    }
  },

  async resetPassword(data: { token: string; email: string; password: string; password_confirmation: string }) {
    return await api.post('/reset-password', data);
  },

  // Função para enviar email de recuperação de senha
  async forgotPassword(email: string, recaptchaToken: string): Promise<void> {
    try {
      await api.post('/forgot-password', { email, recaptcha_token: recaptchaToken }); // Envia o email de recuperação
    } catch (error) {
      // Erro ao tentar enviar email de recuperação
      throw new Error('Erro ao enviar email de recuperação');
    }
  },

  // Função para redefinir a senha
  // async resetPassword(data: {
  //   token: string;
  //   email: string;
  //   password: string;
  //   password_confirmation: string;
  // }): Promise<void> {
  //   try {
  //     await api.post('/reset-password', data); // Envia os dados para redefinir a senha
  //   } catch (error) {
  //     // Erro ao tentar redefinir a senha
  //     throw new Error('Erro ao redefinir senha');
  //   }
  // },
};
