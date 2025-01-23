import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLeaderForm } from '../../hooks/useLeaderForm';
import LeaderFormFields from '../../components/Leaders/LeaderFormFields';
import PageHeader from '../../components/Common/PageHeader';
import { Toaster } from 'sonner';
import { leaderService } from '../../services/leader.service';
import LoadingScreen from '../../components/Common/LoadingScreen'; // Importando o LoadingScreen

export default function EditarLideranca() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { form, onSubmit, handleCepChange, loadingCep, parseFormData } = useLeaderForm(true);
  
  // Estado de carregamento e erro
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLeader = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const leader = await leaderService.getLeaderDetails(Number(id));
        if (leader) {
          parseFormData(leader);
        } else {
          setError('Liderança não encontrada.');
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError('Erro ao carregar os dados da liderança.');
        console.error('Error loading leader:', error);
      }
    };

    loadLeader();
  }, [id]);

  // Exibe a tela de carregamento enquanto os dados estão sendo carregados
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingScreen message="Carregando dados da liderança..." /> {/* Tela de loading */}
      </div>
    );
  }

  // Exibe mensagem de erro caso algo dê errado
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">{error}</div> {/* Mensagem de erro */}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Toaster position="top-right" />

      <PageHeader
        title="Editar Liderança"
        subtitle="Atualize as informações da liderança"
        backTo="/lideranca"
      />

      <LeaderFormFields
        form={form}
        onSubmit={onSubmit}
        handleCepChange={handleCepChange}
        loadingCep={loadingCep}
        isEditing={true}
      />
    </div>
  );
}
