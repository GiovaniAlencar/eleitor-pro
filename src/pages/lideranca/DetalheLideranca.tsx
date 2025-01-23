import { useParams, useNavigate } from 'react-router-dom';
import { useLeaderProfile } from '../../hooks/useLeaderProfile';
import LeaderProfileHeader from '../../components/Leaders/LeaderProfileHeader';
import LeaderProfileInfo from '../../components/Leaders/LeaderProfileInfo';
import AlertDialog from '../../components/Common/AlertDialog';
import ImageCropper from '../../components/Common/ImageCropper';
import { useState, useEffect } from 'react';
import { leaderService } from '../../services/leader.service';
import { toast } from 'sonner';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoadingScreen from '../../components/Common/LoadingScreen'; // Importando o LoadingScreen

export default function DetalheLideranca() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { leader, updatePhoto, loading, error } = useLeaderProfile(Number(id)); // Pegando o estado de loading e erro
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Estados para o Cropper
  const [showCropper, setShowCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      toast.error('Erro ao carregar os dados da liderança');
    }
  }, [error]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingScreen message="Carregando dados da liderança..." /> {/* Exibe a tela de loading */}
      </div>
    );
  }

  if (!leader) {
    return null;
  }

  // Método para capturar a imagem e abrir o Cropper
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0]; // Garante que `files` exista antes de acessar o índice
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    } else {
      console.error('Nenhum arquivo foi selecionado.');
    }
  };

  // Método para enviar a imagem recortada
  const handleCropComplete = async (croppedImage: string) => {
    try {
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const file = new File([blob], 'cropped-image.jpg', { type: blob.type });

      // Atualiza a foto usando o método da API
      await updatePhoto(file);
      toast.success('Foto atualizada com sucesso!');
      setShowCropper(false);
      setSelectedImage(null);
    } catch (error) {
      toast.error('Erro ao atualizar a foto');
      console.error(error);
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
            onPhotoChange={handleImageSelect} // Passa o método de seleção de imagem
          />
        </div>

        <div className="lg:w-2/3">
          <LeaderProfileInfo
            leader={leader}
            onDelete={() => setShowDeleteDialog(true)}
            onStatusChange={async () => {
              // Alteração de status (pode ser extraído para uma função separada)
              const newStatus = leader.status === 'active' ? 'inactive' : 'active';
              await leaderService.updateLeaderStatus(leader.id, newStatus, leader.name);
              toast.success(`Status alterado para ${newStatus}`);
              window.location.reload();
            }}
          />
        </div>
      </div>

      <AlertDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={async () => {
          try {
            await leaderService.deleteLeader(leader.id);
            toast.success('Liderança excluída com sucesso');
            navigate('/lideranca');
          } catch {
            toast.error('Erro ao excluir liderança');
          }
        }}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir esta liderança? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />

      {/* Modal do Cropper */}
      {showCropper && selectedImage && (
        <ImageCropper
          image={selectedImage}
          onCropComplete={handleCropComplete}
          onClose={() => setShowCropper(false)}
        />
      )}
    </div>
  );
}
