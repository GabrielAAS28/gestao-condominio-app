import React from 'react';
import { View, ActivityIndicator } from 'react-native';

// CORREÇÃO: O caminho para o AuthContext é '../contexts/AuthContext'
// porque estamos a "subir" um nível da pasta 'routes' para a pasta 'src',
// e depois a "descer" para a pasta 'contexts'.
import { useAuth } from '../contexts/AuthContext';

// CORREÇÃO: Importando os componentes de rotas que estão na mesma pasta.
import { AppRoutes } from './app.routes';
import { AuthRoutes } from './auth.routes';

export default function Routes() {
  const { signed, loading } = useAuth();

  // Enquanto o AuthContext verifica se o usuário está logado,
  // mostramos um indicador de carregamento.
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' }}>
        <ActivityIndicator size="large" color="#0D47A1" />
      </View>
    );
  }

  // Se 'signed' for true, mostra as rotas do app. Senão, mostra as de autenticação.
  return signed ? <AppRoutes /> : <AuthRoutes />;
}
