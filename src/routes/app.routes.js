import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'styled-components/native';

import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { useAuth } from '../contexts/AuthContext';

import { Home } from '../screens/Home';
import { CriarComunicado } from '../screens/CriarComunicado';
import { DetalheComunicado } from '../screens/DetalheComunicado';
import { Cobrancas } from '../screens/Cobrancas';
import { PagarCobranca } from '../screens/PagarCobranca';
import { Reservas } from '../screens/Reservas';
import { FazerReserva } from '../screens/FazerReserva';
import { CriarReserva } from '../screens/CriarReserva';
import { Perfil } from '../screens/Perfil';
import { MeusDados } from '../screens/MeusDados';
import { AlterarSenha } from '../screens/AlterarSenha';
import { Visitantes } from '../screens/Visitantes';
import { Encomendas } from '../screens/Encomendas';
import { Ocorrencias } from '../screens/Ocorrencias';
import { DetalheOcorrencia } from '../screens/DetalheOcorrencia';
import { PainelGestao } from '../screens/PainelGestao';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeInitial" component={Home} />
      <Stack.Screen name="CriarComunicado" component={CriarComunicado} />
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

function ReservasStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: '#333',
      }}
    >
      <Stack.Screen name="ReservasList" component={Reservas} options={{ headerShown: false }} />
      <Stack.Screen name="CriarReserva" component={CriarReserva} options={{ title: 'Nova Reserva' }} />
      <Stack.Screen name="FazerReserva" component={FazerReserva} options={{ title: 'Disponibilidade' }} />
    </Stack.Navigator>
  );
}

function CobrancasStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: '#333',
      }}
    >
      <Stack.Screen name="CobrancasList" component={Cobrancas} options={{ headerShown: false }} />
      <Stack.Screen name="PagarCobranca" component={PagarCobranca} options={{ title: 'Pagamento' }} />
    </Stack.Navigator>
  );
}

function OcorrenciasStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: '#333',
      }}
    >
      <Stack.Screen name="OcorrenciasList" component={Ocorrencias} options={{ headerShown: false }} />
      <Stack.Screen
        name="DetalheOcorrencia"
        component={DetalheOcorrencia}
        options={{ title: 'Detalhe da Ocorrência' }}
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
        headerTintColor: '#333',
      }}
    >
      <Stack.Screen name="PerfilInitial" component={Perfil} options={{ headerShown: false }} />
      <Stack.Screen name="MeusDados" component={MeusDados} options={{ title: 'Meus Dados' }} />
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
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tab.Screen
        name="Início"
        component={HomeStack}
        options={{ tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Cobranças"
        component={CobrancasStack}
        options={{ tabBarIcon: ({ color, size }) => <FontAwesome name="dollar" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Reservas"
        component={ReservasStack}
        options={{ tabBarIcon: ({ color, size }) => <Feather name="calendar" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Ocorrências"
        component={OcorrenciasStack}
        options={{ tabBarIcon: ({ color, size }) => <Feather name="alert-octagon" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilStack}
        options={{ tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} /> }}
      />
    </Tab.Navigator>
  );
}

function GestaoStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true, headerStyle: { backgroundColor: '#fff' } }}>
      <Stack.Screen name="PainelGestao" component={PainelGestao} options={{ headerShown: false }} />
      <Stack.Screen name="Ocorrencias" component={Ocorrencias} options={{ title: 'Ocorrências' }} />
      <Stack.Screen name="Visitantes" component={Visitantes} options={{ title: 'Visitantes' }} />
      <Stack.Screen name="Encomendas" component={Encomendas} options={{ title: 'Encomendas' }} />
      <Stack.Screen
        name="DetalheOcorrencia"
        component={DetalheOcorrencia}
        options={{ title: 'Detalhe da Ocorrência' }}
      />
    </Stack.Navigator>
  );
}

export function AppRoutes() {
  const theme = useTheme();
  const { user } = useAuth();

  const isGestor =
    user?.isGlobalAdmin ||
    user?.pesIsGlobalAdmin ||
    (user?.roles ?? []).some((r) =>
      /^ROLE_(SINDICO|ADMIN|FUNCIONARIO_ADM|PORTEIRO)_/.test(r),
    );

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
      {isGestor && (
        <Drawer.Screen
          name="Módulo Gestão"
          component={GestaoStack}
          options={{
            title: 'Painel do Gestor',
            drawerIcon: ({ color, size }) => <Feather name="settings" size={size} color={color} />,
          }}
        />
      )}
    </Drawer.Navigator>
  );
}
