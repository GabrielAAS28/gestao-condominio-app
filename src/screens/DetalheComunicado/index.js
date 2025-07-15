import React from 'react';
import { ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Icon from 'react-native-vector-icons/Feather';

// Importe os seus componentes de estilo
import {
  Container,
  Header,
  Title,
  Meta,
  Author,
  DateText,
  Content,
  Message,
} from './styles';

export function DetalheComunicado() {
  const route = useRoute();
  // Recebe o objeto 'comunicado' completo que foi passado via navegação
  const { comunicado } = route.params;

  // Formata a data para um formato mais legível
  const formattedDate = comunicado.comDataCadastro
    ? format(new Date(comunicado.comDataCadastro), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
        locale: ptBR,
      })
    : 'Data não disponível';

  return (
    <Container>
      <ScrollView>
        <Header>
          <Title>{comunicado.comAssunto}</Title>
          <Meta>
            <Icon name="user" size={14} color="#555" />
            <Author>Por: {comunicado.pessoa?.pesNome || 'Sistema'}</Author>
          </Meta>
          <Meta>
            <Icon name="calendar" size={14} color="#555" />
            <DateText>{formattedDate}</DateText>
          </Meta>
        </Header>
        <Content>
          <Message>{comunicado.comMensagem}</Message>
        </Content>
      </ScrollView>
    </Container>
  );
}
