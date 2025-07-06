import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

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
  PlaceholderText
} from './styles';

const formatCpfCnpj = (value) => {
  if (!value) return '';
  const stringValue = value.replace(/\D/g, '');
  if (stringValue.length === 11) {
    return stringValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  return value;
};

export default function MeusDados() {
  const { user, updateUserData } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    pesNome: '',
    pesEmail: '',
    pesTelefone1: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        pesNome: user.pesNome || '',
        pesEmail: user.pesEmail || '',
        pesTelefone1: user.pesTelefone1 || ''
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateUserData(formData);
      Alert.alert('Sucesso', 'Seus dados foram atualizados.');
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setIsLoading(false);
    }
  };

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
              <InfoValue>{user?.pesNome || 'Não informado'}</InfoValue>
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
              <InfoValue>{user?.pesEmail || 'Não informado'}</InfoValue>
            )}
          </InfoRow>

          <InfoRow>
            <InfoLabel>Telefone Celular</InfoLabel>
            {isEditing ? (
              <Input 
                value={formData.pesTelefone1}
                onChangeText={(text) => handleInputChange('pesTelefone1', text)}
                keyboardType="phone-pad"
              />
            ) : (
              <InfoValue>{user?.pesTelefone1 || 'Não informado'}</InfoValue>
            )}
          </InfoRow>

          <InfoRow>
            <InfoLabel>CPF/CNPJ</InfoLabel>
            <InfoValue>{formatCpfCnpj(user?.pesCpfCnpj) || 'Não informado'}</InfoValue>
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
              <Button onPress={handleSave} color="#0D47A1" disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="#fff" /> : <ButtonText>Salvar</ButtonText>}
              </Button>
            </ButtonContainer>
          )}
        </Section>

        <Section>
          <SectionTitle>Dados do Condomínio</SectionTitle>
          {user?.condominios && user.condominios.length > 0 ? (
            user.condominios.map((condo) => (
              <View key={condo.conCod} style={styles.condominioCard}>
                <InfoRow>
                  <InfoLabel>Nome do Condomínio</InfoLabel>
                  <InfoValue>{condo.conNome}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Endereço</InfoLabel>
                  <InfoValue>{`${condo.conLogradouro}, ${condo.conNumero}`}</InfoValue>
                </InfoRow>
              </View>
            ))
          ) : (
            <PlaceholderText>
              Você não está associado a nenhum condomínio.
            </PlaceholderText>
          )}
          <PlaceholderText style={{fontSize: 12, marginTop: 16}}>
            A edição dos dados do condomínio não está disponível.
          </PlaceholderText>
        </Section>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  condominioCard: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  }
});
