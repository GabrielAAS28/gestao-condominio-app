import api from './api';

// GET /comunicados — aceita filtros: titulo, mensagem, publicoDestino, isUrgente, condominioId, take, skip
export const listarComunicados = (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  );
  return api.get('/comunicados', { params: cleanParams });
};

// GET /comunicados/:id
export const getComunicadoById = (id) => api.get(`/comunicados/${id}`);

// POST /comunicados — cria comunicado (suporta multipart/form-data com anexo)
// data: { titulo, mensagem, publicoDestino, isUrgente, condominiosIds: number[] }
// arquivo: opcional, objeto File/asset do react-native-image-picker
export const criarComunicado = (data, arquivo) => {
  if (!arquivo) {
    return api.post('/comunicados', data);
  }
  const fd = new FormData();
  Object.entries(data).forEach(([k, v]) => {
    if (Array.isArray(v)) {
      v.forEach((item) => fd.append(`${k}[]`, item));
    } else if (v !== undefined && v !== null) {
      fd.append(k, String(v));
    }
  });
  fd.append('anexo', {
    uri: arquivo.uri,
    name: arquivo.fileName ?? 'anexo',
    type: arquivo.type ?? 'application/octet-stream',
  });
  return api.post('/comunicados', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// PUT /comunicados/:id/marcar-como-lido
export const marcarComunicadoComoLido = (id) =>
  api.put(`/comunicados/${id}/marcar-como-lido`);

// DELETE /comunicados/:id
export const deletarComunicado = (id) => api.delete(`/comunicados/${id}`);

// GET /comunicados/:id/anexo/download — URL para abrir/baixar o anexo
// Em mobile, geralmente é mais prático apenas montar a URL e abrir com Linking.
// Use este helper se precisar baixar via fetch autenticado.
export const baixarAnexoComunicado = (id) =>
  api.get(`/comunicados/${id}/anexo/download`, { responseType: 'blob' });
