import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  center: { justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#FFF', padding: 16, borderRadius: 8, marginBottom: 12, elevation: 2 },
  headerCard: { borderLeftWidth: 4, borderLeftColor: '#0D47A1' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#212121', flex: 1, marginRight: 8 },
  meta: { fontSize: 11, color: '#999', marginTop: 4 },
  descricao: { fontSize: 14, color: '#333', marginTop: 12 },
  pill: { color: '#FFF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, fontSize: 10, overflow: 'hidden' },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', marginTop: 16, marginBottom: 8, color: '#212121' },
  commentCard: { backgroundColor: '#FFF', padding: 12, borderRadius: 6, marginBottom: 8, elevation: 1 },
  commentAuthor: { fontWeight: 'bold', fontSize: 13, color: '#0D47A1' },
  commentTxt: { fontSize: 13, color: '#333', marginTop: 4 },
  commentDate: { fontSize: 10, color: '#999', marginTop: 4 },
  commentBox: { backgroundColor: '#FFF', padding: 12, borderRadius: 6, marginTop: 8 },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 6, padding: 10, backgroundColor: '#FAFAFA' },
  btn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6, marginTop: 8, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold' },
  parecerBox: { backgroundColor: '#E8F5E9', padding: 10, borderRadius: 6, marginTop: 12, borderLeftWidth: 3, borderLeftColor: '#388E3C' },
  parecerLabel: { fontWeight: 'bold', color: '#1B5E20', marginBottom: 4 },
  parecerTxt: { color: '#333' },
});
