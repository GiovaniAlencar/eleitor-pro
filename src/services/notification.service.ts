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
    try {
      const response = await api.get('/notifications');
      return response.data;
    } catch (error) {
      console.error('Error loading notifications:', error);
      return [];
    }
  },

  async markAsRead(id: number): Promise<void> {
    try {
      await api.put(`/notifications/${id}/read`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  },

  async markAllAsRead(): Promise<void> {
    try {
      await api.put('/notifications/read-all');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  },

  async createNotification(data: CreateNotificationData): Promise<Notification> {
    try {
      const response = await api.post('/notifications', data);
      return response.data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
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