import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Crie a instância do Axios com a URL base da sua API.
const api = axios.create({
  baseURL: 'https://gestao-condominio-api.onrender.com/api', 
});

// Este 'interceptor' é uma função que roda ANTES de cada requisição.
// Nós o usamos para buscar o token de autenticação no AsyncStorage
// e injetá-lo no cabeçalho (header) da requisição.
// Assim, você não precisa adicionar o token manualmente em cada chamada de API.
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
// Este arquivo configura a instância do Axios para fazer requisições à API do aplicativo.
// Ele inclui o token de autenticação automaticamente em cada requisição,
// garantindo que você não precise se preocupar com isso em cada chamada de API.    