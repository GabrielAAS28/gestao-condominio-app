import api from './api';

// ===== PESSOAS =====
export const cadastrarPessoa = (data) => api.post('/pessoas', data);
export const updatePessoa = (id, data) => api.put(`/pessoas/${id}`, data);
export const getPessoaById = (id) => api.get(`/pessoas/${id}`);
export const listarPessoas = (params) => api.get('/pessoas', { params });

// ===== CONDOMÍNIOS =====
export const cadastrarCondominio = (data) => api.post('/condominios', data);
export const listarCondominios = (params) => api.get('/condominios', { params });
export const getCondominioById = (id) => api.get(`/condominios/${id}`);
export const updateCondominio = (id, data) => api.put(`/condominios/${id}`, data);

// ===== UNIDADES =====
export const cadastrarUnidade = (data) => api.post('/unidades', data);
export const listarUnidades = (params) => api.get('/unidades', { params });
export const getUnidadeById = (id) => api.get(`/unidades/${id}`);
export const updateUnidade = (id, data) => api.put(`/unidades/${id}`, data);

// ===== OCUPANTES (substitui o antigo /moradores) =====
export const cadastrarOcupante = (data) => api.post('/ocupantes', data);
export const ocupantesPorUnidade = (unidadeId) =>
  api.get(`/ocupantes/por-unidade/${unidadeId}`);
export const ocupantesPorPessoa = (pesCod) =>
  api.get(`/ocupantes/por-pessoa/${pesCod}`);
export const getOcupanteById = (id) => api.get(`/ocupantes/${id}`);
export const atualizarOcupante = (id, data) => api.put(`/ocupantes/${id}`, data);
export const removerOcupante = (id) => api.delete(`/ocupantes/${id}`);

// ===== USUÁRIO ↔ CONDOMÍNIO (papéis) =====
// Substitui o antigo /usuarios/condominios. A nova API expõe /usuario-condominio.
// Body: { pesCod, conCod, papel: 'SINDICO' | 'MORADOR' | 'FUNCIONARIO_ADM' | 'PORTEIRO' | 'ADMIN' }
export const associarPapel = (data) => api.post('/usuario-condominio', data);
export const desassociarPapel = ({ pesCod, conCod, papel }) =>
  api.delete(`/usuario-condominio/${pesCod}/${conCod}/${papel}`);
export const papeisPorPessoa = (pesCod) =>
  api.get(`/usuario-condominio/por-pessoa/${pesCod}`);
export const papeisPorCondominio = (conCod) =>
  api.get(`/usuario-condominio/por-condominio/${conCod}`);
