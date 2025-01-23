import api from './api';
import { PaginatedResponse, Voter } from '../types/api';
import { notificationService } from './notification.service';

export interface VoterFilters {
  page?: number;
  search?: string;
  status?: string;
  city?: string;
  leader_id?: number;
}

export interface VoterExportData {
  Nome: string;
  Email: string;
  Whatsapp: string;
  Cidade: string;
  Bairro: string;
  Status: string;
  Liderança: string;
}

export interface CityStatistic {
  city: string;
  total: number;
}

export const voterService = {
  async getVoters(filters: VoterFilters): Promise<PaginatedResponse<Voter>> {
    try {
      const response = await api.get('/voters', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error loading voters:', error);
      return { data: [], meta: { current_page: 1, last_page: 1, per_page: 10, total: 0 } };
    }
  },

  async getCityStatistics(): Promise<CityStatistic[]> {
    const response = await api.get('/map/stats');
    return response.data;
  },

  async exportVoters(): Promise<VoterExportData[]> {
    try {
      const response = await api.get('/voters/export');
      return response.data;
    } catch (error) {
      console.error('Error exporting voters:', error);
      return [];
    }
  },

  async createVoter(data: Partial<Voter>): Promise<Voter> {
    const response = await api.post('/voters', data);
    
    await notificationService.createNotification({
      title: 'Novo Eleitor Cadastrado',
      message: `${data.name} foi cadastrado(a) como novo(a) eleitor(a)`,
      type: 'success'
    });
    
    return response.data;
  },

  async updateVoter(id: number, data: Partial<Voter>): Promise<Voter> {
    await notificationService.createNotification({
      title: 'Cadastro de editor atualizado',
      message: `O cadastro de ${data.name} eleitor(a) foi atualizado`,
      type: 'success'
    });

    const response = await api.put(`/voters/${id}`, data);
    return response.data;
  },

  async deleteVoter(id: number): Promise<void> {
    try {
      const response = await api.get(`/voters/${id}`); // Busca os dados do eleitor
      const voter = response.data;
      
      await notificationService.createNotification({
        title: 'Eleitor(a) excluído(a)',
        message: `O cadastro de ${voter.data.name} foi excluído`,
        type: 'success'
      });
  
      await api.delete(`/voters/${id}`);
    } catch (error) {
      console.error('Erro ao excluir eleitor:', error);
      throw new Error('Erro ao excluir eleitor.');
    }
  },

  async updateVoterStatus(id: number, status: 'active' | 'inactive', name: string): Promise<void> {
    const response = await api.put(`/voters/${id}/status`, { status });
  
    await notificationService.createNotification({
      title: 'Status de Eleitor Atualizado',
      message: `O status de eleitor ${name} foi alterado para ${status === 'active' ? 'Ativo' : 'Inativo'}.`,
      type: 'success',
    });
  
    return response.data.data;
  },  

  async importVoters(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await api.post('/voters/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      await notificationService.createNotification({
        title: 'Importação concluída',
        message: 'Eleitores importados com sucesso!',
        type: 'success',
      });
  
      return response.data;
    } catch (error) {
      console.error('Erro ao importar eleitores:', error);
  
      notificationService.error('Não foi possível importar os eleitores. Verifique o arquivo e tente novamente');

      // await notificationService.createNotification({
      //   title: 'Erro na Importação',
      //   message: 'Não foi possível importar os eleitores. Verifique o arquivo e tente novamente.',
      //   type: 'error',
      // });
  
      throw error;
    }
  },
  

  async getVoterDetails(id: number): Promise<Voter> {
    const response = await api.get(`/voters/${id}`);
    return response.data;
  }
};