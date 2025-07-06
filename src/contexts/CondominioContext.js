import React, { createContext, useState, useContext, useCallback } from 'react';
import { getComunicacoes, createComunicado, deleteComunicado } from '../services/comunicacaoService';
import { notificationService } from '../services/NotificationService';
import { Alert } from 'react-native';

const CondominioContext = createContext({});

export const CondominioProvider = ({ children }) => {
  const [comunicados, setComunicados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComunicados = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getComunicacoes();
      setComunicados(response.data);
    } catch (err) {
      console.error("--- ERRO DETALHADO AO BUSCAR COMUNICADOS ---");
      if (err.response) {
        // O servidor respondeu com um status de erro (4xx ou 5xx)
        console.error("Data:", err.response.data);
        console.error("Status:", err.response.status);
        console.error("Headers:", err.response.headers);
      } else if (err.request) {
        // A requisição foi feita mas não houve resposta
        console.error("Request:", err.request);
      } else {
        // Algo aconteceu ao configurar a requisição
        console.error('Error', err.message);
      }
      console.error("-----------------------------------------");

      const errorMessage = err.response?.data?.message || "Não foi possível carregar os comunicados.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const addComunicado = async (novoComunicado) => {
    try {
      const response = await createComunicado(novoComunicado);
      setComunicados(prev => [response.data, ...prev]);
      notificationService.localNotification(
        'Novo Comunicado!',
        novoComunicado.comAssunto
      );
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Não foi possível criar o comunicado.";
      Alert.alert('Atenção', errorMessage);
      throw err;
    }
  };

  const removeComunicado = async (id) => {
    try {
      await deleteComunicado(id);
      setComunicados(prev => prev.filter(c => c.comCod !== id));
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Não foi possível remover o comunicado.";
      Alert.alert('Atenção', errorMessage);
      throw err;
    }
  };

  return (
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

export function useCondominio() {
  const context = useContext(CondominioContext);
  return context;
}
// O hook useCondominio permite que outros componentes acessem o contexto do condomínio,
// facilitando a obtenção de comunicados, o carregamento de dados e a manipulação
// de comunicados (adição e remoção) sem a necessidade de passar props manualmente
// por toda a árvore de componentes.