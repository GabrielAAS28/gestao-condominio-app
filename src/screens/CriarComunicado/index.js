import React, { useState } from 'react';
import { Alert, Switch, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Importe o seu hook do contexto para adicionar o comunicado
import { useCondominio } from '../../contexts/CondominioContext';

// Importe os seus componentes de estilo
import {
  Container,
  Label,
  Input,
  InputMensagem,
  Button,
  ButtonText,
  SwitchContainer,
  SwitchLabel,
} from './styles';

export function CriarComunicado() {
  const navigation = useNavigation();
  const { addComunicado, loading } = useCondominio();

  const [assunto, setAssunto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [isGlobal, setIsGlobal] = useState(false); // Estado para o Switch

  const handleSaveComunicado = async () => {
    if (!assunto.trim() || !mensagem.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha o assunto e a mensagem.');
      return;
    }

    const novoComunicado = {
      comAssunto: assunto,
      comMensagem: mensagem,
      comGlobal: isGlobal, 
    };

    try {
      await addComunicado(novoComunicado);
      

      Alert.alert(
        'Sucesso!', 
        'O seu comunicado foi criado.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );

    } catch (error) {
      console.error('Falha ao salvar comunicado na tela:', error);
    }
  };

  return (
    <Container>
      <Label>Assunto</Label>
      <Input
        value={assunto}
        onChangeText={setAssunto}
        placeholder="Ex: Manutenção da Piscina"
      />

      <Label>Mensagem</Label>
      <InputMensagem
        value={mensagem}
        onChangeText={setMensagem}
        placeholder="Descreva o comunicado aqui..."
        multiline
      />

      {/* Componente Switch para "Enviar para Todos" */}
      <SwitchContainer>
        <SwitchLabel>Enviar para todos os moradores?</SwitchLabel>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isGlobal ? '#3182ce' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setIsGlobal(previousState => !previousState)}
          value={isGlobal}
        />
      </SwitchContainer>

      <Button onPress={handleSaveComunicado} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <ButtonText>Salvar Comunicado</ButtonText>
        )}
      </Button>
    </Container>
  );
}
