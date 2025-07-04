import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

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
      console.log('Dados enviados para a API:', credentials);

      const response = await api.post('/api/auth/login', credentials);

      const { token, user: userData } = response.data;

      await AsyncStorage.setItem('@GestaoCondominio:user', JSON.stringify(userData));
      await AsyncStorage.setItem('@GestaoCondominio:token', token);

      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(userData);
    } catch (error) {
      console.error('Erro no signIn:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Não foi possível fazer o login. Verifique suas credenciais.');
    }
  }

  async function signOut() {
    await AsyncStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
