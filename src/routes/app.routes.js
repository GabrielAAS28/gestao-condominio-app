import React from 'react';
import { View, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'styled-components/native';

// Importando os ícones
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { useAuth } from '../contexts/AuthContext';

// Importando as telas
import { Home } from '../screens/Home';
import { CriarComunicado } from '../screens/CriarComunicado';
import { Cobrancas } from '../screens/Cobrancas';
import { Reservas } from '../screens/Reservas';
import { Perfil } from '../screens/Perfil';
import { MeusDados } from '../screens/MeusDados';
import { AlterarSenha } from '../screens/AlterarSenha'; 

import { DetalheComunicado } from '../screens/DetalheComunicado';


const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeInitial" component={Home} />
      <Stack.Screen name="CriarComunicado" component={CriarComunicado} />
      {/* ADICIONE ESTA LINHA ABAIXO */}
      <Stack.Screen 
        name="DetalheComunicado" 
        component={DetalheComunicado} 
        options={{ 
          headerShown: true, 
          title: 'Detalhes do Comunicado',
          headerStyle: { backgroundColor: '#f4f5f7' }, 
          headerTintColor: '#333',
        }} 
      />
    </Stack.Navigator>
  );
}

function PerfilStack() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: true,
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: '#333'
      }}
    >
      <Stack.Screen name="PerfilInitial" component={Perfil} options={{ headerShown: false }} />
      <Stack.Screen name="MeusDados" component={MeusDados} options={{ title: 'Meus Dados' }} />
      {/* Esta linha já está correta, usando o componente importado */} 
      <Stack.Screen name="AlterarSenha" component={AlterarSenha} options={{ title: 'Alterar Senha' }} />
    </Stack.Navigator>
  );
}

function MoradorTabNavigator() {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: theme.colors.card, borderTopColor: theme.colors.border },
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tab.Screen 
        name="Início" 
        component={HomeStack} 
        options={{ tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} /> }}
      />
      <Tab.Screen 
        name="Cobranças" 
        component={Cobrancas} 
        options={{ tabBarIcon: ({ color, size }) => <FontAwesome name="dollar" size={size} color={color} /> }}
      />
      <Tab.Screen 
        name="Reservas" 
        component={Reservas} 
        options={{ tabBarIcon: ({ color, size }) => <Feather name="calendar" size={size} color={color} /> }}
      />
      <Tab.Screen 
        name="Perfil" 
        component={PerfilStack} 
        options={{ tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} /> }}
      />
    </Tab.Navigator>
  );
}

function GestaoScreen() {
    return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text>Painel do Gestor (Em construção)</Text></View>
}




export function AppRoutes() {
  const theme = useTheme();
  const { user } = useAuth();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        headerTintColor: theme.colors.primary,
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: 'gray',
        drawerLabelStyle: { fontSize: 16 },
        headerStyle: { backgroundColor: theme.colors.card, elevation: 0, shadowOpacity: 0 },
      }}
    >
      <Drawer.Screen 
        name="Módulo Morador" 
        component={MoradorTabNavigator} 
        options={{
          title: 'Painel do Morador',
          headerTitle: 'Gestao Condominio',
          drawerIcon: ({ color, size }) => <Feather name="users" size={size} color={color} />,
        }}
      />
      {user?.pesIsGlobalAdmin && (
        <Drawer.Screen 
          name="Módulo Gestão" 
          component={GestaoScreen}
          options={{
            title: 'Painel do Gestor',
            drawerIcon: ({ color, size }) => <Feather name="settings" size={size} color={color} />,
          }}
        />
      )}
    </Drawer.Navigator>
  );
}
