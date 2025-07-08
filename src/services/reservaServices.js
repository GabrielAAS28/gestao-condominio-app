import api from './api';

// --- Funções para Áreas Comuns ---

/**
 * GET /area-comum
 * Busca a lista de todas as áreas comuns disponíveis para reserva.
 */
export const getCommonAreas = async () => {
  try {
    const response = await api.get('/area-comum/listar');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar áreas comuns:", error);
    throw error;
  }
};

/**
 * GET /area-comum/{id}
 * Busca os detalhes de uma área comum específica pelo seu ID.
 * @param {string} id - O ID da área comum.
 */
export const getCommonAreaById = async (id) => {
  try {
    const response = await api.get(`/area-comum/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar a área comum com ID ${id}:`, error);
    throw error;
  }
};


// --- Funções para Reservas (Morador) ---

/**
 * GET /reserva/area-comum/{commonAreaId}
 * Busca todas as reservas existentes para uma área comum específica.
 */
export const getReservationsByArea = async (commonAreaId) => {
  try {
    const response = await api.get(`/reserva/area-comum/${commonAreaId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar reservas para a área ${commonAreaId}:`, error);
    throw error;
  }
};

/**
 * GET /reserva/minhas-reservas
 * Busca a lista de todas as reservas feitas pelo utilizador logado.
 */
export const getMyReservations = async () => {
  try {
    const response = await api.get('/reserva/minhas-reservas');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar as minhas reservas:", error);
    throw error;
  }
};

/**
 * POST /reserva
 * Cria uma nova reserva para uma área comum.
 * @param {object} reservationData - Os dados da reserva.
 */
export const createReservation = async (reservationData) => {
  try {
    const response = await api.post('/reserva', reservationData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar reserva:", error);
    throw error;
  }
};

/**
 * DELETE /reserva/{id}
 * Cancela uma reserva específica.
 * @param {string} reservationId - O ID da reserva a ser cancelada.
 */
export const cancelReservation = async (reservationId) => {
  try {
    const response = await api.delete(`/reserva/${reservationId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao cancelar a reserva ${reservationId}:`, error);
    throw error;
  }
};


// --- Funções para Gestão de Reservas (Síndico/Admin) ---

/**
 * GET /reserva
 * Busca todas as reservas do condomínio (requer permissão de gestor).
 */
export const getAllReservations = async () => {
  try {
    const response = await api.get('/reserva');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar todas as reservas:", error);
    throw error;
  }
};

/**
 * PATCH /reserva/{id}/aprovar
 * Aprova uma reserva pendente.
 * @param {string} reservationId - O ID da reserva a ser aprovada.
 */
export const approveReservation = async (reservationId) => {
  try {
    const response = await api.patch(`/reserva/${reservationId}/aprovar`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao aprovar a reserva ${reservationId}:`, error);
    throw error;
  }
};

/**
 * PATCH /reserva/{id}/reprovar
 * Rejeita uma reserva pendente.
 * @param {string} reservationId - O ID da reserva a ser rejeitada.
 */
export const rejectReservation = async (reservationId) => {
  try {
    const response = await api.patch(`/reserva/${reservationId}/reprovar`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao rejeitar a reserva ${reservationId}:`, error);
    throw error;
  }
};
