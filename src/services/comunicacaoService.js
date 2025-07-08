import api from './api';

// --- Gestão de Comunicação Endpoints ---

/**
 * GET /api/comunicacoes
 * Busca na API a lista de comunicados visíveis para o usuário logado.
 */
export const getComunicacoes = () => {
  return api.get('/comunicacoes');
};

/**
 * GET /api/comunicacoes/{id}
 * Busca um comunicado específico pelo seu ID.
 * @param {number} id - O ID do comunicado.
 */
export const getComunicadoById = (id) => {
  return api.get(`/comunicacoes/${id}`);
};

/**
 * POST /api/comunicacoes
 * Cria um novo comunicado no sistema.
 * @param {object} data - O objeto com os dados do comunicado.
 */
export const createComunicado = (data) => {
  return api.post('/comunicacoes', data);
};

/**
 * PUT /api/comunicacoes/{id}
 * Atualiza um comunicado existente.
 * @param {number} id - O ID do comunicado a ser atualizado.
 * @param {object} data - O objeto com os campos a serem atualizados.
 */
export const updateComunicado = (id, data) => {
  return api.put(`/comunicacoes/${id}`, data);
};

/**
 * DELETE /api/comunicacoes/{id}
 * Deleta um comunicado.
 * @param {number} id - O ID do comunicado a ser deletado.
 */
export const deleteComunicado = (id) => {
  return api.delete(`/comunicacoes/${id}`);
};

/**
 * POST /api/comunicacoes/{id}/enviar
 * Envia um comunicado que estava em modo rascunho.
 * @param {number} id - O ID do comunicado a ser enviado.
 */
export const enviarComunicado = (id) => {
  return api.post(`/comunicacoes/${id}/enviar`);
};

/**
 * POST /api/comunicacoes/{id}/marcar-lido
 * Marca um comunicado como lido pelo usuário.
 * @param {number} id - O ID do comunicado.
 */
export const marcarComunicadoComoLido = (id) => {
  return api.post(`/comunicacoes/${id}/marcar-lido`);
};
