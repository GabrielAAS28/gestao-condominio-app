import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'https://gestao-condominio-api.onrender.com/api',
  // CORREÇÃO: Aumentei o tempo de espera para 30 segundos (30000 ms)
  // para dar tempo ao servidor do Render de responder.
  timeout: 30000, 
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@GestaoCondominio:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
