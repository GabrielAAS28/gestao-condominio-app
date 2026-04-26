// Compatibilidade: re-exporta do novo reservasService.
// Prefira importar diretamente de './reservasService'.
export {
  listarAreasComuns as getCommonAreas,
  getAreaComumById as getCommonAreaById,
  reservasPorArea as getReservationsByArea,
  minhasReservas as getMyReservations,
  criarReserva as createReservation,
  cancelarReserva as cancelReservation,
  listarReservas as getAllReservations,
  aprovarReserva as approveReservation,
  rejeitarReserva as rejectReservation,
} from './reservasService';
