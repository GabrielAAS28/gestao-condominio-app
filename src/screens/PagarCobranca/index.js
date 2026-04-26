import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Share } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import {
  getCobrancaById,
  pagarCobranca,
  gerarCodigoPix,
  gerarCodigoBoleto,
} from '../../services/cobrancasService';

import {
  Container,
  LoadingContainer,
  Card,
  Title,
  Subtitle,
  Valor,
  SectionTitle,
  MethodRow,
  MethodCard,
  MethodLabel,
  CodeBox,
  CodeText,
  ConfirmButton,
  ConfirmText,
  PaidBadge,
  PaidText,
} from './styles';

const formatBRL = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export function PagarCobranca() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;

  const [cobranca, setCobranca] = useState(null);
  const [metodo, setMetodo] = useState('PIX');
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    (async () => {
      const c = await getCobrancaById(id);
      setCobranca(c);
      setLoading(false);
    })();
  }, [id]);

  if (loading || !cobranca) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#007bff" />
      </LoadingContainer>
    );
  }

  const codigo = metodo === 'PIX' ? gerarCodigoPix(cobranca) : gerarCodigoBoleto(cobranca);

  const handleConfirm = async () => {
    try {
      setPaying(true);
      await pagarCobranca(cobranca.id, metodo);
      Alert.alert('Pagamento confirmado', `${cobranca.titulo} foi marcada como paga.`);
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível confirmar o pagamento.');
    } finally {
      setPaying(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: codigo });
    } catch {}
  };

  return (
    <Container>
      <Card>
        <Title>{cobranca.titulo}</Title>
        <Subtitle>{cobranca.descricao}</Subtitle>
        <Valor>{formatBRL(cobranca.valor)}</Valor>
        <Subtitle>Vencimento: {cobranca.vencimento}</Subtitle>
      </Card>

      {cobranca.status === 'PAGO' ? (
        <PaidBadge>
          <Icon name="check-circle" size={28} color="#16a34a" />
          <PaidText>Esta cobrança já foi paga.</PaidText>
        </PaidBadge>
      ) : (
        <>
          <Card>
            <SectionTitle>Forma de pagamento</SectionTitle>
            <MethodRow>
              <MethodCard selected={metodo === 'PIX'} onPress={() => setMetodo('PIX')}>
                <Icon name="zap" size={24} color={metodo === 'PIX' ? '#007bff' : '#555'} />
                <MethodLabel selected={metodo === 'PIX'}>Pix</MethodLabel>
              </MethodCard>
              <MethodCard selected={metodo === 'BOLETO'} onPress={() => setMetodo('BOLETO')}>
                <Icon name="file-text" size={24} color={metodo === 'BOLETO' ? '#007bff' : '#555'} />
                <MethodLabel selected={metodo === 'BOLETO'}>Boleto</MethodLabel>
              </MethodCard>
            </MethodRow>

            <SectionTitle style={{ marginTop: 18 }}>
              {metodo === 'PIX' ? 'Pix Copia e Cola' : 'Linha digitável'}
            </SectionTitle>
            <CodeBox>
              <CodeText>{codigo}</CodeText>
            </CodeBox>
            <ConfirmButton onPress={handleShare} style={{ backgroundColor: '#007bff', marginTop: 12 }}>
              <ConfirmText>Compartilhar código</ConfirmText>
            </ConfirmButton>
          </Card>

          <ConfirmButton onPress={handleConfirm} disabled={paying}>
            {paying ? <ActivityIndicator color="#fff" /> : <ConfirmText>Confirmar pagamento</ConfirmText>}
          </ConfirmButton>
        </>
      )}
    </Container>
  );
}
