import { useVoterForm } from '../../hooks/useVoterForm';
import VoterFormFields from '../../components/Voters/VoterFormFields';
import PageHeader from '../../components/Common/PageHeader';
import { Toaster } from 'sonner';

export default function NovoEleitor() {
  const { form, onSubmit, handleCepChange, loadingCep } = useVoterForm();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Toaster position="top-right" />
      
      <PageHeader
        title="Cadastrar Eleitor"
        subtitle="Preencha os campos abaixo:"
        backTo="/eleitores"
      />

      <VoterFormFields
        form={form}
        onSubmit={onSubmit}
        handleCepChange={handleCepChange}
        loadingCep={loadingCep}
      />
    </div>
  );
}