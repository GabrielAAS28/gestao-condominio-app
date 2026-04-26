import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  center: { justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#FFF', padding: 16, borderRadius: 8, marginBottom: 12, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#212121', flex: 1, marginRight: 8 },
  cardLine: { fontSize: 13, color: '#555', marginTop: 4 },
  cardMeta: { fontSize: 11, color: '#999', marginTop: 6 },
  pill: { color: '#FFF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, fontSize: 10, overflow: 'hidden' },
  btn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 4, marginTop: 10, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold' },
  fab: { position: 'absolute', right: 24, bottom: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#0D47A1', alignItems: 'center', justifyContent: 'center', elevation: 6 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 16 },
  modal: { backgroundColor: '#FFF', padding: 16, borderRadius: 8 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 6, padding: 10, marginBottom: 8, backgroundColor: '#FAFAFA' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, margin: 4, borderRadius: 16, backgroundColor: '#EEE' },
  chipActive: { backgroundColor: '#0D47A1' },
  chipText: { color: '#333', fontSize: 12 },
  chipTextActive: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
});
