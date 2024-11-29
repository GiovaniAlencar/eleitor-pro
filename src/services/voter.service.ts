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

export const voterService = {
  async getVoters(filters: VoterFilters): Promise<PaginatedResponse<Voter>> {
    try {
      const response = await api.get('/voters', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao carregar eleitores');
    }
  },

  async exportVoters(): Promise<VoterExportData[]> {
    try {
      const response = await api.get('/voters/export');
      return response.data;
    } catch (error) {
      throw new Error('Erro ao exportar eleitores');
    }
  },

  async createVoter(data: Partial<Voter>): Promise<Voter> {
    try {
      const response = await api.post('/voters', data);
      
      // Create notification for new voter
      await notificationService.createNotification({
        title: 'Novo Eleitor Cadastrado',
        message: `${data.name} foi cadastrado(a) como novo(a) eleitor(a)`,
        type: 'success'
      });
      
      return response.data;
    } catch (error) {
      throw new Error('Erro ao criar eleitor');
    }
  },

  async updateVoter(id: number, data: Partial<Voter>): Promise<Voter> {
    try {
      const response = await api.put(`/voters/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao atualizar eleitor');
    }
  },

  async deleteVoter(id: number): Promise<void> {
    try {
      await api.delete(`/voters/${id}`);
    } catch (error) {
      throw new Error('Erro ao excluir eleitor');
    }
  },

  async getVoterDetails(id: number): Promise<Voter> {
    try {
      const response = await api.get(`/voters/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao carregar detalhes do eleitor');
    }
  }
};