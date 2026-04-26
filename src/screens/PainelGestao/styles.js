import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  center: { justifyContent: 'center', alignItems: 'center' },
  shortcuts: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#FFF', paddingVertical: 16 },
  shortcut: { alignItems: 'center', padding: 12 },
  shortcutLabel: { fontSize: 12, marginTop: 4, color: '#333', fontWeight: '500' },
  heading: { fontSize: 16, fontWeight: 'bold', padding: 16, paddingBottom: 0, color: '#212121' },
  card: { backgroundColor: '#FFF', padding: 16, borderRadius: 8, marginBottom: 12, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#212121', marginBottom: 4 },
  cardLine: { fontSize: 13, color: '#555', marginVertical: 2 },
  btn: { paddingVertical: 10, borderRadius: 4, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold' },
});
