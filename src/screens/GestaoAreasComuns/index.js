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
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import {
  listarAreasComuns,
  removerAreaComum,
} from '../../services/reservasService';
import { useAuth } from '../../contexts/AuthContext';
import { styles } from './styles';

export function GestaoAreasComuns() {
  const navigation = useNavigation();
  const { user, getCondominioIds } = useAuth();
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregar = useCallback(async () => {
    try {
      const condominioId = getCondominioIds()[0] ?? user?.condominios?.[0]?.conCod;
      const params = condominioId ? { condominioId } : {};
      const { data } = await listarAreasComuns(params);
      setAreas(data ?? []);
    } catch (e) {
      Alert.alert('Erro', e.response?.data?.message ?? 'Falha ao carregar áreas.');
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

  const handleRemover = (area) => {
    Alert.alert(
      'Remover área',
      `Tem certeza que deseja remover "${area.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await removerAreaComum(area.areCod);
              carregar();
            } catch (e) {
              Alert.alert('Erro', e.response?.data?.message ?? e.message);
            }
          },
        },
      ],
    );
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
      <FlatList
        data={areas}
        keyExtractor={(item) => String(item.areCod)}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
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
            <Icon name="inbox" size={40} color="#ccc" />
            <Text style={styles.emptyText}>Nenhuma área cadastrada.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.nome}</Text>
            {item.descricao ? (
              <Text style={styles.cardLine}>{item.descricao}</Text>
            ) : null}
            <Text style={styles.cardLine}>
              Capacidade: {item.capacidadeMaxima ?? '—'} ·{' '}
              Taxa: {item.taxaValor ? `R$ ${item.taxaValor}` : 'sem taxa'}
            </Text>
            <Text style={styles.cardLine}>
              Turnos: {item.turnos?.length ?? 0} ·{' '}
              Convidados: {item.permiteConvidados ? `até ${item.limiteConvidados ?? 0}` : 'não'}
            </Text>
            {!item.ativa && <Text style={styles.inactiveBadge}>INATIVA</Text>}

            <View style={styles.rowActions}>
              <TouchableOpacity
                style={[styles.btn, styles.btnPrimary]}
                onPress={() =>
                  navigation.navigate('EditarAreaComum', { areaId: item.areCod })
                }
              >
                <Text style={styles.btnText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btnDanger]}
                onPress={() => handleRemover(item)}
              >
                <Text style={styles.btnText}>Remover</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('EditarAreaComum', {})}
      >
        <Icon name="plus" size={22} color="#FFF" />
        <Text style={styles.fabText}>Nova área</Text>
      </TouchableOpacity>
    </View>
  );
}
