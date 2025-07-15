import styled from 'styled-components/native';

export const Container = styled.ScrollView.attrs({
  contentContainerStyle: {
    padding: 24,
  },
  showsVerticalScrollIndicator: false,
})`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Label = styled.Text`
  font-size: 16px;
  font-family: ${({ theme }) => theme.fonts.medium};
  color: ${({ theme }) => theme.colors.text_secondary};
  margin-bottom: 8px;
  margin-top: 16px;
`;

export const Input = styled.TextInput.attrs(props => ({
  placeholderTextColor: props.theme.colors.text_secondary,
  textAlignVertical: 'top', // Adicionado aqui
}))`
  width: 100%;
  height: 50px;
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.border_radius.md}px;
  padding: 0 16px;
  font-size: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
`;

export const InputMensagem = styled(Input)`
  height: 150px;
  padding-top: 16px;
 
`;

export const SwitchContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.card};
  padding: 16px;
  border-radius: ${({ theme }) => theme.border_radius.md}px;
  margin-top: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const SwitchLabel = styled.Text`
  font-size: 16px;
  font-family: ${({ theme }) => theme.fonts.medium};
  color: ${({ theme }) => theme.colors.text};
`;

export const Button = styled.TouchableOpacity`
  width: 100%;
  height: 50px;
  background-color: ${({ theme, disabled }) =>
    disabled ? theme.colors.text_secondary : theme.colors.primary};
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
