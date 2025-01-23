import { useState, useCallback, useEffect } from 'react';
import { User, UserFilters } from '../types/api';
import { userService } from '../services/user.service';
import { toast } from 'sonner';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const loadUsers = useCallback(async (filters: UserFilters) => {
    try {
      setLoading(true);
      setError(null);

      const response = await userService.getUsers(filters);

      if (response && Array.isArray(response.data)) {
        setUsers(response.data);
        setTotalPages(response.meta?.last_page || 1);
        setCurrentPage(response.meta?.current_page || 1);
      } else {
        setUsers([]); // Garante que o estado seja sempre um array
        toast.error('Erro: dados inesperados da API');
      }
    } catch (err) {
      console.error(err);
      const message = 'Erro ao carregar usuários';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []); // useCallback sem dependências

  // O hook `useEffect` garante que `loadUsers` seja chamado ao inicializar
  // ou ao mudar a página ou filtros
  useEffect(() => {
    loadUsers({ page: currentPage });
  }, [loadUsers, currentPage]); // Recarrega quando a página ou filtros mudam

  const deleteUser = async (id: number) => {
    try {
      await userService.deleteUser(id);
      toast.success('Usuário excluído com sucesso');
      return true;
    } catch (err) {
      toast.error('Erro ao excluir usuário');
      return false;
    }
  };

  return {
    users,
    loading,
    error,
    totalPages,
    currentPage,
    setCurrentPage, // Agora a página pode ser alterada diretamente
    loadUsers,
    deleteUser,
  };
}
