import api from './api';

export interface MapStats {
  total_voters: number;
  gender_stats: {
    male: number;
    female: number;
  };
  city_stats: Array<{
    city: string;
    count: number;
  }>;
}

// export interface MapMarker {
//   id: number;
//   name: string;
//   city: string;
//   type: 'voter' | 'leader';
//   latitude: number;
//   longitude: number;
//   gender: string;
// }

export const mapService = {
  async getStats(): Promise<MapStats> {
    const response = await api.get('/map/stats');
    return response.data;
  },

  async getMarkers(filters?: {
    type?: 'eleitor' | 'lideranca';
    city?: string;
  }): Promise<MapMarker[]> {
    const response = await api.get('/map/markers', { params: filters });

    // Tratamento dos dados retornados pela API
    const markers: MapMarker[] = response.data.map((marker: any) => {
      // Garantir que cada marcador tem os campos necessários no formato correto
      return {
        id: marker.id,
        name: marker.name || 'Desconhecido', // Valor padrão para 'name'
        city: marker.city || 'Cidade Desconhecida', // Valor padrão para 'city'
        type: marker.type === 'voter' || marker.type === 'lideranca' ? marker.type : 'eleitor', // Garantir que o tipo seja válido
        latitude: parseFloat(marker.latitude), // Garantir que seja um número
        longitude: parseFloat(marker.longitude), // Garantir que seja um número
        gender: marker.gender, // Garantir que seja um número
      };
    });

    // Filtrar ou logar possíveis problemas (opcional)
    const invalidMarkers = markers.filter(
      marker => isNaN(marker.latitude) || isNaN(marker.longitude)
    );
    if (invalidMarkers.length > 0) {
      console.warn('Marcadores inválidos encontrados:', invalidMarkers);
    }

    return markers;
  },
};
