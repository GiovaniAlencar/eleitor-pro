import api from './api'; // Sua configuração de axios ou similar
import { PaginatedResponse, User } from '../types/api'; // Tipos esperados

export interface UserFilters {
  page?: number;
  search?: string;
  perPage?: number;
  status?: string;
}

export const userService = {
  async getUsers(params: UserFilters): Promise<PaginatedResponse<User>> {
    try {
      const response = await api.get('/users', { params });

      // Verifica se a resposta contém os dados esperados
      if (response.data && Array.isArray(response.data.data)) {
        return response.data; // Retorna os dados paginados
      } else {
        console.warn('Formato inesperado da API:', response.data);
        return { data: [], meta: { current_page: 1, last_page: 1, per_page: 10, total: 0 } };
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      return { data: [], meta: { current_page: 1, last_page: 1, per_page: 10, total: 0 } };
    }
  },

  async createUser(data: Partial<User>): Promise<User> {
    const response = await api.post('/users', data);

    return response.data.data; // Retorna o usuário criado
  },

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const response = await api.put(`/users/${id}/status`, data);

    return response.data.data; // Retorna o usuário atualizado
  },

  async deleteUser(id: number): Promise<void> {
    try {
      const response = await api.get(`/users/${id}`); // Busca os dados do usuário para notificação
      const user = response.data;

      // Exemplo de notificação, adapte conforme necessário
      console.log(`Usuário ${user.data.name} foi excluído.`);

      await api.delete(`/users/${id}`);
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      throw new Error('Erro ao excluir usuário.');
    }
  },

  async getUserDetails(id: number): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data.data; // Retorna detalhes do usuário
  },

  async updateUserStatus(id: number, status: 'active' | 'inactive'): Promise<User> {
    try {
      const response = await api.put(`/users/${id}/status`, { status });

      // Exemplo de notificação, adapte conforme necessário
      console.log(`Status do usuário foi atualizado para: ${status}.`);

      return response.data.data; // Retorna o usuário atualizado
    } catch (error) {
      console.error('Erro ao atualizar status do usuário:', error);
      throw new Error('Erro ao atualizar status do usuário.');
    }
  },
};
