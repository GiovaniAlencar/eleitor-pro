import api from './api';

export interface MapStats {
  total_voters: number;
  gender_stats: {
    male: number;
    female: number;
  };
  city_stats: {
    name: string;
    count: number;
  }[];
}

export interface MapMarker {
  id: number;
  type: 'voter' | 'leader';
  latitude: number;
  longitude: number;
  name: string;
  city: string;
}

export const mapService = {
  async getStats(): Promise<MapStats> {
    const response = await api.get('/map/stats');
    return response.data;
  },

  async getMarkers(filters?: {
    type?: 'voter' | 'leader';
    city?: string;
  }): Promise<MapMarker[]> {
    const response = await api.get('/map/markers', { params: filters });
    return response.data;
  }
};