import api from './api';

// Este serviço agrupa as funções de criação (POST) das principais
// entidades do sistema, conforme definido no manual da API.

/**
 * POST /api/pessoas
 * Cadastra uma nova pessoa física ou jurídica no sistema.
 * @param {object} dadosPessoa - Ex: { pesNome, pesCpfCnpj, pesTipo, pesEmail, pesSenhaLogin }
 */
export const cadastrarPessoa = (dadosPessoa) => {
  return api.post('/api/pessoas', dadosPessoa);
};

/**
 * POST /api/condominios
 * Cadastra um novo condomínio.
 * @param {object} dadosCondominio - Ex: { conNome, conLogradouro, conNumero, ... }
 */
export const cadastrarCondominio = (dadosCondominio) => {
  return api.post('/api/condominios', dadosCondominio);
};

/**
 * POST /api/unidades
 * Cadastra uma nova unidade (apartamento, sala) em um condomínio.
 * @param {object} dadosUnidade - Ex: { uniNumero, uniStatusOcupacao, condominio: { conCod } }
 */
export const cadastrarUnidade = (dadosUnidade) => {
  return api.post('/api/unidades', dadosUnidade);
};

/**
 * POST /api/moradores
 * Associa uma pessoa a uma unidade, definindo-a como morador.
 * @param {object} dadosVinculo - Ex: { pessoa: { pesCod }, unidade: { uniCod }, morTipoRelacionamento }
 */
export const vincularMorador = (dadosVinculo) => {
  return api.post('/api/moradores', dadosVinculo);
};

/**
 * POST /api/usuarios/condominios
 * Concede um papel (ex: SINDICO) a um usuário dentro de um condomínio específico.
 * @param {object} dadosPapel - Ex: { pessoa: { pesCod }, condominio: { conCod }, uscPapel }
 */
export const concederPapelCondominio = (dadosPapel) => {
  return api.post('/api/usuarios/condominios', dadosPapel);
};

/**
 * POST /api/areascomuns
 * Cadastra uma nova área comum (piscina, salão de festas) em um condomínio.
 * @param {object} dadosAreaComum - Os dados da nova área comum.
 */
export const cadastrarAreaComum = (dadosAreaComum) => {
  return api.post('/api/areascomuns', dadosAreaComum);
};

/**
 * POST /api/manutencoes
 * Abre um novo chamado de manutenção para uma área comum ou unidade.
 * @param {object} dadosManutencao - Os dados do chamado de manutenção.
 */
export const abrirChamadoManutencao = (dadosManutencao) => {
  return api.post('/api/manutencoes', dadosManutencao);
};
/**
 * POST /api/avisos
 * Cria um novo aviso para os moradores do condomínio.
 * @param {object} dadosAviso - Os dados do aviso a ser criado.
 */
export const criarAviso = (dadosAviso) => {
  return api.post('/api/avisos', dadosAviso);
}       