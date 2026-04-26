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
import { ptBR } from 'date-fns/locale';

import {
  listarVisitantes,
  registrarVisitante,
  marcarSaida,
} from '../../services/visitantesService';
import { useAuth } from '../../contexts/AuthContext';
import { styles } from './styles';

export function Visitantes() {
  const { user, getCondominioIds } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [filtro, setFiltro] = useState('NO_LOCAL'); // 'NO_LOCAL' | 'SAIU' | 'TODOS'

  const carregar = useCallback(async () => {
    try {
      const condominioId = getCondominioIds()[0];
      const params = condominioId ? { condominioId } : {};
      if (filtro !== 'TODOS') params.status = filtro;
      const { data } = await listarVisitantes(params);
      setList(data ?? []);
    } catch (e) {
      console.warn(e?.response?.data || e.message);
      Alert.alert('Erro', 'Não foi possível carregar visitantes.');
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

  const onRefresh = () => {
    setRefreshing(true);
    carregar();
  };

  const handleSaida = (id) => {
    Alert.alert('Marcar saída', 'Confirmar?', [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Sim',
        onPress: async () => {
          try {
            await marcarSaida(id);
            carregar();
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

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {['NO_LOCAL', 'SAIU', 'TODOS'].map((opt) => (
          <TouchableOpacity
            key={opt}
            onPress={() => setFiltro(opt)}
            style={[styles.tab, filtro === opt && styles.tabActive]}
          >
            <Text style={filtro === opt ? styles.tabTextActive : styles.tabText}>
              {opt === 'NO_LOCAL' ? 'No local' : opt === 'SAIU' ? 'Saíram' : 'Todos'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={list}
        keyExtractor={(item) => String(item.visCod)}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={[styles.center, { padding: 40 }]}>
            <Icon name="user-x" size={40} color="#ccc" />
            <Text style={{ marginTop: 8, color: '#999' }}>Nenhum visitante.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.nome}</Text>
            {item.cpf ? <Text style={styles.cardLine}>CPF: {item.cpf}</Text> : null}
            <Text style={styles.cardLine}>
              Unidade: {item.unidade?.bloco ? `${item.unidade.bloco}/` : ''}
              {item.unidade?.uniNumero ?? '—'}
            </Text>
            <Text style={styles.cardLine}>
              Entrada: {format(parseISO(item.dataEntrada), 'dd/MM HH:mm', { locale: ptBR })}
            </Text>
            {item.dataSaida && (
              <Text style={styles.cardLine}>
                Saída: {format(parseISO(item.dataSaida), 'dd/MM HH:mm', { locale: ptBR })}
              </Text>
            )}
            <Text
              style={[
                styles.pill,
                { backgroundColor: item.status === 'NO_LOCAL' ? '#388E3C' : '#757575' },
              ]}
            >
              {item.status === 'NO_LOCAL' ? 'No local' : 'Saiu'}
            </Text>
            {item.status === 'NO_LOCAL' && (
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: '#D32F2F' }]}
                onPress={() => handleSaida(item.visCod)}
              >
                <Text style={styles.btnText}>Marcar saída</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalOpen(true)}>
        <Icon name="plus" size={28} color="#fff" />
      </TouchableOpacity>

      <RegistrarModal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={() => {
          setModalOpen(false);
          carregar();
        }}
        defaultCondominioId={getCondominioIds()[0]}
        pesCodMorador={user?.pesCod}
      />
    </View>
  );
}

function RegistrarModal({ visible, onClose, onSaved, defaultCondominioId, pesCodMorador }) {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [unidadeId, setUnidadeId] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setNome(''); setCpf(''); setTelefone(''); setUnidadeId(''); setObservacoes('');
  };

  const handleSave = async () => {
    if (!nome || !unidadeId) {
      Alert.alert('Atenção', 'Informe nome e unidade.');
      return;
    }
    setSaving(true);
    try {
      await registrarVisitante({
        condominioId: defaultCondominioId,
        unidadeId: Number(unidadeId),
        pesCodMorador,
        nome,
        cpf: cpf || undefined,
        telefone: telefone || undefined,
        dataEntrada: new Date().toISOString(),
        observacoes: observacoes || undefined,
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
          <Text style={styles.modalTitle}>Registrar visitante</Text>
          <TextInput style={styles.input} placeholder="Nome*" value={nome} onChangeText={setNome} />
          <TextInput style={styles.input} placeholder="CPF" value={cpf} onChangeText={setCpf} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
          <TextInput style={styles.input} placeholder="ID da unidade*" value={unidadeId} onChangeText={setUnidadeId} keyboardType="numeric" />
          <TextInput style={[styles.input, { minHeight: 60 }]} placeholder="Observações" value={observacoes} onChangeText={setObservacoes} multiline />
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity style={[styles.btn, { backgroundColor: '#757575', marginRight: 8 }]} onPress={onClose}>
              <Text style={styles.btnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, { backgroundColor: '#0D47A1' }]} onPress={handleSave} disabled={saving}>
              {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Registrar</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

