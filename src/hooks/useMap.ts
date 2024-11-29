import { useState, useEffect } from 'react';
import { mapService, MapStats, MapMarker } from '../services/map.service';
import { notificationService } from '../services/notification.service';

export function useMap() {
  const [stats, setStats] = useState<MapStats | null>(null);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await mapService.getStats();
      setStats(data);
    } catch (err) {
      notificationService.error('Erro ao carregar estatísticas do mapa');
      setError('Erro ao carregar estatísticas do mapa');
    } finally {
      setLoading(false);
    }
  };

  const loadMarkers = async (filters?: { type?: 'voter' | 'leader'; city?: string }) => {
    try {
      setLoading(true);
      const data = await mapService.getMarkers(filters);
      setMarkers(data);
    } catch (err) {
      notificationService.error('Erro ao carregar marcadores do mapa');
      setError('Erro ao carregar marcadores do mapa');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    loadMarkers();
  }, []);

  return {
    stats,
    markers,
    loading,
    error,
    refreshStats: loadStats,
    refreshMarkers: loadMarkers
  };
}