import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Switch,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import { useAuth } from '../../contexts/AuthContext';
import { getAreaComumById, criarReserva } from '../../services/reservasService';
import { ocupantesPorPessoa } from '../../services/cadastroService';
import { styles } from './styles';

export function FazerReserva() {
  const navigation = useNavigation();
  const route = useRoute();
  const { areaId } = route.params ?? {};
  const { user } = useAuth();

  const [area, setArea] = useState(null);
  const [unidades, setUnidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [unidadeId, setUnidadeId] = useState(null);
  const [turnoId, setTurnoId] = useState(null);
  const [dataStr, setDataStr] = useState(''); // 'YYYY-MM-DD'
  const [termosAceitos, setTermosAceitos] = useState(false);
  const [convidadosTxt, setConvidadosTxt] = useState(''); // nomes separados por vírgula

  useEffect(() => {
    (async () => {
      try {
        const [areaRes, ocuRes] = await Promise.all([
          getAreaComumById(areaId),
          ocupantesPorPessoa(user.pesCod),
        ]);
        setArea(areaRes.data);
        const uns = (ocuRes.data ?? []).map((o) => o.unidade).filter(Boolean);
        setUnidades(uns);
        if (uns.length === 1) setUnidadeId(uns[0].uniCod);
      } catch (e) {
        Alert.alert('Erro', 'Não foi possível carregar a área comum.');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    })();
  }, [areaId, navigation, user.pesCod]);

  const handleSubmit = async () => {
    if (!unidadeId) {
      Alert.alert('Atenção', 'Selecione uma unidade.');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dataStr)) {
      Alert.alert('Atenção', 'Informe a data no formato AAAA-MM-DD.');
      return;
    }
    if (!termosAceitos) {
      Alert.alert('Atenção', 'Você precisa aceitar os termos de uso.');
      return;
    }

    const convidados = convidadosTxt
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((nome) => ({ nome }));

    setSaving(true);
    try {
      await criarReserva({
        areaComumId: area.areCod,
        turnoId: turnoId ?? undefined,
        unidadeId,
        data: dataStr,
        termosAceitos: true,
        convidados: convidados.length ? convidados : undefined,
      });
      Alert.alert('Sucesso', 'Reserva enviada para aprovação!', [
        { text: 'Ver minhas reservas', onPress: () => navigation.navigate('Reservas', { tab: 'minhas' }) },
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Erro', e.response?.data?.message ?? 'Falha ao criar reserva.');
    } finally {
      setSaving(false);
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
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>{area.nome}</Text>
      {area.descricao ? <Text style={styles.desc}>{area.descricao}</Text> : null}

      <Text style={styles.label}>Unidade</Text>
      {unidades.length === 0 ? (
        <Text style={styles.warn}>Você não está vinculado a nenhuma unidade.</Text>
      ) : (
        <View style={styles.chipsRow}>
          {unidades.map((u) => (
            <TouchableOpacity
              key={u.uniCod}
              onPress={() => setUnidadeId(u.uniCod)}
              style={[styles.chip, unidadeId === u.uniCod && styles.chipActive]}
            >
              <Text style={unidadeId === u.uniCod ? styles.chipTextActive : styles.chipText}>
                {u.bloco ? `${u.bloco}/` : ''}{u.uniNumero}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={styles.label}>Data (AAAA-MM-DD)</Text>
      <TextInput
        style={styles.input}
        value={dataStr}
        onChangeText={setDataStr}
        placeholder="2026-05-15"
        keyboardType="numbers-and-punctuation"
      />

      {area.turnos?.length > 0 && (
        <>
          <Text style={styles.label}>Turno</Text>
          <View style={styles.chipsRow}>
            {area.turnos.map((t) => (
              <TouchableOpacity
                key={t.turCod}
                onPress={() => setTurnoId(t.turCod)}
                style={[styles.chip, turnoId === t.turCod && styles.chipActive]}
              >
                <Text style={turnoId === t.turCod ? styles.chipTextActive : styles.chipText}>
                  {t.nome}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {area.permiteConvidados && (
        <>
          <Text style={styles.label}>
            Convidados (nomes separados por vírgula
            {area.limiteConvidados ? `, máx ${area.limiteConvidados}` : ''})
          </Text>
          <TextInput
            style={[styles.input, { minHeight: 60 }]}
            value={convidadosTxt}
            onChangeText={setConvidadosTxt}
            placeholder="Maria Silva, João Souza"
            multiline
          />
        </>
      )}

      {area.termosUso ? (
        <View style={styles.termsBox}>
          <Text style={styles.termsTitle}>Termos de uso</Text>
          <Text style={styles.termsTxt}>{area.termosUso}</Text>
        </View>
      ) : null}

      <View style={styles.row}>
        <Switch value={termosAceitos} onValueChange={setTermosAceitos} />
        <Text style={{ marginLeft: 8, flex: 1 }}>
          Li e aceito os termos de uso.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, saving && { opacity: 0.6 }]}
        onPress={handleSubmit}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>
            <Icon name="check" size={14} /> Confirmar reserva
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('Reservas', { tab: 'minhas' })}
      >
        <Text style={styles.secondaryButtonText}>Ver minhas reservas</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

