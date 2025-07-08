import api from './api';

// --- Funções para Áreas Comuns ---

/**
 * GET /common-areas
 * Busca a lista de todas as áreas comuns disponíveis para reserva.
 */
export const getCommonAreas = async () => {
  try {
    const response = await api.get('/common-areas');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar áreas comuns:", error);
    throw error;
  }
};

/**
 * GET /common-areas/{id}
 * Busca os detalhes de uma área comum específica pelo seu ID.
 * @param {string} id - O ID da área comum.
 */
export const getCommonAreaById = async (id) => {
  try {
    const response = await api.get(`/common-areas/${id}`);
    return response.data;
  } catch (error) { // <-- O erro estava aqui, faltava um parêntese
    console.error(`Erro ao buscar a área comum com ID ${id}:`, error);
    throw error;
  }
};


// --- Funções para Reservas (Morador) ---

/**
 * GET /reservations/common-area/{commonAreaId}
 * Busca todas as reservas existentes para uma área comum específica.
 * @param {string} commonAreaId - O ID da área comum.
 */
export const getReservationsByArea = async (commonAreaId) => {
  try {
    const response = await api.get(`/reservations/common-area/${commonAreaId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar reservas para a área ${commonAreaId}:`, error);
    throw error;
  }
};

/**
 * GET /reservations/my-reservations
 * Busca a lista de todas as reservas feitas pelo utilizador logado.
 */
export const getMyReservations = async () => {
  try {
    const response = await api.get('/reservations/my-reservations');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar as minhas reservas:", error);
    throw error;
  }
};

/**
 * POST /reservations
 * Cria uma nova reserva para uma área comum.
 * @param {object} reservationData - Os dados da reserva.
 * @param {string} reservationData.commonAreaId - ID da área a ser reservada.
 * @param {string} reservationData.startDateTime - Data e hora de início (ISO 8601).
 * @param {string} reservationData.endDateTime - Data e hora de fim (ISO 8601).
 */
export const createReservation = async (reservationData) => {
  try {
    const response = await api.post('/reservations', reservationData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar reserva:", error);
    throw error;
  }
};

/**
 * DELETE /reservations/{id}
 * Cancela uma reserva específica.
 * @param {string} reservationId - O ID da reserva a ser cancelada.
 */
export const cancelReservation = async (reservationId) => {
  try {
    const response = await api.delete(`/reservations/${reservationId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao cancelar a reserva ${reservationId}:`, error);
    throw error;
  }
};


// --- Funções para Gestão de Reservas (Síndico/Admin) ---

/**
 * GET /reservations
 * Busca todas as reservas do condomínio (requer permissão de gestor).
 */
export const getAllReservations = async () => {
    try {
      const response = await api.get('/reservations');
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar todas as reservas:", error);
      throw error;
    }
  };

/**
 * PATCH /reservations/{id}/approve
 * Aprova uma reserva pendente.
 * @param {string} reservationId - O ID da reserva a ser aprovada.
 */
export const approveReservation = async (reservationId) => {
  try {
    const response = await api.patch(`/reservations/${reservationId}/approve`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao aprovar a reserva ${reservationId}:`, error);
    throw error;
  }
};

/**
 * PATCH /reservations/{id}/reject
 * Rejeita uma reserva pendente.
 * @param {string} reservationId - O ID da reserva a ser rejeitada.
 */
export const rejectReservation = async (reservationId) => {
  try {
    const response = await api.patch(`/reservations/${reservationId}/reject`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao rejeitar a reserva ${reservationId}:`, error);
    throw error;
  }
};
