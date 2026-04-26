import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Form = styled.ScrollView.attrs({
  contentContainerStyle: { padding: 20 },
})`
  flex: 1;
`;

export const Label = styled.Text`
  font-size: 14px;
  font-family: ${({ theme }) => theme.fonts.medium};
  color: ${({ theme }) => theme.colors.text_secondary};
  margin-bottom: 6px;
  margin-top: 12px;
`;

export const Input = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: theme.colors.text_secondary,
}))`
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.border_radius.md}px;
  padding: 12px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

export const Picker = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.border_radius.md}px;
  padding: 14px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const PickerText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

export const TermsRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
`;

export const Checkbox = styled.View`
  width: 22px;
  height: 22px;
  border-radius: 4px;
  border: 2px solid ${({ theme, checked }) => checked ? theme.colors.primary : theme.colors.border};
  background-color: ${({ theme, checked }) => checked ? theme.colors.primary : 'transparent'};
  margin-right: 10px;
  align-items: center;
  justify-content: center;
`;

export const TermsText = styled.Text`
  flex: 1;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
`;

export const SubmitButton = styled.TouchableOpacity`
  background-color: ${({ theme, disabled }) => disabled ? theme.colors.border : theme.colors.primary};
  padding: 14px;
  border-radius: ${({ theme }) => theme.border_radius.md}px;
  align-items: center;
  margin-top: 28px;
`;

export const SubmitText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: 16px;
  font-family: ${({ theme }) => theme.fonts.bold};
`;

export const ModalBackdrop = styled.View`
  flex: 1;
  background-color: rgba(0,0,0,0.4);
  justify-content: flex-end;
`;

export const ModalContent = styled.View`
  background-color: ${({ theme }) => theme.colors.card};
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding: 20px;
  max-height: 70%;
`;

export const ModalTitle = styled.Text`
  font-size: 18px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 12px;
`;

export const Option = styled.TouchableOpacity`
  padding: 14px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

export const OptionText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
`;
