import React, { useState } from 'react';
import { Alert, Switch, ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useCondominio } from '../../contexts/CondominioContext';
import { useAuth } from '../../contexts/AuthContext';

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

const PUBLICOS = ['TODOS', 'PROPRIETARIOS', 'INQUILINOS', 'FUNCIONARIOS'];

export function CriarComunicado() {
  const navigation = useNavigation();
  const { addComunicado, loading } = useCondominio();
  const { getCondominioIds } = useAuth();

  const [titulo, setTitulo] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [isUrgente, setIsUrgente] = useState(false);
  const [publicoIdx, setPublicoIdx] = useState(0); // 0..3

  const handleSave = async () => {
    if (!titulo.trim() || !mensagem.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha o título e a mensagem.');
      return;
    }

    const condominiosIds = getCondominioIds();
    if (condominiosIds.length === 0) {
      Alert.alert(
        'Atenção',
        'Você não está vinculado a nenhum condomínio. Peça ao administrador para te associar.',
      );
      return;
    }

    try {
      await addComunicado({
        titulo,
        mensagem,
        publicoDestino: PUBLICOS[publicoIdx],
        isUrgente,
        condominiosIds,
      });
      Alert.alert('Sucesso!', 'O comunicado foi criado.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      // O erro já é mostrado pelo CondominioContext via Alert
    }
  };

  return (
    <Container>
      <Label>Título</Label>
      <Input
        value={titulo}
        onChangeText={setTitulo}
        placeholder="Ex: Manutenção da Piscina"
      />

      <Label>Mensagem</Label>
      <InputMensagem
        value={mensagem}
        onChangeText={setMensagem}
        placeholder="Descreva o comunicado aqui..."
        multiline
      />

      <Label>Público destino</Label>
      <View style={styles.publicoRow}>
        {PUBLICOS.map((p, idx) => (
          <Text
            key={p}
            onPress={() => setPublicoIdx(idx)}
            style={[styles.chip, publicoIdx === idx && styles.chipActive]}
          >
            {p}
          </Text>
        ))}
      </View>

      <SwitchContainer>
        <SwitchLabel>Marcar como urgente?</SwitchLabel>
        <Switch
          trackColor={{ false: '#767577', true: '#ff8a80' }}
          thumbColor={isUrgente ? '#d32f2f' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setIsUrgente((v) => !v)}
          value={isUrgente}
        />
      </SwitchContainer>

      <Button onPress={handleSave} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <ButtonText>Salvar Comunicado</ButtonText>}
      </Button>
    </Container>
  );
}

const styles = StyleSheet.create({
  publicoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
    borderRadius: 16,
    backgroundColor: '#eeeeee',
    color: '#333',
    fontSize: 12,
    overflow: 'hidden',
  },
  chipActive: {
    backgroundColor: '#0D47A1',
    color: '#fff',
  },
});
