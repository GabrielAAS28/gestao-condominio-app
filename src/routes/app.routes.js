import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Home } from '../screens/Home';
// CORREÇÃO: O caminho foi alterado para 'criarcomunicacao' (minúsculas)
// para corresponder ao nome real da pasta no seu projeto.
import { CriarComunicado } from '../screens/CriarComunicacao'; 

const Stack = createNativeStackNavigator();

export function AppRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{ title: 'Início' }} />
      <Stack.Screen 
        name="CriarComunicado" 
        component={CriarComunicado} 
        options={{ title: 'Novo Comunicado' }} 
      />
    </Stack.Navigator>
  );
}
// Note: Certifique-se de que o nome do componente CriarComunicado
// corresponde exatamente ao nome do arquivo e à exportação dele.   