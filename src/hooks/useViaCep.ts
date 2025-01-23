import { useState } from 'react';
import axios from 'axios';
import { notificationService } from '../services/notification.service';

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  latitude: string;
  longitude: string;
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

      const addressData = {
        zip_code: response.data.cep,
        address: response.data.logradouro,
        neighborhood: response.data.bairro,
        city: response.data.localidade,
        state: response.data.uf,
        latitude: response.data.latitude,
        longitude: response.data.longitude,
      };

      // Geocode para obter latitude e longitude
      const geocodeResponse = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: `${addressData.address}, ${addressData.neighborhood}, ${addressData.city}, ${addressData.state}`,
          format: 'json',
          addressdetails: 1,
          limit: 1
        }
      });

      if (geocodeResponse.data.length > 0) {
        const location = geocodeResponse.data[0];
        return {
          ...addressData,
          latitude: location.lat,
          longitude: location.lon
        };
      } else {
        notificationService.error('Não foi possível obter a localização.');
        return addressData;
      }
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
