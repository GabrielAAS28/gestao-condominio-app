import React, { useState, useCallback } from 'react';
import {
  FlatList,
  Alert,
  ActivityIndicator,
  RefreshControl,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import {
  listarAreasComuns,
  minhasReservas,
  cancelarReserva,
} from '../../services/reservasService';
import { useAuth } from '../../contexts/AuthContext';
import { styles } from './styles';

const STATUS_LABELS = {
  PENDENTE_APROVACAO: 'Pendente',
  APROVADA: 'Aprovada',
  REJEITADA: 'Rejeitada',
  CANCELADA_PELO_MORADOR: 'Cancelada',
  CONCLUIDA: 'Concluída',
};

const STATUS_COLORS = {
  PENDENTE_APROVACAO: '#FFA000',
  APROVADA: '#388E3C',
  REJEITADA: '#D32F2F',
  CANCELADA_PELO_MORADOR: '#757575',
  CONCLUIDA: '#1976D2',
};

export function Reservas() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user, getCondominioIds } = useAuth();
  const [tab, setTab] = useState('areas'); // 'areas' | 'minhas'
  const [areas, setAreas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const condominioIds = getCondominioIds();
      const condominioId = condominioIds[0];
      const [areasRes, reservasRes] = await Promise.all([
        listarAreasComuns(condominioId ? { condominioId, ativa: true } : { ativa: true }),
        user?.pesCod ? minhasReservas(user.pesCod) : Promise.resolve({ data: [] }),
      ]);
      setAreas(areasRes.data ?? []);
      setReservas(reservasRes.data ?? []);
    } catch (e) {
      console.error('Erro Reservas:', e?.response?.data || e.message);
      Alert.alert('Erro', 'Não foi possível carregar reservas e áreas.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getCondominioIds, user?.pesCod]);

  useFocusEffect(
    useCallback(() => {
      const requestedTab = route.params?.tab;
      if (requestedTab === 'areas' || requestedTab === 'minhas') {
        setTab(requestedTab);
      }
      setLoading(true);
      loadData();
    }, [loadData, route.params?.tab]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleCancelar = (resCod) => {
    Alert.alert('Cancelar reserva', 'Tem certeza?', [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Sim, cancelar',
        style: 'destructive',
        onPress: async () => {
          try {
            await cancelarReserva(resCod);
            loadData();
          } catch (e) {
            Alert.alert('Erro', e.response?.data?.message ?? e.message);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#0D47A1" />
      </View>
    );
  }

  const renderArea = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.nome}</Text>
      {item.descricao ? <Text style={styles.cardDesc}>{item.descricao}</Text> : null}
      <View style={styles.iconRow}>
        <Icon name="users" size={14} color="#555" />
        <Text style={styles.iconText}>
          Capacidade: {item.capacidadeMaxima ?? '—'} pessoas
        </Text>
      </View>
      {item.taxaValor ? (
        <View style={styles.iconRow}>
          <Icon name="dollar-sign" size={14} color="#555" />
          <Text style={styles.iconText}>Taxa: R$ {item.taxaValor}</Text>
        </View>
      ) : null}
      {item.turnos?.length > 0 && (
        <View style={{ marginTop: 8 }}>
          <Text style={styles.subLabel}>Turnos disponíveis:</Text>
          {item.turnos.map((t) => (
            <Text key={t.turCod} style={styles.turnoText}>
              • {t.nome} ({String(t.horaInicio).slice(11, 16)} – {String(t.horaFim).slice(11, 16)})
            </Text>
          ))}
        </View>
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('FazerReserva', { areaId: item.areCod })}
      >
        <Text style={styles.buttonText}>Reservar</Text>
      </TouchableOpacity>
    </View>
  );

  const renderReserva = ({ item }) => {
    const dataFmt = item.data
      ? format(parseISO(item.data), "dd/MM/yyyy", { locale: ptBR })
      : '—';
    const podeCancelar =
      item.status === 'PENDENTE_APROVACAO' || item.status === 'APROVADA';
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.areaComum?.nome ?? 'Área comum'}</Text>
        <View style={styles.iconRow}>
          <Icon name="calendar" size={14} color="#555" />
          <Text style={styles.iconText}>{dataFmt}</Text>
        </View>
        {item.turno?.nome ? (
          <View style={styles.iconRow}>
            <Icon name="clock" size={14} color="#555" />
            <Text style={styles.iconText}>{item.turno.nome}</Text>
          </View>
        ) : null}
        <Text
          style={[styles.statusPill, { backgroundColor: STATUS_COLORS[item.status] ?? '#888' }]}
        >
          {STATUS_LABELS[item.status] ?? item.status}
        </Text>
        {item.motivoRejeicao ? (
          <Text style={styles.motivo}>Motivo: {item.motivoRejeicao}</Text>
        ) : null}
        {podeCancelar && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#D32F2F' }]}
            onPress={() => handleCancelar(item.resCod)}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const data = tab === 'areas' ? areas : reservas;

  return (
    <View style={styles.container}>
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, tab === 'areas' && styles.tabActive]}
          onPress={() => setTab('areas')}
        >
          <Text style={tab === 'areas' ? styles.tabTextActive : styles.tabText}>
            Áreas Comuns
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'minhas' && styles.tabActive]}
          onPress={() => setTab('minhas')}
        >
          <Text style={tab === 'minhas' ? styles.tabTextActive : styles.tabText}>
            Minhas Reservas
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        renderItem={tab === 'areas' ? renderArea : renderReserva}
        keyExtractor={(item) => String(item.areCod ?? item.resCod)}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View style={[styles.center, { padding: 40 }]}>
            <Icon name="inbox" size={40} color="#ccc" />
            <Text style={styles.emptyText}>
              {tab === 'areas' ? 'Nenhuma área cadastrada.' : 'Nenhuma reserva.'}
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0D47A1']} />
        }
      />

      {tab === 'minhas' && (
        <TouchableOpacity style={styles.floatingButton} onPress={() => setTab('areas')}>
          <Icon name="plus" size={24} color="#fff" />
          <Text style={styles.floatingButtonText}>Nova reserva</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
