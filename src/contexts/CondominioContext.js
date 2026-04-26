import React, { createContext, useState, useContext, useCallback } from 'react';
import {
  listarComunicados as getComunicacoes,
  criarComunicado as createComunicado,
  deletarComunicado as deleteComunicado,
} from '../services/comunicadosService';
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
      // A nova API retorna { items, total, take, skip }
      const list = Array.isArray(response.data) ? response.data : response.data?.items ?? [];
      setComunicados(list);
    } catch (err) {
      // Loga como string para não depender de expandir objetos no DevTools
      const dump = {
        url: err.config?.url,
        method: err.config?.method,
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      };
      console.error('[Comunicados][ERRO]', JSON.stringify(dump, null, 2));

      const apiMsg = err.response?.data?.message;
      const errorMessage = Array.isArray(apiMsg)
        ? apiMsg.join('; ')
        : apiMsg || 'Não foi possível carregar os comunicados.';
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
        novoComunicado.titulo ?? novoComunicado.comAssunto ?? '',
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