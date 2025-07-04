import React, { createContext, useState, useContext, useCallback } from 'react';
// Importando todas as funções do nosso serviço de comunicação
import { getComunicacoes, createComunicado, deleteComunicado } from '../services/comunicacaoService';
import { Alert } from 'react-native';

const CondominioContext = createContext({});

export const CondominioProvider = ({ children }) => {
  const [comunicados, setComunicados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Novo estado para armazenar erros da API

  // Função para buscar os comunicados, agora com tratamento de erro aprimorado
  const fetchComunicados = useCallback(async () => {
    setLoading(true);
    setError(null); // Limpa erros anteriores
    try {
      const response = await getComunicacoes();
      setComunicados(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Não foi possível carregar os comunicados.";
      setError(errorMessage);
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Nova função para adicionar um comunicado
  const addComunicado = async (novoComunicado) => {
    try {
      const response = await createComunicado(novoComunicado);
      // Adiciona o novo comunicado retornado pela API no início da lista
      setComunicados(prev => [response.data, ...prev]);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Não foi possível criar o comunicado.";
      Alert.alert('Erro', errorMessage);
      throw err; // Lança o erro para a tela que chamou a função poder tratar também
    }
  };

  // Nova função para remover um comunicado
  const removeComunicado = async (id) => {
    try {
      await deleteComunicado(id);
      // Remove o comunicado da lista localmente para atualizar a UI instantaneamente
      setComunicados(prev => prev.filter(c => c.comCod !== id));
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Não foi possível remover o comunicado.";
      Alert.alert('Erro', errorMessage);
      throw err;
    }
  };


  return (
    // Disponibilizando os novos estados e funções para o resto do app
    <CondominioContext.Provider 
      value={{ 
        comunicados, 
        loading, 
        error,
        fetchComunicados,
        addComunicado,
        removeComunicado 
      }}
    >
      {children}
    </CondominioContext.Provider>
  );
};

// Hook customizado para facilitar o uso
export function useCondominio() {
  const context = useContext(CondominioContext);
  return context;
}
