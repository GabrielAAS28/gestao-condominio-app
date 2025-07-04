import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// O caminho correto para a tela de SignIn é '../screens/SignIn'
// Ele sobe um nível da pasta 'routes' para a pasta 'src',
// e depois desce para 'screens/SignIn'.
import { SignIn } from '../screens/SignIn';

const Stack = createNativeStackNavigator();

export function AuthRoutes() {
  return (
    // O `screenOptions={{ headerShown: false }}` esconde o cabeçalho padrão da tela de login.
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignIn} />
      {/* Se você tivesse uma tela de "Cadastre-se", ela entraria aqui */}
    </Stack.Navigator>
  );
}
// Este arquivo define as rotas de autenticação do aplicativo.
// Ele inclui a tela de login (SignIn) e pode ser expandido para incluir outras telas relacionadas à autenticação, como cadastro de usuário.
// O uso do `createNativeStackNavigator` permite uma navegação fluida e eficiente entre as telas.
// O `headerShown: false` é usado para ocultar o cabeçalho padrão
// do React Navigation, permitindo que você crie um layout personalizado para a tela de login.    