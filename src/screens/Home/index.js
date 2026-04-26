import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { useCondominio } from '../../contexts/CondominioContext';


import Feather from 'react-native-vector-icons/Feather';
import { styles } from './styles';

export function Home({ navigation }) {
  const { comunicados, loading, fetchComunicados } = useCondominio();

  useEffect(() => {
    fetchComunicados();
  }, [fetchComunicados]);

  const handleComunicadoPress = (comunicado) => {
    navigation.navigate('DetalheComunicado', { comunicado: comunicado });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={comunicados}
        keyExtractor={(item) => String(item.comCod)}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Últimos Comunicados</Text>
          </>
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#0D47A1" />
            ) : (
              <Text style={styles.emptyText}>Nenhum comunicado encontrado.</Text>
            )}
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleComunicadoPress(item)}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                {item.isUrgente ? '🔴 ' : ''}
                {item.titulo}
              </Text>
              <Text style={styles.cardSender}>
                Por: {item.pessoaCriador?.pesNome || 'Sistema'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchComunicados} />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
      
      <TouchableOpacity 
        style={styles.floatingButton} 
        onPress={() => navigation.navigate('CriarComunicado')}
      >
        <Feather name="plus" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}


