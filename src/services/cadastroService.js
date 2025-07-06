import api from './api';

// Este serviço agrupa as funções de criação (POST) e atualização (PUT)
// das principais entidades do sistema.

/**
 * POST /pessoas
 * Cadastra uma nova pessoa física ou jurídica no sistema.
 * @param {object} dadosPessoa - Ex: { pesNome, pesCpfCnpj, pesTipo, pesEmail, pesSenhaLogin }
 */
export const cadastrarPessoa = (dadosPessoa) => {
  // CORREÇÃO: Removido o '/api' do início do caminho.
  return api.post('/pessoas', dadosPessoa);
};

/**
 * PUT /pessoas/{id}
 * Atualiza os dados de uma pessoa existente.
 * @param {number} id - O ID da pessoa a ser atualizada.
 * @param {object} dadosPessoa - Os dados a serem atualizados.
 */
export const updatePessoa = (id, dadosPessoa) => {
  // CORREÇÃO: Removido o '/api' do início do caminho.
  return api.put(`/pessoas/${id}`, dadosPessoa);
};



export const cadastrarCondominio = (dadosCondominio) => {
  return api.post('/condominios', dadosCondominio);
};

export const cadastrarUnidade = (dadosUnidade) => {
  return api.post('/unidades', dadosUnidade);
};

export const vincularMorador = (dadosVinculo) => {
  return api.post('/moradores', dadosVinculo);
};

export const concederPapelCondominio = (dadosPapel) => {
  return api.post('/usuarios/condominios', dadosPapel);
};

export const cadastrarAreaComum = (dadosAreaComum) => {
  return api.post('/areascomuns', dadosAreaComum);
};

export const abrirChamadoManutencao = (dadosManutencao) => {
  return api.post('/manutencoes', dadosManutencao);
};
