import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Header = styled.View`
  background-color: ${({ theme }) => theme.colors.card};
  padding: 40px 24px 24px;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

export const AvatarContainer = styled.View`
  position: relative;
  margin-bottom: 16px;
`;

export const Avatar = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 60px;
`;

export const AvatarText = styled.Text`
    font-size: 50px;
    color: #fff;
    font-weight: bold;
`;

export const EditAvatarButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.primary};
  width: 40px;
  height: 40px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  border: 2px solid ${({ theme }) => theme.colors.card};
`;

export const UserName = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

export const UserEmail = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text_secondary};
  margin-top: 4px;
`;

export const Menu = styled.View`
  margin-top: 24px;
  padding: 0 16px;
`;

export const MenuItem = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.card};
  padding: 16px;
  flex-direction: row;
  align-items: center;
  border-radius: 8px;
  margin-bottom: 12px;
`;

export const MenuItemText = styled.Text`
  flex: 1;
  margin-left: 16px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

export const LogoutButton = styled(MenuItem)`
  background-color: #FFF0F0;
`;

export const LogoutButtonText = styled(MenuItemText)`
  color: #C62828;
  font-weight: bold;
`;
