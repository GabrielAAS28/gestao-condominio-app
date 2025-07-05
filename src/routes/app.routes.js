import React from 'react';
import { View, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'styled-components/native';

// Importando os ícones
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Esta é a abordagem mais robusta para evitar erros de resolução de módulo.
import { Home } from '../screens/Home/index.js';
import { CriarComunicacao } from '../screens/CriarComunicacao/index.js';
import { Cobrancas } from '../screens/Cobrancas/index.js';
import { Reservas } from '../screens/Reservas/index.js';
import { Perfil } from '../screens/Perfil/index.js';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack para a tela Home, permitindo abrir a tela de Criar Comunicado por cima
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeInitial" component={Home} />
      <Stack.Screen name="CriarComunicado" component={CriarComunicado} />
    </Stack.Navigator>
  );
}

// Componente da Navegação por Abas (Bottom Tabs) para o Módulo do Morador
function MoradorTabNavigator() {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen 
        name="Início" 
        component={HomeStack} 
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Cobranças" 
        component={Cobrancas} 
        options={{
          tabBarIcon: ({ color, size }) => <FontAwesome name="dollar" size={size} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Reservas" 
        component={Reservas} 
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="calendar" size={size} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Perfil" 
        component={Perfil} 
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

// Placeholder para o futuro Módulo de Gestão
function GestaoScreen() {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Painel do Gestor (Em construção)</Text>
        </View>
    )
}

// Navegador Principal (Drawer) que permite trocar entre os módulos
export function AppRoutes() {
  const theme = useTheme();
  return (
    <Drawer.Navigator
      screenOptions={{
        headerTintColor: theme.colors.primary, // Cor do ícone do menu e do título
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: 'gray',
        drawerLabelStyle: {
          marginLeft: -20,
          fontSize: 16,
        }
      }}
    >
      <Drawer.Screen 
        name="Módulo Morador" 
        component={MoradorTabNavigator} 
        options={{
          title: 'Painel do Morador',
          drawerIcon: ({ color, size }) => <Feather name="users" size={size} color={color} />,
        }}
      />
      <Drawer.Screen 
        name="Módulo Gestão" 
        component={GestaoScreen}
        options={{
          title: 'Painel do Gestor',
          drawerIcon: ({ color, size }) => <Feather name="settings" size={size} color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
}
