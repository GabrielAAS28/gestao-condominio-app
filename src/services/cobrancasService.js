import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@GestaoCondominio:cobrancas';

const seed = [
  {
    id: 'cob-1',
    tipo: 'CONDOMINIO',
    titulo: 'Taxa de Condomínio',
    descricao: 'Referente ao mês corrente',
    valor: 580.0,
    vencimento: '2026-05-10',
    status: 'PENDENTE',
  },
  {
    id: 'cob-2',
    tipo: 'GAS',
    titulo: 'Conta de Gás',
    descricao: 'Consumo mensal de gás',
    valor: 87.5,
    vencimento: '2026-05-15',
    status: 'PENDENTE',
  },
  {
    id: 'cob-3',
    tipo: 'RESERVA',
    titulo: 'Taxa de Reserva - Salão de Festas',
    descricao: 'Reserva confirmada para 2026-05-20',
    valor: 250.0,
    vencimento: '2026-05-18',
    status: 'PENDENTE',
  },
];

async function load() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
}

async function save(list) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export async function listCobrancas() {
  return load();
}

export async function getCobrancaById(id) {
  const list = await load();
  return list.find((c) => c.id === id) || null;
}

export async function pagarCobranca(id, metodo) {
  const list = await load();
  const updated = list.map((c) =>
    c.id === id
      ? { ...c, status: 'PAGO', pagoEm: new Date().toISOString(), metodoPagamento: metodo }
      : c,
  );
  await save(updated);
  return updated.find((c) => c.id === id);
}

export function gerarCodigoPix(cobranca) {
  const base = `PIX|${cobranca.id}|${cobranca.valor.toFixed(2)}|GESTAOCOND`;
  return base.padEnd(64, '0');
}

export function gerarCodigoBoleto(cobranca) {
  const seg = String(Date.now()).slice(-10);
  return `34191.79001 ${seg.slice(0, 5)}.${seg.slice(5)} 12345.678901 1 9999000${Math.round(cobranca.valor * 100)}`;
}
