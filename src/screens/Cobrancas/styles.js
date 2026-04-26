import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const Header = styled.View`
  padding: 20px;
  padding-bottom: 12px;
`;

export const Title = styled.Text`
  font-size: 22px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.text};
`;

export const Subtitle = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text_secondary};
  margin-top: 4px;
`;

export const TotalCard = styled.View`
  margin: 0 20px 12px;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.border_radius.md}px;
`;

export const TotalLabel = styled.Text`
  color: rgba(255,255,255,0.85);
  font-size: 14px;
`;

export const TotalValue = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: 26px;
  font-family: ${({ theme }) => theme.fonts.bold};
  margin-top: 4px;
`;

export const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.border_radius.md}px;
  padding: 16px;
  margin-bottom: 12px;
`;

export const CardRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const TipoTag = styled.View`
  background-color: ${({ tipo, theme }) =>
    tipo === 'CONDOMINIO' ? '#3b82f6' :
    tipo === 'GAS' ? '#f97316' :
    tipo === 'RESERVA' ? '#8b5cf6' : theme.colors.border};
  padding: 4px 10px;
  border-radius: 12px;
`;

export const TipoText = styled.Text`
  color: #fff;
  font-size: 11px;
  font-family: ${({ theme }) => theme.fonts.bold};
`;

export const StatusTag = styled.View`
  background-color: ${({ status }) => status === 'PAGO' ? '#16a34a' : '#eab308'};
  padding: 4px 10px;
  border-radius: 12px;
`;

export const StatusText = styled.Text`
  color: #fff;
  font-size: 11px;
  font-family: ${({ theme }) => theme.fonts.bold};
`;

export const CardTitle = styled.Text`
  font-size: 17px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-top: 10px;
`;

export const CardDescription = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text_secondary};
  margin-top: 4px;
`;

export const CardFooter = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 14px;
`;

export const Valor = styled.Text`
  font-size: 20px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.text};
`;

export const Vencimento = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text_secondary};
`;

export const PayButton = styled.TouchableOpacity`
  background-color: ${({ theme, disabled }) => disabled ? theme.colors.border : theme.colors.primary};
  padding: 10px 18px;
  border-radius: ${({ theme }) => theme.border_radius.md}px;
`;

export const PayButtonText = styled.Text`
  color: #fff;
  font-family: ${({ theme }) => theme.fonts.bold};
`;

export const EmptyContainer = styled.View`
  align-items: center;
  margin-top: 80px;
`;

export const EmptyText = styled.Text`
  margin-top: 12px;
  color: ${({ theme }) => theme.colors.text_secondary};
`;
