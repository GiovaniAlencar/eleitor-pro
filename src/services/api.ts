import axios from 'axios';
import { notificationService } from './notification.service';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.message || 'Ocorreu um erro inesperado';
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      notificationService.error('Sessão expirada. Por favor, faça login novamente.');
    } else if (error.response?.status === 403) {
      notificationService.error('Você não tem permissão para realizar esta ação');
    } else if (error.response?.status === 422) {
      notificationService.error('Dados inválidos. Verifique as informações fornecidas.');
    } else if (error.response?.status >= 500) {
      notificationService.error('Erro no servidor. Tente novamente mais tarde.');
    } else {
      notificationService.error(message);
    }
    
    return Promise.reject(error);
  }
);

export default api;