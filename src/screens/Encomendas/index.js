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
import { useFocusEffect } from '@react-navigation/native';
import { format, parseISO } from 'date-fns';

import {
  listarEncomendas,
  cadastrarEncomenda,
  marcarRetirada,
} from '../../services/encomendasService';
import { useAuth } from '../../contexts/AuthContext';
import { styles } from './styles';

const TIPOS = ['CORREIOS', 'TRANSPORTADORA', 'DELIVERY', 'OUTROS'];

const STATUS_COLORS = {
  PENDENTE: '#FFA000',
  RETIRADA: '#388E3C',
  DEVOLVIDA: '#757575',
  EXTRAVIADA: '#D32F2F',
};

export function Encomendas() {
  const { user, getCondominioIds } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [filtro, setFiltro] = useState('PENDENTE');

  const carregar = useCallback(async () => {
    try {
      const condominioId = getCondominioIds()[0];
      const params = condominioId ? { condominioId, take: 50 } : { take: 50 };
      if (filtro !== 'TODAS') params.status = filtro;
      const { data } = await listarEncomendas(params);
      const items = Array.isArray(data) ? data : data?.items ?? [];
      setList(items);
    } catch (e) {
      console.warn(e?.response?.data || e.message);
      Alert.alert('Erro', 'Não foi possível carregar encomendas.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filtro, getCondominioIds]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      carregar();
    }, [carregar]),
  );

  const handleRetirada = (id) => {
    Alert.prompt?.('Marcar retirada', 'Nome de quem retirou:', async (nome) => {
      if (!nome) return;
      try {
        await marcarRetirada(id, { nomeRetirada: nome, pesCodRetirada: user?.pesCod });
        carregar();
      } catch (e) {
        Alert.alert('Erro', e.response?.data?.message ?? e.message);
      }
    });
    // Em Android, Alert.prompt não existe — fallback simples:
    if (!Alert.prompt) {
      // Marca o próprio usuário como retirador
      marcarRetirada(id, {
        nomeRetirada: user?.nome ?? user?.pesNome ?? 'Morador',
        pesCodRetirada: user?.pesCod,
      })
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
      <View style={styles.tabs}>
        {['PENDENTE', 'RETIRADA', 'TODAS'].map((opt) => (
          <TouchableOpacity
            key={opt}
            onPress={() => setFiltro(opt)}
            style={[styles.tab, filtro === opt && styles.tabActive]}
          >
            <Text style={filtro === opt ? styles.tabTextActive : styles.tabText}>
              {opt === 'PENDENTE' ? 'Pendentes' : opt === 'RETIRADA' ? 'Retiradas' : 'Todas'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={list}
        keyExtractor={(item) => String(item.encCod)}
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
            <Icon name="package" size={40} color="#ccc" />
            <Text style={{ marginTop: 8, color: '#999' }}>Nenhuma encomenda.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.destinatario}</Text>
            <Text style={styles.cardLine}>Tipo: {item.tipo}</Text>
            <Text style={styles.cardLine}>
              Recebida por: {item.nomeRecebidoPor} em{' '}
              {format(parseISO(item.dataRecebimento), 'dd/MM HH:mm')}
            </Text>
            {item.descricao ? <Text style={styles.cardLine}>{item.descricao}</Text> : null}
            <Text style={[styles.pill, { backgroundColor: STATUS_COLORS[item.status] }]}>
              {item.status}
            </Text>
            {item.status === 'PENDENTE' && (
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: '#388E3C' }]}
                onPress={() => handleRetirada(item.encCod)}
              >
                <Text style={styles.btnText}>Marcar retirada</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalOpen(true)}>
        <Icon name="plus" size={28} color="#fff" />
      </TouchableOpacity>

      <CadastrarModal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={() => {
          setModalOpen(false);
          carregar();
        }}
        defaultCondominioId={getCondominioIds()[0]}
        defaultRecebedor={user?.nome ?? user?.pesNome ?? ''}
      />
    </View>
  );
}

function CadastrarModal({ visible, onClose, onSaved, defaultCondominioId, defaultRecebedor }) {
  const [destinatario, setDestinatario] = useState('');
  const [unidadeId, setUnidadeId] = useState('');
  const [recebedor, setRecebedor] = useState(defaultRecebedor);
  const [descricao, setDescricao] = useState('');
  const [tipoIdx, setTipoIdx] = useState(0);
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setDestinatario(''); setUnidadeId(''); setDescricao(''); setTipoIdx(0);
  };

  const handleSave = async () => {
    if (!destinatario || !unidadeId || !recebedor) {
      Alert.alert('Atenção', 'Preencha destinatário, unidade e quem recebeu.');
      return;
    }
    setSaving(true);
    try {
      await cadastrarEncomenda({
        condominioId: defaultCondominioId,
        unidadeId: Number(unidadeId),
        destinatario,
        nomeRecebidoPor: recebedor,
        descricao: descricao || undefined,
        tipo: TIPOS[tipoIdx],
        dataRecebimento: new Date().toISOString(),
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
          <Text style={styles.modalTitle}>Cadastrar encomenda</Text>
          <TextInput style={styles.input} placeholder="Destinatário*" value={destinatario} onChangeText={setDestinatario} />
          <TextInput style={styles.input} placeholder="ID da unidade*" value={unidadeId} onChangeText={setUnidadeId} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Recebido por*" value={recebedor} onChangeText={setRecebedor} />
          <TextInput style={[styles.input, { minHeight: 50 }]} placeholder="Descrição" value={descricao} onChangeText={setDescricao} multiline />
          <View style={styles.chipsRow}>
            {TIPOS.map((t, idx) => (
              <TouchableOpacity
                key={t}
                onPress={() => setTipoIdx(idx)}
                style={[styles.chip, tipoIdx === idx && styles.chipActive]}
              >
                <Text style={tipoIdx === idx ? styles.chipTextActive : styles.chipText}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity style={[styles.btn, { backgroundColor: '#757575', marginRight: 8 }]} onPress={onClose}>
              <Text style={styles.btnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, { backgroundColor: '#0D47A1' }]} onPress={handleSave} disabled={saving}>
              {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Salvar</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

