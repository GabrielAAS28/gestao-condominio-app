import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export function Home() {
  const { user, signOut } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>
        Bem-vindo(a), {user?.nome || 'Usuário'}!
      </Text>
      <Button title="Sair" onPress={signOut} />
    </View>
  );
}
