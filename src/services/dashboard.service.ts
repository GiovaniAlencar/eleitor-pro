import api from './api';

export interface Statistics {
  total_voters: number;
  total_leaders: number;
  total_cities: number;
  growth: {
    voters: number;
    leaders: number;
    cities: number;
  };
}

export interface CityStatistic {
  city: string;
  total: number;
}

export interface GrowthMetric {
  date: string;
  voters: number;
  leaders: number;
  cities: number;
}

export const dashboardService = {
  async getStats(): Promise<Statistics> {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  async getCityStatistics(): Promise<CityStatistic[]> {
    const response = await api.get('/cities');
    return response.data;
  },

  async getGrowthMetrics(): Promise<GrowthMetric[]> {
    const response = await api.get('/dashboard/growth');
    return response.data;
  },

  async getUserProfile(): Promise<any> {
    const response = await api.get('/user-profile');
    return response.data;
  },

  async getGrowthData(period: 'week' | 'month' | 'year'): Promise<GrowthMetric[]> {
    const metrics = await this.getGrowthMetrics(); // Obtém todos os dados de crescimento.
    
    const now = new Date();
    const startDate = new Date(
      period === 'week' ? now.setDate(now.getDate() - 7) :
      period === 'month' ? now.setMonth(now.getMonth() - 1) :
      now.setFullYear(now.getFullYear() - 1)
    );

    // Filtra os dados com base no período selecionado.
    return metrics.filter(metric => new Date(metric.date) >= startDate);
  }
};