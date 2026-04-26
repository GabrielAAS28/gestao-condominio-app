import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { format, parseISO } from 'date-fns';

import {
  listarOcorrencias,
  criarOcorrencia,
} from '../../services/ocorrenciasService';
import { useAuth } from '../../contexts/AuthContext';
import { styles } from './styles';

const TIPOS = ['BARULHO', 'CONFLITO', 'MANUTENCAO', 'RECLAMACAO', 'OUTRO'];

const STATUS_COLORS = {
  ABERTA: '#1976D2',
  EM_ANALISE: '#FFA000',
  RESOLVIDA: '#388E3C',
};

export function Ocorrencias() {
  const navigation = useNavigation();
  const { getCondominioIds } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const carregar = useCallback(async () => {
    try {
      const condominioId = getCondominioIds()[0];
      const params = condominioId ? { condominioId, take: 50 } : { take: 50 };
      const { data } = await listarOcorrencias(params);
      const items = Array.isArray(data) ? data : data?.items ?? [];
      setList(items);
    } catch (e) {
      console.warn(e?.response?.data || e.message);
      Alert.alert('Erro', 'Não foi possível carregar ocorrências.');
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
        data={list}
        keyExtractor={(item) => String(item.ocoCod)}
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
            <Icon name="alert-octagon" size={40} color="#ccc" />
            <Text style={{ marginTop: 8, color: '#999' }}>Nenhuma ocorrência aberta.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('DetalheOcorrencia', { ocoCod: item.ocoCod })}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle} numberOfLines={1}>{item.titulo}</Text>
              <Text style={[styles.pill, { backgroundColor: STATUS_COLORS[item.status] }]}>
                {item.status}
              </Text>
            </View>
            <Text style={styles.cardLine} numberOfLines={2}>{item.descricao}</Text>
            <Text style={styles.cardMeta}>
              {item.tipo} · {format(parseISO(item.dataRegistro), 'dd/MM HH:mm')}
            </Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalOpen(true)}>
        <Icon name="plus" size={28} color="#fff" />
      </TouchableOpacity>

      <CriarModal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={() => {
          setModalOpen(false);
          carregar();
        }}
        defaultCondominioId={getCondominioIds()[0]}
      />
    </View>
  );
}

function CriarModal({ visible, onClose, onSaved, defaultCondominioId }) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [unidadeId, setUnidadeId] = useState('');
  const [tipoIdx, setTipoIdx] = useState(2); // MANUTENCAO
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setTitulo(''); setDescricao(''); setUnidadeId(''); setTipoIdx(2);
  };

  const handleSave = async () => {
    if (!titulo || !descricao || !unidadeId) {
      Alert.alert('Atenção', 'Preencha título, descrição e unidade.');
      return;
    }
    setSaving(true);
    try {
      await criarOcorrencia({
        condominioId: defaultCondominioId,
        unidadeId: Number(unidadeId),
        titulo,
        descricao,
        tipo: TIPOS[tipoIdx],
      });
      reset();
      onSaved();
    } catch (e) {
      Alert.alert('Erro', e.response?.data?.message ?? e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalBg}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Abrir ocorrência</Text>
          <TextInput style={styles.input} placeholder="Título*" value={titulo} onChangeText={setTitulo} />
          <TextInput style={styles.input} placeholder="ID da unidade*" value={unidadeId} onChangeText={setUnidadeId} keyboardType="numeric" />
          <TextInput style={[styles.input, { minHeight: 80 }]} placeholder="Descrição*" value={descricao} onChangeText={setDescricao} multiline />
          <View style={styles.chipsRow}>
            {TIPOS.map((t, idx) => (
              <TouchableOpacity
                key={t}
                onPress={() => setTipoIdx(idx)}
                style={[styles.chip, tipoIdx === idx && styles.chipActive]}
              >
                <Text style={tipoIdx === idx ? styles.chipTextActive : styles.chipText}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity style={[styles.btn, { backgroundColor: '#757575', marginRight: 8 }]} onPress={onClose}>
              <Text style={styles.btnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, { backgroundColor: '#0D47A1' }]} onPress={handleSave} disabled={saving}>
              {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Abrir</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

