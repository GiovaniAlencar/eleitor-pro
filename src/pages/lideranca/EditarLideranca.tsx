import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLeaderForm } from '../../hooks/useLeaderForm';
import LeaderFormFields from '../../components/Leaders/LeaderFormFields';
import PageHeader from '../../components/Common/PageHeader';
import { Toaster } from 'sonner';
import { leaderService } from '../../services/leader.service';

export default function EditarLideranca() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { form, onSubmit, handleCepChange, loadingCep, parseFormData } = useLeaderForm(true);

  useEffect(() => {
    const loadLeader = async () => {
      if (!id) return;
      try {
        const leader = await leaderService.getLeaderDetails(Number(id));
        const formattedData = parseFormData(leader);
        form.reset(formattedData);
      } catch (error) {
        console.error('Error loading leader:', error);
        navigate('/lideranca');
      }
    };

    loadLeader();
  }, [id, form, navigate, parseFormData]);

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