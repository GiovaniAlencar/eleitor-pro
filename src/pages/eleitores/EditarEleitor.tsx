import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { voterSchema, VoterFormData } from '../../schemas/voter.schema';
import VoterFormFields from '../../components/Voters/VoterFormFields';
import PageHeader from '../../components/Common/PageHeader';
import Breadcrumb from '../../components/Common/Breadcrumb';
import { Toaster } from 'sonner';
import { voterService } from '../../services/voter.service';
import LoadingScreen from '../../components/Common/LoadingScreen';
import { useViaCep } from '../../hooks/useViaCep';
import { formatDate } from '../../utils/date';
import { formatPhone, formatCEP } from '../../utils/format';
import { notificationService } from '../../services/notification.service';

export default function EditarEleitor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { searchCep, loading: loadingCep } = useViaCep();

  const form = useForm<VoterFormData>({
    resolver: zodResolver(voterSchema),
    defaultValues: {
      name: '',
      email: '',
      whatsapp: '',
      zip_code: '',
      address: '',
      number: '',
      neighborhood: '',
      city: '',
      birth_date: '',
      marital_status: ''
    }
  });

  const handleCepChange = async (cep: string) => {
    if (cep.length === 9) {
      const address = await searchCep(cep);
      if (address) {
        form.setValue('address', address.address);
        form.setValue('neighborhood', address.neighborhood);
        form.setValue('city', address.city);
      }
    }
  };

  const onSubmit = async (data: VoterFormData) => {
    try {
      const formattedData = {
        ...data,
        id: Number(id), // Include the ID in the form data
        birth_date: data.birth_date ? formatDate(data.birth_date, 'yyyy-MM-dd') : '',
        whatsapp: data.whatsapp ? data.whatsapp.replace(/\D/g, '') : '',
        zip_code: data.zip_code ? data.zip_code.replace(/\D/g, '') : ''
      };

      await voterService.updateVoter(Number(id), formattedData);
      notificationService.success('Eleitor atualizado com sucesso!');
      navigate('/eleitores');
    } catch (error) {
      console.error('Error updating voter:', error);
      notificationService.error('Erro ao atualizar eleitor');
    }
  };

  useEffect(() => {
    const loadVoter = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const voter = await voterService.getVoterDetails(Number(id));

        if (voter) {
          const formattedData = {
            ...voter,
            id: Number(id),
            whatsapp: formatPhone(voter.whatsapp || ''),
            zip_code: formatCEP(voter.zip_code || ''),
            birth_date: voter.birth_date ? formatDate(voter.birth_date) : ''
          };

          // Set form values
          Object.keys(formattedData).forEach(key => {
            form.setValue(key as keyof VoterFormData, formattedData[key]);
          });
        }
      } catch (error) {
        console.error('Error loading voter:', error);
        notificationService.error('Erro ao carregar dados do eleitor');
        navigate('/eleitores');
      } finally {
        setLoading(false);
      }
    };

    loadVoter();
  }, [id, navigate, form.setValue]);

  if (loading) {
    return <LoadingScreen message="Carregando dados do eleitor..." />;
  }

  const breadcrumbItems = [
    { label: 'HOME', href: '/' },
    { label: 'ELEITORES', href: '/eleitores' },
    { label: 'EDITAR' }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Toaster position="top-right" />
      
      <Breadcrumb items={breadcrumbItems} />
      
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