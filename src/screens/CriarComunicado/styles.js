import styled from 'styled-components/native';

export const Container = styled.ScrollView.attrs({
  contentContainerStyle: {
    padding: 24,
  },
  keyboardShouldPersistTaps: 'handled',
})`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Label = styled.Text`
  font-size: 16px;
  font-family: ${({ theme }) => theme.fonts.medium};
  color: ${({ theme }) => theme.colors.text_secondary};
  margin-bottom: 8px;
`;

export const Input = styled.TextInput`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.border_radius.md}px;
  padding: 16px;
  margin-bottom: 16px;
  font-size: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
`;

export const Button = styled.TouchableOpacity`
  width: 100%;
  height: 60px;
  background-color: ${({ theme, disabled }) => disabled ? theme.colors.text_secondary : theme.colors.primary};
  border-radius: ${({ theme }) => theme.border_radius.md}px;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
`;

export const ButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: 18px;
  font-family: ${({ theme }) => theme.fonts.bold};
`;
