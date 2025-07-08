import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 24px;
`;

export const Label = styled.Text`
  font-size: 16px;
  font-family: ${({ theme }) => theme.fonts.medium};
  color: ${({ theme }) => theme.colors.text_secondary};
  margin-bottom: 8px;
  margin-top: 16px;
`;

export const Input = styled.TextInput`
  width: 100%;
  height: 50px;
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.border_radius.md}px;
  padding: 0 16px;
  font-size: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Button = styled.TouchableOpacity`
  width: 100%;
  height: 50px;
  background-color: ${({ theme, disabled }) => disabled ? theme.colors.text_secondary : theme.colors.primary};
  border-radius: ${({ theme }) => theme.border_radius.md}px;
  justify-content: center;
  align-items: center;
  margin-top: 32px;
`;

export const ButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: 16px;
  font-family: ${({ theme }) => theme.fonts.bold};
`;

export const ValidationContainer = styled.View`
  margin-top: -10px;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #fef3f3; /* Um fundo avermelhado bem claro */
  border-radius: ${({ theme }) => theme.border_radius.md}px;
  border: 1px solid #fecaca; /* Uma borda vermelha clara */
`;

export const ValidationText = styled.Text`
  font-size: 14px;
  color: #991b1b; /* Um vermelho escuro para o texto */
  font-family: ${({ theme }) => theme.fonts.regular}; /* Use a fonte regular */
`;