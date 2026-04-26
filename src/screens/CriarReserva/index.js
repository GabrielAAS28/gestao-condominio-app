import React, { useEffect, useState } from 'react';
import { Alert, ActivityIndicator, Modal, FlatList, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import { getCommonAreas, createReservation } from '../../services/reservaServices';
import { useAuth } from '../../contexts/AuthContext';

import {
  Container,
  Form,
  Label,
  Input,
  Picker,
  PickerText,
  TermsRow,
  Checkbox,
  TermsText,
  SubmitButton,
  SubmitText,
  ModalBackdrop,
  ModalContent,
  ModalTitle,
  Option,
  OptionText,
} from './styles';

export function CriarReserva() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();

  const [areas, setAreas] = useState([]);
  const [areaId, setAreaId] = useState(route.params?.areaId ?? null);
  const [data, setData] = useState('');
  const [convidados, setConvidados] = useState('');
  const [termos, setTermos] = useState(false);
  const [showAreas, setShowAreas] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const list = await getCommonAreas();
        setAreas(list);
      } catch (err) {
        Alert.alert('Erro', 'Não foi possível carregar as áreas comuns.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const selectedArea = areas.find((a) => a.id === areaId);

  const validateDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);

  const handleSubmit = async () => {
    if (!areaId) return Alert.alert('Atenção', 'Selecione uma área comum.');
    if (!validateDate(data)) return Alert.alert('Atenção', 'Informe a data no formato AAAA-MM-DD.');
    if (!termos) return Alert.alert('Atenção', 'É necessário aceitar os termos.');

    const unidadeId = user?.unidades?.[0]?.uniCod ?? user?.condominios?.[0]?.unidades?.[0]?.uniCod;
    if (!unidadeId) {
      return Alert.alert('Atenção', 'Não foi possível identificar sua unidade. Verifique seu cadastro.');
    }

    const payload = {
      areaComumId: Number(areaId),
      unidadeId: Number(unidadeId),
      data,
      termosAceitos: true,
      convidados: convidados
        .split(',')
        .map((nome) => nome.trim())
        .filter(Boolean)
        .map((nome) => ({ nome })),
    };

    try {
      setSubmitting(true);
      await createReservation(payload);
      Alert.alert('Sucesso', 'Reserva criada com sucesso!');
      navigation.goBack();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Não foi possível criar a reserva.';
      Alert.alert('Erro', Array.isArray(msg) ? msg.join('\n') : msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007bff" />
      </Container>
    );
  }

  return (
    <Container>
      <Form>
        <Label>Área Comum</Label>
        <Picker onPress={() => setShowAreas(true)}>
          <PickerText>{selectedArea ? selectedArea.name : 'Selecione uma área...'}</PickerText>
          <Icon name="chevron-down" size={20} color="#555" />
        </Picker>

        <Label>Data da reserva</Label>
        <Input
          placeholder="AAAA-MM-DD"
          value={data}
          onChangeText={setData}
          autoCapitalize="none"
        />

        <Label>Convidados (opcional, separados por vírgula)</Label>
        <Input
          placeholder="João Silva, Maria Souza"
          value={convidados}
          onChangeText={setConvidados}
          multiline
        />

        <TermsRow onPress={() => setTermos(!termos)} activeOpacity={0.7}>
          <Checkbox checked={termos}>
            {termos && <Icon name="check" size={14} color="#fff" />}
          </Checkbox>
          <TermsText>
            Aceito os termos de uso da área comum e me responsabilizo pelos convidados.
          </TermsText>
        </TermsRow>

        <SubmitButton onPress={handleSubmit} disabled={submitting}>
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <SubmitText>Confirmar Reserva</SubmitText>
          )}
        </SubmitButton>
      </Form>

      <Modal visible={showAreas} transparent animationType="slide" onRequestClose={() => setShowAreas(false)}>
        <ModalBackdrop>
          <ModalContent>
            <ModalTitle>Selecione a área comum</ModalTitle>
            <FlatList
              data={areas}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Option onPress={() => { setAreaId(item.id); setShowAreas(false); }}>
                  <OptionText>{item.name}</OptionText>
                </Option>
              )}
              ListEmptyComponent={<View style={{ padding: 20 }}><OptionText>Nenhuma área disponível.</OptionText></View>}
            />
          </ModalContent>
        </ModalBackdrop>
      </Modal>
    </Container>
  );
}
