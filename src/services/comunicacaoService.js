// Compatibilidade: re-exporta do novo comunicadosService.
// Prefira importar diretamente de './comunicadosService'.
export {
  listarComunicados as getComunicacoes,
  getComunicadoById,
  criarComunicado as createComunicado,
  deletarComunicado as deleteComunicado,
  marcarComunicadoComoLido,
} from './comunicadosService';
