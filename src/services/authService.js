import api from './api';

/**
 * POST /auth/me — perfil do usuário logado, com papeis ativos por condomínio.
 * (No backend está como POST por questão de implementação, mas semanticamente é GET.)
 */
export const getMe = () => api.post('/auth/me');

/**
 * POST /auth/change-password
 * @param {{ senhaAtual: string, novaSenha: string }} data
 */
export const alterarSenha = (data) => api.post('/auth/change-password', data);

/**
 * POST /auth/forgot-password — solicita link de redefinição.
 * @param {{ email: string }} data
 */
export const solicitarResetSenha = (data) => api.post('/auth/forgot-password', data);

/**
 * POST /auth/reset-password — confirma a redefinição com o token recebido por email.
 * @param {{ token: string, novaSenha: string }} data
 */
export const resetarSenha = (data) => api.post('/auth/reset-password', data);

/**
 * POST /auth/logout — revoga o refresh token atual (?all=true revoga todos).
 * @param {{ refreshToken: string }} data
 */
export const logout = (data) => api.post('/auth/logout', data);
