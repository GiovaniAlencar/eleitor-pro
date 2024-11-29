import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileService } from '../services/profile.service';
import { notificationService } from '../services/notification.service';

export function usePasswordChange() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changePassword = async (data: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }) => {
    try {
      setLoading(true);
      await profileService.updatePassword(data);
      notificationService.success('Senha alterada com sucesso');
      navigate('/configuracoes');
    } catch (error) {
      notificationService.error('Erro ao alterar senha');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    changePassword
  };
}