import { useState, useCallback } from 'react';
import { Leader, LeaderFilters } from '../types/api';
import { leaderService } from '../services/leader.service';
import { toast } from 'sonner';

export function useLeaders() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const loadLeaders = useCallback(async (filters: LeaderFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await leaderService.getLeaders(filters);
      
      if (response && response.data) {
        setLeaders(response.data);
        setTotalPages(response.meta?.last_page || 1);
        setCurrentPage(response.meta?.current_page || 1);
      }
    } catch (err) {
      const message = 'Erro ao carregar lideranças';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteLeader = async (id: number) => {
    try {
      await leaderService.deleteLeader(id);
      toast.success('Liderança excluída com sucesso');
      return true;
    } catch (err) {
      toast.error('Erro ao excluir liderança');
      return false;
    }
  };

  return {
    leaders,
    loading,
    error,
    totalPages,
    currentPage,
    loadLeaders,
    deleteLeader
  };
}