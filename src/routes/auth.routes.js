import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SignIn } from '../screens/SignIn';

const Stack = createNativeStackNavigator();

export function AuthRoutes() {
  return (

    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignIn} />
    </Stack.Navigator>
  );
}
// Este arquivo define as rotas de autenticação do aplicativo.
// Ele inclui a tela de login (SignIn) e pode ser expandido para incluir outras telas relacionadas à autenticação, como cadastro de usuário.
  