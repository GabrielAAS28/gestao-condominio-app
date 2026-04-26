import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import { listCobrancas } from '../../services/cobrancasService';

import {
  Container,
  LoadingContainer,
  Header,
  Title,
  Subtitle,
  TotalCard,
  TotalLabel,
  TotalValue,
  Card,
  CardRow,
  TipoTag,
  TipoText,
  StatusTag,
  StatusText,
  CardTitle,
  CardDescription,
  CardFooter,
  Valor,
  Vencimento,
  PayButton,
  PayButtonText,
  EmptyContainer,
  EmptyText,
} from './styles';

const formatBRL = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const formatDate = (iso) => {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};

export function Cobrancas() {
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const list = await listCobrancas();
      setItems(list);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchData();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const totalPendente = items
    .filter((c) => c.status === 'PENDENTE')
    .reduce((acc, c) => acc + c.valor, 0);

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#007bff" />
      </LoadingContainer>
    );
  }

  const renderItem = ({ item }) => (
    <Card>
      <CardRow>
        <TipoTag tipo={item.tipo}>
          <TipoText>{item.tipo}</TipoText>
        </TipoTag>
        <StatusTag status={item.status}>
          <StatusText>{item.status}</StatusText>
        </StatusTag>
      </CardRow>
      <CardTitle>{item.titulo}</CardTitle>
      <CardDescription>{item.descricao}</CardDescription>
      <CardFooter>
        <Valor>{formatBRL(item.valor)}</Valor>
        <PayButton
          disabled={item.status === 'PAGO'}
          onPress={() => navigation.navigate('PagarCobranca', { id: item.id })}
        >
          <PayButtonText>{item.status === 'PAGO' ? 'Pago' : 'Pagar'}</PayButtonText>
        </PayButton>
      </CardFooter>
      <Vencimento>Vence em {formatDate(item.vencimento)}</Vencimento>
    </Card>
  );

  return (
    <Container>
      <Header>
        <Title>Minhas Cobranças</Title>
        <Subtitle>Condomínio, gás e taxas de reserva</Subtitle>
      </Header>
      <TotalCard>
        <TotalLabel>Total em aberto</TotalLabel>
        <TotalValue>{formatBRL(totalPendente)}</TotalValue>
      </TotalCard>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <EmptyContainer>
            <Icon name="check-circle" size={40} color="#16a34a" />
            <EmptyText>Nenhuma cobrança pendente.</EmptyText>
          </EmptyContainer>
        }
      />
    </Container>
  );
}
