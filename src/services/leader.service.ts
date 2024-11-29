import api from './api';
import { PaginatedResponse, Leader, LeaderProfile } from '../types/api';

export interface LeaderFilters {
  page?: number;
  search?: string;
  status?: string;
  city?: string;
}

export const leaderService = {
  async getLeaders(params: LeaderFilters): Promise<PaginatedResponse<Leader>> {
    try {
      const response = await api.get('/leaders', { params });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao carregar lideranças');
    }
  },

  async exportLeaders(): Promise<Leader[]> {
    try {
      const response = await api.get('/leaders/export', {
        params: { all: true }
      });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao exportar lideranças');
    }
  },

  async createLeader(data: Partial<Leader>): Promise<Leader> {
    try {
      const response = await api.post('/leaders', data);
      return response.data.data;
    } catch (error) {
      throw new Error('Erro ao criar liderança');
    }
  },

  async updateLeader(id: number, data: Partial<Leader>): Promise<Leader> {
    try {
      const response = await api.put(`/leaders/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw new Error('Erro ao atualizar liderança');
    }
  },

  async deleteLeader(id: number): Promise<void> {
    try {
      await api.delete(`/leaders/${id}`);
    } catch (error) {
      throw new Error('Erro ao excluir liderança');
    }
  },

  async getLeaderProfile(id: number): Promise<LeaderProfile> {
    try {
      const response = await api.get(`/leaders/${id}/profile`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao carregar perfil da liderança');
    }
  },

  async updateLeaderPhoto(id: number, photo: File): Promise<{ photo_url: string }> {
    try {
      const formData = new FormData();
      formData.append('photo', photo);
      
      const response = await api.post(`/leaders/${id}/photo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao atualizar foto da liderança');
    }
  },

  async getLeaderDetails(id: number): Promise<Leader> {
    try {
      const response = await api.get(`/leaders/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error('Erro ao carregar detalhes da liderança');
    }
  }
};