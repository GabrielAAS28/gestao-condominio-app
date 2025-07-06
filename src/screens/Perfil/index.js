import React, { useState } from 'react';
// CORREÇÃO: Adicionando a importação do 'View' que estava em falta.
import { Alert, PermissionsAndroid, Platform, Image, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import Feather from 'react-native-vector-icons/Feather';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import { 
  Container, 
  Header, 
  AvatarContainer,
  Avatar, 
  AvatarText,
  EditAvatarButton,
  UserName, 
  UserEmail,
  Menu,
  MenuItem,
  MenuItemText,
  LogoutButton,
  LogoutButtonText
} from './styles';

export function Perfil({ navigation }) {
  const { user, signOut } = useAuth();
  // Estado para guardar a URI da imagem do avatar
  const [avatarSource, setAvatarSource] = useState(null);

  const userInitial = user?.pesNome ? user.pesNome[0].toUpperCase() : '?';

  const handleChoosePhoto = () => {
    Alert.alert(
      "Selecionar Avatar",
      "Escolha de onde quer pegar a foto",
      [
        {
          text: "Câmara",
          onPress: () => requestCameraPermission(),
        },
        {
          text: "Galeria",
          onPress: () => requestStoragePermission(),
        },
        {
          text: "Cancelar",
          style: "cancel"
        }
      ]
    );
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Permissão da Câmara",
            message: "A aplicação precisa de acesso à sua câmara.",
            buttonNeutral: "Pergunte-me depois",
            buttonNegative: "Cancelar",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          launchCamera({ mediaType: 'photo', quality: 0.5 }, (response) => {
            if (response.didCancel || response.errorCode) {
              console.log('Lançamento da câmara cancelado ou com erro.');
            } else {
              setAvatarSource({ uri: response.assets[0].uri });
            }
          });
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const requestStoragePermission = async () => {
     launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, (response) => {
        if (response.didCancel || response.errorCode) {
          console.log('Seleção da galeria cancelada ou com erro.');
        } else {
          setAvatarSource({ uri: response.assets[0].uri });
        }
      });
  };

  return (
    <Container>
      <Header>
        <AvatarContainer>
          {avatarSource ? (
            <Avatar source={avatarSource} />
          ) : (
            <View style={{width: 120, height: 120, borderRadius: 60, backgroundColor: '#0D47A1', justifyContent: 'center', alignItems: 'center'}}>
                <AvatarText>{userInitial}</AvatarText>
            </View>
          )}
          <EditAvatarButton onPress={handleChoosePhoto}>
            <Feather name="camera" size={24} color="#fff" />
          </EditAvatarButton>
        </AvatarContainer>
        <UserName>{user?.pesNome || 'Nome do Utilizador'}</UserName>
        <UserEmail>{user?.pesEmail || 'email@exemplo.com'}</UserEmail>
      </Header>

      <Menu>
        <MenuItem onPress={() => { /* Navegar para Meus Dados no futuro */ 

           console.log("Botão 'Meus Dados' foi clicado!");
           navigation.navigate('MeusDados');
        }}>
          <Feather name="user" size={20} color="#333" />
          <MenuItemText>Meus Dados</MenuItemText>
          <Feather name="chevron-right" size={20} color="#ccc" />
        </MenuItem>

        <MenuItem onPress={() => navigation.navigate('AlterarSenha')}>
          <Feather name="lock" size={20} color="#333" />
          <MenuItemText>Alterar Senha</MenuItemText>
          <Feather name="chevron-right" size={20} color="#ccc" />
        </MenuItem>

        <LogoutButton onPress={signOut}>
          <Feather name="log-out" size={20} color="#C62828" />
          <LogoutButtonText>Sair</LogoutButtonText>
        </LogoutButton>
      </Menu>
    </Container>
  );
}
