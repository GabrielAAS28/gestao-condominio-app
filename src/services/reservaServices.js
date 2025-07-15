import api from './api';

// --- Funções para Áreas Comuns ---

/**
 * GET /api/area-comum
 * Busca a lista de todas as áreas comuns disponíveis para reserva.
 */
export const getCommonAreas = async () => {
  try {
    // CORREÇÃO: Removido o '/api' porque já está na baseURL
    const response = await api.get('/area-comum');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar áreas comuns:", error);
    throw error;
  }
};

/**
 * GET /api/area-comum/{id}
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
 * GET /api/reservas/area-comum/{commonAreaId}
 * Busca todas as reservas existentes para uma área comum específica.
 */
export const getReservationsByArea = async (commonAreaId) => {
  try {
    const response = await api.get(`/reservas/area-comum/${commonAreaId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar reservas para a área ${commonAreaId}:`, error);
    throw error;
  }
};

/**
 * GET /api/reservas/minhas-reservas
 * Busca a lista de todas as reservas feitas pelo utilizador logado.
 */
export const getMyReservations = async () => {
  try {
    const response = await api.get('/reservas/minhas-reservas');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar as minhas reservas:", error);
    throw error;
  }
};

/**
 * POST /api/reservas
 * Cria uma nova reserva para uma área comum.
 */
export const createReservation = async (reservationData) => {
  try {
    const response = await api.post('/reservas', reservationData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar reserva:", error);
    throw error;
  }
};

/**
 * DELETE /api/reservas/{id}
 * Cancela uma reserva específica.
 */
export const cancelReservation = async (reservationId) => {
  try {
    const response = await api.delete(`/reservas/${reservationId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao cancelar a reserva ${reservationId}:`, error);
    throw error;
  }
};

/**
 * GET /api/reservas
 * Busca todas as reservas do condomínio (requer permissão de gestor).
 */
export const getAllReservations = async () => {
    try {
      const response = await api.get('/reservas');
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar todas as reservas:", error);
      throw error;
    }
  };

/**
 * PATCH /api/reservas/{id}/aprovar
 * Aprova uma reserva pendente.
 */
export const approveReservation = async (reservationId) => {
  try {
    const response = await api.patch(`/reservas/${reservationId}/aprovar`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao aprovar a reserva ${reservationId}:`, error);
    throw error;
  }
};

/**
 * PATCH /api/reservas/{id}/reprovar
 * Rejeita uma reserva pendente.
 */
export const rejectReservation = async (reservationId) => {
  try {
    const response = await api.patch(`/reservas/${reservationId}/reprovar`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao rejeitar a reserva ${reservationId}:`, error);
    throw error;
  }
};
