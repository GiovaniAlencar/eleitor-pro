import { useState } from 'react';
import axios from 'axios';
import { notificationService } from '../services/notification.service';

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export function useViaCep() {
  const [loading, setLoading] = useState(false);

  const searchCep = async (cep: string) => {
    const cleanedCep = cep.replace(/\D/g, '');
    
    if (cleanedCep.length !== 8) {
      return null;
    }

    try {
      setLoading(true);
      const response = await axios.get<ViaCepResponse>(
        `https://viacep.com.br/ws/${cleanedCep}/json/`
      );

      if (response.data.erro) {
        notificationService.error('CEP não encontrado');
        return null;
      }

      return {
        zip_code: response.data.cep,
        address: response.data.logradouro,
        neighborhood: response.data.bairro,
        city: response.data.localidade,
        state: response.data.uf
      };
    } catch (error) {
      notificationService.error('Erro ao buscar CEP');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    searchCep
  };
}