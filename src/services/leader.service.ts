import api from './api';
import { PaginatedResponse, Leader, LeaderProfile } from '../types/api';
import { notificationService } from './notification.service';

export interface LeaderFilters {
  page?: number;
  search?: string;
  status?: string;
  city?: string;
}
export interface CityStatistic {
  city: string;
  total: number;
}

export const leaderService = {
  async getLeaders(params: LeaderFilters): Promise<PaginatedResponse<Leader>> {
    try {
      const response = await api.get('/leaders', { params });
      return response.data;
    } catch (error) {
      console.error('Error loading leaders:', error);
      return { data: [], meta: { current_page: 1, last_page: 1, per_page: 10, total: 0 } };
    }
  },

  async getCityStatistics(): Promise<CityStatistic[]> {
    const response = await api.get('/map/stats');
    return response.data;
  },

  async exportLeaders(): Promise<Leader[]> {
    try {
      const response = await api.get('/leaders/export'); // Endpoint correto
      return response.data;
    } catch (error) {
      console.error('Erro ao exportar líderes:', error);
      return [];
    }
  },

  async createLeader(data: Partial<Leader>): Promise<Leader> {

    const response = await api.post('/leaders', data);

    await notificationService.createNotification({
      title: 'Nova Liderança Cadastrada',
      message: `${data.name} foi cadastrado(a) como novo(a) liderança`,
      type: 'success'
    });

    
    return response.data.data;
    // window.location.reload();
  },

  async updateLeader(id: number, data: Partial<Leader>): Promise<Leader> {
    const response = await api.put(`/leaders/${id}`, data);

    await notificationService.createNotification({
      title: 'Cadastro de Liderança Atualizada',
      message: `O cadastro de ${data.name} liderança foi atualizado`,
      type: 'success'
    });

    return response.data.data;
    // window.location.reload();
  },

  async updateLeaderStatus(id: number, status: 'active' | 'inactive', name: string): Promise<void> {
    const response = await api.put(`/leaders/${id}/status`, { status });
  
    await notificationService.createNotification({
      title: 'Status de Liderança Atualizado',
      message: `O status da liderança ${name} foi alterado para ${status === 'active' ? 'Ativo' : 'Inativo'}.`,
      type: 'success',
    });
  
    return response.data.data;
  },  
  

  async deleteLeader(id: number): Promise<void> {
    try {
      const response = await api.get(`/leaders/${id}`); // Busca os dados do eleitor
      const leader = response.data;

      await notificationService.createNotification({
        title: 'Eleitor(a) excluído(a)',
        message: `O cadastro de ${leader.data.name} foi excluído`,
        type: 'success'
      });

      await api.delete(`/leaders/${id}`);
    } catch (error) {
      console.error('Erro ao excluir liderança:', error);
      throw new Error('Erro ao excluir liderança.');
    }
  },
  async getLeaderProfile(id: number): Promise<LeaderProfile> {
    const response = await api.get(`/leaders/${id}/profile`);
    return response.data;
  },

  async getLeaderDetails(id: number): Promise<Leader> {
    const response = await api.get(`/leaders/${id}`);
    return response.data.data;
  },

  async updateLeaderPhoto(id: number, photo: File): Promise<{ photo_url: string }> {
    const formData = new FormData();
    formData.append('photo', photo);
  
    const response = await api.post(`/profile/${id}/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  
    console.log("API Response:", response.data);
    return response.data.data;
    window.location.reload(true);

  }
};