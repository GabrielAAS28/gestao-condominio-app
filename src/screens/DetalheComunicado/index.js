import React from 'react';
import { ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Icon from 'react-native-vector-icons/Feather';


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

  const dataIso = comunicado.dataCadastro ?? comunicado.comDataCadastro;
  const formattedDate = dataIso
    ? format(new Date(dataIso), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })
    : 'Data não disponível';

  const tituloTxt = comunicado.titulo ?? comunicado.comAssunto ?? '';
  const mensagemTxt = comunicado.mensagem ?? comunicado.comMensagem ?? '';
  const autor =
    comunicado.pessoaCriador?.pesNome ?? comunicado.pessoa?.pesNome ?? 'Sistema';

  return (
    <Container>
      <ScrollView>
        <Header>
          <Title>
            {comunicado.isUrgente ? '🔴 ' : ''}
            {tituloTxt}
          </Title>
          <Meta>
            <Icon name="user" size={14} color="#555" />
            <Author>Por: {autor}</Author>
          </Meta>
          <Meta>
            <Icon name="calendar" size={14} color="#555" />
            <DateText>{formattedDate}</DateText>
          </Meta>
        </Header>
        <Content>
          <Message>{mensagemTxt}</Message>
        </Content>
      </ScrollView>
    </Container>
  );
}
