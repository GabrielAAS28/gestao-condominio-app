import api from './api';

// GET /visitantes?condominioId=&unidadeId=&status=&busca=
export const listarVisitantes = (params) => api.get('/visitantes', { params });
export const getVisitanteById = (id) => api.get(`/visitantes/${id}`);

/**
 * POST /visitantes
 * Body: { condominioId, unidadeId, pesCodMorador?, nome, cpf?, rg?, telefone?,
 *         dataEntrada: ISOString, observacoes? }
 */
export const registrarVisitante = (data) => api.post('/visitantes', data);

// PUT /visitantes/:id/marcar-saida
export const marcarSaida = (id) => api.put(`/visitantes/${id}/marcar-saida`);
