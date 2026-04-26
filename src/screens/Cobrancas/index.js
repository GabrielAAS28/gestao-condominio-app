import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { styles } from './styles';

export function Cobrancas() {
  return (
    <View style={styles.container}>
      <Icon name="dollar-sign" size={64} color="#BDBDBD" />
      <Text style={styles.title}>Cobranças</Text>
      <Text style={styles.subtitle}>Módulo em desenvolvimento.</Text>
      <Text style={styles.detail}>
        A integração com boletos / taxa condominial ainda não está disponível
        nesta versão da API.
      </Text>
    </View>
  );
}

