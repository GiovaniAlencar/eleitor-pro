import api from './api';
import { User } from '../types/api';

export interface ProfileUpdateData {
  name: string;
  email: string;
  whatsapp: string;
  zip_code: string;
  address: string;
  number: string;
  neighborhood: string;
  city: string;
  birth_date: string;
  marital_status: string;
}

export interface PasswordUpdateData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export const profileService = {
  async updateProfile(data: ProfileUpdateData): Promise<User> {
    const response = await api.put('/profile', data);
    return response.data;
  },

  async updatePassword(data: PasswordUpdateData): Promise<void> {
    await api.put('/profile/password', data);
  },

  async updatePhoto(photo: File): Promise<{ photo_url: string }> {
    const formData = new FormData();
    formData.append('photo', photo);

    const response = await api.post('/profile/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};