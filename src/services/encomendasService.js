import api from './api';

// GET /encomendas?condominioId=&unidadeId=&busca=&status=&take=&skip=
export const listarEncomendas = (params) => api.get('/encomendas', { params });
export const getEncomendaById = (id) => api.get(`/encomendas/${id}`);

/**
 * POST /encomendas
 * Body: { condominioId, unidadeId, destinatario, nomeRecebidoPor, descricao?,
 *         tipo: 'CORREIOS'|'TRANSPORTADORA'|'DELIVERY'|'OUTROS',
 *         dataRecebimento: ISOString, observacoes? }
 */
export const cadastrarEncomenda = (data) => api.post('/encomendas', data);

// PUT /encomendas/:id/status  body: { status, observacaoAtualizacao? }
export const atualizarStatusEncomenda = (id, data) =>
  api.put(`/encomendas/${id}/status`, data);

// POST /encomendas/:id/marcar-retirada  body: { nomeRetirada, pesCodRetirada? }
export const marcarRetirada = (id, data) =>
  api.post(`/encomendas/${id}/marcar-retirada`, data);

// DELETE /encomendas/:id
export const deletarEncomenda = (id) => api.delete(`/encomendas/${id}`);
