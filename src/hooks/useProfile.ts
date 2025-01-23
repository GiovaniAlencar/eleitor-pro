import { useState } from 'react';
import { profileService, ProfileUpdateData, PasswordUpdateData } from '../services/profile.service';
import { notificationService } from '../services/notification.service';
import { User } from '../types/api';

export function useProfile() {
  const [loading, setLoading] = useState(false);

  const updateProfile = async (data: ProfileUpdateData): Promise<User | null> => {
    try {
      setLoading(true);
      const updatedUser = await profileService.updateProfile(data);
      notificationService.success('Perfil atualizado com sucesso');
      return updatedUser;
    } catch (err) {
      notificationService.error('Erro ao atualizar perfil');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (data: PasswordUpdateData): Promise<boolean> => {
    try {
      setLoading(true);
      await profileService.updatePassword(data);
      notificationService.success('Senha atualizada com sucesso');
      return true;
    } catch (err) {
      notificationService.error('Erro ao atualizar Senha');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePhoto = async (photo: File): Promise<string | null> => {
    try {
      setLoading(true);
      const { photo_url } = await profileService.updatePhoto(photo);
      notificationService.success('Foto atualizada com sucesso');
      return photo_url;
    } catch (err) {
      notificationService.error('Erro ao atualizar foto');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    updateProfile,
    updatePassword,
    updatePhoto
  };
}