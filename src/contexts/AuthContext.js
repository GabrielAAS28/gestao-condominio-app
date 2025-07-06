import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
// Importando a nova função de update do serviço
import { updatePessoa } from '../services/cadastroService';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storagedUser = await AsyncStorage.getItem('@GestaoCondominio:user');
      const storagedToken = await AsyncStorage.getItem('@GestaoCondominio:token');

      if (storagedUser && storagedToken) {
        api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
        setUser(JSON.parse(storagedUser));
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);

  async function signIn(credentials) {
    try {
      const response = await api.post('/api/auth/login', credentials);
      const { token, user: userData } = response.data;
      await AsyncStorage.setItem('@GestaoCondominio:user', JSON.stringify(userData));
      await AsyncStorage.setItem('@GestaoCondominio:token', token);
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(userData);
    } catch (error) {
      console.error('Erro no signIn:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Não foi possível fazer o login.');
    }
  }

  // Nova função para atualizar os dados do utilizador
  async function updateUserData(updatedData) {
    try {
      // Chama a API para atualizar os dados da pessoa
      const response = await updatePessoa(user.pesCod, updatedData);
      
      // Atualiza o estado global e o AsyncStorage com os novos dados
      const newUser = response.data;
      setUser(newUser);
      await AsyncStorage.setItem('@GestaoCondominio:user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Erro ao atualizar dados do utilizador:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Não foi possível atualizar os dados.');
    }
  }

  async function signOut() {
    await AsyncStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
