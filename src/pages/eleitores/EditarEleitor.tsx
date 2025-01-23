import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVoterForm } from '../../hooks/useVoterForm';
import VoterFormFields from '../../components/Voters/VoterFormFields';
import PageHeader from '../../components/Common/PageHeader';
import { Toaster } from 'sonner';
import { voterService } from '../../services/voter.service';
import LoadingScreen from '../../components/Common/LoadingScreen'; // Tela de carregamento

export default function EditarEleitor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { form, onSubmit, handleCepChange, loadingCep, parseFormData } = useVoterForm(true);

  const [loading, setLoading] = useState(true);  // Estado de carregamento
  const [error, setError] = useState<string | null>(null);  // Estado para erro
  const [voterDataLoaded, setVoterDataLoaded] = useState(false); // Controla se os dados foram carregados

  useEffect(() => {
    // Evita que a requisição seja feita sem id válido
    if (!id) return;

    const loadVoter = async () => {
      // setLoading(true);
      setError(null);  // Reseta o erro antes de tentar carregar os dados
      try {
        const response = await voterService.getVoterDetails(Number(id));
        const voter = response.data;
        if (voter) {
          // Chamamos parseFormData apenas uma vez quando os dados estiverem carregados
          parseFormData(voter); 
          setVoterDataLoaded(true); // Marca que os dados foram carregados
          setLoading(false); // Finaliza o carregamento
        }
      } catch (error) {
        setError('Erro ao carregar os dados do eleitor.');
        console.error('Error loading voter:', error);
        navigate('/eleitores'); // Redireciona para a lista de eleitores em caso de erro
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };

    loadVoter();
  }, [id, navigate]);  // Evita que parseFormData cause re-renderizações infinitas

  // Exibe a tela de erro se houver um erro
  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // Exibe a tela de carregamento enquanto os dados estão sendo carregados
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingScreen message="Carregando dados do eleitor..." /> {/* Componente de Loading */}
      </div>
    );
  }

  // Exibe o formulário depois que os dados foram carregados
  if (voterDataLoaded) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Toaster position="top-right" />

        <PageHeader
          title="Editar Eleitor"
          subtitle="Atualize as informações do eleitor"
          backTo="/eleitores"
        />

        <VoterFormFields
          form={form}
          onSubmit={onSubmit}
          handleCepChange={handleCepChange}
          loadingCep={loadingCep}
          isEditing={true}
        />
      </div>
    );
  }

  return null; // Retorna null se não estiver carregando nem com erro
}
