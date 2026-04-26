import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    margin: 16,
    marginTop: 8,
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
