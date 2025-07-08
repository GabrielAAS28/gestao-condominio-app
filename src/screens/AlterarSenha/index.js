import React, { useState } from 'react';
import { Alert, ActivityIndicator, StatusBar, Text, View } from 'react-native';

// Importe a função do seu serviço de autenticação
import { alterarSenha } from '../../services/authService';

// Importe seus componentes estilizados do arquivo de estilos
import { 
  Container, 
  Label, 
  Input, 
  Button, 
  ButtonText,
  ValidationContainer,
  ValidationText
} from './styles'; // Adicionei ValidationContainer e ValidationText ao styles

/**
 * Valida a força de uma senha com base em critérios específicos.
 * @param {string} password - A senha a ser validada.
 * @returns {object} Um objeto contendo a validade e uma lista de erros.
 */
const validatePassword = (password) => {
  const errors = [];
  if (password.length < 8) {
    errors.push('Pelo menos 8 caracteres.');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Pelo menos uma letra minúscula.');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Pelo menos uma letra maiúscula.');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Pelo menos um número.');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Pelo menos um caractere especial.');
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
};


export function AlterarSenha({ navigation }) {
  // Estados para os campos de senha e carregamento
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);

  /**
   * Função chamada ao pressionar o botão para alterar a senha.
   */
  const handleAlterarSenha = async () => {
    // Validação 1: Campos vazios
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }
    
    // Validação 2: Força da Senha
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      const errorMessage = 'A nova senha não é forte o suficiente:\n\n' + passwordValidation.errors.join('\n');
      Alert.alert('Senha Fraca', errorMessage);
      return;
    }

    // Validação 3: Confirmação da Senha
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Erro de Validação', 'A nova senha e a confirmação não correspondem.');
      return;
    }

    setIsLoading(true);
    try {
      const data = {
        currentPassword: currentPassword,
        newPassword: newPassword,
      };
      
      await alterarSenha(data);

      Alert.alert('Sucesso!', 'Sua senha foi alterada.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Não foi possível alterar a senha. Verifique sua senha atual.';
      Alert.alert('Erro ao Alterar Senha', errorMessage);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Atualiza a validação em tempo real enquanto o utilizador digita
  const handleNewPasswordChange = (text) => {
    setNewPassword(text);
    const validation = validatePassword(text);
    if(text.length > 0) {
        setPasswordErrors(validation.errors);
    } else {
        setPasswordErrors([]);
    }
  }

  return (
    <Container>
      <StatusBar barStyle="dark-content" />
      
      <Label>Senha Atual</Label>
      <Input
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
        placeholder="Digite sua senha atual"
      />

      <Label>Nova Senha</Label>
      <Input
        secureTextEntry
        value={newPassword}
        onChangeText={handleNewPasswordChange}
        placeholder="Crie uma senha forte"
      />
      
      {/* Mostra os requisitos de senha que ainda não foram cumpridos */}
      {passwordErrors.length > 0 && (
          <ValidationContainer>
              {passwordErrors.map((error, index) => (
                  <ValidationText key={index}>- {error}</ValidationText>
              ))}
          </ValidationContainer>
      )}

      <Label>Confirmar Nova Senha</Label>
      <Input
        secureTextEntry
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
        placeholder="Repita a nova senha"
      />

      <Button onPress={handleAlterarSenha} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <ButtonText>Salvar Nova Senha</ButtonText>
        )}
      </Button>
    </Container>
  );
}
