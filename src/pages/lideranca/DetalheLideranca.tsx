import { useParams, useNavigate } from 'react-router-dom';
import { useLeaderProfile } from '../../hooks/useLeaderProfile';
import LeaderProfileHeader from '../../components/Leaders/LeaderProfileHeader';
import LeaderProfileInfo from '../../components/Leaders/LeaderProfileInfo';
import AlertDialog from '../../components/Common/AlertDialog';
import { useState } from 'react';
import { leaderService } from '../../services/leader.service';
import { toast } from 'sonner';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DetalheLideranca() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { leader, loading, error, updatePhoto } = useLeaderProfile(Number(id));
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (error || !leader) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">{error || 'Liderança não encontrada'}</p>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      await leaderService.deleteLeader(leader.id);
      toast.success('Liderança excluída com sucesso');
      navigate('/lideranca');
    } catch (err) {
      toast.error('Erro ao excluir liderança');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-gray-900">HOME</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/lideranca" className="hover:text-gray-900">LIDERANÇAS</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-gray-900">PERFIL</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/3">
          <LeaderProfileHeader
            leader={leader}
            onPhotoChange={updatePhoto}
          />
        </div>

        <div className="lg:w-2/3">
          <LeaderProfileInfo
            leader={leader}
            onDelete={() => setShowDeleteDialog(true)}
          />
        </div>
      </div>

      <AlertDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir esta liderança? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
}