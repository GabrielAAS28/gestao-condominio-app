import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { useCondominio } from '../../contexts/CondominioContext';
// CORREÇÃO: Importando o useAuth para aceder aos dados do utilizador
import { useAuth } from '../../contexts/AuthContext';

// Importando o ícone
import Feather from 'react-native-vector-icons/Feather';

export function Home({ navigation }) {
  const { comunicados, loading, fetchComunicados } = useCondominio();

  useEffect(() => {
    fetchComunicados();
  }, [fetchComunicados]);

  return (
    <View style={styles.container}>
      {/* O cabeçalho principal agora é gerido pelo DrawerNavigator */}
      
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
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.comAssunto}</Text>
            <Text style={styles.cardSender}>Por: {item.remetente.pesNome}</Text>
          </View>
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

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F5F5',
  },
  // Estilo para o texto de boas-vindas
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    margin: 16,
    marginTop: 8, // Reduzindo a margem superior
    color: '#212121',
  },
  emptyContainer: {
    flex: 1,
    marginTop: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: { 
    textAlign: 'center', 
    color: '#757575',
    fontSize: 16,
  },
  card: { 
    backgroundColor: '#FFFFFF', 
    padding: 16, 
    borderRadius: 8, 
    marginVertical: 6, 
    marginHorizontal: 16, 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 1.41, 
  },
  cardTitle: { 
    fontSize: 16, 
    fontWeight: 'bold',
  },
  cardSender: { 
    fontSize: 12, 
    color: '#757575', 
    marginTop: 4,
  },
  floatingButton: { 
    position: 'absolute', 
    width: 60, 
    height: 60, 
    alignItems: 'center', 
    justifyContent: 'center', 
    right: 30, 
    bottom: 30, 
    backgroundColor: '#0D47A1', 
    borderRadius: 30, 
    elevation: 8, 
  },
});
