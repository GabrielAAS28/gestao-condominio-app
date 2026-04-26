import styled from 'styled-components/native';

export const Container = styled.ScrollView.attrs({
  contentContainerStyle: { padding: 20, paddingBottom: 40 },
})`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.border_radius.md}px;
  padding: 18px;
  margin-bottom: 16px;
`;

export const Title = styled.Text`
  font-size: 20px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.text};
`;

export const Subtitle = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text_secondary};
  margin-top: 4px;
`;

export const Valor = styled.Text`
  font-size: 30px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-top: 12px;
`;

export const SectionTitle = styled.Text`
  font-size: 16px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 10px;
`;

export const MethodRow = styled.View`
  flex-direction: row;
  gap: 10px;
`;

export const MethodCard = styled.TouchableOpacity`
  flex: 1;
  border: 2px solid ${({ theme, selected }) => selected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.border_radius.md}px;
  padding: 16px;
  align-items: center;
  background-color: ${({ theme, selected }) => selected ? `${theme.colors.primary}10` : theme.colors.card};
`;

export const MethodLabel = styled.Text`
  margin-top: 8px;
  font-family: ${({ theme }) => theme.fonts.medium};
  color: ${({ theme, selected }) => selected ? theme.colors.primary : theme.colors.text};
`;

export const CodeBox = styled.View`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.border_radius.md}px;
  padding: 14px;
  margin-top: 12px;
`;

export const CodeText = styled.Text`
  font-family: monospace;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
`;

export const ConfirmButton = styled.TouchableOpacity`
  background-color: ${({ theme, disabled }) => disabled ? theme.colors.border : '#16a34a'};
  padding: 16px;
  border-radius: ${({ theme }) => theme.border_radius.md}px;
  align-items: center;
  margin-top: 8px;
`;

export const ConfirmText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-family: ${({ theme }) => theme.fonts.bold};
`;

export const PaidBadge = styled.View`
  background-color: #16a34a20;
  border: 1px solid #16a34a;
  border-radius: ${({ theme }) => theme.border_radius.md}px;
  padding: 14px;
  align-items: center;
`;

export const PaidText = styled.Text`
  color: #16a34a;
  font-family: ${({ theme }) => theme.fonts.bold};
`;
