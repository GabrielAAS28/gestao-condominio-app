import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// Importe o serviço que busca os dados da API
import { getCommonAreas } from '../../services/reservaServices';

// Importe os seus componentes de estilo
import { 
  Container, 
  Card, 
  CardHeader,
  AreaTitle, 
  AreaDescription,
  AreaCapacity,
  ReserveButton, 
  ButtonText,
  IconText,
  LoadingContainer,
  EmptyListContainer,
  EmptyListText
} from './styles';
import Icon from 'react-native-vector-icons/Feather';

export function Reservas() {
  const navigation = useNavigation();
  const [areas, setAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Função para carregar os dados da API
  const fetchAreas = async () => {
    try {
      const response = await getCommonAreas();
      setAreas(response);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as áreas comuns.');
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // useFocusEffect para recarregar os dados sempre que a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      fetchAreas();
    }, [])
  );

  // Função para o "puxar para atualizar"
  const onRefresh = () => {
    setIsRefreshing(true);
    fetchAreas();
  };

  // Navega para a tela de fazer reserva, passando o ID da área
  const handleReservePress = (areaId) => {
    navigation.navigate('FazerReserva', { areaId: areaId });
  };

  if (isLoading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#007bff" />
      </LoadingContainer>
    );
  }

  const renderItem = ({ item }) => (
    <Card>
      <CardHeader>
        <AreaTitle>{item.name}</AreaTitle>
      </CardHeader>
      <AreaDescription>{item.description}</AreaDescription>
      <IconText>
        <Icon name="users" size={16} color="#555" />
        <AreaCapacity>Capacidade: {item.capacity} pessoas</AreaCapacity>
      </IconText>
      
      <ReserveButton onPress={() => handleReservePress(item.id)}>
        <ButtonText>Ver Disponibilidade</ButtonText>
      </ReserveButton>
    </Card>
  );

  return (
    <Container>
      <FlatList
        data={areas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyListContainer>
            <Icon name="x-circle" size={40} color="#ccc" />
            <EmptyListText>Nenhuma área comum encontrada.</EmptyListText>
          </EmptyListContainer>
        }
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={["#007bff"]} />
        }
      />
    </Container>
  );
}
