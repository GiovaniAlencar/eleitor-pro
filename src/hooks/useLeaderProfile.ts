import { useState, useEffect } from 'react';
import { LeaderProfile } from '../types/api';
import { leaderService } from '../services/leader.service';
import { toast } from 'sonner';

export function useLeaderProfile(id: number) {
  const [leader, setLeader] = useState<LeaderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLeaderProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await leaderService.getLeaderProfile(id);
      setLeader(data);
    } catch (err) {
      const message = 'Erro ao carregar perfil da liderança';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const updatePhoto = async (photo: File) => {
    try {
      await leaderService.updateLeaderPhoto(id, photo);
      await loadLeaderProfile();
      toast.success('Foto atualizada com sucesso');
    } catch (err) {
      toast.error('Erro ao atualizar foto');
    }
  };

  useEffect(() => {
    loadLeaderProfile();
  }, [id]);

  return {
    leader,
    loading,
    error,
    updatePhoto,
    reloadProfile: loadLeaderProfile
  };
}