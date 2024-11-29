import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { leaderSchema, LeaderFormData } from '../schemas/leader.schema';
import { leaderService } from '../services/leader.service';
import { useViaCep } from './useViaCep';
import { formatDate } from '../utils/date';
import { formatPhone, formatCEP } from '../utils/format';

export function useLeaderForm(isEditing = false) {
  const navigate = useNavigate();
  const { searchCep, loading: loadingCep } = useViaCep();
  
  const form = useForm<LeaderFormData>({
    resolver: zodResolver(leaderSchema)
  });

  const handleCepChange = async (cep: string) => {
    if (cep.length === 9) { // Format: 00000-000
      const address = await searchCep(cep);
      if (address) {
        form.setValue('address', address.address);
        form.setValue('neighborhood', address.neighborhood);
        form.setValue('city', address.city);
      }
    }
  };

  const formatFormData = (data: LeaderFormData) => {
    // Format date to API expected format (YYYY-MM-DD)
    if (data.birth_date) {
      const [day, month, year] = data.birth_date.split('/');
      data.birth_date = `${year}-${month}-${day}`;
    }
    
    // Remove mask from phone number
    if (data.whatsapp) {
      data.whatsapp = data.whatsapp.replace(/\D/g, '');
    }
    
    // Remove mask from CEP
    if (data.zip_code) {
      data.zip_code = data.zip_code.replace(/\D/g, '');
    }

    return data;
  };

  const parseFormData = (data: any) => {
    return {
      ...data,
      // Format date from API (YYYY-MM-DD) to form format (DD/MM/YYYY)
      birth_date: data.birth_date ? formatDate(data.birth_date.split('T')[0]) : '',
      // Format phone number
      whatsapp: data.whatsapp ? formatPhone(data.whatsapp) : '',
      // Format CEP
      zip_code: data.zip_code ? formatCEP(data.zip_code) : ''
    };
  };

  const onSubmit = async (data: LeaderFormData) => {
    try {
      const formattedData = formatFormData(data);
      
      if (isEditing && data.id) {
        await leaderService.updateLeader(data.id, formattedData);
        toast.success('Liderança atualizada com sucesso!');
      } else {
        await leaderService.createLeader(formattedData);
        toast.success('Liderança cadastrada com sucesso!');
      }
      navigate('/lideranca');
    } catch (error) {
      console.error('Error saving leader:', error);
      toast.error(isEditing ? 'Erro ao atualizar liderança' : 'Erro ao cadastrar liderança');
    }
  };

  return {
    form,
    onSubmit,
    handleCepChange,
    loadingCep,
    parseFormData
  };
}