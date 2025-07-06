import React, { useState } from 'react';
import { Alert, ActivityIndicator, View } from 'react-native';
import { useCondominio } from '../../contexts/CondominioContext';
import { useAuth } from '../../contexts/AuthContext';
import { Container, Input, Button, ButtonText, Label } from './styles';

export function CriarComunicado({ navigation }) {
  const [assunto, setAssunto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addComunicado } = useCondominio();
  const { user } = useAuth();

  async function handleAddComunicado() {
    if (!assunto.trim() || !mensagem.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha o assunto e a mensagem.');
      return;
    }
    setIsSubmitting(true);
    try {
      const condominioId = user?.condominios?.[0]?.conCod;

      if (!condominioId) {
        Alert.alert('Erro', 'Não foi possível identificar o seu condomínio. Verifique se você está associado a um condomínio.');
        setIsSubmitting(false);
        return;
      }

      const novoComunicado = {
        comAssunto: assunto,
        comMensagem: mensagem,
        condominio: {
          conCod: condominioId
        },
      };

      await addComunicado(novoComunicado);
      
      Alert.alert('Sucesso!', 'Comunicado criado.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro ao Criar Comunicado', error.message);
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
        {isSubmitting ? <ActivityIndicator color="#FFF" /> : <ButtonText>Salvar Comunicado</ButtonText>}
      </Button>
    </Container>
  );
}
