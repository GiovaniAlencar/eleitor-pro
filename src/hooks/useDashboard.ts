import { useState, useEffect } from 'react';
import { dashboardService, DashboardStats, GrowthData } from '../services/dashboard.service';
import { notificationService } from '../services/notification.service';

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [growthData, setGrowthData] = useState<GrowthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (err) {
      notificationService.error('Erro ao carregar estatísticas do dashboard');
      setError('Erro ao carregar estatísticas do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const loadGrowthData = async (period: 'week' | 'month' | 'year' = 'month') => {
    try {
      setLoading(true);
      const data = await dashboardService.getGrowthData(period);
      setGrowthData(data);
    } catch (err) {
      notificationService.error('Erro ao carregar dados de crescimento');
      setError('Erro ao carregar dados de crescimento');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    loadGrowthData();
  }, []);

  return {
    stats,
    growthData,
    loading,
    error,
    refreshStats: loadStats,
    refreshGrowthData: loadGrowthData
  };
}