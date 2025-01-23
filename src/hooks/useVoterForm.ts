import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { voterSchema, VoterFormData } from '../schemas/voter.schema';
import { voterService } from '../services/voter.service';
import { useViaCep } from './useViaCep';
import { formatDate } from '../utils/date';
import { formatPhone, formatCEP } from '../utils/format';
import { notificationService } from '../services/notification.service';

import { profileService } from '../services/profile.service';
import { useEffect, useState } from 'react';


export function useVoterForm(isEditing = false) {
  const navigate = useNavigate();
  const { searchCep, loading: loadingCep } = useViaCep();
  const [userName, setUserName] = useState<string>(''); // Estado para armazenar o nome


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
      marital_status: '',
    }
  });

  const handleCepChange = async (cep: string) => {
    if (cep.length === 9) {
      const address = await searchCep(cep);
      console.log(address);
      if (address) {
        // Atualiza apenas os campos vazios
        form.setValue('address', address.address || form.getValues('address'));
        form.setValue('neighborhood', address.neighborhood || form.getValues('neighborhood'));
        form.setValue('city', address.city || form.getValues('city'));
        form.setValue('state', address.state || form.getValues('state'));
  
        if (address.latitude && address.longitude) {
          form.setValue('latitude', address.latitude);
          form.setValue('longitude', address.longitude);
        }
      }
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await profileService.getProfile(); // Chama o serviço para obter os dados do perfil
        setUserName(profile.id); // Assume que a resposta tem um campo 'name' com o nome 
      } catch (err) {
        console.error('Erro ao carregar perfil:', err);
      }
    };

    fetchProfile();
  }, []);

  const formatFormData = (data: VoterFormData) => {
    const formattedData = { ...data };

    formattedData.leader_id = userName

    if (data.birth_date) {
      const [day, month, year] = data.birth_date.split('/');
      formattedData.birth_date = `${year}-${month}-${day}`;
    }

    if (data.whatsapp) {
      formattedData.whatsapp = data.whatsapp.replace(/\D/g, '');
    }

    if (data.zip_code) {
      formattedData.zip_code = data.zip_code.replace(/\D/g, '');
    }

    return formattedData;
  };

  const parseFormData = (data: any) => {
    const parsedData = {
      id: data.id,
      name: data.name || '',
      email: data.email || '',
      whatsapp: data.whatsapp ? formatPhone(data.whatsapp) : '',
      zip_code: data.zip_code ? formatCEP(data.zip_code) : '',
      address: data.address || '',
      number: data.number || '',
      neighborhood: data.neighborhood || '',
      city: data.city || '',
      birth_date: data.birth_date ? formatDate(data.birth_date) : '',
      marital_status: data.marital_status || '',
      state: data.state || '',
      gender: data.gender || '',
      latitude: data.latitude,
      longitude: data.longitude
    };

    // Update form with parsed data
    Object.keys(parsedData).forEach(key => {
      form.setValue(key as keyof VoterFormData, parsedData[key]);
    });

    // Assinalar o valor correto para o campo gender
    if (parsedData.gender) {
      form.setValue('gender', parsedData.gender); // Atualiza o campo 'gender'
    }

    return parsedData;
  };


  const onSubmit = async (data: VoterFormData) => {
    try {
      const formattedData = formatFormData(data);

      if (isEditing && data.id) {
        await voterService.updateVoter(data.id, formattedData);
        notificationService.success('Eleitor atualizado com sucesso!');
      } else {
        await voterService.createVoter(formattedData);
        notificationService.success('Eleitor cadastrado com sucesso!');
      }
      navigate('/eleitores');
    } catch (error) {
      console.error('Error saving voter:', error);
      notificationService.error(
        error.response.data.message
      );
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