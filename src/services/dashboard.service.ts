import api from './api';

export interface GrowthData {
  eleitores: number;
  liderancas: number;
  cidades: number;
  date: string;
}

export interface DashboardStats {
  total_eleitores: number;
  total_liderancas: number;
  total_cidades: number;
  growth: GrowthData[];
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  async getGrowthData(period: 'week' | 'month' | 'year' = 'month'): Promise<GrowthData[]> {
    const response = await api.get(`/dashboard/growth?period=${period}`);
    return response.data;
  }
};