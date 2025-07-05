import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

import { 
  Container, 
  Title, 
  Input, 
  Button, 
  ButtonText 
} from './styles';

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();

  async function handleSignIn() {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha o e-mail e a senha.');
      return;
    }

    try {
      // CORREÇÃO: O nome do campo foi alterado de 'password' para 'senha'
      // para corresponder ao que a API espera.
      await signIn({ email,password });
      
      // Se o login for bem-sucedido, o roteador principal irá
      // automaticamente navegar para as AppRoutes.
    } catch (error) {
      Alert.alert('Erro no Login', error.message);
    }
  }

  return (
    <Container>
      <Title>Gestão de Condomínio</Title>
      
      <Input
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      
      <Input
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button onPress={handleSignIn}>
        <ButtonText>Entrar</ButtonText>
      </Button>
    </Container>
  );
}
// O componente SignIn agora está configurado para lidar com o login do usuário
// utilizando o contexto de autenticação. Ele exibe um alerta em caso de erro
// e navega para as rotas do aplicativo se o login for bem-sucedido.- 