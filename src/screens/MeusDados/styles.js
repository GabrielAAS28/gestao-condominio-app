import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Section = styled.View`
  margin-top: 16px;
  background-color: ${({ theme }) => theme.colors.card};
  padding: 16px;
  border-bottom-width: 1px;
  border-top-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

export const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 16px;
  border-bottom-width: 2px;
  border-bottom-color: ${({ theme }) => theme.colors.primary};
  padding-bottom: 8px;
`;

export const InfoRow = styled.View`
  margin-bottom: 12px;
`;

export const InfoLabel = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text_secondary};
  margin-bottom: 4px;
`;

export const InfoValue = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  padding: 12px 0;
`;

// CORREÇÃO: Adicionando os estilos que estavam em falta
export const Input = styled.TextInput`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 10px;
`;

export const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 24px;
`;

export const Button = styled.TouchableOpacity`
  background-color: ${props => props.color || '#ccc'};
  padding: 12px 24px;
  border-radius: 8px;
  margin-left: 12px;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
`;

export const EditButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.primary};
  align-self: flex-end;
`;

export const EditButtonText = styled(ButtonText)``;

export const PlaceholderText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text_secondary};
  text-align: center;
  padding: 24px;
`;

export const CondominioCard = styled.View`
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;
