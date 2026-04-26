import api, { BASE_URL } from './api';

// GET /ocorrencias?condominioId=&unidadeId=&status=&tipo=&take=&skip=
export const listarOcorrencias = (params) => api.get('/ocorrencias', { params });
export const getOcorrenciaById = (id) => api.get(`/ocorrencias/${id}`);

/**
 * POST /ocorrencias
 * Body: { condominioId, unidadeId, titulo, descricao,
 *         tipo: 'BARULHO'|'CONFLITO'|'MANUTENCAO'|'RECLAMACAO'|'OUTRO' }
 */
export const criarOcorrencia = (data) => api.post('/ocorrencias', data);

// PUT /ocorrencias/:id  — atualizar título/descrição/tipo
export const atualizarOcorrencia = (id, data) => api.put(`/ocorrencias/${id}`, data);

// PUT /ocorrencias/:id/finalizar  body: { parecerFinal }
export const finalizarOcorrencia = (id, parecerFinal) =>
  api.put(`/ocorrencias/${id}/finalizar`, { parecerFinal });

// POST /ocorrencias/:id/comentarios  body: { comentario }
export const comentarOcorrencia = (id, comentario) =>
  api.post(`/ocorrencias/${id}/comentarios`, { comentario });

/**
 * POST /ocorrencias/:id/anexos — upload de imagem/arquivo
 * arquivo: { uri, fileName, type } (asset do react-native-image-picker)
 */
export const anexarArquivoOcorrencia = (id, arquivo) => {
  const fd = new FormData();
  fd.append('arquivo', {
    uri: arquivo.uri,
    name: arquivo.fileName ?? 'anexo',
    type: arquivo.type ?? 'application/octet-stream',
  });
  return api.post(`/ocorrencias/${id}/anexos`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const removerAnexo = (ocorrenciaId, anexoId) =>
  api.delete(`/ocorrencias/${ocorrenciaId}/anexos/${anexoId}`);

// URL absoluta para abrir/baixar um anexo (ex.: <Image source={{ uri }} />)
export const anexoUrl = (ocorrenciaId, anexoId) =>
  `${BASE_URL}/ocorrencias/${ocorrenciaId}/anexos/${anexoId}/download`;
