import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { getPessoaById } from '../../services/cadastroService';
import { papeisPorPessoa } from '../../services/cadastroService';

import {
  Container,
  Section,
  SectionTitle,
  InfoRow,
  InfoLabel,
  InfoValue,
  Input,
  ButtonContainer,
  Button,
  ButtonText,
  EditButton,
  EditButtonText,
  PlaceholderText,
  CondominioCard,
} from './styles';

const PAPEIS_LABELS = {
  SINDICO: 'Síndico',
  MORADOR: 'Morador',
  FUNCIONARIO_ADM: 'Funcionário ADM',
  PORTEIRO: 'Porteiro',
  ADMIN: 'Administrador',
};

const formatCpfCnpj = (value) => {
  if (!value) return '';
  const stringValue = String(value).replace(/\D/g, '');
  if (stringValue.length === 11) {
    return stringValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  if (stringValue.length === 14) {
    return stringValue.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  return value;
};

export function MeusDados() {
  const { user, updateUserData } = useAuth();

  const [pessoa, setPessoa] = useState(null);
  const [papeis, setPapeis] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ pesNome: '', pesEmail: '', pesTelefone: '' });

  const carregar = useCallback(async () => {
    if (!user?.pesCod) return;
    try {
      const [pesRes, papRes] = await Promise.all([
        getPessoaById(user.pesCod),
        papeisPorPessoa(user.pesCod).catch(() => ({ data: [] })),
      ]);
      const p = pesRes.data;
      setPessoa(p);
      setPapeis(papRes.data ?? []);
      setFormData({
        pesNome: p?.pesNome ?? '',
        pesEmail: p?.pesEmail ?? '',
        pesTelefone: p?.pesTelefone ?? '',
      });
    } catch (e) {
      console.warn('Falha ao carregar pessoa:', e?.response?.data || e.message);
    } finally {
      setIsLoading(false);
    }
  }, [user?.pesCod]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUserData({
        pesNome: formData.pesNome,
        pesEmail: formData.pesEmail,
        pesTelefone: formData.pesTelefone,
      });
      await carregar();
      Alert.alert('Sucesso', 'Seus dados foram atualizados.');
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <ActivityIndicator size="large" color="#0D47A1" style={{ marginTop: 40 }} />
      </Container>
    );
  }

  return (
    <Container>
      <ScrollView>
        <Section>
          <SectionTitle>Dados Pessoais</SectionTitle>

          <InfoRow>
            <InfoLabel>Nome Completo</InfoLabel>
            {isEditing ? (
              <Input
                value={formData.pesNome}
                onChangeText={(text) => handleInputChange('pesNome', text)}
              />
            ) : (
              <InfoValue>{pessoa?.pesNome || 'Não informado'}</InfoValue>
            )}
          </InfoRow>

          <InfoRow>
            <InfoLabel>E-mail</InfoLabel>
            {isEditing ? (
              <Input
                value={formData.pesEmail}
                onChangeText={(text) => handleInputChange('pesEmail', text)}
                keyboardType="email-address"
              />
            ) : (
              <InfoValue>{pessoa?.pesEmail || 'Não informado'}</InfoValue>
            )}
          </InfoRow>

          <InfoRow>
            <InfoLabel>Telefone</InfoLabel>
            {isEditing ? (
              <Input
                value={formData.pesTelefone}
                onChangeText={(text) => handleInputChange('pesTelefone', text)}
                keyboardType="phone-pad"
              />
            ) : (
              <InfoValue>{pessoa?.pesTelefone || 'Não informado'}</InfoValue>
            )}
          </InfoRow>

          <InfoRow>
            <InfoLabel>CPF/CNPJ</InfoLabel>
            <InfoValue>{formatCpfCnpj(pessoa?.pesCpfCnpj) || 'Não informado'}</InfoValue>
          </InfoRow>

          {!isEditing ? (
            <EditButton onPress={() => setIsEditing(true)}>
              <EditButtonText>Editar Dados</EditButtonText>
            </EditButton>
          ) : (
            <ButtonContainer>
              <Button onPress={() => setIsEditing(false)} color="#757575">
                <ButtonText>Cancelar</ButtonText>
              </Button>
              <Button onPress={handleSave} color="#0D47A1" disabled={isSaving}>
                {isSaving ? <ActivityIndicator color="#fff" /> : <ButtonText>Salvar</ButtonText>}
              </Button>
            </ButtonContainer>
          )}
        </Section>

        <Section>
          <SectionTitle>Meus Vínculos com Condomínios</SectionTitle>
          {papeis.length > 0 ? (
            papeis.map((p) => (
              <CondominioCard key={`${p.pesCod}-${p.conCod}-${p.uscPapel}`}>
                <InfoRow>
                  <InfoLabel>Condomínio</InfoLabel>
                  <InfoValue>{p.condominio?.conNome ?? `#${p.conCod}`}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Papel</InfoLabel>
                  <InfoValue>{PAPEIS_LABELS[p.uscPapel] ?? p.uscPapel}</InfoValue>
                </InfoRow>
              </CondominioCard>
            ))
          ) : (
            <PlaceholderText>
              Você não está associado a nenhum condomínio.
            </PlaceholderText>
          )}
        </Section>
      </ScrollView>
    </Container>
  );
}
