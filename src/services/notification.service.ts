import api from './api';
import { toast } from 'sonner';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
  created_at: string;
}

export interface CreateNotificationData {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
}

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    const response = await api.get('/notifications');
    return response.data;
  },

  async markAsRead(id: number): Promise<void> {
    await api.put(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await api.put('/notifications/read-all');
  },

  async createNotification(data: CreateNotificationData): Promise<Notification> {
    const response = await api.post('/notifications', data);
    return response.data;
  },

  // Toast notifications
  success(message: string) {
    toast.success(message || 'Operação realizada com sucesso');
  },

  error(message: string) {
    toast.error(message || 'Ocorreu um erro. Tente novamente');
  },

  warning(message: string) {
    toast.warning(message || 'Atenção! Verifique os dados informados');
  },

  info(message: string) {
    toast.info(message || 'Informação importante');
  }
};