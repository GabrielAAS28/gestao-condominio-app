import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { format, parseISO } from 'date-fns';

import {
  listarReservas,
  aprovarReserva,
  rejeitarReserva,
} from '../../services/reservasService';
import { useAuth } from '../../contexts/AuthContext';
import { styles } from './styles';

export function PainelGestao() {
  const navigation = useNavigation();
  const { getCondominioIds } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregar = useCallback(async () => {
    try {
      const condominioId = getCondominioIds()[0];
      const params = condominioId
        ? { condominioId, status: 'PENDENTE_APROVACAO' }
        : { status: 'PENDENTE_APROVACAO' };
      const { data } = await listarReservas(params);
      setReservas(data ?? []);
    } catch (e) {
      console.warn(e?.response?.data || e.message);
      Alert.alert('Erro', 'Não foi possível carregar reservas pendentes.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getCondominioIds]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      carregar();
    }, [carregar]),
  );

  const handleAprovar = (resCod) => {
    Alert.alert('Aprovar reserva', 'Confirmar?', [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Aprovar',
        onPress: async () => {
          try {
            await aprovarReserva(resCod);
            carregar();
          } catch (e) {
            Alert.alert('Erro', e.response?.data?.message ?? e.message);
          }
        },
      },
    ]);
  };

  const handleRejeitar = (resCod) => {
    Alert.prompt?.('Rejeitar reserva', 'Motivo da rejeição:', async (motivo) => {
      if (!motivo) return;
      try {
        await rejeitarReserva(resCod, motivo);
        carregar();
      } catch (e) {
        Alert.alert('Erro', e.response?.data?.message ?? e.message);
      }
    });
    if (!Alert.prompt) {
      // Fallback Android: motivo padrão
      rejeitarReserva(resCod, 'Rejeitada pelo síndico')
        .then(carregar)
        .catch((e) => Alert.alert('Erro', e.response?.data?.message ?? e.message));
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#0D47A1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.shortcuts}>
        <Shortcut
          icon="alert-octagon"
          label="Ocorrências"
          onPress={() => navigation.navigate('Ocorrencias')}
        />
        <Shortcut
          icon="user-check"
          label="Visitantes"
          onPress={() => navigation.navigate('Visitantes')}
        />
        <Shortcut
          icon="package"
          label="Encomendas"
          onPress={() => navigation.navigate('Encomendas')}
        />
        <Shortcut
          icon="grid"
          label="Áreas Comuns"
          onPress={() => navigation.navigate('GestaoAreasComuns')}
        />
      </View>

      <Text style={styles.heading}>Reservas pendentes</Text>
      <FlatList
        data={reservas}
        keyExtractor={(item) => String(item.resCod)}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              carregar();
            }}
          />
        }
        ListEmptyComponent={
          <View style={[styles.center, { padding: 40 }]}>
            <Icon name="check-circle" size={40} color="#388E3C" />
            <Text style={{ marginTop: 8, color: '#999' }}>
              Nenhuma reserva pendente.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.areaComum?.nome ?? 'Área'}</Text>
            <Text style={styles.cardLine}>
              <Icon name="user" size={12} /> {item.morador?.pesNome ?? '—'}
            </Text>
            <Text style={styles.cardLine}>
              <Icon name="home" size={12} />{' '}
              {item.unidade?.bloco ? `${item.unidade.bloco}/` : ''}
              {item.unidade?.uniNumero ?? '—'}
            </Text>
            <Text style={styles.cardLine}>
              <Icon name="calendar" size={12} />{' '}
              {format(parseISO(item.data), 'dd/MM/yyyy')}
              {item.turno?.nome ? ` · ${item.turno.nome}` : ''}
            </Text>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: '#388E3C', flex: 1, marginRight: 6 }]}
                onPress={() => handleAprovar(item.resCod)}
              >
                <Text style={styles.btnText}>Aprovar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: '#D32F2F', flex: 1, marginLeft: 6 }]}
                onPress={() => handleRejeitar(item.resCod)}
              >
                <Text style={styles.btnText}>Rejeitar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

function Shortcut({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.shortcut} onPress={onPress}>
      <Icon name={icon} size={28} color="#0D47A1" />
      <Text style={styles.shortcutLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

