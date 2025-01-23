import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { leaderSchema, LeaderFormData } from '../schemas/leader.schema';
import { leaderService } from '../services/leader.service';
import { useViaCep } from './useViaCep';
import { formatDate } from '../utils/date';
import { formatPhone, formatCEP } from '../utils/format';

import { profileService } from '../services/profile.service';
import { useEffect, useState } from 'react';


export function useLeaderForm(isEditing = false) {
  const navigate = useNavigate();
  const { searchCep, loading: loadingCep } = useViaCep();
  const [userName, setUserName] = useState<string>(''); // Estado para armazenar o nome

  const form = useForm<LeaderFormData>({
    resolver: zodResolver(leaderSchema),
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

  // useEffect(() => {
  //   console.log('Erros no formulário:', form.formState.errors);
  // }, [form.formState.errors]);

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

  const handleCepChange = async (cep: string) => {
    if (cep.length === 9) {
      const address = await searchCep(cep);
      // console.log(address)
      if (address) {
        form.setValue('address', address.address);
        form.setValue('neighborhood', address.neighborhood);
        form.setValue('city', address.city);
        form.setValue('state', address.state);

        if (address.latitude && address.longitude) {
          form.setValue('latitude', address.latitude);
          form.setValue('longitude', address.longitude);
        }
      }
    }
  };

  const formatFormData = (data: LeaderFormData) => {
    const formattedData = { ...data };

    // formattedData.id_user = data.whatsapp.replace(/\D/g, '');
    formattedData.id_user = userName

    console.log(formattedData)
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
      state: data.state || '',
      birth_date: data.birth_date ? formatDate(data.birth_date) : '',
      marital_status: data.marital_status || '',
      latitude: data.latitude,
      longitude: data.longitude,
      children: data.children,
      voteGoal: data.voteGoal,
      gender: data.gender,
      id_user: data.id_user,
    };

    // Update form with parsed data
    Object.keys(parsedData).forEach(key => {
      form.setValue(key as keyof LeaderFormData, parsedData[key]);
    });

    return parsedData;
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
      // toast.error(
      //   isEditing ? 'Erro ao atualizar liderança' : 'Erro ao cadastrar liderança'
      // );
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