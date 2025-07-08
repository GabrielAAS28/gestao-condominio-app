import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
`;

// --- CORREÇÃO AQUI ---
// As propriedades de sombra foram movidas para o método .attrs()
// para serem aplicadas como props, e não como estilos CSS.
export const Card = styled.View.attrs({
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2, // Elevação para Android
})`
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.border_radius.md}px;
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const CardHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const AreaTitle = styled.Text`
  font-size: 20px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.text};
`;

export const AreaDescription = styled.Text`
  font-size: 16px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.text_secondary};
  margin-bottom: 16px;
  line-height: 24px;
`;

export const IconText = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

export const AreaCapacity = styled.Text`
  font-size: 14px;
  font-family: ${({ theme }) => theme.fonts.medium};
  color: ${({ theme }) => theme.colors.text_secondary};
  margin-left: 8px;
`;

export const ReserveButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 12px;
  border-radius: ${({ theme }) => theme.border_radius.md}px;
  align-items: center;
`;

export const ButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: 16px;
  font-family: ${({ theme }) => theme.fonts.bold};
`;

export const EmptyListContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
`;

export const EmptyListText = styled.Text`
  font-size: 16px;
  margin-top: 16px;
  color: ${({ theme }) => theme.colors.text_secondary};
`;
