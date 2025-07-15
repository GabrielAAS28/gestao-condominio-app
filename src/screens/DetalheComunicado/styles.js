import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Header = styled.View`
  background-color: ${({ theme }) => theme.colors.card};
  padding: 24px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

export const Title = styled.Text`
  font-size: 24px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 16px;
`;

export const Meta = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

export const Author = styled.Text`
  font-size: 14px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.text_secondary};
  margin-left: 8px;
`;

export const DateText = styled.Text`
  font-size: 14px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.text_secondary};
  margin-left: 8px;
`;

export const Content = styled.View`
  padding: 24px;
`;

export const Message = styled.Text`
  font-size: 16px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.text};
  line-height: 26px; /* Aumenta o espaçamento entre linhas para melhor leitura */
`;
