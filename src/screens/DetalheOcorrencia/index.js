import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useFocusEffect, useRoute, useNavigation } from '@react-navigation/native';
import { format, parseISO } from 'date-fns';

import {
  getOcorrenciaById,
  comentarOcorrencia,
  finalizarOcorrencia,
} from '../../services/ocorrenciasService';
import { useAuth } from '../../contexts/AuthContext';
import { styles } from './styles';

const STATUS_COLORS = {
  ABERTA: '#1976D2',
  EM_ANALISE: '#FFA000',
  RESOLVIDA: '#388E3C',
};

export function DetalheOcorrencia() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user, hasPapel } = useAuth();
  const { ocoCod } = route.params;

  const [ocorrencia, setOcorrencia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [novoComentario, setNovoComentario] = useState('');
  const [parecer, setParecer] = useState('');
  const [acao, setAcao] = useState(null); // 'comentar' | 'finalizar' | null
  const [showFinal, setShowFinal] = useState(false);

  const carregar = useCallback(async () => {
    try {
      const { data } = await getOcorrenciaById(ocoCod);
      setOcorrencia(data);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível carregar a ocorrência.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [navigation, ocoCod]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      carregar();
    }, [carregar]),
  );

  const handleComentar = async () => {
    if (!novoComentario.trim()) return;
    setAcao('comentar');
    try {
      await comentarOcorrencia(ocoCod, novoComentario);
      setNovoComentario('');
      await carregar();
    } catch (e) {
      Alert.alert('Erro', e.response?.data?.message ?? e.message);
    } finally {
      setAcao(null);
    }
  };

  const handleFinalizar = async () => {
    if (!parecer.trim()) {
      Alert.alert('Atenção', 'Informe o parecer final.');
      return;
    }
    setAcao('finalizar');
    try {
      await finalizarOcorrencia(ocoCod, parecer);
      setShowFinal(false);
      setParecer('');
      await carregar();
    } catch (e) {
      Alert.alert('Erro', e.response?.data?.message ?? e.message);
    } finally {
      setAcao(null);
    }
  };

  if (loading || !ocorrencia) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#0D47A1" />
      </View>
    );
  }

  // Pode finalizar se for SINDICO/ADMIN do condomínio ou global admin
  const podeFinalizar =
    ocorrencia.status !== 'RESOLVIDA' &&
    (hasPapel('SINDICO', ocorrencia.conCod) ||
      hasPapel('ADMIN', ocorrencia.conCod) ||
      user?.isGlobalAdmin);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <View style={[styles.card, styles.headerCard]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.title}>{ocorrencia.titulo}</Text>
          <Text style={[styles.pill, { backgroundColor: STATUS_COLORS[ocorrencia.status] }]}>
            {ocorrencia.status}
          </Text>
        </View>
        <Text style={styles.meta}>
          {ocorrencia.tipo} · Aberta em{' '}
          {format(parseISO(ocorrencia.dataRegistro), 'dd/MM/yyyy HH:mm')}
        </Text>
        <Text style={styles.descricao}>{ocorrencia.descricao}</Text>
        {ocorrencia.parecerFinal ? (
          <View style={styles.parecerBox}>
            <Text style={styles.parecerLabel}>Parecer final</Text>
            <Text style={styles.parecerTxt}>{ocorrencia.parecerFinal}</Text>
            {ocorrencia.dataFinalizacao ? (
              <Text style={styles.meta}>
                Em {format(parseISO(ocorrencia.dataFinalizacao), 'dd/MM/yyyy HH:mm')}
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>

      <Text style={styles.sectionTitle}>Comentários</Text>
      {(ocorrencia.comentarios ?? []).length === 0 ? (
        <Text style={{ color: '#999', textAlign: 'center', marginVertical: 16 }}>
          Nenhum comentário ainda.
        </Text>
      ) : (
        ocorrencia.comentarios.map((c) => (
          <View key={c.occCod} style={styles.commentCard}>
            <Text style={styles.commentAuthor}>{c.pessoa?.pesNome ?? 'Usuário'}</Text>
            <Text style={styles.commentTxt}>{c.comentario}</Text>
            <Text style={styles.commentDate}>
              {format(parseISO(c.dataComentario), 'dd/MM HH:mm')}
            </Text>
          </View>
        ))
      )}

      {ocorrencia.status !== 'RESOLVIDA' && (
        <View style={styles.commentBox}>
          <TextInput
            style={[styles.input, { minHeight: 60 }]}
            value={novoComentario}
            onChangeText={setNovoComentario}
            placeholder="Adicionar comentário..."
            multiline
          />
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: '#0D47A1' }]}
            onPress={handleComentar}
            disabled={acao === 'comentar'}
          >
            {acao === 'comentar' ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.btnText}>
                <Icon name="send" size={14} /> Enviar
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {podeFinalizar && (
        <View style={{ marginTop: 24 }}>
          {!showFinal ? (
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: '#388E3C' }]}
              onPress={() => setShowFinal(true)}
            >
              <Text style={styles.btnText}>Finalizar ocorrência</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.commentBox}>
              <Text style={styles.sectionTitle}>Parecer final</Text>
              <TextInput
                style={[styles.input, { minHeight: 80 }]}
                value={parecer}
                onChangeText={setParecer}
                placeholder="Descreva como foi resolvido..."
                multiline
              />
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  style={[styles.btn, { flex: 1, backgroundColor: '#757575', marginRight: 8 }]}
                  onPress={() => setShowFinal(false)}
                >
                  <Text style={styles.btnText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, { flex: 1, backgroundColor: '#388E3C' }]}
                  onPress={handleFinalizar}
                  disabled={acao === 'finalizar'}
                >
                  {acao === 'finalizar' ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.btnText}>Confirmar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

