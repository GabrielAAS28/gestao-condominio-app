import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 0 30px;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Title = styled.Text`
  font-size: 28px;
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.bold};
  margin-bottom: 24px;
`;

export const Input = styled.TextInput`
  width: 100%;
  height: 60px;
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.border_radius.md}px;
  padding: 0 16px;
  margin-bottom: 16px;
  font-size: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Button = styled.TouchableOpacity`
  width: 100%;
  height: 60px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.border_radius.md}px;
  justify-content: center;
  align-items: center;
  margin-top: 8px;
`;

export const ButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: 18px;
  font-family: ${({ theme }) => theme.fonts.bold};
`;
