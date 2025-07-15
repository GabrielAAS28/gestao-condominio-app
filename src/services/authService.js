// Importe a instância do axios que você configurou no seu projeto
import api from './api';

/**
 * Envia uma requisição PUT para /users/password para alterar a senha.
 * @param {object} data - O objeto contendo as senhas.
 * @param {string} data.currentPassword - A senha atual do usuário.
 * @param {string} data.newPassword - A nova senha desejada.
 * @returns {Promise} A promessa da requisição axios.
 */
export const alterarSenha = (data) => {
  // A documentação da API especifica o método PUT para este endpoint.
  return api.put('/users/password', data);
};

