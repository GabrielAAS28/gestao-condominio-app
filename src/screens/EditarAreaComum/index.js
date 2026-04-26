import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import {
  getAreaComumById,
  criarAreaComum,
  atualizarAreaComum,
} from '../../services/reservasService';
import { useAuth } from '../../contexts/AuthContext';
import { styles } from '../GestaoAreasComuns/styles';

const empty = {
  nome: '',
  descricao: '',
  termosUso: '',
  capacidadeMaxima: '',
  permiteConvidados: false,
  limiteConvidados: '',
  diasAntecedenciaMin: '1',
  diasAntecedenciaMax: '30',
  ativa: true,
  taxaValor: '',
  turnos: [],
};

const turnoVazio = () => ({ nome: '', horaInicio: '08:00', horaFim: '12:00', ativo: true });

const onlyTime = (str) => {
  if (!str) return '';
  const m = String(str).match(/(\d{2}):(\d{2})/);
  return m ? `${m[1]}:${m[2]}` : '';
};

export function EditarAreaComum() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user, getCondominioIds } = useAuth();
  const { areaId } = route.params ?? {};
  const isEdit = !!areaId;

  const autoCondominioId =
    getCondominioIds()[0] ??
    user?.condominios?.[0]?.conCod ??
    user?.condominios?.[0]?.id ??
    user?.condominio?.conCod ??
    user?.conCod ??
    null;

  const [manualCondominioId, setManualCondominioId] = useState(
    autoCondominioId ? String(autoCondominioId) : '',
  );

  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const { data } = await getAreaComumById(areaId);
        setForm({
          nome: data.nome ?? '',
          descricao: data.descricao ?? '',
          termosUso: data.termosUso ?? '',
          capacidadeMaxima: data.capacidadeMaxima != null ? String(data.capacidadeMaxima) : '',
          permiteConvidados: !!data.permiteConvidados,
          limiteConvidados: data.limiteConvidados != null ? String(data.limiteConvidados) : '',
          diasAntecedenciaMin: data.diasAntecedenciaMin != null ? String(data.diasAntecedenciaMin) : '1',
          diasAntecedenciaMax: data.diasAntecedenciaMax != null ? String(data.diasAntecedenciaMax) : '30',
          ativa: data.ativa !== false,
          taxaValor: data.taxaValor != null ? String(data.taxaValor) : '',
          turnos: (data.turnos ?? []).map((t) => ({
            turCod: t.turCod,
            nome: t.nome,
            horaInicio: onlyTime(t.horaInicio),
            horaFim: onlyTime(t.horaFim),
            ativo: t.ativo !== false,
          })),
        });
      } catch (e) {
        Alert.alert('Erro', e.response?.data?.message ?? 'Não foi possível carregar a área.');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    })();
  }, [areaId, isEdit, navigation]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const addTurno = () => set('turnos', [...form.turnos, turnoVazio()]);
  const updateTurno = (idx, key, value) => {
    const next = form.turnos.map((t, i) => (i === idx ? { ...t, [key]: value } : t));
    set('turnos', next);
  };
  const removeTurno = (idx) => set('turnos', form.turnos.filter((_, i) => i !== idx));

  const validar = () => {
    if (!form.nome.trim()) return 'Informe o nome.';
    for (const t of form.turnos) {
      if (!t.nome.trim()) return 'Cada turno precisa de um nome.';
      if (!/^\d{2}:\d{2}$/.test(t.horaInicio)) return 'Hora início deve ser HH:mm.';
      if (!/^\d{2}:\d{2}$/.test(t.horaFim)) return 'Hora fim deve ser HH:mm.';
    }
    return null;
  };

  const buildPayload = () => {
    const payload = {
      nome: form.nome.trim(),
      descricao: form.descricao.trim() || undefined,
      termosUso: form.termosUso.trim() || undefined,
      capacidadeMaxima: form.capacidadeMaxima ? Number(form.capacidadeMaxima) : undefined,
      permiteConvidados: form.permiteConvidados,
      limiteConvidados: form.limiteConvidados ? Number(form.limiteConvidados) : undefined,
      diasAntecedenciaMin: form.diasAntecedenciaMin ? Number(form.diasAntecedenciaMin) : undefined,
      diasAntecedenciaMax: form.diasAntecedenciaMax ? Number(form.diasAntecedenciaMax) : undefined,
      ativa: form.ativa,
      taxaValor: form.taxaValor ? Number(form.taxaValor) : undefined,
      turnos: form.turnos.map((t) => ({
        nome: t.nome.trim(),
        horaInicio: `${t.horaInicio}:00`,
        horaFim: `${t.horaFim}:00`,
        ativo: t.ativo,
      })),
    };
    if (!isEdit) {
      payload.condominioId = manualCondominioId ? Number(manualCondominioId) : null;
    }
    return payload;
  };

  const salvar = async () => {
    const erro = validar();
    if (erro) return Alert.alert('Atenção', erro);

    const payload = buildPayload();
    if (!isEdit && !payload.condominioId) {
      return Alert.alert(
        'Atenção',
        'Informe o ID do condomínio (conCod) no campo do topo do formulário.',
      );
    }

    setSaving(true);
    try {
      if (isEdit) {
        await atualizarAreaComum(areaId, payload);
      } else {
        await criarAreaComum(payload);
      }
      Alert.alert('Sucesso', isEdit ? 'Área atualizada.' : 'Área criada.');
      navigation.goBack();
    } catch (e) {
      const msg = e.response?.data?.message ?? e.message;
      Alert.alert('Erro', Array.isArray(msg) ? msg.join('\n') : msg);
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

  const userKeys = user ? Object.keys(user).join(', ') : '(sem user)';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.form}>
      {!isEdit && (
        <>
          <Text style={styles.label}>ID do Condomínio (conCod)*</Text>
          <TextInput
            style={styles.input}
            value={manualCondominioId}
            onChangeText={(v) => setManualCondominioId(v.replace(/\D/g, ''))}
            keyboardType="numeric"
            placeholder="Ex.: 1"
          />
          <Text style={{ fontSize: 11, color: '#888', marginTop: 4 }}>
            {autoCondominioId
              ? `Detectado automaticamente: ${autoCondominioId}. Edite se necessário.`
              : `Não detectei o condomínio automaticamente. Campos do usuário: ${userKeys}. Digite o conCod manualmente.`}
          </Text>
        </>
      )}

      <Text style={styles.label}>Nome*</Text>
      <TextInput
        style={styles.input}
        value={form.nome}
        onChangeText={(v) => set('nome', v)}
        placeholder="Ex.: Salão de Festas"
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        value={form.descricao}
        onChangeText={(v) => set('descricao', v)}
        multiline
        placeholder="Descrição opcional"
      />

      <Text style={styles.label}>Termos de uso</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        value={form.termosUso}
        onChangeText={(v) => set('termosUso', v)}
        multiline
        placeholder="Regras que o morador precisa aceitar"
      />

      <View style={styles.twoCols}>
        <View style={styles.flex1}>
          <Text style={styles.label}>Capacidade</Text>
          <TextInput
            style={styles.input}
            value={form.capacidadeMaxima}
            onChangeText={(v) => set('capacidadeMaxima', v.replace(/\D/g, ''))}
            keyboardType="numeric"
            placeholder="Ex.: 50"
          />
        </View>
        <View style={styles.flex1}>
          <Text style={styles.label}>Taxa (R$)</Text>
          <TextInput
            style={styles.input}
            value={form.taxaValor}
            onChangeText={(v) => set('taxaValor', v.replace(/[^0-9.]/g, ''))}
            keyboardType="decimal-pad"
            placeholder="Ex.: 250.00"
          />
        </View>
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Permite convidados</Text>
        <Switch
          value={form.permiteConvidados}
          onValueChange={(v) => set('permiteConvidados', v)}
        />
      </View>

      {form.permiteConvidados && (
        <>
          <Text style={styles.label}>Limite de convidados</Text>
          <TextInput
            style={styles.input}
            value={form.limiteConvidados}
            onChangeText={(v) => set('limiteConvidados', v.replace(/\D/g, ''))}
            keyboardType="numeric"
            placeholder="Ex.: 30"
          />
        </>
      )}

      <View style={styles.twoCols}>
        <View style={styles.flex1}>
          <Text style={styles.label}>Antecedência mín. (dias)</Text>
          <TextInput
            style={styles.input}
            value={form.diasAntecedenciaMin}
            onChangeText={(v) => set('diasAntecedenciaMin', v.replace(/\D/g, ''))}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.flex1}>
          <Text style={styles.label}>Antecedência máx. (dias)</Text>
          <TextInput
            style={styles.input}
            value={form.diasAntecedenciaMax}
            onChangeText={(v) => set('diasAntecedenciaMax', v.replace(/\D/g, ''))}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Ativa</Text>
        <Switch value={form.ativa} onValueChange={(v) => set('ativa', v)} />
      </View>

      <Text style={[styles.label, { marginTop: 24, fontSize: 15 }]}>Turnos</Text>
      {form.turnos.map((t, idx) => (
        <View key={idx} style={styles.turnoCard}>
          <View style={styles.turnoRow}>
            <TextInput
              style={[styles.input, styles.flex1]}
              value={t.nome}
              onChangeText={(v) => updateTurno(idx, 'nome', v)}
              placeholder="Nome (ex.: Manhã)"
            />
            <TouchableOpacity style={styles.turnoRemove} onPress={() => removeTurno(idx)}>
              <Icon name="trash-2" size={20} color="#D32F2F" />
            </TouchableOpacity>
          </View>
          <View style={[styles.twoCols, { marginTop: 8 }]}>
            <View style={styles.flex1}>
              <Text style={styles.label}>Início (HH:mm)</Text>
              <TextInput
                style={styles.input}
                value={t.horaInicio}
                onChangeText={(v) => updateTurno(idx, 'horaInicio', v)}
                placeholder="08:00"
              />
            </View>
            <View style={styles.flex1}>
              <Text style={styles.label}>Fim (HH:mm)</Text>
              <TextInput
                style={styles.input}
                value={t.horaFim}
                onChangeText={(v) => updateTurno(idx, 'horaFim', v)}
                placeholder="12:00"
              />
            </View>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.addTurnoBtn} onPress={addTurno}>
        <Icon name="plus" size={18} color="#0D47A1" />
        <Text style={styles.addTurnoText}>Adicionar turno</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveBtn} onPress={salvar} disabled={saving}>
        {saving ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.saveBtnText}>{isEdit ? 'Salvar alterações' : 'Criar área'}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
