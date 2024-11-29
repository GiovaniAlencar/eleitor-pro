import { useState, useCallback } from 'react';
import { voterService } from '../services/voter.service';
import { notificationService } from '../services/notification.service';
import { Voter } from '../types/api';

export function useVoters() {
  const [voters, setVoters] = useState<Voter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const loadVoters = useCallback(async (filters: {
    page?: number;
    search?: string;
    status?: string;
    city?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await voterService.getVoters(filters);
      
      if (response && response.data) {
        setVoters(response.data);
        if (response.meta) {
          setTotalPages(response.meta.last_page || 1);
          setCurrentPage(response.meta.current_page || 1);
        }
      }
    } catch (err) {
      const message = 'Erro ao carregar eleitores';
      setError(message);
      notificationService.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteVoter = async (id: number) => {
    try {
      await voterService.deleteVoter(id);
      notificationService.success('Eleitor excluído com sucesso');
      return true;
    } catch (err) {
      notificationService.error('Erro ao excluir eleitor');
      return false;
    }
  };

  return {
    voters,
    loading,
    error,
    totalPages,
    currentPage,
    loadVoters,
    deleteVoter
  };
}