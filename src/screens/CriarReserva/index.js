import React, { useEffect, useState } from 'react';
import { Alert, ActivityIndicator, FlatList, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import { listarAreasComuns } from '../../services/reservasService';
import { useAuth } from '../../contexts/AuthContext';

import {
  Container,
  Form,
  Label,
  SubmitButton,
  SubmitText,
  Option,
  OptionText,
} from './styles';

export function CriarReserva() {
  const navigation = useNavigation();
  const { user, getCondominioIds } = useAuth();
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const condominioId = getCondominioIds()[0] ?? user?.condominios?.[0]?.conCod;
        const res = await listarAreasComuns(
          condominioId ? { condominioId, ativa: true } : { ativa: true },
        );
        setAreas(res.data ?? []);
      } catch (err) {
        Alert.alert('Erro', 'Não foi possível carregar as áreas comuns.');
      } finally {
        setLoading(false);
      }
    })();
  }, [getCondominioIds]);

  const handleSelect = (area) => {
    navigation.replace('FazerReserva', { areaId: area.areCod });
  };

  if (loading) {
    return (
      <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0D47A1" />
      </Container>
    );
  }

  return (
    <Container>
      <Form>
        <Label>Selecione a área para reservar</Label>
        {areas.length === 0 ? (
          <View style={{ alignItems: 'center', padding: 30 }}>
            <Icon name="inbox" size={40} color="#ccc" />
            <Text style={{ color: '#777', marginTop: 8, textAlign: 'center' }}>
              Nenhuma área comum cadastrada para este condomínio.
            </Text>
          </View>
        ) : (
          <FlatList
            data={areas}
            scrollEnabled={false}
            keyExtractor={(item) => String(item.areCod)}
            renderItem={({ item }) => (
              <Option onPress={() => handleSelect(item)}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <OptionText>{item.nome}</OptionText>
                    {item.descricao ? (
                      <Text style={{ color: '#777', fontSize: 12, marginTop: 4 }}>
                        {item.descricao}
                      </Text>
                    ) : null}
                  </View>
                  <Icon name="chevron-right" size={20} color="#555" />
                </View>
              </Option>
            )}
          />
        )}

        <SubmitButton onPress={() => navigation.goBack()} style={{ backgroundColor: '#777' }}>
          <SubmitText>Voltar</SubmitText>
        </SubmitButton>
      </Form>
    </Container>
  );
}
