import api from './api';

// ===== ÁREAS COMUNS =====
// GET /areas-comuns?condominioId=&ativa=
export const listarAreasComuns = (params) => api.get('/areas-comuns', { params });
export const getAreaComumById = (id) => api.get(`/areas-comuns/${id}`);

// ===== RESERVAS =====
// Listagem com filtros via query string (não há mais /minhas-reservas / /por-area):
//   condominioId, unidadeId, areaComumId, pesCodMorador, status, dataDe, dataAte
export const listarReservas = (params) => api.get('/reservas', { params });

export const minhasReservas = (pesCodMorador) =>
  api.get('/reservas', { params: { pesCodMorador } });

export const reservasPorArea = (areaComumId) =>
  api.get('/reservas', { params: { areaComumId } });

export const getReservaById = (id) => api.get(`/reservas/${id}`);

/**
 * POST /reservas
 * Body: { areaComumId, turnoId?, unidadeId, pesCodMorador?, data: 'YYYY-MM-DD',
 *         termosAceitos: true, convidados?: [{ nome, documento? }] }
 */
export const criarReserva = (data) => api.post('/reservas', data);

// PUT /reservas/:id/aprovar  | rejeitar (com { motivoRejeicao }) | cancelar | concluir
export const aprovarReserva = (id) => api.put(`/reservas/${id}/aprovar`);
export const rejeitarReserva = (id, motivoRejeicao) =>
  api.put(`/reservas/${id}/rejeitar`, { motivoRejeicao });
export const cancelarReserva = (id) => api.put(`/reservas/${id}/cancelar`);
export const concluirReserva = (id) => api.put(`/reservas/${id}/concluir`);
