import { useLeaderForm } from '../../hooks/useLeaderForm';
import LeaderFormFields from '../../components/Leaders/LeaderFormFields';
import PageHeader from '../../components/Common/PageHeader';
import { Toaster } from 'sonner';

export default function NovaLideranca() {
  const { form, onSubmit, handleCepChange, loadingCep } = useLeaderForm();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Toaster position="top-right" />
      
      <PageHeader
        title="Cadastrar Liderança"
        subtitle="Preencha os campos abaixo:"
        backTo="/lideranca"
      />

      <LeaderFormFields
        form={form}
        onSubmit={onSubmit}
        handleCepChange={handleCepChange}
        loadingCep={loadingCep}
      />
    </div>
  );
}