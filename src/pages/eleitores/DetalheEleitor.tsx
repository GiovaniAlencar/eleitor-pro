import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { voterService } from '../../services/voter.service';
import VoterProfileHeader from '../../components/Voters/VoterProfileHeader';
import VoterProfileInfo from '../../components/Voters/VoterProfileInfo';
import AlertDialog from '../../components/Common/AlertDialog';
import { toast } from 'sonner';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoadingScreen from '../../components/Common/LoadingScreen'; // Tela de Carregamento

export default function DetalheEleitor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [voter, setVoter] = useState<any | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVoterDetails() {
      setLoading(true);
      setError(null);
      try {
        const response = await voterService.getVoterDetails(Number(id));
        setVoter(response.data);
      } catch (error) {
        setError('Erro ao carregar detalhes do eleitor');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchVoterDetails();
  }, [id]);

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
        <LoadingScreen message="Carregando detalhes do eleitor..." /> {/* Tela de loading */}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-gray-900">HOME</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/eleitores" className="hover:text-gray-900">ELEITORES</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-gray-900">PERFIL</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/3">
          <VoterProfileHeader voter={voter} />
        </div>

        <div className="lg:w-2/3">
          <VoterProfileInfo
            voter={voter}
            onDelete={() => setShowDeleteDialog(true)}
            onStatusChange={async () => {
              try {
                const newStatus = voter.status === 'active' ? 'inactive' : 'active';
                await voterService.updateVoterStatus(voter.id, newStatus, voter.name);
                toast.success(`Status alterado para ${newStatus}`);
                const response = await voterService.getVoterDetails(Number(id));
                setVoter(response.data);
              } catch (error) {
                toast.error('Erro ao alterar status do eleitor');
                console.error(error);
              }
            }}
          />
        </div>
      </div>

      <AlertDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={async () => {
          try {
            await voterService.deleteVoter(voter.id);
            toast.success('Eleitor excluído com sucesso');
            navigate('/eleitores');
          } catch {
            toast.error('Erro ao excluir eleitor');
          }
        }}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este eleitor? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
}
