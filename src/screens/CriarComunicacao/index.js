import React, { useState } from 'react';
import { Alert, ActivityIndicator } from 'react-native';
import { useCondominio } from '../../contexts/CondominioContext';
import { useAuth } from '../../contexts/AuthContext';

import { 
  Container, 
  Input, 
  Button, 
  ButtonText,
  Label
} from './styles';

export function CriarComunicado({ navigation }) {
  const [assunto, setAssunto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addComunicado } = useCondominio();
  const { user } = useAuth(); // Pegamos o usuário para saber o ID do condomínio

  async function handleAddComunicado() {
    if (!assunto.trim() || !mensagem.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha o assunto e a mensagem.');
      return;
    }

    setIsSubmitting(true);
    try {
      // O objeto enviado para a API deve corresponder ao que o backend espera.
      // Aqui assumimos que o backend já está configurado para lidar com o remetente
      const novoComunicado = {
        comAssunto: assunto,
        comMensagem: mensagem,
        condominio: {
          conCod: user.condominios[0].conCod // Assumindo que o usuário tem pelo menos um condomínio
        },
        // O backend deve definir o remetente e outros campos automaticamente.
      };

      await addComunicado(novoComunicado);

      Alert.alert('Sucesso!', 'Comunicado criado.');
      navigation.goBack(); // Volta para a tela anterior

    } catch (error) {
      // O erro já é exibido pelo Alert no contexto, não precisamos de outro aqui.
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Container>
      <Label>Assunto</Label>
      <Input
        placeholder="Ex: Manutenção da Piscina"
        value={assunto}
        onChangeText={setAssunto}
        returnKeyType="next"
      />

      <Label>Mensagem</Label>
      <Input
        placeholder="Detalhes do comunicado..."
        value={mensagem}
        onChangeText={setMensagem}
        multiline
        numberOfLines={6}
        style={{ height: 120, textAlignVertical: 'top' }}
      />

      <Button onPress={handleAddComunicado} disabled={isSubmitting}>
        {isSubmitting ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <ButtonText>Salvar Comunicado</ButtonText>
        )}
      </Button>
    </Container>
  );
}
