import { useState, useEffect } from 'react';
import { dashboardService, Statistics, CityStatistic, GrowthMetric } from '../services/dashboard.service';
import { notificationService } from '../services/notification.service';

export function useDashboardMetrics() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [cityStats, setCityStats] = useState<CityStatistic[]>([]);
  const [growthMetrics, setGrowthMetrics] = useState<GrowthMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [stats, cities, growth] = await Promise.all([
        dashboardService.getStatistics(),
        dashboardService.getCityStatistics(),
        dashboardService.getGrowthMetrics()
      ]);

      setStatistics(stats);
      setCityStats(cities);
      setGrowthMetrics(growth);
    } catch (err) {
      const message = 'Erro ao carregar dados do dashboard';
      setError(message);
      notificationService.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    statistics,
    cityStats,
    growthMetrics,
    loading,
    error,
    refresh: loadDashboardData
  };
}