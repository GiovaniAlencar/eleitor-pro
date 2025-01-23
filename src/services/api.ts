import axios from 'axios';
import { notificationService } from './notification.service';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.graficabomjesus.com.br/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true
});

// Request interceptor for API calls
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  response => response,
  error => {
    // Don't show error toast for 404 notifications endpoint
    if (error.config.url !== '/notifications') {
      const message = error.response?.data?.message || 'Ocorreu um erro inesperado';
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        notificationService.error('Sessão expirada. Por favor, faça login novamente.');
      } else if (error.response?.status === 403) {
        notificationService.error('Você não tem permissão para realizar esta ação');
      } else if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        if (validationErrors) {
          Object.values(validationErrors).forEach((errorMessages: any) => {
            errorMessages.forEach((message: string) => {
              notificationService.error(message);
            });
          });
        } else {
          notificationService.error('Dados inválidos. Verifique as informações fornecidas.');
        }
      } else if (error.response?.status >= 500) {
        notificationService.error('Erro no servidor. Tente novamente mais tarde.');
      } else if (error.response?.status !== 404) {
        notificationService.error(message);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;